// Generates raster brand assets from inline SVG:
//   public/og-image.png        1200x630  social / link preview
//   public/apple-touch-icon.png 180x180  iOS home screen
//   public/favicon-32.png        32x32    PNG favicon fallback
//
// Run with: npm run gen:assets
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = (name) => join(__dirname, "..", "public", name);

const INK = "#101820";
const MAGENTA = "#e6007e";
const CYAN = "#1ba5e0";
const CYAN_LIGHT = "#5ec7ef";
const CREAM = "#fbfdfe";

// --- App icon (rounded square, roof + water drop) -------------------------
const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${CREAM}"/>
  <path d="M16 5 C 11 13, 9 17, 9 20 a7 7 0 0 0 14 0 c0-3-2-7-7-15 Z" fill="${CYAN}"/>
  <path d="M12 19 a4 4 0 0 0 4 4" fill="none" stroke="${CREAM}" stroke-width="2" stroke-linecap="round"/>
  <path d="M5 8 L13 2 L13 6 L19 6 L19 3 L24 8" fill="none" stroke="${MAGENTA}" stroke-width="2.4" stroke-linejoin="round"/>
</svg>`;

// --- Social / OG image (1200x630) -----------------------------------------
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

  <!-- water swooshes -->
  <g fill="${CYAN}" opacity="0.9">
    <path d="M70 470 C 30 410, 70 350, 140 360 C 100 388, 100 440, 158 458 C 120 494, 88 492, 70 470 Z"/>
    <path d="M1130 470 C 1170 410, 1130 350, 1060 360 C 1100 388, 1100 440, 1042 458 C 1080 494, 1112 492, 1130 470 Z"/>
  </g>
  <g fill="${CYAN_LIGHT}">
    <circle cx="120" cy="330" r="9"/>
    <circle cx="1080" cy="330" r="9"/>
  </g>

  <!-- roofline -->
  <polyline points="500,150 588,110 612,110 612,96 640,96 640,124 700,150"
    fill="none" stroke="${INK}" stroke-width="16" stroke-linejoin="round" stroke-linecap="square"/>

  <!-- wordmark -->
  <text x="600" y="318" text-anchor="middle" font-family="'Inter','DejaVu Sans',sans-serif"
    font-weight="800" font-size="104" letter-spacing="-3" fill="${MAGENTA}">UMYJEME FASÁDU</text>

  <!-- tagline -->
  <text x="600" y="390" text-anchor="middle" font-family="'Inter','DejaVu Sans',sans-serif"
    font-weight="400" font-size="38" letter-spacing="-1" fill="${INK}">Profesionální mytí fasád, střech a dlažby</text>

  <!-- divider -->
  <rect x="540" y="430" width="120" height="4" rx="2" fill="${CYAN}"/>

  <!-- contact -->
  <text x="600" y="520" text-anchor="middle" font-family="'Inter','DejaVu Sans',sans-serif"
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
