/** Trust strip — adapted to a values row: monochrome marks + micro-label. */
const ITEMS = [
  "Pojištěno u Generali",
  "Ekologické přípravky",
  "Záruka až 8 let",
  "Roky zkušeností",
];

export default function TrustStrip() {
  return (
    <section
      className="border-y"
      style={{
        backgroundColor: "var(--color-sage-mist)",
        borderColor: "var(--color-lichen)",
      }}
    >
      <div className="container-page flex flex-col items-center gap-6 py-10 text-center">
        <span className="micro-label text-botanical-ink/70">
          Proč nám klienti věří
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 8.5 L6.5 12 L13 4"
                  fill="none"
                  stroke="#0a1d08"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className="font-akkurat font-bold text-botanical-ink"
                style={{ fontSize: "14px" }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
