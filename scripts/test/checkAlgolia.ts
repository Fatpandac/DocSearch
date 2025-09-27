import algoliasearch from "algoliasearch";

export async function checkAlgolia(appId: string, apiKey: string, indexName: string) {
  const client = algoliasearch(appId, apiKey);
  const index = client.initIndex(indexName);

  try {
    await index.search("", { hitsPerPage: 1 });
    return true;
  } catch {
    return false;
  }
}
