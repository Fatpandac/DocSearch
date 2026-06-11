import { DocItem } from "../types";

const elementPlus: DocItem = {
  "en-US": {
    icon: "../assets/logo/element.png",
    apiKey: "99caf32e743ba77d78b095b763b8e380",
    appId: "ZM3TI8AKL4",
    indexName: "element-plus",
    type: "algolia",
    homepage: "https://element-plus.org/en-US/",
    searchParameters: {
      facetFilters: ["language:en-US"],
    },
  },
  "zh-CN": {
    icon: "../assets/logo/element.png",
    apiKey: "99caf32e743ba77d78b095b763b8e380",
    appId: "ZM3TI8AKL4",
    indexName: "element-plus",
    type: "algolia",
    homepage: "https://element-plus.org/zh-CN/",
    searchParameters: {
      facetFilters: ["language:zh-CN"],
    },
  },
};

export default elementPlus;
