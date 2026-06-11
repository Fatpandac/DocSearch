/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { showToast, Toast } from "@raycast/api";
import { NewScoreChunk, searchTrieve, Trieve } from "@docsearch/core";

export function useTrieve(query: string, currentAPI: Trieve) {
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
        const res = await searchTrieve(query, currentAPI);

        if (controller.signal.aborted) return;

        setSearchResults(res);
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
  }, [query, currentAPI]);

  return { searchResults, isLoading };
}
