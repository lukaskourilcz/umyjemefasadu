// Generates raster brand assets from the real Umyjeme Fasádu logo:
//   public/og-image.png        1200x630  social / link preview
//   public/apple-touch-icon.png 180x180  iOS home screen
//   public/favicon-32.png        32x32    PNG favicon fallback
//
// The logo artwork is read from public/logo.svg (the optimized real mark) and
// embedded as a nested <svg>, so these assets always track the live logo.
//
// Run with: npm run gen:assets
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = (name) => join(__dirname, "..", "public", name);

const INK = "#101820";
const CYAN = "#1ba5e0";
const CREAM = "#fbfdfe";

// --- Pull the real logo artwork + its viewBox from public/logo.svg ----------
const logoRaw = readFileSync(out("logo.svg"), "utf8");
const LOGO_VIEWBOX = (logoRaw.match(/viewBox="([^"]*)"/) || [])[1] || "0 0 100 100";
const LOGO_INNER = logoRaw
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");

// Embed the logo as a nested <svg> positioned in the given box.
const logoMark = (x, y, w, h) => `
  <svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${LOGO_VIEWBOX}"
       preserveAspectRatio="xMidYMid meet">${LOGO_INNER}</svg>`;

// --- App icon (rounded cream square holding the real mark) ------------------
const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${CREAM}"/>
  ${logoMark(2, 2, 28, 28)}
</svg>`;

// --- Social / OG image (1200x630) -------------------------------------------
const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="haze" cx="86%" cy="14%" r="60%">
      <stop offset="0%" stop-color="${CYAN}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${CREAM}"/>
  <rect width="1200" height="630" fill="url(#haze)"/>

  <!-- real logo mark, centered above the copy -->
  ${logoMark(417, 48, 366, 310)}

  <!-- tagline -->
  <text x="600" y="438" text-anchor="middle" font-family="'Inter','DejaVu Sans',sans-serif"
    font-weight="400" font-size="38" letter-spacing="-1" fill="${INK}">Profesionální mytí fasád, střech a dlažby</text>

  <!-- divider -->
  <rect x="540" y="478" width="120" height="4" rx="2" fill="${CYAN}"/>

  <!-- contact -->
  <text x="600" y="548" text-anchor="middle" font-family="'Inter','DejaVu Sans',sans-serif"
    font-weight="700" font-size="30" letter-spacing="0.5" fill="${INK}">umyjemefasadu.cz · +420 775 222 760</text>
</svg>`;

async function run() {
  await sharp(Buffer.from(ogSvg)).png().toFile(out("og-image.png"));
  await sharp(Buffer.from(iconSvg(180))).png().toFile(out("apple-touch-icon.png"));
  await sharp(Buffer.from(iconSvg(32))).png().toFile(out("favicon-32.png"));
  console.log("Generated og-image.png, apple-touch-icon.png, favicon-32.png");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
