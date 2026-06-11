import { Algolia, searchAlgolia } from "@docsearch/core";

export async function checkAlgolia(api: Algolia) {
  try {
    await searchAlgolia("", api);
    return true;
  } catch {
    return false;
  }
}
