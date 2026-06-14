# DocSearch MCP

Stdio MCP server for searching the official documentation indexes configured in DocSearch.

## Usage

Build the server:

```sh
npm run build -w apps/mcp
```

Configure an MCP client to run:

```sh
node <repo>/apps/mcp/dist/server.js
```

Example MCP client config:

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
