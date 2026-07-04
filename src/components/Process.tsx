import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    no: "01",
    title: "Aplikace přípravku",
    desc: "Naneseme přípravek na odstranění organických (plísně, řasy, lišejníky) i anorganických nečistot (saze, prach a mastnota).",
  },
  {
    no: "02",
    title: "Tlakové mytí horkou vodou",
    desc: "Fasádu omyjeme horkou vodou pod regulovaným tlakem. Tlak, teplotu i trysky volíme podle typu a stavu omítky.",
  },
  {
    no: "03",
    title: "Nanoimpregnace a ochrana",
    desc: "Nakonec naneseme nanoimpregnaci, která brání opětovnému růstu plísní a usazování nečistot na dlouhé roky.",
  },
];

const METHODS = [
  {
    title: "Tlakové mytí horkou vodou",
    desc: "Fasádu umyjeme horkou vodou pod regulovaným tlakem. Tlak i teplotu pečlivě hlídáme a trysky volíme podle typu omítky tak, abychom povrch nepoškodili.",
  },
  {
    title: "Aktivní pěna a nástřik",
    desc: "U citlivějších omítek volíme šetrnou variantu: necháme působit přípravek na organické nečistoty (cca 30 minut) a poté nanášíme aktivní pěnu s vysokým obsahem tenzidů na prach, mastnotu a smog.",
  },
];

/** The page's dark mid-section - grounds the pastel surfaces around it. */
export default function Process() {
  return (
    <section
      id="postup"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-botanical-ink)" }}
    >
      <div className="container-page">
        <SectionHeading
          tone="dark"
          title="Jak čistíme, krok za krokem"
          intro="Postup volíme podle typu a stavu fasády, od první aplikace přípravku až po závěrečnou ochranu."
        />

        {/* Vertical timeline - mono numbers on a hairline rail. */}
        <ol className="mx-auto mt-14 flex max-w-[720px] flex-col fade-up">
          {STEPS.map((s, i) => (
            <li key={s.no} className="relative flex gap-6 md:gap-8">
              <div className="flex flex-col items-center">
                <span
                  className="font-fragment-mono pt-1"
                  style={{
                    color: "var(--color-forest-floor)",
                    fontSize: "15px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.no}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mt-3 w-px flex-1"
                    style={{ backgroundColor: "rgba(251,253,254,0.16)" }}
                  />
                )}
              </div>
              <div className={i < STEPS.length - 1 ? "pb-10" : ""}>
                <h3
                  className="text-cream-paper"
                  style={{ fontSize: "clamp(18px, 1vw + 14px, 20px)", fontWeight: 700 }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-cream-paper/70"
                  style={{ fontSize: "16px", lineHeight: 1.6 }}
                >
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Two approaches - chosen podle typu a stavu fasády */}
        <div className="mx-auto mt-14 grid max-w-[900px] grid-cols-1 gap-5 fade-up md:grid-cols-2">
          {METHODS.map((m) => (
            <div
              key={m.title}
              className="flex flex-col items-start gap-4 rounded-[14px] border p-6 md:p-7"
              style={{
                backgroundColor: "rgba(251,253,254,0.06)",
                borderColor: "rgba(251,253,254,0.14)",
              }}
            >
              <h3
                className="text-cream-paper"
                style={{ fontSize: "clamp(18px, 1vw + 14px, 20px)", fontWeight: 700 }}
              >
                {m.title}
              </h3>
              <p
                className="text-cream-paper/70"
                style={{ fontSize: "16px", lineHeight: 1.6 }}
              >
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
