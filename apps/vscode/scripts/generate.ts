import { data, DocID } from "@docsearch/core";
import packageData from "../package.json";
import fs from "fs";
import path from "path";

function generateCommands() {
  return Object.keys(data).map((idStr) => {
    const id = parseInt(idStr) as DocID;
    const name = DocID[id].toLowerCase();
    const title = DocID[id].replace(/_/g, " ");
    return {
      command: `docsearch.${name}`,
      title,
      category: "DocSearch",
    };
  });
}

packageData.contributes.commands = generateCommands();

fs.writeFileSync(
  path.join(__dirname, "../package.json"),
  JSON.stringify(packageData, null, 2) + "\n",
);

console.log(`Generated ${packageData.contributes.commands.length} commands.`);
