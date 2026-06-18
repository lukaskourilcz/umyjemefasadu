import SectionHeading from "./SectionHeading";

const POINTS = [
  {
    title: "Šetrné a ekologické přípravky",
    desc: "Používáme jen ty nejlepší aplikační přípravky — ekologické, bezpečné a ohleduplné k okolí i k povrchu budovy.",
  },
  {
    title: "Ochrana na dlouhé roky",
    desc: "Po umytí fasádu chráníme před budoucím znečištěním. Díky nanoimpregnaci vydrží v kondici minimálně 8 let.",
  },
  {
    title: "Pojištěni u Generali",
    desc: "Jsme pojištěni, takže váš majetek je při práci v bezpečí a za výsledek neseme plnou odpovědnost.",
  },
  {
    title: "Férový a osobní přístup",
    desc: "Jsme parta nadšenců, která věří, že každá budova si zaslouží druhou šanci vypadat svěže. Domluvíme se na míru.",
  },
];

export default function WhyUs() {
  return (
    <section id="proc-my" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            align="left"
            label="Proč my"
            title="Stará fasáda není konec — je to začátek"
            intro="Jsme na trhu noví, ale za sebou máme roky zkušeností s čištěním fasád, střech i dlažby. Naším posláním je vrátit budovám svěžest a nechat je znovu dýchat."
          />
          <a href="#kontakt" className="btn-primary mt-8 fade-up">
            Domluvit prohlídku zdarma
          </a>
        </div>

        <ul className="flex flex-col gap-4">
          {POINTS.map((p, i) => (
            <li
              key={p.title}
              className="fade-up flex gap-4 rounded-[20px] border p-6"
              style={{
                backgroundColor: "var(--color-lichen)",
                borderColor: "var(--color-eucalyptus)",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <span
                className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-moss-veil)" }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3 8.5 L6.5 12 L13 4"
                    fill="none"
                    stroke="#0a1d08"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h3
                  className="font-akkurat font-bold text-botanical-ink"
                  style={{ fontSize: "18px", letterSpacing: "-0.04em" }}
                >
                  {p.title}
                </h3>
                <p
                  className="font-akkurat mt-1 text-botanical-ink/75"
                  style={{ fontSize: "16px", lineHeight: 1.55, letterSpacing: "-0.04em" }}
                >
                  {p.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
