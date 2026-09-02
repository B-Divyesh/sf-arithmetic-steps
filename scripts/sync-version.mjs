import { chmod, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageUrl = new URL("../package.json", import.meta.url);
const manifestUrl = new URL("../dist/manifest.webmanifest", import.meta.url);
const notFoundUrl = new URL("../dist/404.html", import.meta.url);
const packageInfo = JSON.parse(await readFile(packageUrl, "utf8"));
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
const notFound = await readFile(notFoundUrl, "utf8");

manifest.start_url = `/?source=pwa&v=${packageInfo.version}`;
// A read-only source tree can make Vite preserve the template's mode when it
// copies this public file into dist/. The output belongs to this build, so make
// just that emitted manifest writable before adding the release query.
await chmod(manifestUrl, 0o644);
await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`);
await chmod(notFoundUrl, 0o644);
await writeFile(notFoundUrl, notFound.replaceAll("__ARITHMETIC_STEPS_VERSION__", packageInfo.version));
console.log(`Wrote PWA version ${packageInfo.version} into dist/manifest.webmanifest.`);
