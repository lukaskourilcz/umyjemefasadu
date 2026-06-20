import type { CSSProperties } from "react";

/**
 * Shared typography presets for the Akkurat body/heading rhythm, so the same
 * font-size/line-height/letter-spacing combos aren't duplicated across sections.
 * Pair with the `font-akkurat` class.
 */
export const TEXT = {
  /** Card / list-item heading. */
  cardTitle: { fontSize: "20px", letterSpacing: "-0.04em" },
  /** Default body copy inside cards. */
  body: { fontSize: "16px", lineHeight: 1.6, letterSpacing: "-0.04em" },
  /** Slightly tighter body copy (denser lists). */
  bodyTight: { fontSize: "16px", lineHeight: 1.55, letterSpacing: "-0.04em" },
} satisfies Record<string, CSSProperties>;
