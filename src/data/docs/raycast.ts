import { DocItem } from "../types";
import { FormatResultItem } from "../../utils";
import { randomUUID } from "crypto";
import { parseNextFlightText } from "../utils";

const ACTION_ID = "600943e3ab9307ee861b42e0036d6f54427022714e";

const raycast: DocItem = {
  "en-US": {
    icon: "../assets/logo/raycast.png",
    type: "custom",
    homepage: "https://developers.raycast.com/",
    request: async (query: string) => {
      const API_URL = `https://developers.raycast.com/api-reference/user-interface/list?q=${encodeURIComponent(query)}`;
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
        url: `https://developers.raycast.com${item.href}`,
      }));
    },
  },
};

export default raycast;
