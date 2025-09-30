/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChunkMetadata, ContentChunkMetadata, ScoreChunk, TrieveSDK } from "trieve-ts-sdk";
import { Trieve } from "../data/apis";
import { useEffect, useMemo, useState } from "react";
import { showToast, Toast } from "@raycast/api";

function formatUrl(item: ScoreChunk, homepage: string) {
  if ((item.chunk as ChunkMetadata)?.link) {
    return `${homepage}/${(item.chunk as ChunkMetadata)?.link}`;
  }
  return homepage;
}

function foramtContent(content: string) {
  return content.replaceAll("<mark><b>", "**").replaceAll("</b></mark>", "**");
}

type NewScoreChunk = Omit<ScoreChunk, "chunk"> & {
  chunk: ContentChunkMetadata & { url: string };
};

export function useTrieve(query: string, currentAPI: Trieve) {
  const trieveClient = useMemo(() => {
    return new TrieveSDK({
      baseUrl: currentAPI.baseUrl,
      apiKey: currentAPI.apiKey,
      datasetId: currentAPI.datasetId,
    });
  }, [currentAPI.apiKey, currentAPI.datasetId, currentAPI.baseUrl]);

  const [searchResults, setSearchResults] = useState<Array<NewScoreChunk>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    const performSearch = async () => {
      try {
        const res = await trieveClient.autocomplete({
          query: query,
          search_type: currentAPI.searchType || "fulltext",
          ...currentAPI.searchParameters,
        });

        if (controller.signal.aborted) return;

        const formattedChunks = res.chunks.map((item) => {
          const chunk = item.chunk as ContentChunkMetadata;
          return {
            ...item,
            chunk: {
              ...item.chunk,
              chunk_html: chunk.chunk_html ? foramtContent(chunk.chunk_html) : undefined,
              url: formatUrl(item, currentAPI.homepage),
            },
          };
        });

        setSearchResults(formattedChunks || []);
      } catch (err: any) {
        if (controller.signal.aborted) return;

        setSearchResults([]);
        showToast(Toast.Style.Failure, "Trieve Error", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();

    return () => {
      controller.abort();
    };
  }, [query, currentAPI.homepage]);

  return { searchResults, isLoading };
}
