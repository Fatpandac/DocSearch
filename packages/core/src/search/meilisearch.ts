/* eslint-disable @typescript-eslint/no-explicit-any */
import MeiliSearch from "meilisearch";

import { Meilisearch } from "../data/types";
import { formatHitUrl } from "../utils";

export async function searchMeilisearch(query = "", currentAPI: Meilisearch): Promise<Array<any>> {
  const searchClient = new MeiliSearch({
    host: currentAPI.apiHost,
    apiKey: currentAPI.apiKey,
  });
  const searchIndex = searchClient.index(currentAPI.indexName);
  const res = await searchIndex.search(query, currentAPI.searchParameters);

  formatHitUrl(res, currentAPI.homepage);

  return res.hits;
}
