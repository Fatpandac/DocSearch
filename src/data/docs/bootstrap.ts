import { DocItem } from "../types";

const bootstrap: DocItem = {
  "en-US": {
    icon: "../assets/logo/bootstrap.png",
    apiKey: "3151f502c7b9e9dafd5e6372b691a24e",
    appId: "AK7KMZKZHQ",
    indexName: "bootstrap",
    type: "algolia",
    homepage: "https://getbootstrap.com/",
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
      facetFilters: ["version:5.3"],
    },
  },
};

export default bootstrap;
