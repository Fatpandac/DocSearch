/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewScoreChunk } from "../hooks";
import { generateContent } from "./generateContent";
import { getTitleForAlgolis, getTitleForMeilisearch } from "./getTitle";

export type FormatResultItem = {
  id: string;
  title: string;
  url: string;
  objectID?: string;
  content?: string | null | undefined;
  subtitle?: string;
};
export type FormatResult = Array<FormatResultItem>;

function encodeURL(url?: string): string {
  if (!url) return "";
  return url.indexOf("%") !== -1 ? url : encodeURI(url);
}

export function algoliaDefaultFormatter(searchResults: Array<any>): FormatResult {
  return searchResults.map((item, index) => {
    item.title = getTitleForAlgolis(item);

    return {
      url: encodeURL(item.url),
      title: item.title,
      objectID: item.objectID,
      content: generateContent(item),
      id: `${index}`,
    };
  });
}

export function meilisearchDefaultFormatter(searchResults: Array<any>): FormatResult {
  return searchResults.map((item, index) => ({
    objectID: item.objectID,
    url: encodeURL(item.url),
    title: getTitleForMeilisearch(item),
    id: `${index}`,
  }));
}

export function trieveDefaultFormatter(searchResults: Array<NewScoreChunk>): FormatResult {
  return searchResults.map((item, index) => {
    return {
      title: (item.chunk as any).metadata.title,
      url: item.chunk.url,
      id: `${index}`,
      content: item.chunk.chunk_html,
      objectID: item.chunk.id,
    };
  });
}
