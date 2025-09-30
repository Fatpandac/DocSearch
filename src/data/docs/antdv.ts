import { DocItem } from "../types";

const antdv: DocItem = {
  "en-US": {
    icon: "../assets/logo/antdv.png",
    apiKey: "92003c1d1d07beef165b08446f4224a3",
    appId: "BH4D9OD16A",
    indexName: "antdv",
    type: "algolia",
    homepage: "https://antdv.com/components/overview-cn",
    searchParameters: {
      facetFilters: ["tags:en"],
    },
  },
  "zh-CN": {
    icon: "../assets/logo/antdv.png",
    apiKey: "92003c1d1d07beef165b08446f4224a3",
    appId: "BH4D9OD16A",
    indexName: "antdv",
    type: "algolia",
    homepage: "https://antdv.com/components/overview",
    searchParameters: {
      facetFilters: ["tags:cn"],
    },
  },
};

export default antdv;
