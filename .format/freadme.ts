import fs from "fs";
import { data } from "../src/data/apis";

function formatSupportedDocsTable() {
  const columns = 3
  let times = 0;
  let supportedDocsTable = `### Supported Documentations (${data.length})

| Documentations |   |   |
| :------------: |:-:|:-:|
`;

  // Sort data
  const sortedData = data.sort((a, b) => (a.name > b.name ? 1 : -1));

  sortedData.map((item) => {
    supportedDocsTable +=
      "lang" in item && item.lang
        ? `| [${item.name}(${item.lang})](${item.homepage})`
        : `| [${item.name}](${item.homepage})`;
    times++;
    if (times % columns === 0) {
      supportedDocsTable += " |\n";
    }
  });
  if (sortedData.length % columns !== 0) {
    supportedDocsTable += ' |'
  }

  return supportedDocsTable;
}

export default function formatReadme() {
  // read README.md
  var readme = fs.readFileSync("./README.md", "utf8");

  // replace supported docs table
  readme = readme.replace(/### Supported Documentations(.|\s)*?###/, `${formatSupportedDocsTable()}\n\n###`);

  // write README.md
  fs.writeFileSync("./README.md", readme);
}
