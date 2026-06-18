/**
 * Brand logo — hand-built SVG recreation of the Umyjeme Fasádu mark:
 * black roofline, magenta two-line wordmark, cyan water splash and a
 * Poseidon mascot holding a pressure-washer lance.
 *
 * variant="compact" — roofline + wordmark only (navigation, footer).
 * variant="full"    — complete emblem with mascot + water (hero, large use).
 */
type Variant = "compact" | "full";

const MAGENTA = "#e6007e";
const INK = "#141a16";
const CYAN = "#1ba5e0";
const CYAN_LIGHT = "#5ec7ef";
const SKIN = "#f7941e";
const SKIN_DARK = "#e2761b";
const GOLD = "#f5a623";
const GOLD_DARK = "#e0901a";
const METAL = "#c7cdd1";
const METAL_DARK = "#9aa1a6";

function Roof({ y = 0 }: { y?: number }) {
  return (
    <polyline
      points={`150,${70 + y} 268,${26 + y} 300,${26 + y} 300,${10 + y} 332,${10 + y} 332,${40 + y} 410,${70 + y}`}
      fill="none"
      stroke={INK}
      strokeWidth="20"
      strokeLinejoin="round"
      strokeLinecap="square"
    />
  );
}

function Wordmark({ y = 0 }: { y?: number }) {
  const common = {
    textAnchor: "middle" as const,
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 800,
    fill: MAGENTA,
  };
  return (
    <g style={{ letterSpacing: "-2px" }}>
      <text x="280" y={130 + y} fontSize="66" {...common}>
        UMYJEME
      </text>
      <text x="280" y={194 + y} fontSize="66" {...common}>
        FASÁDU
      </text>
    </g>
  );
}

export default function Logo({
  className = "",
  variant = "compact",
  height = 36,
}: {
  className?: string;
  variant?: Variant;
  height?: number;
}) {
  const label = "Umyjeme Fasádu";

  if (variant === "compact") {
    return (
      <a
        href="#top"
        className={`inline-flex ${className}`}
        aria-label={`${label} — domů`}
      >
        <svg
          viewBox="0 0 560 215"
          height={height}
          role="img"
          aria-label={label}
          style={{ display: "block" }}
        >
          <Roof />
          <Wordmark />
        </svg>
      </a>
    );
  }

  return (
    <svg
      viewBox="0 0 560 760"
      height={height}
      role="img"
      aria-label={label}
      className={className}
      style={{ display: "block" }}
    >
      <Roof />
      <Wordmark />

      {/* Water splash — cyan, arcing around the mascot */}
      <g fill={CYAN}>
        <path d="M70 540 C 20 470, 60 400, 130 410 C 90 440, 90 500, 150 520 C 110 560, 80 560, 70 540 Z" />
        <path d="M490 540 C 540 470, 500 400, 430 410 C 470 440, 470 500, 410 520 C 450 560, 480 560, 490 540 Z" />
        <path d="M120 640 C 60 620, 60 560, 120 560 C 100 590, 120 620, 170 615 C 150 645, 140 648, 120 640 Z" />
        <path d="M440 640 C 500 620, 500 560, 440 560 C 460 590, 440 620, 390 615 C 410 645, 420 648, 440 640 Z" />
      </g>
      <g fill={CYAN_LIGHT}>
        <circle cx="110" cy="470" r="9" />
        <circle cx="450" cy="470" r="9" />
        <circle cx="150" cy="660" r="7" />
        <circle cx="410" cy="660" r="7" />
      </g>

      {/* Mascot — Poseidon bust */}
      <g stroke={INK} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        {/* Shoulders / torso */}
        <path
          d="M175 740 C 175 615, 230 565, 280 565 C 330 565, 385 615, 385 740 Z"
          fill={SKIN}
        />
        <path d="M280 565 C 250 600, 250 650, 268 700" fill="none" stroke={SKIN_DARK} strokeWidth="8" />

        {/* Neck */}
        <path d="M252 560 L252 600 Q280 615 308 600 L308 560 Z" fill={SKIN} />

        {/* Beard */}
        <path
          d="M214 470 C 206 580, 280 625, 280 625 C 280 625, 354 580, 346 470 C 330 510, 312 524, 280 524 C 248 524, 230 510, 214 470 Z"
          fill="#ffffff"
        />

        {/* Face */}
        <path
          d="M236 410 C 236 360, 260 332, 280 332 C 300 332, 324 360, 324 410 C 324 452, 306 482, 280 482 C 254 482, 236 452, 236 410 Z"
          fill={SKIN}
        />

        {/* Hair side locks */}
        <path d="M236 392 C 212 396, 206 440, 222 470 C 222 430, 230 410, 240 400 Z" fill="#ffffff" />
        <path d="M324 392 C 348 396, 354 440, 338 470 C 338 430, 330 410, 320 400 Z" fill="#ffffff" />

        {/* Mustache */}
        <path d="M256 452 C 268 462, 292 462, 304 452 C 296 470, 264 470, 256 452 Z" fill="#ffffff" stroke="none" />
      </g>

      {/* Face details (no outline noise) */}
      <g fill={INK}>
        <circle cx="262" cy="408" r="5" />
        <circle cx="298" cy="408" r="5" />
        <path d="M250 392 C 256 384, 268 384, 274 390" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M286 390 C 292 384, 304 384, 310 392" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </g>
      <path d="M280 414 C 274 428, 272 436, 282 440" fill="none" stroke={SKIN_DARK} strokeWidth="5" strokeLinecap="round" />

      {/* Crown with trident */}
      <g stroke={INK} strokeWidth="6" strokeLinejoin="round">
        <path
          d="M232 352 L240 318 L262 340 L280 306 L298 340 L320 318 L328 352 Z"
          fill={GOLD}
        />
        <path d="M232 352 L328 352" stroke={GOLD_DARK} strokeWidth="4" />
        {/* Trident spike */}
        <path d="M280 306 L280 250" stroke={GOLD} strokeWidth="9" strokeLinecap="round" />
        <path d="M280 250 L280 232 M268 262 L268 244 L280 250 M292 262 L292 244 L280 250" fill="none" stroke={GOLD} strokeWidth="7" strokeLinecap="round" />
      </g>

      {/* Pressure-washer lance across the body */}
      <g stroke={INK} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        <rect x="300" y="345" width="150" height="20" rx="6" transform="rotate(-32 375 355)" fill={METAL} />
        <rect x="300" y="345" width="30" height="20" rx="4" transform="rotate(-32 315 355)" fill={METAL_DARK} />
        {/* Handle + grip */}
        <path d="M286 470 L322 470 L330 510 L300 540 L274 520 Z" fill={METAL} />
        <path d="M276 540 C 268 590, 300 610, 320 590 C 308 596, 292 588, 292 560 L300 540 Z" fill={INK} />
        <rect x="296" y="500" width="40" height="18" rx="6" transform="rotate(-32 316 509)" fill={GOLD} />
      </g>
    </svg>
  );
}
