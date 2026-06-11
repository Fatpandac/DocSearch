import assert from "node:assert/strict";

import { DocID, data, getDocApi, getDocTags } from "@docsearch/core";

const tags = getDocTags(DocID.React);

assert.ok(tags.length > 0, "React docs should expose at least one searchable tag");
assert.equal(getDocApi(DocID.React, tags[0]), data[DocID.React][tags[0]]);
