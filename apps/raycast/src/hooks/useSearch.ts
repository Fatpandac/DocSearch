import { useEffect, useState } from "react";
import { Custom, FormatResult, searchCustom } from "@docsearch/core";
import { showToast, Toast } from "@raycast/api";

export function useSearch(query = "", currentAPI: Custom) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<FormatResult>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await searchCustom(query, currentAPI);
        setSearchResults(res);
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Search Error",
          message: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [query, currentAPI]);

  return { searchResults, isLoading };
}
