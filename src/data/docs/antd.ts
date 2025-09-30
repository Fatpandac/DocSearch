import { DocItem } from "../types";

const antd: DocItem = {
  "en-US": {
    icon: "../assets/logo/antd.png",
    apiKey: "60ac2c1a7d26ab713757e4a081e133d0",
    appId: "BH4D9OD16A",
    indexName: "ant_design",
    type: "algolia",
    homepage: "https://ant.design/",
    searchParameters: {
      facetFilters: ["tags:en"],
    },
  },
  "zh-CN": {
    icon: "../assets/logo/antd.png",
    apiKey: "60ac2c1a7d26ab713757e4a081e133d0",
    appId: "BH4D9OD16A",
    indexName: "ant_design",
    type: "algolia",
    homepage: "https://ant.design/index-cn",
    searchParameters: {
      facetFilters: ["tags:cn"],
    },
  },
};

export default antd;
