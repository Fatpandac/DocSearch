import {
  data,
  DocID,
  Tags,
  searchAlgolia,
  searchMeilisearch,
  searchTrieve,
  searchCustom,
  loadMinisearchIndex,
  searchMinisearch,
  checkMinisearchVersion,
  algoliaDefaultFormatter,
  meilisearchDefaultFormatter,
  trieveDefaultFormatter,
  FormatResult,
} from "@docsearch/core";
import type { Algolia, Meilisearch, Trieve, Custom, MiniSearch, API } from "@docsearch/core";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// ── text cleaning ─────────────────────────────────────────────────────────────

function clean(s: string | undefined | null): string {
  return (s ?? "")
    .replace(/[​‌‍﻿­]/g, "") // zero-width / soft-hyphen
    .replace(/\*\*(.*?)\*\*/g, "$1")                  // strip ** highlight markers
    .trim();
}

// ── MiniSearch disk cache ─────────────────────────────────────────────────────

const CACHE_DIR = path.join(os.homedir(), ".cache", "docsearch");

function cacheKey(dataUrl: string): string {
  return Buffer.from(dataUrl).toString("base64").replace(/[/+=]/g, "_");
}

async function loadMinisearchWithCache(api: MiniSearch): Promise<ReturnType<typeof loadMinisearchIndex>> {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const cacheFile = path.join(CACHE_DIR, cacheKey(api.dataUrl) + ".json");

  let storedVersion = "";
  let storedIndex = "";
  try {
    const cached = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
    storedVersion = cached.version ?? "";
    storedIndex = cached.searchIndex ?? "";
  } catch {}

  const { isUpToDate, lastVersion } = await checkMinisearchVersion(api.dataUrl, storedVersion);

  let indexData: string;
  if (isUpToDate && storedIndex) {
    indexData = storedIndex;
  } else {
    const res = await fetch(api.dataUrl);
    if (!res.ok) throw new Error(`Failed to fetch index: ${res.statusText}`);
    indexData = await res.text();
    fs.writeFileSync(cacheFile, JSON.stringify({ version: lastVersion, searchIndex: indexData }));
  }

  return loadMinisearchIndex(indexData);
}

// ── search ────────────────────────────────────────────────────────────────────

async function performSearch(query: string, api: API): Promise<FormatResult> {
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
      const client = await loadMinisearchWithCache(api as MiniSearch);
      if (!query.trim()) return [];
      return searchMinisearch(client, query, api as MiniSearch) ?? [];
    }
  }
}

function findApi(docId: string, tag: string): API | undefined {
  const docEntry = Object.keys(data).find(
    (idStr) => DocID[parseInt(idStr) as DocID].toLowerCase() === docId,
  );
  if (!docEntry) return undefined;
  return data[parseInt(docEntry) as DocID][tag as Tags];
}

// ── CLI ───────────────────────────────────────────────────────────────────────

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  // list: output all docs as a single JSON array
  if (command === "list") {
    const docs = Object.keys(data).map((idStr) => {
      const id = parseInt(idStr) as DocID;
      return {
        id: DocID[id].toLowerCase(),
        name: DocID[id].replace(/_/g, " "),
        tags: Object.keys(data[id as DocID]),
      };
    });
    process.stdout.write(JSON.stringify(docs) + "\n");
    return;
  }

  // search <docId> <tag> <query...>  (one-shot, for debugging)
  if (command === "search") {
    const [docId, tag, ...queryParts] = rest;
    const query = queryParts.join(" ").trim();
    if (!query) return;

    const api = findApi(docId, tag);
    if (!api) { process.stderr.write(`unknown doc/tag: ${docId}/${tag}\n`); return; }

    const results = await performSearch(query, api);
    for (const r of results) {
      process.stdout.write(
        JSON.stringify({ title: clean(r.title), url: r.url, subtitle: clean(r.subtitle) }) + "\n",
      );
    }
    return;
  }

  // serve: persistent process, reads requests from stdin
  // protocol — request:  <reqId>\t<docId>\t<tag>\t<query>\n
  //            response: <reqId>\t<json>\n  (one per result)
  //            EOF:      <reqId>\t\n
  if (command === "serve") {
    const { createInterface } = await import("readline");
    const rl = createInterface({ input: process.stdin, terminal: false });

    rl.on("line", async (line) => {
      const tab = line.indexOf("\t");
      if (tab === -1) return;
      const reqId = line.slice(0, tab);
      const rest = line.slice(tab + 1);

      const parts = rest.split("\t");
      const [docId, tag, ...queryParts] = parts;
      const query = queryParts.join(" ").trim();

      const send = (payload: string) => process.stdout.write(reqId + "\t" + payload + "\n");
      const eof  = () => process.stdout.write(reqId + "\t\n");

      if (!query) { eof(); return; }

      const api = findApi(docId, tag);
      if (!api) { eof(); return; }

      try {
        const results = await performSearch(query, api);
        for (const r of results) {
          send(JSON.stringify({ title: clean(r.title), url: r.url, subtitle: clean(r.subtitle) }));
        }
      } catch {
        // swallow errors, just send EOF
      }
      eof();
    });

    // keep alive
    rl.on("close", () => process.exit(0));
    return;
  }
}

main().catch((err) => {
  process.stderr.write((err as Error).message + "\n");
  process.exit(1);
});
