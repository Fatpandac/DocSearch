# DocSearch VS Code

VS Code extension for searching the official documentation indexes configured in `@docsearch/core`.

## Features

- Adds one `DocSearch` command per supported documentation source.
- Opens an in-editor search panel with live results.
- Supports language/version tag switching for docs that expose multiple tags.
- Stores the last selected tag per doc.
- Uses the `docsearch.language` setting as the preferred fallback language.

## Development

Install dependencies from the repository root:

```sh
npm install
```

Build the extension:

```sh
npm run build:vscode
```

Typecheck:

```sh
npm run typecheck -w apps/vscode
```

Watch during development:

```sh
npm run dev:vscode
```

## Usage

Run a command from the VS Code Command Palette, for example:

```text
DocSearch: React
DocSearch: Vue
DocSearch: Vite
```

The search panel lets you type a query, switch the language/version tag when available, open a result in the browser, and copy result URLs.

## Settings

```json
{
  "docsearch.language": "en-US"
}
```

Supported language preferences are `en-US`, `zh-CN`, `fr-FR`, `ko-KR`, and `it-IT`. If a documentation source does not support the configured language, the extension falls back to the first available tag.
