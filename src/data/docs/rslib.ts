import { DocItem } from "../types";

const BASE_API_CONFIG = {
  icon: "../assets/logo/rslib.png",
  apiKey: "08656eae2f8e85d7f3473574000889f2",
  appId: "TICGXW7OMD",
  indexName: "lib",
  type: "algolia",
} as const;

const rslib: DocItem = {
  "en-US": {
    ...BASE_API_CONFIG,
    homepage: "https://rslib.rs/",
    searchParameters: {
      facetFilters: ["lang:en"],
    },
  },
  "zh-CN": {
    ...BASE_API_CONFIG,
    homepage: "https://rslib.rs/zh/",
    searchParameters: {
      facetFilters: ["lang:zh"],
    },
  },
};

export default rslib;
