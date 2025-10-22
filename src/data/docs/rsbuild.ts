import { DocItem } from "../types";

const BASE_API_CONFIG = {
  icon: "../assets/logo/rsbuild.png",
  apiKey: "ecb541ceb2b67d7f23e12e6fb4772c0f",
  appId: "LBYJGZQY5U",
  indexName: "rsbuild",
  type: "algolia",
} as const;

const rsbuild: DocItem = {
  "en-US": {
    ...BASE_API_CONFIG,
    homepage: "https://rsbuild.rs/",
    searchParameters: {
      facetFilters: ["lang:en"],
    },
  },
  "zh-CN": {
    ...BASE_API_CONFIG,
    homepage: "https://rsbuild.rs/zh/",
    searchParameters: {
      facetFilters: ["lang:zh"],
    },
  },
};

export default rsbuild;
