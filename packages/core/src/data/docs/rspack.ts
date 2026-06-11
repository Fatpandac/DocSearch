import { DocItem } from "../types";

const BASE_API_CONFIG = {
  icon: "../assets/logo/rspack.png",
  apiKey: "8c30f9d1f12e786a132af15ea30cf997",
  appId: "TQOGCXPBUD",
  indexName: "rspack",
  type: "algolia",
} as const;

const rspack: DocItem = {
  "en-US": {
    ...BASE_API_CONFIG,
    homepage: "https://rspack.rs/",
    searchParameters: {
      facetFilters: ["lang:en"],
    },
  },
  "zh-CN": {
    ...BASE_API_CONFIG,
    homepage: "https://rspack.rs/zh/",
    searchParameters: {
      facetFilters: ["lang:zh"],
    },
  },
};

export default rspack;
