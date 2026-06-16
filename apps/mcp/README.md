# DocSearch MCP

Stdio MCP server for searching the official documentation indexes configured in DocSearch.

This server reuses `@docsearch/core`, so it supports the same Algolia, Meilisearch, Trieve, Custom, and MiniSearch-backed docs as the Raycast, VS Code, and Neovim integrations.

## Installation

Before configuring an MCP client, ensure the server is built:

```sh
npm run build:mcp
```

## Configuration

Configure your MCP client to run:

```sh
node <repo>/apps/mcp/dist/server.js
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "docsearch": {
      "command": "node",
      "args": ["<repo>/apps/mcp/dist/server.js"]
    }
  }
}
```

## Tools

- `list_docs`: returns all available document ids, names, homepages, and tags.
- `get_doc`: returns metadata for one `doc` id.
- `search_docs`: searches one `doc` id with `query`, optional `tag`, and optional `limit` from 1 to 20.

`search_docs` returns candidate official documentation URLs plus snippets/metadata. It does not guarantee full page content. If an agent needs the full page details, it should use the host's WebFetch, browser, or equivalent web-reading tool on the returned URL, then answer from that fetched page.

Example search arguments:

```json
{
  "doc": "react",
  "query": "useState",
  "tag": "en-US",
  "limit": 3
}
```

## Claude Code

Add the server globally:

```sh
claude mcp add docsearch --scope user --transport stdio -- node /path/to/docsearch/apps/mcp/dist/server.js
```

Verify:

```sh
claude mcp list
claude mcp get docsearch
```

## Codex

Add the server:

```sh
codex mcp add docsearch -- node /path/to/docsearch/apps/mcp/dist/server.js
```

In the Codex TUI, use `/mcp` to verify that `docsearch` exposes `list_docs`, `get_doc`, and `search_docs`.
