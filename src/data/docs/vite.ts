import { DocItem } from "../types";

const vite: DocItem = {
  "en-US": {
    icon: "../assets/logo/vite.png",
    apiKey: "b573aa848fd57fb47d693b531297403c",
    appId: "BH4D9OD16A",
    indexName: "vitejs",
    type: "algolia",
    homepage: "https://vitejs.dev/",
  },
  "zh-CN": {
    icon: "../assets/logo/vite.png",
    apiKey: "b573aa848fd57fb47d693b531297403c",
    appId: "BH4D9OD16A",
    indexName: "vitejs",
    type: "algolia",
    homepage: "https://cn.vitejs.dev/",
    searchParameters: {
      facetFilters: ["tags:cn"],
    },
  },
};

export default vite;
