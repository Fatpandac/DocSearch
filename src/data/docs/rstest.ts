import { DocItem } from "../types";

const BASE_API_CONFIG = {
  icon: "../assets/logo/rstest.png",
  apiKey: "3cf720e0589287b96f68a8c7bad7f682",
  appId: "TRUZL3HFAU",
  indexName: "rstest",
  type: "algolia",
} as const;

const rstest: DocItem = {
  "en-US": {
    ...BASE_API_CONFIG,
    homepage: "https://rstest.rs/",
    searchParameters: {
      facetFilters: ["lang:en"],
    },
  },
  "zh-CN": {
    ...BASE_API_CONFIG,
    homepage: "https://rstest.rs/zh/",
    searchParameters: {
      facetFilters: ["lang:zh"],
    },
  },
};

export default rstest;
