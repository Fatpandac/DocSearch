import { searchTrieve, Trieve } from "@docsearch/core";

export async function checkTrieve(api: Trieve) {
  try {
    await searchTrieve(" ", api);
    return true;
  } catch {
    return false;
  }
}
