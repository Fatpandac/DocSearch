import * as vscode from "vscode";
import {
  data,
  DocID,
  Tags,
  searchAlgolia,
  searchMeilisearch,
  searchTrieve,
  searchCustom,
  loadMinisearchIndex,
  searchMinisearch,
  checkMinisearchVersion,
  algoliaDefaultFormatter,
  meilisearchDefaultFormatter,
  trieveDefaultFormatter,
  FormatResult,
} from "@docsearch/core";
import type { Algolia, Meilisearch, Trieve, Custom, MiniSearch, API } from "@docsearch/core";

// ── search logic ─────────────────────────────────────────────────────────────

const minisearchCache = new Map<string, ReturnType<typeof loadMinisearchIndex>>();

async function loadMinisearchClient(api: MiniSearch, context: vscode.ExtensionContext) {
  if (minisearchCache.has(api.dataUrl)) return minisearchCache.get(api.dataUrl)!;
  const cacheKey = `minisearch:${api.dataUrl}`;
  const stored = context.globalState.get<{ version: string; searchIndex: string }>(cacheKey);
  const { isUpToDate, lastVersion } = await checkMinisearchVersion(api.dataUrl, stored?.version ?? "");
  let indexData: string;
  if (isUpToDate && stored?.searchIndex) {
    indexData = stored.searchIndex;
  } else {
    const res = await fetch(api.dataUrl);
    if (!res.ok) throw new Error(`Failed to fetch index: ${res.statusText}`);
    indexData = await res.text();
    await context.globalState.update(cacheKey, { version: lastVersion, searchIndex: indexData });
  }
  const client = loadMinisearchIndex(indexData);
  minisearchCache.set(api.dataUrl, client);
  return client;
}

async function performSearch(
  query: string,
  api: API,
  context: vscode.ExtensionContext,
  signal: AbortSignal,
): Promise<FormatResult> {
  switch (api.type) {
    case "algolia": {
      const hits = await searchAlgolia(query, api as Algolia);
      if (signal.aborted) return [];
      return ((api as Algolia).formatter ?? algoliaDefaultFormatter)(hits);
    }
    case "meilisearch": {
      const hits = await searchMeilisearch(query, api as Meilisearch);
      if (signal.aborted) return [];
      return ((api as Meilisearch).formatter ?? meilisearchDefaultFormatter)(hits);
    }
    case "trieve": {
      if (!query.trim()) return [];
      const hits = await searchTrieve(query, api as Trieve);
      if (signal.aborted) return [];
      return ((api as Trieve).formatter ?? trieveDefaultFormatter)(hits);
    }
    case "custom": {
      const hits = await searchCustom(query, api as Custom);
      if (signal.aborted) return [];
      return hits;
    }
    case "minisearch": {
      const client = await loadMinisearchClient(api as MiniSearch, context);
      if (signal.aborted || !query.trim()) return [];
      return searchMinisearch(client, query, api as MiniSearch) ?? [];
    }
  }
}

// ── panel ─────────────────────────────────────────────────────────────────────

function getNonce() {
  let text = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) text += chars[Math.floor(Math.random() * chars.length)];
  return text;
}

export class SearchPanel {
  private static panels = new Map<DocID, SearchPanel>();

  private readonly panel: vscode.WebviewPanel;
  private currentTag: Tags;
  private controller = new AbortController();
  private debounce: ReturnType<typeof setTimeout> | undefined;

  static show(id: DocID, context: vscode.ExtensionContext) {
    const existing = SearchPanel.panels.get(id);
    if (existing) { existing.panel.reveal(vscode.ViewColumn.Active); return; }
    new SearchPanel(id, context);
  }

  private constructor(
    private readonly id: DocID,
    private readonly context: vscode.ExtensionContext,
  ) {
    const docs = data[id];
    const tags = Object.keys(docs) as Tags[];
    const docName = DocID[id].replace(/_/g, " ");
    const preferred = vscode.workspace.getConfiguration("docsearch").get<string>("language", "en-US");
    this.currentTag = (tags.find((t) => t.includes(preferred)) ?? tags[0]) as Tags;

    this.panel = vscode.window.createWebviewPanel(
      "docsearch",
      `DocSearch: ${docName}`,
      vscode.ViewColumn.Active,
      { enableScripts: true, retainContextWhenHidden: true, enableFindWidget: false },
    );

    const isMac = process.platform === "darwin";
    this.panel.webview.html = getHtml(tags, this.currentTag, docName, isMac);

    this.panel.webview.onDidReceiveMessage((msg) => {
      switch (msg.type) {
        case "search":    this.search(msg.query); break;
        case "switchTag": this.currentTag = msg.tag as Tags; this.search(msg.query); break;
        case "open":      vscode.env.openExternal(vscode.Uri.parse(msg.url)); break;
      }
    });

    SearchPanel.panels.set(id, this);
    this.panel.onDidDispose(() => {
      SearchPanel.panels.delete(id);
      clearTimeout(this.debounce);
      this.controller.abort();
    });

    const api = docs[this.currentTag]!;
    if (api.type === "minisearch") loadMinisearchClient(api as MiniSearch, context).catch(() => {});
  }

  private search(query: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(async () => {
      this.controller.abort();
      this.controller = new AbortController();
      const signal = this.controller.signal;
      this.post({ type: "loading" });
      try {
        const api = data[this.id][this.currentTag]!;
        const results = await performSearch(query, api, this.context, signal);
        if (!signal.aborted) this.post({ type: "results", items: results });
      } catch (err) {
        if (!this.controller.signal.aborted)
          this.post({ type: "error", message: (err as Error).message });
      }
    }, 300);
  }

  private post(msg: object) { this.panel.webview.postMessage(msg); }
}

// ── HTML ──────────────────────────────────────────────────────────────────────

function getHtml(tags: Tags[], activeTag: Tags, docName: string, isMac: boolean): string {
  const nonce = getNonce();
  const multiTag = tags.length > 1;
  const mod = isMac ? "⌘" : "Ctrl";
  const ctrl = isMac ? "⌃" : "Ctrl";

  const hints = [
    multiTag ? `${mod}L  switch tag` : null,
    `${mod}F  focus search`,
    `↑↓ / ${ctrl}JK  navigate`,
    "↵  open",
    "Esc  clear",
  ].filter(Boolean).join("   ·   ");

  const tagButtons = tags
    .map((t) => `<button class="tag${t === activeTag ? " active" : ""}" data-tag="${t}">${t}</button>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
<style nonce="${nonce}">
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--vscode-sideBar-background,var(--vscode-editor-background));color:var(--vscode-editor-foreground);font-family:var(--vscode-font-family);font-size:var(--vscode-font-size,13px);display:flex;flex-direction:column;height:100vh;overflow:hidden}
.header{padding:12px 16px 8px;border-bottom:1px solid var(--vscode-panel-border,rgba(128,128,128,.2))}
.search-wrap{display:flex;align-items:center;gap:8px;background:var(--vscode-input-background);border:1px solid var(--vscode-input-border,transparent);border-radius:4px;padding:0 10px}
.search-wrap:focus-within{border-color:var(--vscode-focusBorder)}
.search-icon{color:var(--vscode-input-placeholderForeground);flex-shrink:0}
input{flex:1;background:transparent;border:none;outline:none;color:var(--vscode-input-foreground);font-family:inherit;font-size:14px;padding:7px 0}
input::placeholder{color:var(--vscode-input-placeholderForeground)}
.tags{display:flex;gap:6px;flex-wrap:wrap;padding:8px 16px;border-bottom:1px solid var(--vscode-panel-border,rgba(128,128,128,.2))}
.tags.tag-mode{background:var(--vscode-list-hoverBackground)}
.tag{background:transparent;color:var(--vscode-descriptionForeground);border:1px solid var(--vscode-panel-border,rgba(128,128,128,.3));border-radius:100px;padding:2px 10px;font-size:11px;font-family:inherit;cursor:pointer}
.tag:hover{border-color:var(--vscode-focusBorder);color:var(--vscode-editor-foreground)}
.tag.active{background:var(--vscode-button-background);color:var(--vscode-button-foreground);border-color:transparent}
.tag.kb-focus{outline:2px solid var(--vscode-focusBorder);outline-offset:1px}
.results{flex:1;overflow-y:auto}
.hint{padding:32px 16px;color:var(--vscode-descriptionForeground);text-align:center;font-size:12px}
.item{padding:8px 16px;cursor:pointer;border-bottom:1px solid var(--vscode-panel-border,rgba(128,128,128,.08))}
.item:hover{background:var(--vscode-list-hoverBackground)}
.item.active{background:var(--vscode-list-activeSelectionBackground);color:var(--vscode-list-activeSelectionForeground)}
.item-title{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.item-url{font-size:11px;color:var(--vscode-descriptionForeground);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.item.active .item-url{color:var(--vscode-list-activeSelectionForeground);opacity:.75}
.kbd-bar{padding:5px 16px;font-size:11px;color:var(--vscode-descriptionForeground);border-top:1px solid var(--vscode-panel-border,rgba(128,128,128,.2));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.7;flex-shrink:0}
</style>
</head>
<body>
<div class="header">
  <div class="search-wrap">
    <span class="search-icon">⌕</span>
    <input id="q" type="text" placeholder="Search ${docName} docs..." autocomplete="off" spellcheck="false">
  </div>
</div>
${multiTag ? `<div class="tags" id="tags">${tagButtons}</div>` : ""}
<div class="results" id="results"><div class="hint">Type to search…</div></div>
<div class="kbd-bar">${hints}</div>

<script nonce="${nonce}">
const vscode = acquireVsCodeApi();
const inputEl  = document.getElementById('q');
const resultsEl = document.getElementById('results');
const tagsEl   = document.getElementById('tags');
const isMac    = ${JSON.stringify(isMac)};

let items = [], activeIdx = -1, currentTag = ${JSON.stringify(activeTag)}, isComposing = false;

// ── tag keyboard mode ────────────────────────────────────────────────────────
let tagMode = false, tagFocusIdx = 0;

function tagBtns() { return tagsEl ? Array.from(tagsEl.querySelectorAll('.tag')) : []; }

function enterTagMode() {
  if (!tagsEl) return;
  tagMode = true;
  tagFocusIdx = tagBtns().findIndex(b => b.dataset.tag === currentTag);
  if (tagFocusIdx < 0) tagFocusIdx = 0;
  tagsEl.classList.add('tag-mode');
  refreshTagFocus();
}

function exitTagMode() {
  tagMode = false;
  if (tagsEl) tagsEl.classList.remove('tag-mode');
  tagBtns().forEach(b => b.classList.remove('kb-focus'));
  inputEl.focus();
}

function refreshTagFocus() {
  tagBtns().forEach((b, i) => b.classList.toggle('kb-focus', i === tagFocusIdx));
  tagBtns()[tagFocusIdx]?.scrollIntoView({ block: 'nearest' });
}

function commitTag() {
  const btn = tagBtns()[tagFocusIdx];
  if (!btn) return;
  currentTag = btn.dataset.tag;
  tagBtns().forEach(b => b.classList.toggle('active', b === btn));
  vscode.postMessage({ type: 'switchTag', tag: currentTag, query: inputEl.value });
  exitTagMode();
}

if (tagsEl) {
  tagsEl.addEventListener('click', e => {
    const btn = e.target.closest('.tag');
    if (!btn) return;
    currentTag = btn.dataset.tag;
    tagBtns().forEach(b => b.classList.toggle('active', b === btn));
    vscode.postMessage({ type: 'switchTag', tag: currentTag, query: inputEl.value });
    if (tagMode) exitTagMode();
  });
}

// ── keyboard ─────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const mod = isMac ? e.metaKey : e.ctrlKey;

  // Cmd/Ctrl+L → tag mode
  if (mod && e.key === 'l') { e.preventDefault(); tagsEl && enterTagMode(); return; }

  // Cmd/Ctrl+F → focus search
  if (mod && e.key === 'f') { e.preventDefault(); exitTagMode(); inputEl.focus(); inputEl.select(); return; }

  if (tagMode) {
    if      (e.key === 'ArrowLeft'  || (e.ctrlKey && e.key === 'k')) { e.preventDefault(); tagFocusIdx = Math.max(0, tagFocusIdx - 1); refreshTagFocus(); }
    else if (e.key === 'ArrowRight' || (e.ctrlKey && e.key === 'j')) { e.preventDefault(); tagFocusIdx = Math.min(tagBtns().length - 1, tagFocusIdx + 1); refreshTagFocus(); }
    else if (e.key === 'Enter')  { e.preventDefault(); commitTag(); }
    else if (e.key === 'Escape') { e.preventDefault(); exitTagMode(); }
    return;
  }

  if      (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'j')) { e.preventDefault(); moveFocus(1); }
  else if (e.key === 'ArrowUp'   || (e.ctrlKey && e.key === 'k')) { e.preventDefault(); moveFocus(-1); }
  else if (e.key === 'Enter')  { if (!isComposing) { e.preventDefault(); openItem(activeIdx); } }
  else if (e.key === 'Escape') { e.preventDefault(); inputEl.value = ''; render([]); setHint('Type to search…'); inputEl.focus(); }
});

// ── search ────────────────────────────────────────────────────────────────────
inputEl.addEventListener('compositionstart', () => { isComposing = true; });
inputEl.addEventListener('compositionend',   () => {
  isComposing = false;
  const q = inputEl.value;
  if (q.trim()) vscode.postMessage({ type: 'search', query: q });
});
inputEl.addEventListener('input', () => {
  if (isComposing) return;
  const q = inputEl.value;
  if (!q.trim()) { render([]); setHint('Type to search…'); return; }
  vscode.postMessage({ type: 'search', query: q });
});

// ── results ───────────────────────────────────────────────────────────────────
function moveFocus(dir) {
  if (!items.length) return;
  activeIdx = Math.max(0, Math.min(items.length - 1, activeIdx + dir));
  updateActive();
}

function updateActive() {
  const els = resultsEl.querySelectorAll('.item');
  els.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
  els[activeIdx]?.scrollIntoView({ block: 'nearest' });
}

function openItem(idx) {
  if (items[idx]) vscode.postMessage({ type: 'open', url: items[idx].url });
}

function setHint(msg) { resultsEl.innerHTML = '<div class="hint">' + esc(msg) + '</div>'; }

function render(newItems) {
  items = newItems;
  activeIdx = items.length ? 0 : -1;
  resultsEl.scrollTop = 0;
  if (!items.length) { setHint('No results'); return; }
  resultsEl.innerHTML = items.map((item, i) =>
    '<div class="item' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
      '<div class="item-title">' + esc(item.title) + '</div>' +
      '<div class="item-url">'   + esc(item.url)   + '</div>' +
    '</div>'
  ).join('');
  resultsEl.querySelectorAll('.item').forEach(el => {
    el.addEventListener('click',      () => openItem(+el.dataset.i));
    el.addEventListener('mouseenter', () => { activeIdx = +el.dataset.i; updateActive(); });
  });
}

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

window.addEventListener('message', ({ data: msg }) => {
  switch (msg.type) {
    case 'loading': setHint('Searching…'); break;
    case 'results': render(msg.items); break;
    case 'error':   setHint('Error: ' + esc(msg.message)); break;
  }
});

inputEl.focus();
</script>
</body>
</html>`;
}
