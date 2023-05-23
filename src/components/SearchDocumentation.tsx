/* eslint-disable @typescript-eslint/no-explicit-any */
import APIData from "../data/apis";
import { API } from "../types";
import { useAllRoutingRules } from "../hooks";
import { escape2Html } from "../utils";

import { ActionPanel, List, Action } from "@raycast/api";
import { useState } from "react";

export function SearchDocumentation(props: { docsName: string; lang?: string; quickSearch?: string }) {
  const currentAPI = APIData.find((api) =>
    props.lang ? api.name === props.docsName && api.lang === props.lang : api.name === props.docsName
  ) as API;

  const [searchText, setSearchText] = useState(props.quickSearch || "");

  const { searchResults, isLoading } = useAllRoutingRules(searchText, currentAPI.name, currentAPI.lang);

  const getTitle = (result: any) => {
    const combinedTitle = (titles: Array<string>) => titles.filter((itme) => itme).join(" > ");

    return escape2Html(
      combinedTitle(
        "path" in result || "slug" in result ? [result.title, result.description] : Object.values(result.hierarchy)
      )
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
