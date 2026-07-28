import SectionHeading from "./SectionHeading";
import { DropletIcon, LeafIcon, HouseIcon } from "./icons";
import { useContent } from "../content";

/**
 * „Proč si nechat vyčistit fasádu" — edukační/marketingová sekce nahoře na
 * stránce. Editorial dvousloupec: vlevo příběh, vpravo tři přínosy jako
 * seznam s vlasovými linkami a kreslenými ikonami (žádné kartičkové chrome).
 *
 * Zbytek výkladu (fotka výsledku, střecha a dlažba, ochrana proti vodě) je
 * v `WhyCleanDetail` — mezi obojím na stránce leží sekce Rizika.
 */

// Ikony přínosů zůstávají v kódu a přiřazují se podle pořadí; texty jsou
// editovatelné v administraci.
const BULLET_ICONS = [DropletIcon, LeafIcon, HouseIcon];

export default function WhyClean() {
  const { heading, paragraphs, bullets } = useContent().whyClean;

  return (
    <section id="proc-cistit" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading align="left" title={heading} />
            <div className="mt-7 max-w-[58ch] fade-up">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-botanical-ink/80"
                  style={{
                    fontSize: "var(--text-body)",
                    lineHeight: 1.7,
                    marginTop: i === 0 ? 0 : 16,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Tři přínosy - vlasové linky a kreslené ikony, stejný jazyk jako
              seznam v sekci „Proč my". */}
          <ul
            className="flex flex-col border-t fade-up lg:mt-3"
            style={{ borderColor: "var(--color-eucalyptus)" }}
          >
            {bullets.map((b, i) => {
              const Icon = BULLET_ICONS[i % BULLET_ICONS.length];
              return (
                <li
                  key={i}
                  className="flex items-center gap-5 border-b py-6"
                  style={{ borderColor: "var(--color-eucalyptus)" }}
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0"
                    style={{ color: "var(--color-forest-floor)" }}
                  >
                    <Icon size={26} />
                  </span>
                  <span
                    className="text-botanical-ink"
                    style={{ fontSize: "17px", fontWeight: 600, lineHeight: 1.45 }}
                  >
                    {b}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
