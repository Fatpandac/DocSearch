local has_telescope, telescope = pcall(require, "telescope")
if not has_telescope then
  error("docsearch: telescope.nvim is required")
end

local pickers       = require("telescope.pickers")
local finders       = require("telescope.finders")
local conf          = require("telescope.config").values
local actions       = require("telescope.actions")
local action_state  = require("telescope.actions.state")
local entry_display = require("telescope.pickers.entry_display")
local Job           = require("plenary.job")

-- ── paths ─────────────────────────────────────────────────────────────────────

-- This file lives at: <plugin_root>/lua/telescope/_extensions/docsearch.lua
-- The bundled script is at: <plugin_root>/scripts/search.js
local plugin_root = vim.fn.fnamemodify(
  debug.getinfo(1, "S").source:sub(2), ":p:h:h:h:h"
)
local SCRIPT = plugin_root .. "/scripts/search.js"

-- ── helpers ───────────────────────────────────────────────────────────────────

local function open_url(url)
  local cmd
  if vim.fn.has("mac") == 1 then
    cmd = "open"
  elseif vim.fn.has("win32") == 1 then
    cmd = "cmd"
  else
    cmd = "xdg-open"
  end
  local args = vim.fn.has("win32") == 1 and { cmd, "/c", "start", url } or { cmd, url }
  vim.fn.jobstart(args, { detach = true })
end

local function check_script()
  if vim.fn.filereadable(SCRIPT) == 0 then
    vim.notify(
      "DocSearch: search.js not found at " .. SCRIPT
        .. "\nRun: npm run build -w apps/neovim",
      vim.log.levels.ERROR
    )
    return false
  end
  return true
end

-- ── entry makers ─────────────────────────────────────────────────────────────

local result_displayer = entry_display.create({
  separator = " ",
  items = {
    { remaining = true },
    { width = 55 },
  },
})

local function make_result_entry(line)
  if not line or line == "" then return nil end
  local ok, item = pcall(vim.json.decode, line)
  if not ok or not item or not item.title then return nil end
  return {
    value   = item,
    ordinal = item.title,
    display = function()
      return result_displayer({
        item.title,
        { item.url, "TelescopeResultsComment" },
      })
    end,
  }
end

local doc_displayer = entry_display.create({
  separator = " ",
  items = {
    { width = 20 },
    { remaining = true },
  },
})

local function make_doc_entry(doc)
  return {
    value   = doc,
    ordinal = doc.name,
    display = function()
      return doc_displayer({
        doc.name,
        { table.concat(doc.tags, "  "), "TelescopeResultsComment" },
      })
    end,
  }
end

-- ── pickers ───────────────────────────────────────────────────────────────────

local function search_picker(doc_id, tag, opts)
  opts = opts or {}
  local title = "DocSearch: " .. doc_id
  if tag and tag ~= "" then title = title .. "  [" .. tag .. "]" end

  pickers.new(opts, {
    prompt_title = title,
    finder = finders.new_job(
      function(prompt)
        if not prompt or #prompt < 1 then return nil end
        return { "node", SCRIPT, "search", doc_id, tag or "", prompt }
      end,
      make_result_entry,
      50
    ),
    sorter = conf.generic_sorter(opts),
    attach_mappings = function(prompt_bufnr)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)
        local sel = action_state.get_selected_entry()
        if sel then open_url(sel.value.url) end
      end)
      return true
    end,
  }):find()
end

local function tag_picker(doc_id, tags, opts)
  if #tags == 1 then
    search_picker(doc_id, tags[1], opts)
    return
  end

  pickers.new(opts or {}, {
    prompt_title = "DocSearch: " .. doc_id .. "  — select version / language",
    finder = finders.new_table({ results = tags }),
    sorter = conf.generic_sorter(opts or {}),
    attach_mappings = function(prompt_bufnr)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)
        local sel = action_state.get_selected_entry()
        if sel then
          vim.schedule(function()
            search_picker(doc_id, sel[1], opts)
          end)
        end
      end)
      return true
    end,
  }):find()
end

-- ── main entry ────────────────────────────────────────────────────────────────

-- opts.doc  (string) – jump straight to a doc, e.g. "react"
-- opts.tag  (string) – also skip tag picker, e.g. "en-US"
--
-- Usage from Lua:
--   require("telescope").extensions.docsearch.docsearch()
--   require("telescope").extensions.docsearch.docsearch({ doc = "react" })
--   require("telescope").extensions.docsearch.docsearch({ doc = "react", tag = "zh-CN" })

local function docsearch(opts)
  opts = opts or {}
  if not check_script() then return end

  -- Fetch doc list, then open the appropriate picker
  local output_lines = {}
  Job:new({
    command = "node",
    args    = { SCRIPT, "list" },
    on_stdout = function(_, line)
      if line and line ~= "" then
        table.insert(output_lines, line)
      end
    end,
    on_exit = function()
      vim.schedule(function()
        local raw = table.concat(output_lines, "")
        local ok, docs = pcall(vim.json.decode, raw)
        if not ok or not docs then
          vim.notify("DocSearch: failed to load doc list", vim.log.levels.ERROR)
          return
        end

        -- Direct doc specified
        if opts.doc and opts.doc ~= "" then
          for _, doc in ipairs(docs) do
            if doc.id == opts.doc then
              if opts.tag and opts.tag ~= "" then
                search_picker(doc.id, opts.tag, opts)
              else
                tag_picker(doc.id, doc.tags, opts)
              end
              return
            end
          end
          vim.notify('DocSearch: unknown doc "' .. opts.doc .. '"', vim.log.levels.ERROR)
          return
        end

        -- Show all-docs picker
        pickers.new(opts, {
          prompt_title = "DocSearch",
          finder = finders.new_table({
            results      = docs,
            entry_maker  = make_doc_entry,
          }),
          sorter = conf.generic_sorter(opts),
          attach_mappings = function(prompt_bufnr)
            actions.select_default:replace(function()
              actions.close(prompt_bufnr)
              local sel = action_state.get_selected_entry()
              if sel then
                vim.schedule(function()
                  tag_picker(sel.value.id, sel.value.tags, opts)
                end)
              end
            end)
            return true
          end,
        }):find()
      end)
    end,
  }):start()
end

-- ── register ──────────────────────────────────────────────────────────────────

return telescope.register_extension({
  exports = {
    docsearch = docsearch,
  },
})
