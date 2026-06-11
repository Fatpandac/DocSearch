import { Meilisearch, searchMeilisearch } from "@docsearch/core";

export async function checkMeilisearch(api: Meilisearch) {
  try {
    await searchMeilisearch("", api);
    return true;
  } catch {
    return false;
  }
}
