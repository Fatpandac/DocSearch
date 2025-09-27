import MeiliSearch from "meilisearch";

export async function checkMeilisearch(apiHost: string, apiKey: string, indexName: string) {
  const client = new MeiliSearch({
    host: apiHost,
    apiKey: apiKey,
  });
  const index = client.index(indexName);

  try {
    await index.search("", { limit: 1 });
    return true;
  } catch {
    return false;
  }
}
