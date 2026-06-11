import { DocItem } from "../types";

const astro: DocItem = {
  "en-US": {
    icon: "../assets/logo/astro.png",
    apiKey: "4440670147c44d744fd8da35ff652518",
    appId: "7AFBU8EPJU",
    indexName: "astro",
    type: "algolia",
    homepage: "https://docs.astro.build/",
    searchParameters: {
      facetFilters: ["lang:en"],
    },
  },
  "zh-CN": {
    icon: "../assets/logo/astro.png",
    apiKey: "4440670147c44d744fd8da35ff652518",
    appId: "7AFBU8EPJU",
    indexName: "astro",
    type: "algolia",
    homepage: "https://docs.astro.build/zh-cn/",
    searchParameters: {
      facetFilters: ["lang:zh-cn"],
    },
  },
};

export default astro;
