import { Custom, searchCustom } from "@docsearch/core";

export async function checkCustom(api: Custom) {
  try {
    await searchCustom("", api);
    return true;
  } catch {
    return false;
  }
}
