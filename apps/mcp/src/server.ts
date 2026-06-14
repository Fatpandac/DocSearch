#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

import { listDocs, resolveDoc, searchDocs } from "./tools";

export const DOCSEARCH_MCP_INSTRUCTIONS =
  "Use this server to search official documentation. First call list_docs only when you do not know the doc id. Use get_doc to inspect tags. Use search_docs with doc, query, optional tag, and optional limit. search_docs returns candidate official documentation URLs plus snippets/metadata, not guaranteed full page content. If you need the full page details, use the host agent's WebFetch, browser, or equivalent web reading tool on the returned URL, then answer from that fetched page. The tool name is search_docs in this MCP server; do not use dotted names.";

function jsonContent(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: "docsearch-mcp",
      version: "0.0.0",
    },
    {
      instructions: DOCSEARCH_MCP_INSTRUCTIONS,
    },
  );

  server.registerTool(
    "list_docs",
    {
      title: "List DocSearch documents",
      description:
        "List all official documentation indexes available through DocSearch. Use this to discover valid doc ids before calling search_docs.",
      inputSchema: {},
    },
    async () => jsonContent(listDocs()),
  );

  server.registerTool(
    "get_doc",
    {
      title: "Get DocSearch document metadata",
      description:
        "Get the display name, homepage, and available language/version tags for one documentation index. Use the returned tag with search_docs when a specific language/version is needed.",
      inputSchema: {
        doc: z.string().describe("Stable document id, for example react, vue, vite, nextjs, tailwindcss."),
      },
    },
    async ({ doc }) => {
      const resolved = resolveDoc(doc);
      if (!resolved) {
        throw new Error(`Unknown doc: ${doc}`);
      }

      const { docId: _docId, ...metadata } = resolved;
      return jsonContent(metadata);
    },
  );

  server.registerTool(
    "search_docs",
    {
      title: "Search official documentation",
      description:
        "Search one official documentation index. For React use doc=react. For Vue use doc=vue. Returns official documentation titles, URLs, snippets, and content.",
      inputSchema: {
        doc: z.string().describe("Stable document id from list_docs, for example react, vue, vite, nextjs."),
        query: z.string().describe("Search query."),
        tag: z.string().optional().describe("Optional language/version tag from list_docs. Defaults to the first tag."),
        limit: z.number().int().min(1).max(20).optional().describe("Maximum results to return. Defaults to 10."),
      },
    },
    async ({ doc, query, tag, limit }) => jsonContent(await searchDocs({ doc, query, tag, limit })),
  );

  return server;
}

async function main() {
  const server = createServer();
  await server.connect(new StdioServerTransport());
}

if (require.main === module) {
  main().catch((error) => {
    console.error("DocSearch MCP server failed:", error);
    process.exit(1);
  });
}
