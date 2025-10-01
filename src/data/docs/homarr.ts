import { DocItem } from "../types";

const homarr: DocItem = {
  "V1.39.0 en-US": {
    icon: "../assets/logo/homarr.png",
    apiKey: "b2b00f4ed8ca3dc87b5d211c55121416",
    appId: "N69WSPZTID",
    indexName: "homarr",
    type: "algolia",
    homepage: "https://homarr.dev/",
    searchParameters: {
      facetFilters: ["language:en", ["docusaurus_tag:default", "docusaurus_tag:docs-default-1.39.0"]],
    },
  },
};

export default homarr;
