import { data, DocID } from "../../src/data/apis";
import { checkAlgolia } from "./checkAlgolia";
import { checkMeilisearch } from "./checkMeilisearch";

let hasErr = false;
const origError = console.error;
console.error = (...args: unknown[]) => {
  origError(...args);
  hasErr = true;
};

function main() {
  Object.entries(data).forEach(([id, diffLangApi]) => {
    Object.entries(diffLangApi).forEach(async ([lang, api]) => {
      const docsName = DocID[parseInt(id)];
      let res = false;

      if (api.type === "meilisearch") {
        res = await checkMeilisearch(api.apiHost, api.apiKey, api.indexName);
      } else if (api.type === "algolia") {
        res = await checkAlgolia(api.appId, api.apiKey, api.indexName);
      }

      if (res) {
        console.log(`✅ [${docsName}/${lang}] API is available.`);
      } else {
        console.error(`❌ [${docsName}/${lang}] API is NOT available!`);
      }
    });
  });

  if (hasErr) process.exit(1);
}

main();
