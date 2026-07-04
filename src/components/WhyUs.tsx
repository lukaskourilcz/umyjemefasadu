import SectionHeading from "./SectionHeading";
import QuoteRotator from "./QuoteRotator";
import { TEXT } from "../lib/text";

const POINTS = [
  {
    title: "Šetrné a ekologické přípravky",
    desc: "Používáme ekologické a bezpečné přípravky, ohleduplné k okolí i k povrchu budovy.",
  },
  {
    title: "Ochrana na dlouhé roky",
    desc: "Po umytí fasádu chráníme před budoucím znečištěním. Díky nanoimpregnaci účinek vydrží podle podmínek zhruba 5–10 let.",
  },
  {
    title: "Pojištěni u Generali",
    desc: "Jsme pojištěni, takže váš majetek je při práci v bezpečí a za výsledek neseme plnou odpovědnost.",
  },
  {
    title: "Férový a osobní přístup",
    desc: "Malý tým, který si za svou prací stojí. Řekneme vám rovnou, co má smysl a co ne.",
  },
];

export default function WhyUs() {
  return (
    <section id="proc-my" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            align="left"
            title="Špinavá fasáda nemusí znamenat novou omítku"
            intro="Jsme na trhu noví, ale za sebou máme roky zkušeností s čištěním fasád, střech i dlažby. Místo drahé rekonstrukce vrátíme povrchu čistotu a původní vzhled."
          />
          <a href="#kontakt" className="btn-primary mt-8 fade-up">
            Domluvit prohlídku zdarma
          </a>

          {/* Written guarantee, certificate-style. TODO: potvrďte skutečnou délku záruky. */}
          <div
            className="mt-12 flex w-fit overflow-hidden rounded-[14px] border fade-up"
            style={{ borderColor: "var(--color-eucalyptus)" }}
          >
            <div
              className="flex flex-col items-center justify-center px-6 py-5"
              style={{ backgroundColor: "var(--color-botanical-ink)" }}
            >
              <span
                className="text-cream-paper"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "34px",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                24
              </span>
              <span
                className="font-fragment-mono mt-1 uppercase text-cream-paper/60"
                style={{ fontSize: "10px", letterSpacing: "0.12em" }}
              >
                měsíců
              </span>
            </div>

            {/* Perforated coupon edge */}
            <div
              aria-hidden="true"
              className="border-l border-dashed"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            />

            <div className="flex flex-col justify-center gap-1 px-6 py-5">
              <span
                className="flex items-center gap-2 text-botanical-ink"
                style={{ fontSize: "15px", fontWeight: 700 }}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M10 2 L16.5 4.5 V9.5 C 16.5 13.5, 13.8 16.5, 10 18 C 6.2 16.5, 3.5 13.5, 3.5 9.5 V4.5 Z"
                    fill="none"
                    stroke="var(--color-forest-floor)"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 9.8 L9.2 12 L13.2 8"
                    fill="none"
                    stroke="var(--color-forest-floor)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Písemná záruka
              </span>
              <p
                className="max-w-[24ch] text-botanical-ink/65"
                style={{ fontSize: "14px", lineHeight: 1.5, margin: 0 }}
              >
                Na všechny provedené práce, černé na bílém.
              </p>
            </div>
          </div>

          {/* Rotating social proof - pinned with the sticky column, so it
              keeps cycling while the reader scans the list. */}
          <QuoteRotator />
        </div>

        {/* Editorial list - hairline dividers instead of card chrome. */}
        <ul
          className="flex flex-col border-t fade-up"
          style={{ borderColor: "var(--color-eucalyptus)" }}
        >
          {POINTS.map((p) => (
            <li
              key={p.title}
              className="border-b py-6"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            >
              <h3 className="font-bold text-botanical-ink" style={TEXT.cardTitle}>
                {p.title}
              </h3>
              <p className="mt-2 max-w-[52ch] text-botanical-ink/75" style={TEXT.bodyTight}>
                {p.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
