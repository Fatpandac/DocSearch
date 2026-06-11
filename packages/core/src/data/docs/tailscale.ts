import { DocItem } from "../types";
import { FormatResultItem } from "../../utils";
import { randomUUID } from "crypto";

type TailscaleResponseItem = {
  description: string;
  permalink: string;
  title: string;
};

type TailscaleResponse = {
  data: Array<TailscaleResponseItem>;
  status: string;
};

const tailscale: DocItem = {
  "en-US": {
    type: "custom",
    icon: "../assets/logo/tailscale.png",
    homepage: "https://tailscale.com/",
    request: async (query: string) => {
      const API_URL = `https://tailscale.com/api/search?q=${encodeURIComponent(query)}`;
      const res = (await fetch(API_URL).then((response) => response.json())) as TailscaleResponse;
      const formattedResults = res.data.map<FormatResultItem>((item) => ({
        id: randomUUID(),
        title: item.title,
        content: item.description.replace(/<mark>/g, "**").replace(/<\/mark>/g, "**"),
        url: item.permalink,
      }));

      return formattedResults;
    },
  },
};

export default tailscale;
