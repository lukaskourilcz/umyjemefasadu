import type { CSSProperties } from "react";

/**
 * Shared typography presets so the same font-size/line-height combos aren't
 * duplicated across sections. Headings inherit the display face from the base
 * layer; body copy inherits Inter.
 */
export const TEXT = {
  /** Card / list-item heading. */
  cardTitle: { fontSize: "clamp(18px, 1vw + 14px, 20px)" },
  /** Default body copy inside cards. */
  body: { fontSize: "16px", lineHeight: 1.6 },
  /** Slightly tighter body copy (denser lists). */
  bodyTight: { fontSize: "16px", lineHeight: 1.55 },
} satisfies Record<string, CSSProperties>;
