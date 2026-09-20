// Generates raster brand assets from the real logo artwork:
//   public/og-image.png          1200x630  social / link preview (cs)
//   public/og-image.de.png       1200x630  social / link preview (de)
//   public/media/logo-nav-de.webp 1440x810 nav emblem (de)
//   public/apple-touch-icon.png   180x180  iOS home screen (shared)
//   public/favicon-32.png          32x32   PNG favicon fallback (shared)
//
// Obě značky (Umyjeme Fasádu / Waschen Fassade) jsou stejná kresba s jiným
// nápisem, takže ikonky s maskotem jsou společné a generují se jen jednou.
// Kresby se čtou z public/logo.svg a public/logo-de.svg, aby assety vždy
// odpovídaly živému logu.
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

// --- Kresby log (česká i německá) -------------------------------------------
function readLogo(file) {
  const raw = readFileSync(out(file), "utf8");
  return {
    viewBox: (raw.match(/viewBox="([^"]*)"/) || [])[1] || "0 0 100 100",
    inner: raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""),
  };
}

const LOGOS = { cs: readLogo("logo.svg"), de: readLogo("logo-de.svg") };

// Embed the logo as a nested <svg> positioned in the given box.
const logoMark = (logo, x, y, w, h) => `
  <svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${logo.viewBox}"
       preserveAspectRatio="xMidYMid meet">${logo.inner}</svg>`;

/** Samostatné SVG s logem v dané velikosti (pro rasterizaci). */
const logoSvg = (logo, w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${logo.viewBox}"
     fill-rule="evenodd" clip-rule="evenodd"
     preserveAspectRatio="xMidYMid meet">${logo.inner}</svg>`;

// --- App icon --------------------------------------------------------------
// Favicon/ikonka = maskot z loga (public/favicon.svg): kompletní logo s vlnou
// a nápisem je v 16-32px nečitelné. OG obrázek níže dál nese celé logo.
const markRaw = readFileSync(out("favicon.svg"), "utf8");
const MARK_VIEWBOX = (markRaw.match(/viewBox="([^"]*)"/) || [])[1] || "0 0 32 32";
const MARK_INNER = markRaw
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");

/**
 * Ikonka v dané velikosti. `tile` = krémová dlaždice pod značkou (iOS neumí
 * průhlednost, na liště prohlížeče naopak vadí), `inset` = okraj kolem
 * značky v jednotkách 32px mřížky. Na liště jde o 16-32px, takže se hlava
 * kreslí přes celou plochu — každý ušetřený pixel je znát.
 */
const iconSvg = (size, { tile = false, inset = 0 } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
  ${tile ? `<rect width="32" height="32" rx="7" fill="${CREAM}"/>` : ""}
  <svg x="${inset}" y="${inset}" width="${32 - 2 * inset}" height="${32 - 2 * inset}"
       viewBox="${MARK_VIEWBOX}" fill-rule="evenodd" clip-rule="evenodd"
       preserveAspectRatio="xMidYMid meet">${MARK_INNER}</svg>
</svg>`;

// --- Social / OG image (1200x630) -------------------------------------------
/**
 * Texty na OG obrázku. Německá varianta záměrně neuvádí doménu — dokud běží
 * na /de, byla by adresa matoucí, a .cz adresa na německém obrázku nemá co
 * dělat. Zůstává telefon, který platí pro obě mutace.
 */
const OG_COPY = {
  cs: {
    logo: LOGOS.cs,
    tagline: "Profesionální mytí fasád, střech a dlažby",
    taglineSize: 38,
    contact: "umyjemefasadu.cz · +420 775 222 760",
    file: "og-image.png",
  },
  de: {
    logo: LOGOS.de,
    tagline: "Professionelle Fassaden-, Dach- und Pflasterreinigung",
    taglineSize: 32,
    contact: "+420 775 222 760",
    file: "og-image.de.png",
  },
};

const ogSvg = ({ logo, tagline, taglineSize, contact }) => `
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
  ${logoMark(logo, 417, 48, 366, 310)}

  <!-- tagline -->
  <text x="600" y="438" text-anchor="middle" font-family="'Inter','DejaVu Sans',sans-serif"
    font-weight="400" font-size="${taglineSize}" letter-spacing="-1" fill="${INK}">${tagline}</text>

  <!-- divider -->
  <rect x="540" y="478" width="120" height="4" rx="2" fill="${CYAN}"/>

  <!-- contact -->
  <text x="600" y="548" text-anchor="middle" font-family="'Inter','DejaVu Sans',sans-serif"
    font-weight="700" font-size="30" letter-spacing="0.5" fill="${INK}">${contact}</text>
</svg>`;

// --- Navigační emblém (1440x810) --------------------------------------------
// Česká verze (public/media/logo-nav.webp) má kresbu 587x495 na pozici
// 439,169 průhledného plátna 16:9. Německou skládáme do stejného rámu, aby
// logo v navigaci sedělo v obou jazycích úplně stejně.
const NAV_CANVAS = { width: 1440, height: 810 };
const NAV_BOX = { left: 439, top: 169, width: 587, height: 495 };

async function navEmblem(logo, file) {
  const mark = await sharp(
    Buffer.from(logoSvg(logo, NAV_BOX.width, NAV_BOX.height)),
  )
    .png()
    .toBuffer();
  // Bez zapečené záře: lišta na logo aplikuje CSS drop-shadow, který takhle
  // kopíruje obrys kresby. (Rozmazaná záře pod ním vytvořila šedý kotouč.)
  await sharp({
    create: { ...NAV_CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: mark, left: NAV_BOX.left, top: NAV_BOX.top }])
    .webp({ quality: 92 })
    .toFile(out(file));
}

async function run() {
  for (const copy of Object.values(OG_COPY)) {
    await sharp(Buffer.from(ogSvg(copy))).png().toFile(out(copy.file));
  }
  await navEmblem(LOGOS.de, "media/logo-nav-de.webp");
  // iOS ikonu skládá na neprůhledné pozadí → dlaždice; okraj jen 1/32, ať se
  // hlava nezmenšuje víc, než kolik ukrojí systémový oblý ořez.
  await sharp(Buffer.from(iconSvg(180, { tile: true, inset: 1 })))
    .png()
    .toFile(out("apple-touch-icon.png"));
  // Lišta prohlížeče: průhledné pozadí a značka přes celou plochu, ať vypadá
  // stejně velká jako vektorová favicon.svg.
  await sharp(Buffer.from(iconSvg(32))).png().toFile(out("favicon-32.png"));
  console.log(
    "Generated og-image.png, og-image.de.png, media/logo-nav-de.webp, apple-touch-icon.png, favicon-32.png",
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
