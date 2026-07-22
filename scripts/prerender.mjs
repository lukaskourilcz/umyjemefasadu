import { readFile, writeFile } from "node:fs/promises";
import { render } from "../dist-ssr/entry-server.js";

const htmlPath = new URL("../dist/index.html", import.meta.url);
const contentPath = new URL("../public/content.json", import.meta.url);
const [html, rawContent] = await Promise.all([
  readFile(htmlPath, "utf8"),
  readFile(contentPath, "utf8"),
]);
const markup = render(JSON.parse(rawContent));
const marker = '<div id="root"></div>';

if (!html.includes(marker)) {
  throw new Error("Prerender marker #root was not found in dist/index.html");
}

await writeFile(htmlPath, html.replace(marker, `<div id="root">${markup}</div>`), "utf8");
