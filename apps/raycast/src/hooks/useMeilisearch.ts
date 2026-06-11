/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Toast, showToast } from "@raycast/api";
import { Meilisearch, searchMeilisearch } from "@docsearch/core";

export function useMeilisearch(query = "", currentAPI: Meilisearch) {
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const performSearch = async () => {
      try {
        const res = await searchMeilisearch(query, currentAPI);

        if (controller.signal.aborted) return;

        setSearchResults(res);
      } catch (err: any) {
        if (controller.signal.aborted) return;

        setSearchResults([]);
        showToast(Toast.Style.Failure, "Meilisearch Error", err.message);
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
