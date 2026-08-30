import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const packageInfo = JSON.parse(readFileSync(resolve(projectRoot, "package.json"), "utf8")) as { version: string };

export default defineConfig({
  define: {
    __ARITHMETIC_STEPS_VERSION__: JSON.stringify(packageInfo.version)
  },
  build: {
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "index.html"),
        privacy: resolve(projectRoot, "privacy/index.html"),
        terms: resolve(projectRoot, "terms/index.html")
      }
    }
  }
});
