import { data } from "../data/apis";
import { useAlgolia, useMeilisearch, useSearch, useTrieve } from "../hooks";

import { ActionPanel, List, Action, Icon } from "@raycast/api";
import { useState, useMemo } from "react";
import { DocID, Tags } from "../data/types";
import { algoliaDefaultFormatter, FormatResult, meilisearchDefaultFormatter, trieveDefaultFormatter } from "../utils";

export function SearchDocumentation(props: { id: DocID; quickSearch?: string }) {
  const currentDocs = data[props.id];
  const tags = useMemo(() => Object.keys(currentDocs), [currentDocs]);
  const [searchText, setSearchText] = useState(props.quickSearch || "");
  const [searchTag, setSearchTag] = useState<Tags>(tags[0] as Tags);
  const [currentIdx, setCurrentIdx] = useState<string | null>(null);
  const currentAPI = currentDocs[searchTag]!;

  let isLoading = false;
  let searchResults: FormatResult = [];

  switch (currentAPI.type) {
    case "algolia": {
      const res = useAlgolia(searchText, currentAPI);
      isLoading = res.isLoading;
      searchResults = (currentAPI.formatter || algoliaDefaultFormatter)(res.searchResults);
      break;
    }
    case "meilisearch": {
      const res = useMeilisearch(searchText, currentAPI);
      isLoading = res.isLoading;
      searchResults = (currentAPI.formatter || meilisearchDefaultFormatter)(res.searchResults);
      break;
    }
    case "trieve": {
      const res = useTrieve(searchText, currentAPI);
      isLoading = res.isLoading;
      searchResults = (currentAPI.formatter || trieveDefaultFormatter)(res.searchResults);
      break;
    }
    case "custom": {
      const res = useSearch(searchText, currentAPI);
      isLoading = res.isLoading;
      searchResults = res.searchResults;
      break;
    }
    default: {
      const { type } = currentAPI;
      return type satisfies never;
    }
  }

  return (
    <List
      throttle={true}
      navigationTitle={DocID[props.id] || "No Title"}
      isLoading={isLoading || searchResults === undefined}
      isShowingDetail={searchResults.find((item) => item.id === currentIdx)?.content != undefined}
      onSearchTextChange={setSearchText}
      searchText={searchText}
      onSelectionChange={(id) => {
        setCurrentIdx(id || "0");
      }}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Tag"
          storeValue
          onChange={(tag) => {
            setSearchTag(tag as Tags);
            setCurrentIdx(null);
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
            key={result.objectID}
            id={result.id}
            title={result.title}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={result.url} title="Open in Browser" />
                <Action.CopyToClipboard title="Copy URL" content={result.url} />
              </ActionPanel>
            }
            detail={<List.Item.Detail markdown={result.content} />}
          />
        );
      })}
    </List>
  );
}
