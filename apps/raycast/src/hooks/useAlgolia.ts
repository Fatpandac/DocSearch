/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Toast, showToast } from "@raycast/api";
import { Algolia, searchAlgolia } from "@docsearch/core";

export function useAlgolia(query = "", currentAPI: Algolia) {
  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const performSearch = async () => {
      try {
        const res = await searchAlgolia(query, currentAPI);

        if (controller.signal.aborted) return;

        setSearchResults(res);
      } catch (err: any) {
        if (controller.signal.aborted) return;

        setSearchResults([]);
        showToast(Toast.Style.Failure, "Algolia Error", err.message);
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
