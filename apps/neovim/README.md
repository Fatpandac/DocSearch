# DocSearch Neovim

Telescope extension for searching the official documentation indexes configured in `@docsearch/core`.

## Requirements

- Neovim
- Node.js 18+
- `nvim-telescope/telescope.nvim`
- `nvim-lua/plenary.nvim`

## Development

Install dependencies from the repository root:

```sh
npm install
```

Build the bundled search script:

```sh
npm run build:neovim
```

Typecheck:

```sh
npm run typecheck -w apps/neovim
```

Watch during development:

```sh
npm run dev:neovim
```

## Setup

Add this directory as a Neovim plugin, then configure Telescope:

```lua
require("telescope").setup({
  extensions = {
    docsearch = {
      language = "en-US",
    },
  },
})

require("telescope").load_extension("docsearch")
```

The extension expects `apps/neovim/scripts/search.js` to exist. Run `npm run build:neovim` after changing `scripts/search.ts`.

## Usage

Open the document picker:

```vim
:Telescope docsearch
```

Search a specific doc directly from Lua:

```lua
require("telescope").extensions.docsearch.docsearch({ doc = "react" })
```

Specify a tag when needed:

```lua
require("telescope").extensions.docsearch.docsearch({
  doc = "react",
  tag = "en-US",
})
```

Inside a result picker:

- Type to search the selected documentation source.
- Press `<Enter>` to open the selected result in your browser.
- Press `<C-p>` to switch language/version tags when multiple tags are available.

The extension stores the last selected tag per doc in Neovim's data directory and reuses it on later searches.
