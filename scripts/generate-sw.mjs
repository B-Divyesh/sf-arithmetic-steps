import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const root = new URL("../dist/", import.meta.url);

async function filesInside(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory.pathname, entry.name);
    return entry.isDirectory() ? filesInside(new URL(`${entry.name}/`, directory)) : [path];
  }));
  return nested.flat();
}

const paths = (await filesInside(root)).filter((path) => !path.endsWith("sw.js") && !path.endsWith(".map"));
const urls = paths.map((path) => `/${relative(root.pathname, path).split(sep).join("/")}`);
urls.push("/");
const digest = createHash("sha256");
for (const path of paths) digest.update(await readFile(path));
const version = digest.digest("hex").slice(0, 12);

const source = `const CACHE = "arithmetic-steps-${version}";
const PRECACHE = ${JSON.stringify([...new Set(urls)].sort(), null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("arithmetic-steps-") && key !== CACHE).map((key) => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(async () => (await caches.match(event.request, { ignoreVary: true })) || (await caches.match("/index.html", { ignoreVary: true })) || (await caches.match("/offline.html", { ignoreVary: true }))));
    return;
  }
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});
`;

await writeFile(new URL("sw.js", root), source);
console.log(`Generated ${CACHE_LABEL(version)} with ${urls.length} precached URLs.`);

function CACHE_LABEL(value) { return `service worker ${value}`; }
