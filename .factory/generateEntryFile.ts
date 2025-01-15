import fs from "fs";
import { data, DocID } from "../src/data/apis";

function generateFilePath(id: number) {
  return `./src/${DocID[id].toLowerCase()}.tsx`.replace(' ', '_')
}

export default function generateEntryFile() {
  const generateContent = (id: number) =>
    `import { SearchDocumentation } from "./components";
import { DocID } from "./data/apis";

export default function Command(props: { arguments: { search?: string } }) {
  return <SearchDocumentation id={DocID.${DocID[id]}} quickSearch={props.arguments?.search} />;
}`

  Object.keys(data).forEach((id) => {
    fs.writeFileSync(generateFilePath(parseInt(id)), generateContent(parseInt(id)))
  })
}

generateEntryFile()
