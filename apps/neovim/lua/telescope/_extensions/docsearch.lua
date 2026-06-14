local has_telescope, telescope = pcall(require, "telescope")
if not has_telescope then
  error("docsearch: telescope.nvim is required")
end

local config = { language = "en-US" }

local pickers       = require("telescope.pickers")
local finders       = require("telescope.finders")
local conf          = require("telescope.config").values
local actions       = require("telescope.actions")
local action_state  = require("telescope.actions.state")
local entry_display = require("telescope.pickers.entry_display")
local Job           = require("plenary.job")

-- ── paths ─────────────────────────────────────────────────────────────────────

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

-- ── persistent search server ──────────────────────────────────────────────────
-- One Node.js process (node search.js serve) stays alive for the session.
-- Protocol:
--   request:  "<reqId>\t<docId>\t<tag>\t<query>\n"
--   result:   "<reqId>\t<json>\n"
--   eof:      "<reqId>\t\n"   (empty payload = end of results)

local _srv_chan       = nil   -- vim.fn.jobstart channel ID
local _srv_callbacks  = {}   -- [reqId] -> fn(payload_or_nil, is_eof)
local _srv_req_seq    = 0

local function srv_ensure()
  if _srv_chan and _srv_chan > 0 then return _srv_chan end

  _srv_chan = vim.fn.jobstart({ "node", SCRIPT, "serve" }, {
    stdout_buffered = false,
    on_stdout = function(_, lines)
      for _, line in ipairs(lines) do
        if line == "" then goto continue end
        local tab = line:find("\t", 1, true)
        if not tab then goto continue end
        local req_id  = line:sub(1, tab - 1)
        local payload = line:sub(tab + 1)
        local cb = _srv_callbacks[req_id]
        if cb then
          if payload == "" then
            _srv_callbacks[req_id] = nil
            cb(nil, true)
          else
            cb(payload, false)
          end
        end
        ::continue::
      end
    end,
    on_exit = function()
      _srv_chan = nil
    end,
  })

  return _srv_chan
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

-- ── server-backed async finder ────────────────────────────────────────────────
-- Mirrors Telescope's _callable_obj pattern: __call -> _find().

local ServerFinder = {}
ServerFinder.__index = ServerFinder
ServerFinder.__call  = function(t, ...) return t:_find(...) end
ServerFinder.close   = function() end

function ServerFinder:new(doc_id, tag)
  return setmetatable({ _doc_id = doc_id, _tag = tag, _req = nil }, self)
end

function ServerFinder:_find(prompt, process_result, process_complete)
  -- Cancel previous in-flight request.
  if self._req then
    _srv_callbacks[self._req] = nil
    self._req = nil
  end

  if not prompt or #prompt < 1 then
    process_complete()
    return
  end

  _srv_req_seq = _srv_req_seq + 1
  local req_id = tostring(_srv_req_seq)
  self._req = req_id

  _srv_callbacks[req_id] = function(payload, is_eof)
    if self._req ~= req_id then return end   -- stale
    if is_eof then
      self._req = nil
      process_complete()
    else
      local entry = make_result_entry(payload)
      if entry then process_result(entry) end
    end
  end

  local chan = srv_ensure()
  vim.fn.chansend(chan,
    req_id .. "\t" .. self._doc_id .. "\t" .. self._tag .. "\t" .. prompt .. "\n")
end

-- ── pickers ───────────────────────────────────────────────────────────────────

local function search_picker(doc_id, tag, all_tags, opts)
  opts = opts or {}
  local multi = #all_tags > 1
  local hint  = multi and "  ^P switch" or ""
  local title = "DocSearch: " .. doc_id .. "  [" .. tag .. "]" .. hint

  pickers.new(opts, {
    prompt_title = title,
    default_text = opts.default_text,
    finder  = ServerFinder:new(doc_id, tag),
    sorter  = conf.generic_sorter(opts),
    attach_mappings = function(prompt_bufnr, map)
      actions.select_default:replace(function()
        actions.close(prompt_bufnr)
        local sel = action_state.get_selected_entry()
        if sel then open_url(sel.value.url) end
      end)

      if multi then
        map("i", "<C-p>", function()
          local query = action_state.get_current_picker(prompt_bufnr):_get_prompt()
          actions.close(prompt_bufnr)
          vim.ui.select(all_tags, { prompt = "DocSearch: " .. doc_id .. " — switch version" },
            function(choice)
              if not choice then return end
              vim.schedule(function()
                search_picker(doc_id, choice, all_tags,
                  vim.tbl_extend("force", opts, { default_text = query }))
              end)
            end)
        end)
      end

      return true
    end,
  }):find()
end

local function resolve_tag(tags)
  local lang = config.language
  local matches = vim.tbl_filter(function(t)
    return t:find(lang, 1, true) ~= nil
  end, tags)
  local candidates = #matches > 0 and matches or tags
  return candidates[1]
end

-- ── main entry ────────────────────────────────────────────────────────────────

local function docsearch(opts)
  opts = opts or {}
  if not check_script() then return end

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

        if opts.doc and opts.doc ~= "" then
          for _, doc in ipairs(docs) do
            if doc.id == opts.doc then
              local tag = (opts.tag and opts.tag ~= "") and opts.tag or resolve_tag(doc.tags)
              search_picker(doc.id, tag, doc.tags, opts)
              return
            end
          end
          vim.notify('DocSearch: unknown doc "' .. opts.doc .. '"', vim.log.levels.ERROR)
          return
        end

        pickers.new(opts, {
          prompt_title = "DocSearch",
          finder = finders.new_table({
            results     = docs,
            entry_maker = make_doc_entry,
          }),
          sorter = conf.generic_sorter(opts),
          attach_mappings = function(prompt_bufnr)
            actions.select_default:replace(function()
              actions.close(prompt_bufnr)
              local sel = action_state.get_selected_entry()
              if sel then
                vim.schedule(function()
                  local tag = resolve_tag(sel.value.tags)
                  search_picker(sel.value.id, tag, sel.value.tags, opts)
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
  setup = function(ext_config)
    config.language = ext_config.language or "en-US"
    -- Warm up the server process so the first search has no startup overhead.
    if check_script() then
      vim.schedule(srv_ensure)
    end
  end,
  exports = {
    docsearch = docsearch,
  },
})
