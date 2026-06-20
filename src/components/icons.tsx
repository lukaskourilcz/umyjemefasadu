/** Shared inline icons reused across sections. */

/** Rounded check mark - used in the trust strip and the "why us" list. */
export function CheckIcon({
  size = 16,
  color = "#0a1d08",
}: {
  size?: number;
  color?: string;
}) {
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
