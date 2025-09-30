import { DocItem } from "../types";

const taro: DocItem = {
  "V4 zh-CN": {
    icon: "../assets/logo/taro.png",
    apiKey: "3f32982103f4e75dadd86900d26a9315",
    appId: "BH4D9OD16A",
    indexName: "taro-zone",
    type: "algolia",
    homepage: "https://docs.taro.zone/docs/4.x/",
    searchParameters: {
      facetFilters: ["language:zh-cn", ["docusaurus_tag:default", "docusaurus_tag:docs-default-4.x"]],
    },
  },
  "V3 zh-CN": {
    icon: "../assets/logo/taro.png",
    apiKey: "3f32982103f4e75dadd86900d26a9315",
    appId: "BH4D9OD16A",
    indexName: "taro-zone",
    type: "algolia",
    homepage: "https://docs.taro.zone/docs/",
    searchParameters: {
      facetFilters: ["language:zh-cn", ["docusaurus_tag:default", "docusaurus_tag:docs-default-3.x"]],
    },
  },
  "V2 zh-CN": {
    icon: "../assets/logo/taro.png",
    apiKey: "3f32982103f4e75dadd86900d26a9315",
    appId: "BH4D9OD16A",
    indexName: "taro-zone",
    type: "algolia",
    homepage: "https://docs.taro.zone/docs/2.x/",
    searchParameters: {
      facetFilters: ["language:zh-cn", ["docusaurus_tag:default", "docusaurus_tag:docs-default-2.x"]],
    },
  },
  "V1 zh-CN": {
    icon: "../assets/logo/taro.png",
    apiKey: "3f32982103f4e75dadd86900d26a9315",
    appId: "BH4D9OD16A",
    indexName: "taro-zone",
    type: "algolia",
    homepage: "https://docs.taro.zone/docs/1.x/",
    searchParameters: {
      facetFilters: ["language:zh-cn", ["docusaurus_tag:default", "docusaurus_tag:docs-default-1.x"]],
    },
  },
};

export default taro;
