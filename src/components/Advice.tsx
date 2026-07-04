import SectionHeading from "./SectionHeading";

// TODO: až vzniknou skutečné články, doplňte odkazy a odstraňte štítek "Připravujeme".
const ARTICLES = [
  {
    no: "01",
    title: "Kdy je správný čas umýt fasádu",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    no: "02",
    title: "Plíseň, nebo řasa? Jak je poznat",
    excerpt:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    no: "03",
    title: "Jak funguje nanoimpregnace",
    excerpt:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export default function Advice() {
  return (
    <section
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sage-mist)" }}
    >
      <div className="container-page">
        <SectionHeading
          title="Rady a návody"
          intro="Co byste měli vědět o fasádě, střeše i dlažbě, než nás zavoláte."
        />

        {/* Editorial columns - hairline rules instead of card chrome. */}
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 fade-up md:grid-cols-3">
          {ARTICLES.map((a) => (
            <article
              key={a.no}
              className="flex flex-col gap-3 border-t pt-5"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="font-fragment-mono text-forest-floor"
                  style={{ fontSize: "14px", letterSpacing: "0.02em" }}
                >
                  {a.no}
                </span>
                <span className="micro-label text-botanical-ink/45">
                  Připravujeme
                </span>
              </div>
              <h3
                className="text-botanical-ink"
                style={{ fontSize: "19px", fontWeight: 700 }}
              >
                {a.title}
              </h3>
              <p
                className="text-botanical-ink/75"
                style={{ fontSize: "15px", lineHeight: 1.6 }}
              >
                {a.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
