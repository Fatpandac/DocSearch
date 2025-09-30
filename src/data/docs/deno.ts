import { DocItem } from "../types";

const deno: DocItem = {
  "en-US Manual": {
    icon: "../assets/logo/deno.png",
    apiKey: "2ed789b2981acd210267b27f03ab47da",
    appId: "QFPCRZC6WX",
    indexName: "manual",
    type: "algolia",
    homepage: "https://deno.com/",
    searchParameters: {
      filters: "kind:paragraph",
    },
  },
  "en-US Modules": {
    icon: "../assets/logo/deno.png",
    apiKey: "2ed789b2981acd210267b27f03ab47da",
    appId: "QFPCRZC6WX",
    indexName: "modules",
    type: "algolia",
    homepage: "https://deno.land/x/",
  },
};

export default deno;
