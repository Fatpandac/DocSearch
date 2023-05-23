import { API } from "../types";

export default <API[]>[
  {
    id: "48dd6e88-fd12-4e55-8d0d-e9c2982ba924",
    name: "Apollo",
    icon: "../assets/logo/apollo.png",
    apiKey: "ef1ac4e3c439bc17a8e7572700691efc",
    appId: "Q0CJ63JM7B",
    indexName: "docs",
    type: "algolia",
    homepage: "https://www.apollographql.com/docs",
  },
  {
    id: "138055c4-5959-4f0a-bd9b-d8df8ff7cf9b",
    name: "Arthas",
    icon: "../assets/logo/arthas.ico",
    apiKey: "03fb4b6577b57b5dafc792d9ddf66508",
    appId: "UX8WBNVHHR",
    indexName: "arthas",
    type: "algolia",
    homepage: "https://arthas.aliyun.com/",
  },
  {
    id: "885d77e7-300b-4713-8755-6b5f69fc1ac0",
    name: "Bootstrap",
    icon: "../assets/logo/bootstrap.ico",
    apiKey: "5990ad008512000bba2cf951ccf0332f",
    appId: "BH4D9OD16A",
    indexName: "bootstrap",
    type: "algolia",
    homepage: "https://getbootstrap.com/",
    searchParameters: {
      facetFilters: ["version:5.1"],
    },
  },
  {
    id: "c17f1bd8-6479-4232-84d9-3e8666e0f5c4",
    name: "Clerk",
    icon: "../assets/logo/clerk.png",
    apiKey: "52385d30a5ca4460564defe5b2d0ffb1",
    appId: "RA7W9NZP4T",
    indexName: "prod_sanity",
    type: "algolia",
    homepage: "https://clerk.dev",
  },
  {
    id: "85e39537-84d3-442f-a7b3-c3cac9b64d60",
    name: "Dubbo",
    icon: "../assets/logo/dubbo.png",
    apiKey: "364ae307e1da9d02b2335675e9db1eb1",
    appId: "L5F4T9F0I1",
    indexName: "apache_dubbo",
    type: "algolia",
    homepage: "https://dubbo.apache.org/",
  },
  {
    id: "2bf1b09a-6cb5-44d3-9812-c9d8df1ed45e",
    name: "Echarts",
    icon: "../assets/logo/echarts.png",
    apiKey: "6ade5f1ff34e94690f9ea38cddcc2f55",
    appId: "BH4D9OD16A",
    indexName: "apache_echarts",
    type: "algolia",
    homepage: "https://echarts.apache.org/en/index.html",
    searchParameters: {
      facetFilters: ["lang:en"],
    },
  },
  {
    id: "32a8ea32-e398-4ed1-bc99-9425afa1ad33",
    name: "Echarts",
    icon: "../assets/logo/echarts.png",
    apiKey: "6ade5f1ff34e94690f9ea38cddcc2f55",
    appId: "BH4D9OD16A",
    indexName: "apache_echarts",
    type: "algolia",
    homepage: "https://echarts.apache.org/zh/index.html",
    lang: "zh-Hans",
    searchParameters: {
      facetFilters: ["lang:zh"],
    },
  },
  {
    id: "8c01f070-0f5b-4b1c-a45e-36ac52967484",
    name: "Flet",
    icon: "../assets/logo/flet.png",
    apiKey: "4b060907ba79d92e8869e9d1ff80bce7",
    appId: "ESNSJEY7OD",
    indexName: "flet",
    type: "algolia",
    homepage: "https://flet.dev/",
  },
  {
    id: "a70b02e2-573c-4af0-8b57-2de598b79e98",
    name: "GitBook",
    icon: "../assets/logo/gitbook.png",
    apiKey:
      "MDgxNzdmZGVhM2MzMDJiMjAxMzczZTllMmVmMDAxOGQ1N2YzMjAyM2M0ZWMxZjk5NmFmYjE0ODA0OWUzYzFlMGZpbHRlcnM9KHZpZXdhYmxlQnlQdWJsaWNTcGFjZXMlM0FOa0VHUzdoemVxYTM1c01YUVo0WC0xKSUyMEFORCUyMHByb2plY3RJZCUzQWdpdGJvb2steC1wcm9k",
    appId: "U102FN9U1K",
    indexName: "pages",
    type: "algolia",
    homepage: "https://docs.gitbook.com/",
  },
  {
    id: "da1d3562-0f6b-46ed-8c10-eed51f301102",
    name: "Homebrew",
    icon: "../assets/logo/homebrew.png",
    apiKey: "a57ef92bf2adfae863a201ee43d6b5a1",
    appId: "BH4D9OD16A",
    indexName: "brew_all",
    type: "algolia",
    homepage: "https://brew.sh/",
  },
  {
    id: "4e3fd0d3-d77e-4b13-91df-96cb2e36737d",
    name: "IPFS",
    icon: "../assets/logo/ipfs.png",
    apiKey: "e56fc7c611806522df45191e22ed15ac",
    appId: "BH4D9OD16A",
    indexName: "ipfs-docs",
    type: "algolia",
    homepage: "https://docs.ipfs.tech/",
  },
  {
    id: "05b5bb50-2818-49d8-b3f7-590078eff494",
    name: "Laravel 9.x",
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
  {
    id: "92739c0f-d742-4e9b-b1fc-1cd5c939cbd2",
    name: "Nuxt",
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
  {
    id: "85dcc3c8-991c-4e4f-b0c7-a179a14f4da5",
    name: "Nuxt3",
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
  {
    id: "f34b823f-fd22-4b17-940e-a306019d62d1",
    name: "Prettier",
    icon: "../assets/logo/prettier.png",
    apiKey: "9fcdb2a62af4c47cc5eecf3d5a747818",
    appId: "BH4D9OD16A",
    indexName: "prettier",
    type: "algolia",
    homepage: "https://prettier.io/",
  },
  {
    id: "5153b247-e459-42be-89aa-95f8476c1faf",
    name: "RSSHub",
    icon: "../assets/logo/rsshub.png",
    apiKey: "375c36cd9573a2c1d1e536214158c37120fdd0ba6cd8829f7a848e940cc22245",
    indexName: "rsshub",
    type: "meilisearch",
    apiHost: "https://meilisearch.rsshub.app/",
    homepage: "https://docs.rsshub.app/",
  },
  {
    id: "af8c6158-e2d7-465c-8f72-4b5fb922048b",
    name: "Raycast",
    icon: "../assets/logo/raycast.png",
    apiKey:
      "YmZlNDIxZTVlYWQyOWQ4ZThhMzdkOGUxOTY0YjU2NGNjZDNkOTA5NjQ3MmZmMjg0MzViYjYzMDI4NTVkMmQ1ZmZpbHRlcnM9KHZpZXdhYmxlQnlQdWJsaWNTcGFjZXMlM0EtTWVfOEEzOXRGaFpnM1VhVm9TTi0yKSUyMEFORCUyMHByb2plY3RJZCUzQWdpdGJvb2steC1wcm9k",
    appId: "U102FN9U1K",
    indexName: "pages",
    type: "algolia",
    homepage: "https://developers.raycast.com/",
  },
  {
    id: "0d447343-8e25-4f46-b2de-ad3b84acb93f",
    name: "React",
    icon: "../assets/logo/react.ico",
    apiKey: "36221914cce388c46d0420343e0bb32e",
    appId: "BH4D9OD16A",
    indexName: "react",
    type: "algolia",
    homepage: "https://reactjs.org/",
  },
  {
    id: "a7cc37c2-cd7c-4d1b-9db2-5dd3b25bc96e",
    name: "React",
    icon: "../assets/logo/react.ico",
    apiKey: "72499aaa151dba0828babe727c7b86ee",
    appId: "BH4D9OD16A",
    indexName: "reactjs_zh-hans",
    type: "algolia",
    homepage: "https://zh-hans.reactjs.org/",
    lang: "zh-Hans",
  },
  {
    id: "9ed920ac-6414-4c8a-878b-d2807fd7b800",
    name: "React Bootstrap",
    icon: "../assets/logo/react_bootstrap.png",
    apiKey: "33985ee571397d832ef243988ff4c891",
    appId: "C38ZI55F9H",
    type: "algolia",
    homepage: "https://react-bootstrap.github.io/",
    indexName: "react_bootstrap_v4",
  },
  {
    id: "dd5dfe57-d905-4201-82c7-942f522b9ee8",
    name: "React Native",
    icon: "../assets/logo/react.ico",
    apiKey: "83cd239c72f9f8b0ed270a04b1185288",
    appId: "8TDSE0OHGQ",
    indexName: "react-native-v2",
    type: "algolia",
    homepage: "https://reactnative.dev/",
    searchParameters: {
      facetFilters: [
        "language:en",
        [
          "docusaurus_tag:default",
          "docusaurus_tag:docs-default-0.69",
          "docusaurus_tag:docs-contributing-current",
          "docusaurus_tag:docs-architecture-current",
        ],
      ],
    },
  },
  {
    id: "827c55c0-1181-4791-897e-2a852f0eb8b7",
    name: "Remix",
    icon: "../assets/logo/remix.png",
    apiKey: "dff56670dbec8494409989d6ec9c8ac2",
    appId: "6OHWJSR8G4",
    type: "algolia",
    homepage: "https://remix.run/",
    indexName: "remix",
  },
  {
    id: "0ef85678-06e0-44fa-bced-85fc841613cb",
    name: "Slidev",
    icon: "../assets/logo/slidev.png",
    apiKey: "1ff173fe73b20edc962c1c24c0b1c160",
    appId: "LCBV6MIFS6",
    indexName: "slidev",
    type: "algolia",
    homepage: "https://sli.dev/",
    searchParameters: {
      facetFilters: ["language:en"],
    },
  },
  {
    id: "072393d1-fd1b-4d61-bcbe-8d613147f5b4",
    name: "Slidev",
    icon: "../assets/logo/slidev.png",
    apiKey: "1a5c5a504139c58f428974c78c55291d",
    appId: "BH4D9OD16A",
    indexName: "slidev",
    type: "algolia",
    homepage: "https://cn.sli.dev/",
    lang: "zh-Hans",
    searchParameters: {
      facetFilters: ["language:cn"],
    },
  },
  {
    id: "47d9a612-06be-4684-84cb-23b602a458d5",
    name: "Supabase",
    icon: "../assets/logo/supabase.png",
    apiKey: "0424becc4055d51ec60e54cc37df5574",
    appId: "B3Z5XYG8NS",
    indexName: "prod_docs",
    type: "algolia",
    homepage: "https://supabase.com/docs",
  },
  {
    id: "a27a6445-8265-4c59-b08e-ce53474c0b8c",
    name: "TailwindCSS v3",
    icon: "../assets/logo/tailwindcss.png",
    apiKey: "5fc87cef58bb80203d2207578309fab6",
    appId: "KNPXZI5B0M",
    indexName: "tailwindcss",
    type: "algolia",
    homepage: "https://tailwindcss.com/",
    searchParameters: {
      facetFilters: ["version:v3"],
    },
  },
  {
    id: "bd744296-9bed-4ae2-86b6-0fa2ddac45fd",
    name: "Unidata",
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
  {
    id: "f49f3a04-fb3d-4f42-a527-de073e409e2b",
    name: "Vite",
    icon: "../assets/logo/vite.png",
    apiKey: "b573aa848fd57fb47d693b531297403c",
    appId: "BH4D9OD16A",
    indexName: "vitejs",
    type: "algolia",
    homepage: "https://vitejs.dev/",
  },
  {
    id: "3a255f8b-b932-493c-bc8b-9e7bc79ecd3a",
    name: "Vite",
    icon: "../assets/logo/vite.png",
    apiKey: "b573aa848fd57fb47d693b531297403c",
    appId: "BH4D9OD16A",
    indexName: "vitejs",
    type: "algolia",
    homepage: "https://cn.vitejs.dev/",
    lang: "zh-Hans",
    searchParameters: {
      facetFilters: ["tags:cn"],
    },
  },
  {
    id: "9c8d78ea-9a6b-4afa-b051-8187c0ee96d4",
    name: "Vitest",
    icon: "../assets/logo/vitest.png",
    apiKey: "9c3ced6fed60d2670bb36ab7e8bed8bc",
    appId: "ZTF29HGJ69",
    indexName: "vitest",
    type: "algolia",
    homepage: "https://vitest.dev/",
  },
  {
    id: "70d84e01-304f-4838-9ce8-63ba0c6d35cf",
    name: "Vue Router4",
    icon: "../assets/logo/vue.png",
    apiKey: "771d10c8c5cc48f7922f15048b4d931c",
    appId: "BTNTW3I1XP",
    indexName: "next_router_vuejs",
    type: "algolia",
    homepage: "https://router.vuejs.org/",
  },
  {
    id: "3261c206-c4f0-42bd-b53e-af5b6addf350",
    name: "Vue3",
    icon: "../assets/logo/vue.png",
    apiKey: "f49cbd92a74532cc55cfbffa5e5a7d01",
    appId: "ML0LEBN7FQ",
    indexName: "vuejs",
    type: "algolia",
    homepage: "https://vuejs.org/",
    searchParameters: {
      facetFilters: ["version:v3"],
    },
  },
  {
    id: "e9654353-3f1f-4970-ba87-04483158ff12",
    name: "Vue3",
    icon: "../assets/logo/vue.png",
    apiKey: "c23eb8e7895f42daeaf2bf6f63eb4bf6",
    appId: "UURH1MHAF7",
    indexName: "vuejs_cn2",
    lang: "zh-Hans",
    type: "algolia",
    homepage: "https://vuejs.org/",
    searchParameters: {
      facetFilters: ["version:v3"],
    },
  },
  {
    id: "41a892ff-2faf-4d17-9f28-2c43b8a1899c",
    name: "VueUse",
    icon: "../assets/logo/vueuse.png",
    apiKey: "a99ef8de1b2b27949975ce96642149c6",
    appId: "BH4D9OD16A",
    indexName: "vueuse",
    type: "algolia",
    homepage: "https://vueuse.org/",
  },
  {
    id: "658f6845-f675-4c91-b39a-cf92bbe8f7be",
    name: "Vuepress v1",
    icon: "../assets/logo/vuepress.png",
    apiKey: "3a539aab83105f01761a137c61004d85",
    appId: "BH4D9OD16A",
    indexName: "vuepress",
    type: "algolia",
    homepage: "https://vuepress.vuejs.org/",
  },
  {
    id: "3174b8d7-39cf-4631-8a6b-2faaf15b866e",
    name: "Vuepress v2",
    icon: "../assets/logo/vuepress.png",
    apiKey: "9a9058b8655746634e01071411c366b8",
    appId: "34YFD9IUQ2",
    indexName: "vuepress",
    type: "algolia",
    homepage: "https://v2.vuepress.vuejs.org/",
  },
  {
    id: "6cc3dde8-5e2b-4f7c-81e8-16fb3e2abb26",
    name: "pnpm",
    icon: "../assets/logo/pnpm.png",
    apiKey: "a337998a623aa8f80d2a97a79d565086",
    appId: "RAHRBBK2WL",
    indexName: "pnpm",
    type: "algolia",
    homepage: "https://pnpm.io/zh",
    searchParameters: {
      facetFilters: ["language:en"],
    },
  },
  {
    id: "bd3137b3-2d8c-4b3b-91d8-44f647aa0602",
    name: "pnpm",
    icon: "../assets/logo/pnpm.png",
    apiKey: "a337998a623aa8f80d2a97a79d565086",
    appId: "RAHRBBK2WL",
    indexName: "pnpm",
    type: "algolia",
    homepage: "https://pnpm.io/zh",
    lang: "zh-Hans",
    searchParameters: {
      facetFilters: ["language:zh"],
    },
  },
];
