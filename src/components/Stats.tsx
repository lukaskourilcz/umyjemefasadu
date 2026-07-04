// TODO: nahraďte skutečnými čísly firmy - smyšlená čísla by se obrátila proti nám.
const STATS = [
  { value: "12 500+", label: "m² umytých ploch" },
  { value: "180+", label: "dokončených zakázek" },
  { value: "25+", label: "měst a obcí" },
  { value: "15+", label: "let praxe v týmu" },
];

/** Slim editorial number band - proof in figures, no banner theatrics. */
export default function Stats() {
  return (
    <section
      className="border-y"
      style={{
        borderColor: "var(--color-lichen)",
        backgroundColor: "var(--color-sage-mist)",
      }}
    >
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-12 fade-up md:py-14 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-2 text-center">
            <span
              className="text-botanical-ink"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(34px, 4.6vw, 50px)",
                lineHeight: 1,
              }}
            >
              {s.value}
            </span>
            <span className="micro-label text-botanical-ink/60">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
