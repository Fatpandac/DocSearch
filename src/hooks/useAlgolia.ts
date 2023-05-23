/* eslint-disable @typescript-eslint/no-explicit-any */
import APIData from "../data/apis";

import { useState, useEffect } from "react";
import algoliasearch from "algoliasearch/lite";
import { Toast, showToast } from "@raycast/api";
import { API } from "../types";

function formatHitUrl(res: any, homepageUrl: string) {
  if (res.hits[0]) {
    if ("path" in res.hits[0]) {
      res.hits = res.hits.map((hit: any) => {
        hit.url = homepageUrl + hit.path;

        return hit;
      });
    } else if ("slug" in res.hits[0]) {
      res.hits = res.hits.map((hit: any) => {
        hit.url = homepageUrl + hit.slug;

        return hit;
      });
    } else if ("url" in res.hits[0] && !((res.hits[0] as any).url as string).startsWith("http")) {
      res.hits = res.hits.map((hit: any) => {
        hit.url = homepageUrl + hit.url;

        return hit;
      });
    }
  }
}

export function useAllRoutingRules(query = "", docsName: string, lang?: string) {
  const currentAPI = APIData.find((api) =>
    lang ? api.name === docsName && api.lang === lang : api.name === docsName
  ) as API;
  const searchClient = algoliasearch(currentAPI.appId, currentAPI.apiKey);
  const searchIndex = searchClient.initIndex(currentAPI.indexName);

  const [searchResults, setSearchResults] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    searchIndex
      .search(query, currentAPI.searchParameters)
      .then((res: any) => {
        setIsLoading(false);
        formatHitUrl(res, currentAPI.homepage);

        setSearchResults(res.hits);
      })
      .catch((err: { message: string | undefined }) => {
        setIsLoading(false);
        showToast(Toast.Style.Failure, "Algolia Error", err.message);

        return [];
      });
  }, [query]);

  return { searchResults, isLoading };
}
