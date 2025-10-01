import { AutocompleteSearchOverGroupsReqPayload, SearchMethod } from "trieve-ts-sdk";
import { FormatResult } from "../utils";
import { NewScoreChunk } from "../hooks";
// prettier-ignore
export enum DocID {
  Antd, Antdv, Apollo, Arthas, Astro,
  Bootstrap, Clerk, Dubbo, Echarts,
  Flet, GitBook, Homebrew, IPFS,
  Laravel, Nuxt, NvChad, Pnpm,
  Prettier, Raycast, React,
  React_Bootstrap, React_Native,
  Remix, Slidev, Taro, Supabase,
  TailwindCSS, Tauri, Unidata, Vite,
  Vitest, Vue_Router, Vue, VueUse,
  Vuepress, ElementPlus, Neovim, Less,
  Sass, Deno, TypeScript, NextJS,
  MassTransit, Pinia, Yazi, Ollama,
}

type Base = {
  icon: string;
  apiKey: string;
  homepage: string;
  indexName: string;
  searchParameters?: object;
};

export type Algolia = Base & {
  appId: string;
  type: "algolia";
  // TODO: fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (searchResults: Array<any>) => FormatResult;
};

export type Meilisearch = Base & {
  apiHost: string;
  type: "meilisearch";
  // TODO: fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (searchResults: Array<any>) => FormatResult;
};

export type Trieve = Omit<Base, "indexName" | "searchParameters"> & {
  datasetId: string;
  type: "trieve";
  /** Custom Trieve API base URL */
  baseUrl?: string;
  searchType: SearchMethod;
  searchParameters: Omit<AutocompleteSearchOverGroupsReqPayload, "query" | "search_type">;
  formatter?: (searchResults: Array<NewScoreChunk>) => FormatResult;
};

type DocsTypes = "Manual" | "Modules" | "App" | "Pages";
type Languages = "en-US" | "zh-CN" | "fr-FR" | "ko-KR" | "it-IT";
type Versions = "V0" | "V1" | "V2" | "V3" | "V4" | "V9";
export type Tags = `${Versions} ${Languages}` | `${Languages} ${DocsTypes}` | `${Languages}`;

export type API = Algolia | Meilisearch | Trieve;
export type DocItem = Partial<Record<Tags, API>>;
export type Data = {
  [key in DocID]: DocItem;
};
