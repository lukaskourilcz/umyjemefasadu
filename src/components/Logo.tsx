/** Wordmark + slash mark in Onyx — the only maximum-contrast brand element. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Umyjeme Fasádu — domů"
    >
      <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
        <path
          d="M14 2 L6 20"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M10 4 C 6 6, 5 11, 6 15 C 11 14, 15 10, 15 4 C 12 5, 10 8, 8 12"
          fill="none"
          stroke="#203b14"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="font-akkurat font-bold text-botanical-ink"
        style={{ fontSize: "16px" }}
      >
        Umyjeme&nbsp;Fasádu
      </span>
    </a>
  );
}
