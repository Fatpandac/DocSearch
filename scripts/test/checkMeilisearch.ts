import MeiliSearch from "meilisearch";
import { Meilisearch } from "../../src/data/types";

export async function checkMeilisearch(api: Meilisearch) {
  const client = new MeiliSearch({
    host: api.apiHost,
    apiKey: api.apiKey,
  });
  const index = client.index(api.indexName);

  try {
    await index.search("", { limit: 1 });
    return true;
  } catch {
    return false;
  }
}
