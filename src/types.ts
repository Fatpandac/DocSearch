export type API = TAlgolia | TMeilisearch;

type UUID = string;

type base = {
  id: UUID;
  name: string;
  icon: string;
  lang?: string;
  apiKey: string;
  homepage: string;
  indexName: string;
  searchParameters?: object;
};

export type TAlgolia = base & {
  appId: string;
  type: "algolia";
};

export type TMeilisearch = base & {
  apiHost: string;
  type: "meilisearch";
};
