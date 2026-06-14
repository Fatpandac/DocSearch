# DocSearch

DocSearch is organized as a monorepo.

## Workspaces

- `packages/core`: shared documentation registry, search clients, formatters, and types.
- `apps/raycast`: Raycast extension. The directory keeps the normal Raycast extension shape with `package.json`, `src`, `assets`, and `metadata`.
- `apps/vscode`: VS Code extension for searching docs from the editor. See `apps/vscode/README.md`.
- `apps/neovim`: Telescope extension and bundled search script. See `apps/neovim/README.md`.
- `apps/mcp`: stdio MCP server for agent access to the shared documentation search registry. See `apps/mcp/README.md`.

## Commands

```bash
npm run typecheck
npm run test:core
npm run test:mcp
npm run build
npm run build:mcp
npm run build:vscode
npm run build:neovim
```

## MCP Server

Build the MCP server before configuring an MCP client:

```bash
npm run build:mcp
```

Use this command in an MCP client:

```bash
node /path/to/docsearch/apps/mcp/dist/server.js
```

The server exposes:

- `list_docs`: list available documentation ids, names, tags, and homepages.
- `get_doc`: inspect one documentation index and its tags.
- `search_docs`: search one official documentation index and return matching titles, URLs, and snippets.

`search_docs` returns candidate official documentation pages, not guaranteed full page text. Agents should use their host WebFetch/browser tool on the returned URL when they need the full page content.
