import { DocItem } from "../types";

const echarts: DocItem = {
  "en-US": {
    icon: "../assets/logo/echarts.png",
    apiKey: "6ade5f1ff34e94690f9ea38cddcc2f55",
    appId: "BH4D9OD16A",
    indexName: "apache_echarts",
    type: "algolia",
    homepage: "https://echarts.apache.org/en/index.html",
    searchParameters: {
      facetFilters: ["lang:en"],
    },
  },
  "zh-CN": {
    icon: "../assets/logo/echarts.png",
    apiKey: "6ade5f1ff34e94690f9ea38cddcc2f55",
    appId: "BH4D9OD16A",
    indexName: "apache_echarts",
    type: "algolia",
    homepage: "https://echarts.apache.org/zh/index.html",
    searchParameters: {
      facetFilters: ["lang:zh"],
    },
  },
};

export default echarts;
