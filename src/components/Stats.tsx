const STATS = [
  { value: "8+", label: "let záruka na ochranu" },
  { value: "100 %", label: "ekologické přípravky" },
  { value: "0", label: "kompromisů v kvalitě" },
];

export default function Stats() {
  return (
    <section
      className="py-20 md:py-24"
      style={{ backgroundColor: "var(--color-eucalyptus)" }}
    >
      <div className="container-page grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="fade-up flex flex-col items-center gap-3">
            <span
              className="font-akkurat text-botanical-ink"
              style={{
                fontWeight: 400,
                fontSize: "clamp(40px, 6vw, 53px)",
                lineHeight: 1,
                letterSpacing: "-2.12px",
              }}
            >
              {s.value}
            </span>
            <span className="micro-label text-botanical-ink/80">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
