import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const target = process.env.TARGET === "firefox" ? "firefox" : "chrome";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), buildManifest()],
  base: "./",
  build: {
    outDir: process.env.TARGET ? `dist-${target}` : "dist",
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
});

function buildManifest(): Plugin {
  return {
    name: "build-manifest",
    apply: "build",
    generateBundle() {
      const read = (file: string) =>
        JSON.parse(
          fs.readFileSync(path.resolve(__dirname, "manifests", file), "utf-8"),
        );

      const manifest = {
        ...read("manifest.base.json"),
        ...read(`manifest.${target}.json`),
      };

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}
