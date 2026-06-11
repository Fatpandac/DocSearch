import { Custom } from "../data/types";
import { FormatResult } from "../utils";

export function searchCustom(query = "", currentAPI: Custom): Promise<FormatResult> {
  return currentAPI.request(query);
}
