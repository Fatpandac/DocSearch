import { randomUUID } from "crypto";
import { FormatResultItem } from "../../utils";
import { DocItem } from "../types";
import { parseNextFlightText } from "../utils";

const ACTION_ID = "600943e3ab9307ee861b42e0036d6f54427022714e";

const gitbook: DocItem = {
  "en-US": {
    icon: "../assets/logo/gitbook.png",
    type: "custom",
    homepage: "https://gitbook.com/docs/",
    request: async (query: string) => {
      const API_URL = `https://gitbook.com/docs/${encodeURIComponent(query)}`;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "next-action": ACTION_ID,
        },
        body: JSON.stringify([query, "sitesp_VTXrD"]),
      })
        .then((response) => response.text())
        .then((text) => parseNextFlightText(text));

      return res.map<FormatResultItem>((item) => ({
        id: randomUUID(),
        title: item.title || item.body?.slice(0, 50) || "Untitled",
        content: item.body,
        url: `https://gitbook.com${item.href}`,
      }));
    },
  },

};

export default gitbook;
