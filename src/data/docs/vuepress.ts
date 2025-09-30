import { DocItem } from "../types";

const vuepress: DocItem = {
  "V2 en-US": {
    icon: "../assets/logo/vuepress.png",
    apiKey: "9a9058b8655746634e01071411c366b8",
    appId: "34YFD9IUQ2",
    indexName: "vuepress",
    searchParameters: {
      attributesToRetrieve: [
        "hierarchy.lvl0",
        "hierarchy.lvl1",
        "hierarchy.lvl2",
        "hierarchy.lvl3",
        "hierarchy.lvl4",
        "hierarchy.lvl5",
        "hierarchy.lvl6",
        "content",
        "type",
        "url",
      ],
    },
    type: "algolia",
    homepage: "https://v2.vuepress.vuejs.org/",
  },
  "V2 zh-CN": {
    icon: "../assets/logo/vuepress.png",
    apiKey: "9a9058b8655746634e01071411c366b8",
    appId: "34YFD9IUQ2",
    indexName: "vuepress",
    searchParameters: {
      attributesToRetrieve: [
        "hierarchy.lvl0",
        "hierarchy.lvl1",
        "hierarchy.lvl2",
        "hierarchy.lvl3",
        "hierarchy.lvl4",
        "hierarchy.lvl5",
        "hierarchy.lvl6",
        "content",
        "type",
        "url",
      ],
      facetFilters: ["lang:zh-CN", "tags:v2"],
    },
    type: "algolia",
    homepage: "https://v2.vuepress.vuejs.org/zh/",
  },
  "V1 en-US": {
    icon: "../assets/logo/vuepress.png",
    apiKey: "3a539aab83105f01761a137c61004d85",
    appId: "BH4D9OD16A",
    indexName: "vuepress",
    type: "algolia",
    homepage: "https://vuepress.vuejs.org/",
  },
  "V1 zh-CN": {
    icon: "../assets/logo/vuepress.png",
    apiKey: "3a539aab83105f01761a137c61004d85",
    appId: "BH4D9OD16A",
    indexName: "vuepress",
    type: "algolia",
    homepage: "https://vuepress.vuejs.org/zh/",
    searchParameters: {
      facetFilters: ["lang:zh-CN", "tags:v1"],
    },
  },
};

export default vuepress;
