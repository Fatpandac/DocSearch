import { DocItem } from "../types";

const slidev: DocItem = {
  "en-US": {
    icon: "../assets/logo/slidev.png",
    apiKey: "1ff173fe73b20edc962c1c24c0b1c160",
    appId: "LCBV6MIFS6",
    indexName: "slidev",
    type: "algolia",
    homepage: "https://sli.dev/",
    searchParameters: {
      facetFilters: ["language:en"],
    },
  },
  "zh-CN": {
    icon: "../assets/logo/slidev.png",
    apiKey: "1a5c5a504139c58f428974c78c55291d",
    appId: "BH4D9OD16A",
    indexName: "slidev",
    type: "algolia",
    homepage: "https://cn.sli.dev/",
    searchParameters: {
      facetFilters: ["language:cn"],
    },
  },
};

export default slidev;
