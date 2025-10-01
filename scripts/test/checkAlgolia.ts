import algoliasearch from "algoliasearch";
import { Algolia } from "../../src/data/types";

export async function checkAlgolia(api: Algolia) {
  const client = algoliasearch(api.appId, api.apiKey);
  const index = client.initIndex(api.indexName);

  try {
    await index.search("", { hitsPerPage: 1 });
    return true;
  } catch {
    return false;
  }
}
