import assert from "node:assert/strict";

import { DocID, Tags, type API, type FormatResult } from "@docsearch/core";

import { DOCSEARCH_MCP_INSTRUCTIONS } from "../src/server";
import { listDocs, resolveDoc, searchDocs, type SearchAdapter } from "../src/tools";

async function main() {
  const docs = listDocs();
  const react = resolveDoc("react");

  assert.ok(docs.length > 0, "docs should include searchable entries");
  assert.ok(
    docs.some((doc) => doc.id === "react" && doc.name === "React" && doc.tags.length > 0),
    "React should be exposed with a stable string id, display name, and tags",
  );
  assert.equal(resolveDoc("REACT")?.docId, DocID.React, "doc ids should be case-insensitive");
  assert.equal(resolveDoc("missing-doc"), undefined, "unknown docs should not resolve");
  assert.match(
    DOCSEARCH_MCP_INSTRUCTIONS,
    /WebFetch|browser/i,
    "server instructions should tell agents how to fetch full page content",
  );

  assert.ok(react, "React should resolve");

  const firstTag = react.tags[0] as Tags;
  const calls: Array<{ query: string; api: API }> = [];
  const adapter: SearchAdapter = async (query, api): Promise<FormatResult> => {
    calls.push({ query, api });
    return [
      {
        id: "0",
        title: " **useState** ",
        url: "https://react.dev/reference/react/useState",
        subtitle: " Hook ",
        content: "Returns state",
      },
      {
        id: "1",
        title: "useEffect",
        url: "https://react.dev/reference/react/useEffect",
      },
    ];
  };

  const results = await searchDocs({ doc: "react", tag: firstTag, query: " state ", limit: 1 }, adapter);

  assert.equal(calls.length, 1, "search should call the provided adapter once");
  assert.equal(calls[0].query, "state");
  assert.deepEqual(results, [
    {
      id: "0",
      title: "useState",
      url: "https://react.dev/reference/react/useState",
      subtitle: "Hook",
      content: "Returns state",
    },
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
