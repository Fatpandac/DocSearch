import { DocItem } from "../types";

const laravel: DocItem = {
  "V9 en-US": {
    icon: "../assets/logo/laravel.png",
    apiKey: "1fa3a8fec06eb1858d6ca137211225c0",
    appId: "E3MIRNPJH5",
    indexName: "laravel",
    type: "algolia",
    homepage: "https://laravel.com/",
    searchParameters: {
      facetFilters: ["version:9.x"],
      highlightPreTag: '<em class: "not-italic bg-red-600 bg-opacity-25">',
      highlightPostTag: "</em>",
    },
  },
};

export default laravel;
