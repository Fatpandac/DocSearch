import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

import {
  data,
  DocID,
  Tags,
  type API,
  type FormatResult,
  type FormatResultItem,
  type Algolia,
  type Custom,
  type Meilisearch,
  type MiniSearch,
  type Trieve,
  algoliaDefaultFormatter,
  checkMinisearchVersion,
  loadMinisearchIndex,
  meilisearchDefaultFormatter,
  searchAlgolia,
  searchCustom,
  searchMeilisearch,
  searchMinisearch,
  searchTrieve,
  trieveDefaultFormatter,
} from "@docsearch/core";

export type DocSummary = {
  id: string;
  name: string;
  tags: string[];
  homepage: string;
};

export type ResolvedDoc = DocSummary & {
  docId: DocID;
};

export type SearchOptions = {
  doc: string;
  query: string;
  tag?: string;
  limit?: number;
};

export type SearchResult = {
  id: string;
  title: string;
  url: string;
  content?: string | null;
  subtitle?: string;
};

export type SearchAdapter = (query: string, api: API) => Promise<FormatResult>;

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;
const CACHE_DIR = path.join(os.homedir(), ".cache", "docsearch");
const minisearchCache = new Map<string, ReturnType<typeof loadMinisearchIndex>>();

function docIdToString(id: DocID): string {
  return DocID[id].toLowerCase();
}

function docIdToName(id: DocID): string {
  return DocID[id].replace(/_/g, " ");
}

function clean(value: string | undefined | null): string {
  return (value ?? "")
    .replace(/[​‌‍﻿­]/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim();
}

function firstApi(id: DocID): API {
  const tag = Object.keys(data[id])[0] as Tags;
  return data[id][tag]!;
}

function normalizeLimit(limit: number | undefined): number {
  if (limit === undefined) return DEFAULT_LIMIT;
  if (!Number.isFinite(limit)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(MAX_LIMIT, Math.floor(limit)));
}

function cacheKey(dataUrl: string): string {
  return Buffer.from(dataUrl).toString("base64").replace(/[/+=]/g, "_");
}

async function loadMinisearchWithCache(api: MiniSearch): Promise<ReturnType<typeof loadMinisearchIndex>> {
  const cachedClient = minisearchCache.get(api.dataUrl);
  if (cachedClient) return cachedClient;

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cacheFile = path.join(CACHE_DIR, `${cacheKey(api.dataUrl)}.json`);

  let storedVersion = "";
  let storedIndex = "";
  try {
    const cached = JSON.parse(fs.readFileSync(cacheFile, "utf-8")) as {
      version?: string;
      searchIndex?: string;
    };
    storedVersion = cached.version ?? "";
    storedIndex = cached.searchIndex ?? "";
  } catch {
    // Cache misses and invalid cache files both fall through to a fresh fetch.
  }

  const { isUpToDate, lastVersion } = await checkMinisearchVersion(api.dataUrl, storedVersion);
  let indexData = storedIndex;

  if (!isUpToDate || !indexData) {
    const res = await fetch(api.dataUrl);
    if (!res.ok) throw new Error(`Failed to fetch MiniSearch index: ${res.statusText}`);
    indexData = await res.text();
    fs.writeFileSync(cacheFile, JSON.stringify({ version: lastVersion, searchIndex: indexData }));
  }

  const client = loadMinisearchIndex(indexData);
  minisearchCache.set(api.dataUrl, client);
  return client;
}

export function listDocs(): DocSummary[] {
  return Object.keys(data).map((idStr) => {
    const id = Number(idStr) as DocID;
    const api = firstApi(id);
    return {
      id: docIdToString(id),
      name: docIdToName(id),
      tags: Object.keys(data[id]),
      homepage: api.homepage,
    };
  });
}

export function resolveDoc(doc: string): ResolvedDoc | undefined {
  const normalized = doc.trim().toLowerCase();
  const idStr = Object.keys(data).find((candidate) => docIdToString(Number(candidate) as DocID) === normalized);
  if (!idStr) return undefined;

  const docId = Number(idStr) as DocID;
  const api = firstApi(docId);
  return {
    docId,
    id: docIdToString(docId),
    name: docIdToName(docId),
    tags: Object.keys(data[docId]),
    homepage: api.homepage,
  };
}

export async function defaultSearchAdapter(query: string, api: API): Promise<FormatResult> {
  switch (api.type) {
    case "algolia": {
      const hits = await searchAlgolia(query, api as Algolia);
      return ((api as Algolia).formatter ?? algoliaDefaultFormatter)(hits);
    }
    case "meilisearch": {
      const hits = await searchMeilisearch(query, api as Meilisearch);
      return ((api as Meilisearch).formatter ?? meilisearchDefaultFormatter)(hits);
    }
    case "trieve": {
      if (!query.trim()) return [];
      const hits = await searchTrieve(query, api as Trieve);
      return ((api as Trieve).formatter ?? trieveDefaultFormatter)(hits);
    }
    case "custom":
      return searchCustom(query, api as Custom);
    case "minisearch": {
      if (!query.trim()) return [];
      const client = await loadMinisearchWithCache(api as MiniSearch);
      return searchMinisearch(client, query, api as MiniSearch) ?? [];
    }
    default: {
      const neverApi = api satisfies never;
      return neverApi;
    }
  }
}

export async function searchDocs(
  options: SearchOptions,
  adapter: SearchAdapter = defaultSearchAdapter,
): Promise<SearchResult[]> {
  const resolved = resolveDoc(options.doc);
  if (!resolved) {
    throw new Error(`Unknown doc: ${options.doc}`);
  }

  const tags = Object.keys(data[resolved.docId]);
  const tag = options.tag ?? tags[0];
  if (!tags.includes(tag)) {
    throw new Error(`Unknown tag "${tag}" for ${resolved.id}. Available tags: ${tags.join(", ")}`);
  }

  const query = options.query.trim();
  if (!query) return [];

  const api = data[resolved.docId][tag as Tags]!;
  const limit = normalizeLimit(options.limit);
  const results = await adapter(query, api);

  return results.slice(0, limit).map((result: FormatResultItem, index) => ({
    id: result.id || result.objectID || `${index}`,
    title: clean(result.title),
    url: result.url,
    subtitle: result.subtitle ? clean(result.subtitle) : undefined,
    content: result.content,
  }));
}
