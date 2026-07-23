/** Shared inline icons reused across sections. */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Kapka - šetrné čištění vodou. */
export function DropletIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.5 C 8.2 8.3, 6.5 11.1, 6.5 13.6 a5.5 5.5 0 0 0 11 0 C 17.5 11.1, 15.8 8.3, 12 3.5 Z"
        {...stroke}
      />
      <path d="M9.6 14 a2.4 2.4 0 0 0 2.4 2.4" {...stroke} />
    </svg>
  );
}

/** Lístek - profesionální, ekologická chemie. */
export function LeafIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19 5 C 12 5, 6.5 8, 6.5 14.5 a4.5 4.5 0 0 0 9 0 C 15.5 10.5, 17 7.5, 19 5 Z"
        {...stroke}
      />
      <path d="M5 19 C 8 15.5, 11 12.5, 15 9.5" {...stroke} />
    </svg>
  );
}

/** Dům - upravený vzhled objektu. */
export function HouseIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11 L12 4.5 L20 11" {...stroke} />
      <path d="M6 10 V19 H18 V10" {...stroke} />
      <path d="M10 19 V14 H14 V19" {...stroke} />
    </svg>
  );
}

/** Rounded check mark - used in the trust strip and the "why us" list. */
export function CheckIcon({ size = 16, color = "#0a1d08" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3 8.5 L6.5 12 L13 4"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
