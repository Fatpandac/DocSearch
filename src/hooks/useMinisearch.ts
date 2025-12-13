import { useEffect, useRef, useState } from "react";
import { LocalStorage, showToast, Toast } from "@raycast/api";
import MiniSearch from "minisearch";
import { MiniSearchResult, MiniSearch as MiniSearchType } from "../data/types";
import { FormatResult } from "../utils";

async function checkVersion(sourcePath: string, currentVersion: string): Promise<{
  isUpToDate: boolean;
  lastVersion: string;
}> {
  const {
    packName,
    packLocale,
  } = sourcePath.match(/index\/(?<packName>\w+)\/(?<packLocale>[\w-]+)/)?.groups || {};

  if (!packName || !packLocale) {
    return {
      isUpToDate: true,
      lastVersion: currentVersion,
    };
  }

  const versions =
    await fetch('https://raw.githubusercontent.com/Fatpandac/SearchSource/refs/heads/main/search-index/versions.json')
      .then((res) => res.json()) as Record<string, Record<string, string>>;

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
  }
}

export function useMinisearch(query: string, currentAPI: MiniSearchType) {
  const [searchResults, setSearchResults] = useState<FormatResult>([]);
  const [isLoading, setIsLoading] = useState(false);
  const minisearchClient = useRef<MiniSearch | null>(null);

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

      const {
        isUpToDate,
        lastVersion,
      } = await checkVersion(currentAPI.dataUrl, version);
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

          await LocalStorage.setItem(currentAPI.dataUrl, JSON.stringify({
            version: lastVersion,
            searchIndex: data,
          }));
          minisearchClient.current = null;
          minisearchClient.current = MiniSearch.loadJSON(data, {
            fields: ["title", "titles", "content"],
            storeFields: ["title", "titles", "url"],
          });
        } catch (err) {
          if (controller.signal.aborted) return;

          showToast(Toast.Style.Failure, "Fetch Search Index Error", (err as Error).message);
        } finally {
          setIsLoading(false);
        }
      } else {
        if (controller.signal.aborted) return;
        minisearchClient.current = null;
        minisearchClient.current = MiniSearch.loadJSON(searchIndex, {
          fields: ["title", "titles", "content"],
          storeFields: ["title", "titles", "url"],
        });
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
      const res = minisearchClient.current!.search(query) as MiniSearchResult[];

      const formattedResults = currentAPI.formatter
        ? currentAPI.formatter(res)
        : res.map((item) => ({
          title: item.title,
          url: item.url,
          titles: item.titles,
          id: item.id,
        }));

      setSearchResults(formattedResults || []);
    };

    performSearch();
  }, [query, currentAPI.homepage]);

  return { searchResults, isLoading };
}
