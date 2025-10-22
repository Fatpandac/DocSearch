import { DocItem } from "../types";

const BASE_API_CONFIG = {
  icon: "../assets/logo/rsdoctor.png",
  apiKey: "db98c3a0aa060d3aa4b30f49fee02b16",
  appId: "NHFZKCFYI7",
  indexName: "rstor",
  type: "algolia",
} as const;

const rsdoctor: DocItem = {
  "en-US": {
    ...BASE_API_CONFIG,
    homepage: "https://rsdoctor.rs/",
    searchParameters: {
      facetFilters: ["lang:en"],
    },
  },
  "zh-CN": {
    ...BASE_API_CONFIG,
    homepage: "https://rsdoctor.rs/zh/",
    searchParameters: {
      facetFilters: ["lang:zh"],
    },
  },
};

export default rsdoctor;
