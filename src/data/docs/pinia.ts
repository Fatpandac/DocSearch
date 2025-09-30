import { DocItem } from "../types";

const pinia: DocItem = {
  "en-US": {
    icon: "../assets/logo/pinia.png",
    apiKey: "45441f4b65a2f80329fd45c7cb371fea",
    appId: "69Y3N7LHI2",
    indexName: "pinia",
    type: "algolia",
    homepage: "https://pinia.vuejs.org/",
    searchParameters: {
      facetFilters: ["lang:en-US"],
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
      attributesToSnippet: [
        "hierarchy.lvl1:5",
        "hierarchy.lvl2:5",
        "hierarchy.lvl3:5",
        "hierarchy.lvl4:5",
        "hierarchy.lvl5:5",
        "hierarchy.lvl6:5",
        "content:5",
      ],
    },
  },
};

export default pinia;
