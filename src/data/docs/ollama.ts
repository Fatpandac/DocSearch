import { DocItem } from "../types";

type OllamaMetadata = {
  title: string;
};

const ollama: DocItem = {
  "en-US": {
    icon: "../assets/logo/ollama.png",
    apiKey: "tr-T6JLeTkFXeNbNPyhijtI9XhIncydQQ3O",
    datasetId: "61d88682-c9e5-4b83-8a6e-0b01280b26de",
    type: "trieve",
    homepage: "https://docs.ollama.com/",
    baseUrl: "https://api.mintlifytrieve.com",
    searchType: "fulltext",
    searchParameters: {
      highlight_options: {
        highlight_delimiters: ["?", ",", ".", "!", "↵"],
        highlight_strategy: "exactmatch",
      },
      filters: {
        must_not: [
          {
            field: "tag_set",
            match_all: ["code"],
          },
        ],
      },
      extend_results: true,
      page_size: 10,
    },
    formatter: (searchResults) => {
      return searchResults.map((item, index) => {
        return {
          title: (item.chunk.metadata as OllamaMetadata).title,
          url: item.chunk.url,
          id: `${index}`,
          content: item.chunk.chunk_html,
          objectID: item.chunk.id,
        };
      });
    },
  },
};

export default ollama;
