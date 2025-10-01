import { TrieveSDK } from "trieve-ts-sdk";
import { Trieve } from "../../src/data/types";

export async function checkTrieve(api: Trieve) {
  const client = new TrieveSDK({
    baseUrl: api.baseUrl,
    apiKey: api.apiKey,
    datasetId: api.datasetId,
  });
  try {
    await client.autocomplete({
      query: " ",
      search_type: api.searchType || "fulltext",
    })
    return true;
  } catch {
    return false;
  }
}
