/**
 * Hero backdrop - on-brand "clean water" motif.
 * Calm layered water surface in the brand cyan, soft foam crests, drifting
 * droplets and a pair of faint splash arcs that echo the logo's water mark.
 * A few sparse magenta droplets tie it to the primary accent. Soft edges,
 * nothing competes with the headline. Palette mirrors the UI tokens.
 */
export default function Landscape({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        {/* Cream sky settling into a soft cyan haze */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbfdfe" />
          <stop offset="55%" stopColor="#eef6fb" />
          <stop offset="100%" stopColor="#dcf0fb" />
        </linearGradient>
        {/* Water layers, far (palest) to near (deepest) */}
        <linearGradient id="waterFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfeafb" />
          <stop offset="100%" stopColor="#bfe2f5" />
        </linearGradient>
        <linearGradient id="waterMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9bd3f1" />
          <stop offset="100%" stopColor="#6fc1ea" />
        </linearGradient>
        <linearGradient id="waterNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fb0e6" />
          <stop offset="100%" stopColor="#1ba5e0" />
        </linearGradient>
        {/* Soft atmospheric blur */}
        <filter id="mist" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="softer" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        {/* Light bloom, upper area */}
        <radialGradient id="sunHaze" cx="72%" cy="22%" r="46%">
          <stop offset="0%" stopColor="#fbfdfe" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbfdfe" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="720" fill="url(#sky)" />
      <rect width="1440" height="720" fill="url(#sunHaze)" />

      {/* Faint splash arcs echoing the logo's water mark */}
      <g fill="none" stroke="#5ec7ef" opacity="0.35" filter="url(#softer)">
        <path d="M-40 360 C 120 300, 240 360, 220 470 C 150 430, 60 430, -40 470 Z" />
        <path d="M1480 360 C 1320 300, 1200 360, 1220 470 C 1290 430, 1380 430, 1480 470 Z" />
      </g>

      {/* Far water band */}
      <path
        d="M0 372 C 260 348, 520 360, 760 350 C 1000 340, 1220 360, 1440 348 L1440 720 L0 720 Z"
        fill="url(#waterFar)"
        filter="url(#mist)"
        opacity="0.95"
      />

      {/* Mid water band */}
      <path
        d="M0 470 C 300 446, 620 470, 940 456 C 1160 446, 1320 466, 1440 458 L1440 720 L0 720 Z"
        fill="url(#waterMid)"
        opacity="0.9"
      />
      {/* Mid foam crest */}
      <path
        d="M0 470 C 300 446, 620 470, 940 456 C 1160 446, 1320 466, 1440 458"
        fill="none"
        stroke="#dcf3fc"
        strokeWidth="3"
        opacity="0.6"
      />

      {/* Near water band */}
      <path
        d="M0 580 C 360 552, 720 584, 1080 566 C 1260 557, 1360 578, 1440 570 L1440 720 L0 720 Z"
        fill="url(#waterNear)"
      />
      {/* Near foam crest */}
      <path
        d="M0 580 C 360 552, 720 584, 1080 566 C 1260 557, 1360 578, 1440 570"
        fill="none"
        stroke="#bfeaff"
        strokeWidth="3"
        opacity="0.7"
      />

      {/* Drifting droplets - cyan, with two sparse magenta accents */}
      <g>
        <circle cx="240" cy="300" r="9" fill="#5ec7ef" opacity="0.55" />
        <circle cx="1180" cy="318" r="11" fill="#5ec7ef" opacity="0.5" />
        <circle cx="980" cy="262" r="6" fill="#9bd3f1" opacity="0.7" />
        <circle cx="430" cy="250" r="5" fill="#9bd3f1" opacity="0.7" />
        <circle cx="700" cy="318" r="7" fill="#5ec7ef" opacity="0.45" />
        <circle cx="520" cy="338" r="5" fill="#e6007e" opacity="0.4" />
        <circle cx="1100" cy="372" r="6" fill="#e6007e" opacity="0.35" />
      </g>

      {/* Light glints on the near water surface */}
      <g stroke="#eafaff" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <path d="M210 636 C 250 628, 300 632, 340 624" fill="none" />
        <path d="M880 656 C 930 648, 990 652, 1040 644" fill="none" />
        <path d="M560 678 C 600 672, 650 674, 690 668" fill="none" />
      </g>
    </svg>
  );
}
