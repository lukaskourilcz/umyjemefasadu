/** Constrain `n` to the inclusive [min, max] range. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
