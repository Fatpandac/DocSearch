import { DocItem } from "../types";

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
  },
};

export default ollama;
