export type API = algolia;

type algolia = {
  name: string;
  icon: string;
  appId: string;
  apiKey: string;
  indexName: string;
  homepage: string;
  lang?: string;
  searchParameters?: object;
};
