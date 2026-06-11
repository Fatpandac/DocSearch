import { DocItem } from "../types";

const tauri: DocItem = {
  "en-US": {
    icon: "../assets/logo/tauri.png",
    apiKey: "3eb6db150af1abefe000f00386e149dfb5a006932cab55d1ccd810b8672a4e12",
    indexName: "docs-v1",
    type: "meilisearch",
    apiHost: "https://ms-4ebb96f179f0-1619.fra.meilisearch.io/",
    homepage: "https://tauri.app/",
    searchParameters: {
      attributesToHighlight: ["*"],
      attributesToCrop: ["content"],
      cropLength: 30,
      filter: ["lang = en"],
    },
  },
  "zh-CN": {
    icon: "../assets/logo/tauri.png",
    apiKey: "3eb6db150af1abefe000f00386e149dfb5a006932cab55d1ccd810b8672a4e12",
    indexName: "docs-v1",
    type: "meilisearch",
    apiHost: "https://ms-4ebb96f179f0-1619.fra.meilisearch.io/",
    homepage: "https://tauri.app/zh-cn/",
    searchParameters: {
      attributesToHighlight: ["*"],
      attributesToCrop: ["content"],
      cropLength: 30,
      filter: ["lang = zh-cn"],
    },
  },
  "fr-FR": {
    icon: "../assets/logo/tauri.png",
    apiKey: "3eb6db150af1abefe000f00386e149dfb5a006932cab55d1ccd810b8672a4e12",
    indexName: "docs-v1",
    type: "meilisearch",
    apiHost: "https://ms-4ebb96f179f0-1619.fra.meilisearch.io/",
    homepage: "https://tauri.app/fr/",
    searchParameters: {
      attributesToHighlight: ["*"],
      attributesToCrop: ["content"],
      cropLength: 30,
      filter: ["lang = fr"],
    },
  },
  "ko-KR": {
    icon: "../assets/logo/tauri.png",
    apiKey: "3eb6db150af1abefe000f00386e149dfb5a006932cab55d1ccd810b8672a4e12",
    indexName: "docs-v1",
    type: "meilisearch",
    apiHost: "https://ms-4ebb96f179f0-1619.fra.meilisearch.io/",
    homepage: "https://tauri.app/ko/",
    searchParameters: {
      attributesToHighlight: ["*"],
      attributesToCrop: ["content"],
      cropLength: 30,
      filter: ["lang = ko"],
    },
  },
  "it-IT": {
    icon: "../assets/logo/tauri.png",
    apiKey: "3eb6db150af1abefe000f00386e149dfb5a006932cab55d1ccd810b8672a4e12",
    indexName: "docs-v1",
    type: "meilisearch",
    apiHost: "https://ms-4ebb96f179f0-1619.fra.meilisearch.io/",
    homepage: "https://tauri.app/it/",
    searchParameters: {
      attributesToHighlight: ["*"],
      attributesToCrop: ["content"],
      cropLength: 30,
      filter: ["lang = it"],
    },
  },
};

export default tauri;
