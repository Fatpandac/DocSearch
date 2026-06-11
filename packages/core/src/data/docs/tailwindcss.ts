import { DocItem } from "../types";

const tailwindcss: DocItem = {
  "V4 en-US": {
    icon: "../assets/logo/tailwindcss.png",
    apiKey: "5fc87cef58bb80203d2207578309fab6",
    appId: "KNPXZI5B0M",
    indexName: "tailwindcss",
    type: "algolia",
    homepage: "https://tailwindcss.com/",
    searchParameters: {
      facetFilters: [["version:v4", "version:plus"]],
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
        "product",
        "product_category",
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
  "V3 en-US": {
    icon: "../assets/logo/tailwindcss.png",
    apiKey: "5fc87cef58bb80203d2207578309fab6",
    appId: "KNPXZI5B0M",
    indexName: "tailwindcss",
    type: "algolia",
    homepage: "https://v3.tailwindcss.com/",
    searchParameters: {
      facetFilters: ["version:v3"],
    },
  },
  "V2 en-US": {
    icon: "../assets/logo/tailwindcss.png",
    apiKey: "5fc87cef58bb80203d2207578309fab6",
    appId: "KNPXZI5B0M",
    indexName: "tailwindcss",
    type: "algolia",
    homepage: "https://v2.tailwindcss.com/",
    searchParameters: {
      facetFilters: ["version:v2"],
    },
  },
  "V1 en-US": {
    icon: "../assets/logo/tailwindcss.png",
    apiKey: "3df93446658cd9c4e314d4c02a052188",
    appId: "BH4D9OD16A",
    indexName: "tailwindcss",
    type: "algolia",
    homepage: "https://v1.tailwindcss.com/",
    searchParameters: {
      facetFilters: ["version:v1"],
    },
  },
  "V0 en-US": {
    icon: "../assets/logo/tailwindcss.png",
    apiKey: "3df93446658cd9c4e314d4c02a052188",
    appId: "BH4D9OD16A",
    indexName: "tailwindcss",
    type: "algolia",
    homepage: "https://tailwindcss-v0.netlify.app/",
    searchParameters: {
      facetFilters: ["version:v0"],
    },
  },
};

export default tailwindcss;
