import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist", import.meta.url));
const args = process.argv.slice(2);
const readArgument = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1] ?? fallback;
};
const host = readArgument("--host", "127.0.0.1");
const port = Number(readArgument("--port", "4173"));
const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8"
};

function routeFile(pathname) {
  if (["/", "/demo", "/practice", "/saved-problems"].includes(pathname) || pathname.startsWith("/saved-problems/")) return "index.html";
  if (pathname === "/privacy" || pathname === "/privacy/") return "privacy/index.html";
  if (pathname === "/terms" || pathname === "/terms/") return "terms/index.html";
  const resolved = resolve(root, `.${pathname}`);
  if (!resolved.startsWith(`${root}${sep}`)) return null;
  return resolved.slice(root.length + 1);
}

async function readPublicFile(relativePath) {
  if (!relativePath) return null;
  const absolutePath = resolve(root, relativePath);
  if (!absolutePath.startsWith(`${root}${sep}`)) return null;
  try {
    const file = await stat(absolutePath);
    return file.isFile() ? { body: await readFile(absolutePath), path: absolutePath } : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const method = request.method ?? "GET";
  if (method !== "GET" && method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", `http://${request.headers.host ?? host}`).pathname);
  } catch {
    pathname = "/";
  }
  const matched = await readPublicFile(routeFile(pathname));
  const fallback = matched ?? await readPublicFile("404.html");
  if (!fallback) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" }).end("The local preview is missing its 404 page.");
    return;
  }
  const status = matched ? 200 : 404;
  response.writeHead(status, {
    "Content-Type": contentTypes[extname(fallback.path)] ?? "application/octet-stream",
    "Cache-Control": "no-store"
  });
  response.end(method === "HEAD" ? undefined : fallback.body);
});

server.listen(port, host, () => {
  console.log(`Static preview listening at http://${host}:${port}`);
});
