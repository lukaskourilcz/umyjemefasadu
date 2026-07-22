import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";

function inlinePublishedContent() {
  return {
    name: "inline-published-content",
    transformIndexHtml() {
      const content = readFileSync(
        new URL("./public/content.json", import.meta.url),
        "utf8",
      )
        .replace(/</g, "\\u003c")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
      return [
        {
          tag: "script",
          attrs: { id: "initial-content", type: "application/json" },
          children: content,
          injectTo: "head" as const,
        },
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [inlinePublishedContent(), react(), tailwindcss()],
});
