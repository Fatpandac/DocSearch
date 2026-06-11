import { DocItem } from "../types";

const massTransit: DocItem = {
  "en-US": {
    icon: "../assets/logo/masstransit.png",
    apiKey: "c1b63b1b97fd65692eaf194862ce532b",
    appId: "TGRVKMJDRV",
    indexName: "masstransit_io",
    type: "algolia",
    homepage: "https://masstransit.io/",
    searchParameters: {
      facetFilters: ["lang:en"],
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

export default massTransit;
