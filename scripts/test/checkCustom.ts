import { Custom } from "../../src/data/types";

export async function checkCustom(api: Custom) {
  try {
    await api.request("");
    return true;
  } catch {
    return false;
  }
}
