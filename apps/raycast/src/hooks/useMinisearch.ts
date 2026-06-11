import { useEffect, useRef, useState } from "react";
import { LocalStorage, showToast, Toast } from "@raycast/api";
import {
  checkMinisearchVersion,
  FormatResult,
  loadMinisearchIndex,
  MiniSearch as MiniSearchType,
  searchMinisearch,
} from "@docsearch/core";

export function useMinisearch(query: string, currentAPI: MiniSearchType) {
  const [searchResults, setSearchResults] = useState<FormatResult>([]);
  const [isLoading, setIsLoading] = useState(false);
  const minisearchClient = useRef<ReturnType<typeof loadMinisearchIndex> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    (async () => {
      const storedIndex = await LocalStorage.getItem<string>(currentAPI.dataUrl);
      let version = "";
      let searchIndex = "";
      try {
        const parsed = JSON.parse(storedIndex || "{version: '', searchIndex: ''}");
        version = parsed.version;
        searchIndex = parsed.searchIndex;
      } catch {
        version = "";
        searchIndex = "";
      }

      const { isUpToDate, lastVersion } = await checkMinisearchVersion(currentAPI.dataUrl, version);
      if (!isUpToDate) {
        try {
          const response = await fetch(currentAPI.dataUrl, {
            signal: controller.signal,
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch search index: ${response.statusText}`);
          }
          const data = await response.text();
          if (controller.signal.aborted) return;

          await LocalStorage.setItem(
            currentAPI.dataUrl,
            JSON.stringify({
              version: lastVersion,
              searchIndex: data,
            }),
          );
          minisearchClient.current = null;
          minisearchClient.current = loadMinisearchIndex(data);
        } catch (err) {
          if (controller.signal.aborted) return;

          showToast(Toast.Style.Failure, "Fetch Search Index Error", (err as Error).message);
        } finally {
          setIsLoading(false);
        }
      } else {
        if (controller.signal.aborted) return;
        minisearchClient.current = null;
        minisearchClient.current = loadMinisearchIndex(searchIndex);
        setIsLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [currentAPI.dataUrl]);

  useEffect(() => {
    if (query.trim().length === 0 || !minisearchClient.current) {
      setSearchResults([]);
      return;
    }

    const performSearch = () => {
      setSearchResults(searchMinisearch(minisearchClient.current!, query, currentAPI) || []);
    };

    performSearch();
  }, [query, currentAPI.homepage]);

  return { searchResults, isLoading };
}
