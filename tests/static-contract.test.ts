import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

describe("static hosting contract", () => {
  it("ships security, cache, and real-404 settings for Static Web Apps", async () => {
    const config = JSON.parse(await readFile(resolve(root, "public/staticwebapp.config.json"), "utf8")) as {
      globalHeaders: Record<string, string>;
      routes: { route: string; headers?: Record<string, string> }[];
      responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
    };
    expect(config.globalHeaders["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders["X-Frame-Options"]).toBe("DENY");
    expect(config.globalHeaders["Permissions-Policy"]).toContain("camera=()");
    expect(config.routes.find((route) => route.route === "/assets/*")?.headers?.["Cache-Control"]).toContain("immutable");
    expect(config.responseOverrides["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
  });

  it("ships a styled standalone 404 document and CSP-compatible error styling", async () => {
    const [notFound, offline] = await Promise.all([
      readFile(resolve(root, "public/404.html"), "utf8"),
      readFile(resolve(root, "public/offline.html"), "utf8")
    ]);
    expect(notFound).toContain("Page not found — Arithmetic Steps");
    expect(notFound).toContain('href="/"');
    expect(notFound).toContain('href="/error.css"');
    expect(offline).toContain('href="/error.css"');
    expect(offline).not.toContain("<style");
  });
});
