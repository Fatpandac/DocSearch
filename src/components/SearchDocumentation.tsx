/* eslint-disable @typescript-eslint/no-explicit-any */
import { data } from "../data/apis";
import { useAlgolia, useMeilisearch, useTrieve } from "../hooks";

import { ActionPanel, List, Action, Icon } from "@raycast/api";
import { useState, useMemo } from "react";
import { API, DocID, Tags } from "../data/types";
import { algoliaDefaultFormatter, meilisearchDefaultFormatter, trieveDefaultFormatter } from "../utils";

type SearchConfig = {
  algolia: {
    search: typeof useAlgolia;
    formatter: typeof algoliaDefaultFormatter;
  },
  meilisearch: {
    search: typeof useMeilisearch;
    formatter: typeof meilisearchDefaultFormatter;
  },
  trieve: {
    search: typeof useTrieve;
    formatter: typeof trieveDefaultFormatter;
  }
}
type APIType = keyof SearchConfig;

function searchFactory<T extends APIType>(type: T): [SearchConfig[T]["search"], SearchConfig[T]["formatter"]] {
  switch (type) {
    case "algolia":
      return [useAlgolia, algoliaDefaultFormatter]
    case "meilisearch":
      return [useMeilisearch, meilisearchDefaultFormatter]
    case "trieve":
      return [useTrieve, trieveDefaultFormatter]
    default: {
      return type satisfies never;
    }
  }
}

export function SearchDocumentation(props: { id: DocID; quickSearch?: string }) {
  const currentDocs = data[props.id];
  const tags = useMemo(() => Object.keys(currentDocs), [currentDocs]);
  const [searchText, setSearchText] = useState(props.quickSearch || "");
  const [searchTag, setSearchTag] = useState<Tags>(tags[0] as Tags);
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentAPI = currentDocs[searchTag] as API;

  let isLoading = false;
  let searchResults: Array<any> = [];

  const [useSearch, formatter] = useMemo(() => {
    return searchFactory(currentAPI.type as APIType);
  }, [currentAPI.type]);

  const res = useSearch(searchText, currentAPI);
  isLoading = res.isLoading;
  searchResults = formatter(res.searchResults);

  return (
    <List
      throttle={true}
      navigationTitle={DocID[props.id] || "No Title"}
      isLoading={isLoading || searchResults === undefined}
      isShowingDetail={searchResults?.[currentIdx]?.content != undefined}
      onSearchTextChange={setSearchText}
      searchText={searchText}
      onSelectionChange={(id) => {
        setCurrentIdx(parseInt(id || "0"));
      }}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Tag"
          storeValue
          onChange={(tag) => {
            setSearchTag(tag as Tags);
            setCurrentIdx(0);
          }}
        >
          {tags.map((tag) => (
            <List.Dropdown.Item key={tag} title={tag} value={tag} />
          ))}
        </List.Dropdown>
      }
    >
      {searchResults?.map((result) => {
        return (
          <List.Item
            icon={result.content == null && result.subtitle == null ? Icon.Hashtag : Icon.Paragraph}
            key={result.objectID || result.id}
            id={result.id}
            title={result.title}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser
                  url={result.url?.indexOf("%") !== -1 ? result.url : encodeURI(result.url)}
                  title="Open in Browser"
                />
                <Action.CopyToClipboard
                  title="Copy URL"
                  content={result.url?.indexOf("%") !== -1 ? decodeURI(result.url) : result.url}
                />
              </ActionPanel>
            }
            detail={<List.Item.Detail markdown={result.content} />}
          />
        );
      })}
    </List>
  );
}
