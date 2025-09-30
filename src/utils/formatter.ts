/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateContent } from "./generateContent";
import { getTitleForAlgolis, getTitleForMeilisearch } from "./getTitle";

export function algoliaDefaultFormatter(searchResults: Array<any>) {
  return searchResults.map((item, index) => {
    item.title = getTitleForAlgolis(item);

    return {
      ...item,
      content: generateContent(item),
      id: `${index}`,
    };
  });
}

export function meilisearchDefaultFormatter(searchResults: Array<any>) {
  return searchResults.map((item, index) => ({
    ...item,
    title: getTitleForMeilisearch(item),
    id: `${index}`,
  }));
}

export function trieveDefaultFormatter(searchResults: Array<any>) {
  return searchResults.map((item, index) => {
    return {
      ...item,
      title: (item.chunk as any).metadata.title,
      url: item.chunk.url,
      id: `${index}`,
      content: item.chunk.chunk_html,
    };
  });
}


