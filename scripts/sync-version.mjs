import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageUrl = new URL("../package.json", import.meta.url);
const manifestUrl = new URL("../public/manifest.webmanifest", import.meta.url);
const packageInfo = JSON.parse(await readFile(packageUrl, "utf8"));
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

manifest.start_url = `/?source=pwa&v=${packageInfo.version}`;
await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Synced PWA version ${packageInfo.version}.`);
