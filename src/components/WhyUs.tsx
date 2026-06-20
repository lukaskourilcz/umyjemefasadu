import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";
import { CheckIcon } from "./icons";

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
            label=""
            title="Špinavá fasáda nemusí znamenat novou omítku"
            intro="Jsme na trhu noví, ale za sebou máme roky zkušeností s čištěním fasád, střech i dlažby. Místo drahé rekonstrukce vrátíme povrchu čistotu a původní vzhled."
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
                <CheckIcon size={14} />
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
                  style={TEXT.bodyTight}
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
