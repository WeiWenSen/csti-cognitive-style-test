import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "dist");
const files = [
  "index.html",
  "styles.css",
  "data.js",
  "app.js",
  "README.md"
];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const file of files) {
  copyFileSync(join(root, file), join(output, file));
}

console.log(`CSTI static site built to ${output}`);
