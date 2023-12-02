import fs from "fs";
import { API, data, DocID } from "../src/data/apis";

function generateFilePath(item: API) {
  return `./src/${(item.name + (item.lang ? '_'+item.lang: '')).toLowerCase()}.tsx`.replace(' ','_')
}

export default function generateEntryFile() {
  const generateContent = (id: DocID) => 
  `import { SearchDocumentation } from "./components";\nimport { DocID } from "./data/apis";\n\nexport default function Command(props: { arguments: { search?: string } }) {\n  return <SearchDocumentation id={DocID.${DocID[id]}} quickSearch={props.arguments?.search} />;\n}`

  data.forEach((item) => {
    fs.writeFileSync(generateFilePath(item), generateContent(item.id))
  })
}

generateEntryFile()
