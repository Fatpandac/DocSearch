# DocSearch

Link **DocSearch** and **Meilisearch** into Raycast.

![interface](./metadata/docsearch-1.png)

### Supported Documentations (44)

|                        Documentations                        |                                                     |                                                         |
| :----------------------------------------------------------: | :-------------------------------------------------: | :-----------------------------------------------------: |
|         [Antd(zh-Hans)](https://ant.design/index-cn)         |             [Antd](https://ant.design/)             | [Antdv(zh-Hans)](https://antdv.com/components/overview) |
|      [Antdv](https://antdv.com/components/overview-cn)       |    [Apollo](https://www.apollographql.com/docs)     |          [Arthas](https://arthas.aliyun.com/)           |
|            [Bootstrap](https://getbootstrap.com/)            |             [Clerk](https://clerk.dev)              |           [Dubbo](https://dubbo.apache.org/)            |
| [Echarts(zh-Hans)](https://echarts.apache.org/zh/index.html) | [Echarts](https://echarts.apache.org/en/index.html) |                [Flet](https://flet.dev/)                |
|             [GitBook](https://docs.gitbook.com/)             |            [Homebrew](https://brew.sh/)             |             [IPFS](https://docs.ipfs.tech/)             |
|             [Laravel 9.x](https://laravel.com/)              |             [Nuxt](https://nuxtjs.org/)             |             [Nuxt3](https://v3.nuxtjs.org/)             |
|                [NvChad](https://nvchad.com/)                 |         [Pnpm(zh-Hans)](https://pnpm.io/zh)         |               [Pnpm](https://pnpm.io/zh)                |
|               [Prettier](https://prettier.io/)               |         [RSSHub](https://docs.rsshub.app/)          |       [Raycast](https://developers.raycast.com/)        |
|        [React(zh-Hans)](https://zh-hans.reactjs.org/)        |            [React](https://reactjs.org/)            |  [React Bootstrap](https://react-bootstrap.github.io/)  |
|           [React Native](https://reactnative.dev/)           |             [Remix](https://remix.run/)             |         [Slidev(zh-Hans)](https://cn.sli.dev/)          |
|                  [Slidev](https://sli.dev/)                  |        [Supabase](https://supabase.com/docs)        |       [TailwindCSS V3](https://tailwindcss.com/)        |
|        [Taro(zh-Hans)](https://docs.taro.zone/docs/)         |           [Unidata](https://unidata.app/)           |         [Vite(zh-Hans)](https://cn.vitejs.dev/)         |
|                 [Vite](https://vitejs.dev/)                  |            [Vitest](https://vitest.dev/)            |        [Vue Router4](https://router.vuejs.org/)         |
|             [Vue3(zh-Hans)](https://vuejs.org/)              |             [Vue3](https://vuejs.org/)              |              [VueUse](https://vueuse.org/)              |
|          [Vuepress V1](https://vuepress.vuejs.org/)          |    [Vuepress V2](https://v2.vuepress.vuejs.org/)    |

### Docsearch

1. The documentation site is supported [DocSearch](https://docsearch.camunda.com/).
2. Open developer tools and input something in the search bar.
   ![developer_tools](./assets/developer_tools_DocSearch.png)
3. Download the site icon and put it into [assets/logo](assets/logo).
4. Input DocSearch data into [api.ts](/src/data/api.ts), like below.
   ```ts
   {
        id: "UUID"// Generate the UUID by yourself and fill it in
        name: 'Vuepress v1',
        icon: '../assets/logo/XXXX.png',  // path to icon in the assets folder
        apiKey: '3a539aab83105f01761a137c61004d85',
        appID: 'BH4D9OD16A',
        indexName: 'vuepress',
        homepage: 'https://vuepress.vuejs.org/',
   }
   ```
5. Run the command `npm run generate`. This will create the entry file and config. After that, you can run the command `npm run dev` to test it, and `npm run build` to build it.

### Meilisearch

1. The documentation site is supported [Meilisearch](https://www.meilisearch.com/).
2. Open developer tools and input something in the search bar.
   ![developer_tools](./assets/developer_tools_Meilisearch.png)
3. Download the site icon and put it into [assets/logo](assets/logo).
4. Input DocSearch data into [api.ts](/src/data/api.ts), like below.
   ```ts
   {
      id: "UUID"// Generate the UUID by yourself and fill it in
      name: 'RSSHub',
      icon: '../assets/logo/XXXX.png',  // path to icon in the assets folder
      apiKey: '375c36cd9573a2c1d1e536214158c37120fdd0ba6cd8829f7a848e940cc22245',
      apiHost: 'https://meilisearch.rsshub.app',
      indexName: 'rsshub',
      homepage: 'https://docs.rsshub.app/',
   }
   ```
5. Run the command `npm run generate`. This will create the entry file and config. After that, you can run the command `npm run dev` to test it, and `npm run build` to build it.

**Enjoy! Welcome to contribute.**
