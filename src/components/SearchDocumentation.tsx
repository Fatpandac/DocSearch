/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from "../types";
import APIData from "../data/apis";
import { escape2Html } from "../utils";
import { useAlgolia, useMeilisearch } from "../hooks";

import { ActionPanel, List, Action } from "@raycast/api";
import { useState } from "react";

export function SearchDocumentation(props: { id: string; quickSearch?: string }) {
  const currentAPI = APIData.find((api) => props.id === api.id) as API;

  const [searchText, setSearchText] = useState(props.quickSearch || "");

  let isLoading = false;
  let searchResults: Array<any> = [];

  if (currentAPI.type === "algolia") {
    const res = useAlgolia(searchText, currentAPI);
    isLoading = res.isLoading;
    searchResults = res.searchResults;
  } else if (currentAPI.type === "meilisearch") {
    const res = useMeilisearch(searchText, currentAPI);
    isLoading = res.isLoading;
    searchResults = res.searchResults;
  }

  const getTitle = (result: any) => {
    const combinedTitle = (titles: Array<string>) => titles.filter((itme) => itme).join(" > ");
    const {
      hierarchy_lvl0,
      hierarchy_lvl1,
      hierarchy_lvl2,
      hierarchy_lvl3,
      hierarchy_lvl4,
      hierarchy_lvl5,
      hierarchy_lvl6,
    } = result;

    return escape2Html(
      combinedTitle([
        hierarchy_lvl0,
        hierarchy_lvl1,
        hierarchy_lvl2,
        hierarchy_lvl3,
        hierarchy_lvl4,
        hierarchy_lvl5,
        hierarchy_lvl6,
      ])
    );
  };

  return (
    <List
      throttle={true}
      navigationTitle={currentAPI.name}
      isLoading={isLoading || searchResults === undefined}
      onSearchTextChange={setSearchText}
      searchText={searchText}
    >
      {searchResults?.map((result) => (
        <List.Item
          icon={currentAPI.icon}
          key={result.objectID}
          title={getTitle(result)}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                url={result.url.indexOf("%") !== -1 ? result.url : encodeURI(result.url)}
                title="Open in Browser"
              />
              <Action.CopyToClipboard
                title="Copy URL"
                content={result.url.indexOf("%") !== -1 ? decodeURI(result.url) : result.url}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
