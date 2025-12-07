import type { DocItem, MiniSearchResult } from "../types";

function formatResult(searchResults: Array<MiniSearchResult>, home: string) {
  return searchResults.map((item) => {
    const title =
      item.titles
        .map((t) =>
          t
            .replace(/<Site.*\/>/, "")
            .replace(/{(.*?)}/g, "")
            .trim(),
        )
        .join(" > ") || item.title;
    const url = `${home}${item.url.replace("src/", "").replace("zh/", "")}#${item.titles[item.titles.length - 1]
      .replace(/.*{#(.*?)}/g, "$1")
      .replace(/<Site.*\/>/, "")
      .trim()
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

const rsshub: DocItem = {
  "en-US": {
    icon: "../assets/logo/rsshub.png",
    type: "minisearch",
    homepage: "https://docs.rsshub.app/en/",
    dataUrl:
      "https://raw.githubusercontent.com/Fatpandac/SearchSource/refs/heads/main/search-index/RSSHub/en-US/search-index.json",
    formatter: (searchResults) => formatResult(searchResults, "https://docs.rsshub.app/"),
  },
  "zh-CN": {
    icon: "../assets/logo/rsshub.png",
    type: "minisearch",
    homepage: "https://docs.rsshub.app/",
    dataUrl:
      "https://raw.githubusercontent.com/Fatpandac/SearchSource/refs/heads/main/search-index/RSSHub/zh-CN/search-index.json",
    formatter: (searchResults) => formatResult(searchResults, "https://docs.rsshub.app/zh/"),
  },
};

export default rsshub;
