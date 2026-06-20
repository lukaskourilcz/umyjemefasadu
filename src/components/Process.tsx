import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";

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
    tag: "Horkou vodou",
    title: "Tlakové mytí horkou vodou",
    desc: "Fasádu umyjeme horkou vodou pod regulovaným tlakem. Tlak i teplotu pečlivě hlídáme a trysky volíme podle typu omítky tak, abychom povrch nepoškodili.",
  },
  {
    tag: "Bez horké vody",
    title: "Aktivní pěna a nástřik",
    desc: "U citlivějších omítek volíme šetrnou variantu: necháme působit přípravek na organické nečistoty (cca 30 minut) a poté nanášíme aktivní pěnu s vysokým obsahem tenzidů na prach, mastnotu a smog.",
  },
];

export default function Process() {
  return (
    <section
      id="postup"
      className="scroll-mt-24 py-20 md:py-28"
      style={{
        background: "linear-gradient(180deg, #eef6fd 0%, #e1f0fb 100%)",
      }}
    >
      <div className="container-page">
        <SectionHeading
          label="Jak čistíme fasádu"
          title="Krok za krokem"
          intro="Postup volíme podle typu a stavu fasády, od první aplikace přípravku až po závěrečnou ochranu."
        />

        <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.no}
              className="card fade-up flex flex-col items-start gap-4"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span
                className="font-fragment-mono inline-flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--color-moss-veil)",
                  color: "var(--color-forest-floor)",
                  fontSize: "15px",
                  letterSpacing: "0.02em",
                }}
              >
                {s.no}
              </span>
              <h3
                className="font-akkurat font-bold text-botanical-ink"
                style={TEXT.cardTitle}
              >
                {s.title}
              </h3>
              <p
                className="font-akkurat text-botanical-ink/75"
                style={TEXT.body}
              >
                {s.desc}
              </p>
            </li>
          ))}
        </ol>

        {/* Two approaches - chosen podle typu a stavu fasády */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {METHODS.map((m, i) => (
            <div
              key={m.title}
              className="card fade-up flex flex-col items-start gap-4"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="tag">{m.tag}</span>
              <h3
                className="font-akkurat font-bold text-botanical-ink"
                style={TEXT.cardTitle}
              >
                {m.title}
              </h3>
              <p
                className="font-akkurat text-botanical-ink/75"
                style={TEXT.body}
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
