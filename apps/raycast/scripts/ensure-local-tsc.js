const fs = require("node:fs");
const path = require("node:path");

const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "../..");
const binName = process.platform === "win32" ? "tsc.cmd" : "tsc";
const appBinDir = path.join(appRoot, "node_modules", ".bin");
const appTsc = path.join(appBinDir, binName);
const workspaceTsc = path.join(repoRoot, "node_modules", ".bin", binName);

if (!fs.existsSync(workspaceTsc)) {
  throw new Error("TypeScript compiler is not installed in the workspace. Run npm install from the repository root.");
}

fs.mkdirSync(appBinDir, { recursive: true });

try {
  fs.rmSync(appTsc, { force: true });
  fs.symlinkSync(workspaceTsc, appTsc);
} catch {
  fs.copyFileSync(workspaceTsc, appTsc);
  fs.chmodSync(appTsc, 0o755);
}
