/* eslint-disable @typescript-eslint/no-explicit-any */
import algoliasearch from "algoliasearch/lite";

import { Algolia } from "../data/types";
import { formatHitUrl } from "../utils";

const DEFAULT_PARAMETERS = {
  highlightPreTag: "**",
  highlightPostTag: "**",
};

export async function searchAlgolia(query = "", currentAPI: Algolia): Promise<Array<any>> {
  const searchClient = algoliasearch(currentAPI.appId, currentAPI.apiKey);
  const searchIndex = searchClient.initIndex(currentAPI.indexName);
  const res = await searchIndex.search(query, {
    ...DEFAULT_PARAMETERS,
    ...currentAPI.searchParameters,
  });

  formatHitUrl(res, currentAPI.homepage);

  return res.hits;
}
