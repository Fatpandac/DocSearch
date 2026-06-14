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
-- One Node.js process stays alive for the session.  All search requests are
-- sent to it over stdin; results come back on stdout.
--
-- Wire protocol
--   request:  "<reqId>\t<docId>\t<tag>\t<query>\n"
--   result:   "<reqId>\t<json>\n"   (one line per result)
--   eof:      "<reqId>\t\n"         (empty second field signals end-of-results)

local _srv            = nil   -- plenary Job (or nil)
local _srv_callbacks  = {}    -- [reqId] -> fn(line, is_eof)
local _srv_req_seq    = 0

local function srv_ensure()
  if _srv then return _srv end

  _srv = Job:new({
    command = "node",
    args    = { SCRIPT, "serve" },
    on_stdout = vim.schedule_wrap(function(_, line)
      if not line or line == "" then return end
      local tab = line:find("\t", 1, true)
      if not tab then return end
      local req_id = line:sub(1, tab - 1)
      local payload = line:sub(tab + 1)
      local cb = _srv_callbacks[req_id]
      if not cb then return end
      if payload == "" then
        _srv_callbacks[req_id] = nil
        cb(nil, true)
      else
        cb(payload, false)
      end
    end),
    on_exit = function()
      _srv = nil  -- allow restart on next search
    end,
  })
  _srv:start()
  return _srv
end

local function srv_search(doc_id, tag, query, on_result, on_done)
  _srv_req_seq = _srv_req_seq + 1
  local req_id = tostring(_srv_req_seq)

  _srv_callbacks[req_id] = function(line, is_eof)
    if is_eof then
      on_done()
    else
      on_result(line)
    end
  end

  local server = srv_ensure()
  server:send(req_id .. "\t" .. doc_id .. "\t" .. tag .. "\t" .. query .. "\n")
  return req_id
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

-- ── custom async finder using the persistent server ───────────────────────────

local function new_server_finder(doc_id, tag)
  local current_req = nil

  return setmetatable({
    entry_maker = make_result_entry,
    close = function() end,
  }, {
    __call = function(self, prompt, process_result, process_complete)
      -- Cancel stale request
      if current_req then
        _srv_callbacks[current_req] = nil
        current_req = nil
      end

      if not prompt or #prompt < 1 then
        process_complete()
        return
      end

      local req_id = srv_search(
        doc_id, tag, prompt,
        function(line)
          if current_req ~= req_id then return end
          local entry = self.entry_maker(line)
          if entry then process_result(entry) end
        end,
        function()
          if current_req ~= req_id then return end
          current_req = nil
          process_complete()
        end
      )
      current_req = req_id
    end,
  })
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
    finder  = new_server_finder(doc_id, tag),
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
    -- Start the search server eagerly so it's warm before the first query.
    if check_script() then
      vim.schedule(srv_ensure)
    end
  end,
  exports = {
    docsearch = docsearch,
  },
})
