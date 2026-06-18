/**
 * Landscape Backdrop — the brand's emotional anchor.
 * A painterly, atmospheric scene: cream sky, misty lake, rolling sage hills,
 * bonsai-like trees and a solitary bench. Soft edges, no hard lines.
 * Palette mirrors the UI tokens exactly.
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
        {/* Cool dawn sky fading into a soft cyan haze */}
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbfdfe" />
          <stop offset="55%" stopColor="#eef6fb" />
          <stop offset="100%" stopColor="#e2eff8" />
        </linearGradient>
        {/* Distant misty hills */}
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d6e4ee" />
          <stop offset="100%" stopColor="#c7dae8" />
        </linearGradient>
        <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#aecbe0" />
          <stop offset="100%" stopColor="#97bcd8" />
        </linearGradient>
        {/* Still lake reflecting the cyan sky */}
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcf0fb" />
          <stop offset="100%" stopColor="#bfe2f5" />
        </linearGradient>
        {/* Soft atmospheric blur for mist */}
        <filter id="mist" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <radialGradient id="sunHaze" cx="72%" cy="26%" r="40%">
          <stop offset="0%" stopColor="#fbfdfe" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fbfdfe" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="1440" height="720" fill="url(#sky)" />
      <rect width="1440" height="720" fill="url(#sunHaze)" />

      {/* Far ridge */}
      <path
        d="M0 300 C 240 250, 420 290, 620 270 C 820 250, 1020 300, 1240 268 C 1340 254, 1400 270, 1440 262 L1440 720 L0 720 Z"
        fill="url(#hillFar)"
        filter="url(#mist)"
        opacity="0.9"
      />

      {/* Mid ridge */}
      <path
        d="M0 372 C 260 330, 460 360, 700 344 C 940 328, 1140 372, 1440 340 L1440 720 L0 720 Z"
        fill="url(#hillMid)"
        opacity="0.85"
      />

      {/* Lake */}
      <path
        d="M0 470 C 320 452, 720 480, 1100 462 C 1260 454, 1360 466, 1440 460 L1440 720 L0 720 Z"
        fill="url(#lake)"
      />

      {/* Near bank */}
      <path
        d="M0 560 C 300 528, 560 560, 820 548 C 1080 536, 1260 566, 1440 548 L1440 720 L0 720 Z"
        fill="#a9c7df"
        opacity="0.95"
      />
      <path
        d="M0 642 C 360 612, 700 644, 1040 628 C 1240 619, 1360 640, 1440 632 L1440 720 L0 720 Z"
        fill="#8fb4d2"
      />

      {/* Bonsai-like trees on the far bank */}
      <g opacity="0.92">
        {/* tall slender tree */}
        <path d="M1086 470 L1086 360" stroke="#31200b" strokeWidth="3" />
        <ellipse cx="1086" cy="344" rx="38" ry="26" fill="#a9b596" filter="url(#mist)" />
        <ellipse cx="1062" cy="358" rx="22" ry="15" fill="#9aa988" filter="url(#mist)" />

        {/* low rounded tree */}
        <path d="M150 478 L150 408" stroke="#31200b" strokeWidth="3" />
        <ellipse cx="150" cy="396" rx="46" ry="28" fill="#aebb9b" filter="url(#mist)" />
        <ellipse cx="184" cy="408" rx="24" ry="16" fill="#9fae8b" filter="url(#mist)" />

        {/* mid pair */}
        <path d="M300 466 L300 416" stroke="#31200b" strokeWidth="2.5" />
        <ellipse cx="300" cy="406" rx="30" ry="19" fill="#a7b497" filter="url(#mist)" />
      </g>

      {/* Solitary bench on the near bank */}
      <g stroke="#101820" strokeWidth="3" strokeLinecap="round" opacity="0.85">
        <line x1="560" y1="600" x2="660" y2="592" />
        <line x1="560" y1="612" x2="660" y2="604" />
        <line x1="566" y1="600" x2="566" y2="630" />
        <line x1="652" y1="592" x2="652" y2="622" />
        <line x1="560" y1="588" x2="566" y2="600" />
        <line x1="654" y1="580" x2="660" y2="592" />
        <line x1="560" y1="576" x2="654" y2="568" />
      </g>

      {/* Reeds */}
      <g stroke="#7d8a68" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M980 636 C 978 612, 984 600, 988 590" fill="none" />
        <path d="M992 638 C 992 616, 998 604, 1004 596" fill="none" />
        <path d="M1006 640 C 1008 620, 1014 608, 1018 600" fill="none" />
      </g>
    </svg>
  );
}
