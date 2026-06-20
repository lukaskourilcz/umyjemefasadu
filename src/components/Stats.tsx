const STATS = [
  { value: "5 – 10", label: "let účinné ochrany" },
  { value: "100 %", label: "ekologické přípravky" },
  { value: "0 Kč", label: "za prohlídku a nabídku" },
];

export default function Stats() {
  return (
    <section
      className="py-20 md:py-24"
      style={{
        background:
          "linear-gradient(120deg, var(--color-forest-floor), var(--color-cyan-deep))",
      }}
    >
      <div className="container-page grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="fade-up flex flex-col items-center gap-3">
            <span
              className="font-akkurat"
              style={{
                color: "var(--color-cream-paper)",
                fontWeight: 400,
                fontSize: "clamp(40px, 6vw, 53px)",
                lineHeight: 1,
                letterSpacing: "-2.12px",
              }}
            >
              {s.value}
            </span>
            <span
              className="micro-label"
              style={{ color: "var(--color-cream-paper)", opacity: 0.85 }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
