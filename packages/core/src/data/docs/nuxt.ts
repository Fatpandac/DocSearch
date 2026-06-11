import { DocItem } from "../types";

const nuxt: DocItem = {
  "V3 en-US": {
    icon: "../assets/logo/nuxt.png",
    apiKey: "60a01900a4b726d667eab75b6f337592",
    appId: "1V8G7N9GF0",
    indexName: "nuxtjs",
    type: "algolia",
    homepage: "https://v3.nuxtjs.org/",
    searchParameters: {
      facetFilters: ["language:en-US", "tags:v3"],
    },
  },
  "V2 en-US": {
    icon: "../assets/logo/nuxt.png",
    apiKey: "60a01900a4b726d667eab75b6f337592",
    appId: "1V8G7N9GF0",
    indexName: "nuxtjs",
    type: "algolia",
    homepage: "https://nuxtjs.org/",
    searchParameters: {
      facetFilters: ["language:en-US", "tags:main"],
    },
  },
};

export default nuxt;
