import { DocItem } from "../types";

const pnpm: DocItem = {
  "en-US": {
    icon: "../assets/logo/pnpm.png",
    apiKey: "a337998a623aa8f80d2a97a79d565086",
    appId: "RAHRBBK2WL",
    indexName: "pnpm",
    type: "algolia",
    homepage: "https://pnpm.io/zh",
    searchParameters: {
      facetFilters: ["language:en"],
    },
  },
  "zh-CN": {
    icon: "../assets/logo/pnpm.png",
    apiKey: "a337998a623aa8f80d2a97a79d565086",
    appId: "RAHRBBK2WL",
    indexName: "pnpm",
    type: "algolia",
    homepage: "https://pnpm.io/zh",
    searchParameters: {
      facetFilters: ["language:zh"],
    },
  },
};

export default pnpm;
