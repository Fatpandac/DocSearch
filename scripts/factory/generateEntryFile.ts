import fs from "fs";
import { data } from "../../src/data/apis";
import { DocID } from "../../src/data/types";

function generateFilePath(id: number) {
  return `./src/${DocID[id].toLowerCase()}.tsx`.replace(" ", "_");
}

export default function generateEntryFile() {
  const generateContent = (id: number) =>
    `import { SearchDocumentation } from "./components";
import { DocID } from "./data/types";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation id={DocID.${DocID[id]}} quickSearch={props.arguments?.search} />;
}`;

  Object.keys(data).forEach((id) => {
    fs.writeFileSync(generateFilePath(parseInt(id)), generateContent(parseInt(id)));
  });
}

generateEntryFile();
