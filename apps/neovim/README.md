# DocSearch Neovim

Telescope extension for searching the official documentation indexes configured in `@docsearch/core`.

## Requirements

- Neovim
- Node.js 18+
- `nvim-telescope/telescope.nvim`
- `nvim-lua/plenary.nvim`

## Installation

### lazy.nvim

```lua
{
  "Fatpandac/DocSearch",
  dependencies = {
    "nvim-telescope/telescope.nvim",
    "nvim-lua/plenary.nvim",
  },
  config = function(plugin)
    vim.opt.rtp:append(plugin.dir .. "/apps/neovim")
    require("lazy.core.loader").packadd(plugin.dir .. "/apps/neovim")
    require("telescope").setup({
      extensions = {
        docsearch = {
          language = "en-US",
        },
      },
    })
    require("telescope").load_extension("docsearch")
  end,
}
```

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
