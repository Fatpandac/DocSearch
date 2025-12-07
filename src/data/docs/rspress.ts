import type { DocItem, MiniSearchResult } from "../types";

function formatResult(searchResults: Array<MiniSearchResult>, home: string) {
  return searchResults.map((item) => {
    const titles = item.titles.filter(Boolean).map((t) => t.trim().replace(/<SourceCode .*?>/g, ""));
    const title = titles.join(" > ") || item.title;
    const url = `${home}${item.url
      .replace("website/docs/en/", "")
      .replace("website/docs/zh/", "")
      .replace("ui/custom-theme", "guide/advanced/custom-theme")}#${titles[titles.length - 1]
      .replace(/.*{#(.*?)}/g, "$1")
      .trim()
      .replace(/(\d)./g, "$1")
      .replace(/\s+/g, "-")
      .replace("－", "-")
      .replace(/-+/g, "-")
      .toLowerCase()}`;

    return {
      title,
      url,
      content: item.content,
      id: item.id,
    };
  });
}

const rspress: DocItem = {
  "en-US": {
    icon: "../assets/logo/rspress.png",
    type: "minisearch",
    homepage: "https://rspress.rs/",
    dataUrl:
      "https://raw.githubusercontent.com/Fatpandac/SearchSource/refs/heads/main/search-index/Rspress/en-US/search-index.json",
    formatter: (searchResults) => formatResult(searchResults, "https://rspress.rs/"),
  },
  "zh-CN": {
    icon: "../assets/logo/rspress.png",
    type: "minisearch",
    homepage: "https://rspress.rs/zh/",
    dataUrl:
      "https://raw.githubusercontent.com/Fatpandac/SearchSource/refs/heads/main/search-index/Rspress/zh-CN/search-index.json",
    formatter: (searchResults) => formatResult(searchResults, "https://rspress.rs/zh/"),
  },
};

export default rspress;
