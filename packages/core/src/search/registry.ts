import { data } from "../data/apis";
import { API, DocID, Tags } from "../data/types";

export function getDocTags(id: DocID): Tags[] {
  return Object.keys(data[id]) as Tags[];
}

export function getDocApi(id: DocID, tag: Tags): API | undefined {
  return data[id][tag];
}
