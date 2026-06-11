import MiniSearch from "minisearch";

import { MiniSearchResult, MiniSearch as MiniSearchType } from "../data/types";
import { FormatResult } from "../utils";

export type MinisearchVersionState = {
  isUpToDate: boolean;
  lastVersion: string;
};

export async function checkMinisearchVersion(
  sourcePath: string,
  currentVersion: string,
): Promise<MinisearchVersionState> {
  const { packName, packLocale } = sourcePath.match(/index\/(?<packName>\w+)\/(?<packLocale>[\w-]+)/)?.groups || {};

  if (!packName || !packLocale) {
    return {
      isUpToDate: true,
      lastVersion: currentVersion,
    };
  }

  const versions = (await fetch(
    "https://raw.githubusercontent.com/Fatpandac/SearchSource/refs/heads/main/search-index/versions.json",
  ).then((res) => res.json())) as Record<string, Record<string, string>>;
  const packVersion = versions[packName]?.[packLocale];

  if (packVersion === currentVersion) {
    return {
      isUpToDate: true,
      lastVersion: currentVersion,
    };
  }

  return {
    isUpToDate: false,
    lastVersion: packVersion,
  };
}

export function loadMinisearchIndex(searchIndex: string): MiniSearch {
  return MiniSearch.loadJSON(searchIndex, {
    fields: ["title", "titles", "content"],
    storeFields: ["title", "titles", "url"],
  });
}

export function searchMinisearch(client: MiniSearch, query: string, currentAPI: MiniSearchType): FormatResult {
  if (query.trim().length === 0) return [];

  const res = client.search(query) as MiniSearchResult[];

  return currentAPI.formatter
    ? currentAPI.formatter(res)
    : res.map((item) => ({
        title: item.title,
        url: item.url,
        titles: item.titles,
        id: item.id,
      }));
}
