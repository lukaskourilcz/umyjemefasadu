/**
 * Brand logo - the real mark (Poseidon mascot with a pressure-washer lance,
 * magenta wordmark, black roofline and cyan water splash). The German market
 * uses the same artwork with a "WASCHEN FASSADE" wordmark; `alt` already
 * follows the locale, the artwork swap is still pending the German files.
 *
 * Two artworks: the standalone vector (`logo.svg`, used in the footer) and a
 * high-quality WebP nav emblem (`/media/logo-nav.webp`, 1440×810, ~52 kB) —
 * a crisp render of the original nav artwork that replaces the heavy 860 kB
 * raster-backed SVG (stays sharp on high-DPI phones). Both render as <img> so
 * the nav artwork loads as a separate cacheable asset instead of being inlined
 * into the JS bundle. Size is driven by the caller via `height` (and/or
 * responsive height classes in `className`).
 */
import logoUrl from "../assets/logo.svg";
import { BRAND_NAME, LOCALE, type Locale } from "../i18n";

type Source = "default" | "nav";

/**
 * Kresby pro obě značky. Německá vektorová kresba je v `public/logo-de.svg`,
 * navigační emblém generuje `npm run gen:assets` do stejného rámu jako český,
 * takže logo v liště sedí v obou jazycích úplně stejně.
 */
const SRC: Record<Locale, Record<Source, string>> = {
  cs: {
    default: logoUrl,
    nav: "/media/logo-nav.webp",
  },
  de: {
    default: "/logo-de.svg",
    nav: "/media/logo-nav-de.webp",
  },
};

export default function Logo({
  className = "",
  height = 36,
  source = "default",
}: {
  className?: string;
  height?: number;
  source?: Source;
}) {
  return (
    <img
      src={SRC[LOCALE][source]}
      alt={BRAND_NAME}
      height={height}
      loading={source === "nav" ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={{ display: "block", width: "auto" }}
    />
  );
}
