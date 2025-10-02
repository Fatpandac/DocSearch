import { data } from "../../src/data/apis";
import { DocID } from "../../src/data/types";
import { checkAlgolia } from "./checkAlgolia";
import { checkMeilisearch } from "./checkMeilisearch";
import { checkTrieve } from "./checkTrieve";

let hasErr = false;
const origError = console.error;
console.error = (...args: unknown[]) => {
  origError(...args);
  hasErr = true;
};

function main() {
  Object.entries(data).forEach(([id, diffLangApi]) => {
    Object.entries(diffLangApi).forEach(async ([lang, api]) => {
      if (!api) return;
      const docsName = DocID[parseInt(id)];
      let res = false;


      switch (api.type) {
        case "algolia": {
          res = await checkAlgolia(api);
          break;
        }
        case "meilisearch": {
          res = await checkMeilisearch(api);
          break;
        }
        case "trieve": {
          res = await checkTrieve(api);
          break;
        }
        default: {
          const { type } = api;
          return type satisfies never;
        }
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
