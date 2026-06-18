import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    no: "01",
    title: "Aplikace přípravku",
    desc: "Naneseme přípravek na odstranění organických (plísně, řasy, lišejníky) i anorganických nečistot — saze, prach a mastnoty.",
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

export default function Process() {
  return (
    <section
      id="postup"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sage-mist)" }}
    >
      <div className="container-page">
        <SectionHeading
          label="Jak to probíhá"
          title="Tři kroky k fasádě, která znovu dýchá"
          intro="Promyšlený postup, který přináší viditelný výsledek a dlouhodobý efekt — rychle, bezpečně a bez kompromisů."
        />

        <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.no}
              className="fade-up relative rounded-[20px] border p-8"
              style={{
                backgroundColor: "var(--color-cream-paper)",
                borderColor: "var(--color-eucalyptus)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <span
                className="font-fragment-mono block"
                style={{
                  fontSize: "14px",
                  color: "var(--color-forest-floor)",
                  letterSpacing: "0.02em",
                }}
              >
                {s.no}
              </span>
              <h3
                className="font-akkurat mt-5 font-bold text-botanical-ink"
                style={{ fontSize: "22px", letterSpacing: "-0.04em" }}
              >
                {s.title}
              </h3>
              <p
                className="font-akkurat mt-3 text-botanical-ink/75"
                style={{ fontSize: "16px", lineHeight: 1.6, letterSpacing: "-0.04em" }}
              >
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
