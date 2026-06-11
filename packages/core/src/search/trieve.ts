import { ChunkMetadata, ScoreChunk, TrieveSDK } from "trieve-ts-sdk";

import { Trieve } from "../data/types";

function formatUrl(item: ScoreChunk, homepage: string) {
  if ((item.chunk as ChunkMetadata)?.link) {
    return `${homepage}/${(item.chunk as ChunkMetadata)?.link}`;
  }
  return homepage;
}

function formatContent(content: string) {
  return content.replaceAll("<mark><b>", "**").replaceAll("</b></mark>", "**");
}

export type NewScoreChunk = Omit<ScoreChunk, "chunk"> & {
  chunk: ChunkMetadata & { url: string };
};

export async function searchTrieve(query: string, currentAPI: Trieve): Promise<Array<NewScoreChunk>> {
  if (query.trim().length === 0) {
    return [];
  }

  const trieveClient = new TrieveSDK({
    baseUrl: currentAPI.baseUrl,
    apiKey: currentAPI.apiKey,
    datasetId: currentAPI.datasetId,
  });
  const res = await trieveClient.autocomplete({
    query,
    search_type: currentAPI.searchType || "fulltext",
    ...currentAPI.searchParameters,
  });

  return res.chunks.map((item) => {
    const chunk = item.chunk as ChunkMetadata;
    return {
      ...item,
      chunk: {
        ...chunk,
        chunk_html: chunk.chunk_html ? formatContent(chunk.chunk_html) : undefined,
        url: formatUrl(item, currentAPI.homepage),
      },
    };
  });
}
