import { DocItem } from "../types";

const unidata: DocItem = {
  "en-US": {
    icon: "../assets/logo/unidata.png",
    apiKey: "3f968df846740a9e2b38e89d8e6ce9fa",
    appId: "LNA1UZCPZB",
    indexName: "unidata",
    type: "algolia",
    homepage: "https://unidata.app/",
    searchParameters: {
      facetFilters: ["lang:en-US"],
    },
  },
};

export default unidata;
