import SectionHeading from "./SectionHeading";
import { CheckIcon, DropletIcon, LeafIcon, HouseIcon } from "./icons";
import { useContent } from "../content";
import { TEXT } from "../lib/text";
import MobileDisclosure from "./MobileDisclosure";

/**
 * „Proč si nechat vyčistit fasádu" — edukační/marketingová sekce nahoře na
 * stránce. Editorial dvousloupec: vlevo příběh, vpravo tři přínosy jako
 * seznam s vlasovými linkami a kreslenými ikonami (žádné kartičkové chrome).
 */

// Ikony přínosů zůstávají v kódu a přiřazují se podle pořadí; texty jsou
// editovatelné v administraci.
const BULLET_ICONS = [DropletIcon, LeafIcon, HouseIcon];

export default function WhyClean() {
  const {
    heading,
    paragraphs,
    bullets,
    protectionTitle,
    protectionIntro,
    protectionBullets,
    protectionHow,
    image,
    imageAlt,
    imageLabel,
  } = useContent().whyClean;

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

          <figure className="relative m-0 mt-2 aspect-[21/9] overflow-hidden rounded-[14px] border fade-up lg:col-span-2" style={{ borderColor: "var(--color-eucalyptus)" }}>
            <img src={image} alt={imageAlt} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20" style={{ background: "linear-gradient(0deg,rgba(16,24,32,.62),rgba(16,24,32,0))" }} />
            <figcaption className="font-fragment-mono absolute inset-x-0 bottom-0 p-4 px-5 text-[11px] uppercase tracking-[.1em] text-cream-paper/90">{imageLabel}</figcaption>
          </figure>
        </div>

        {/* Ochrana proti vodě - klidný pruh se dvěma sloupci: vlevo vysvětlení,
            vpravo přínosy jako odškrtnutý seznam. */}
        <MobileDisclosure label="Jak chráníme fasádu proti vodě">
        <div
          className="mt-16 grid grid-cols-1 gap-8 rounded-[14px] border p-7 fade-up md:grid-cols-2 md:gap-12 md:p-10"
          style={{
            borderColor: "var(--color-eucalyptus)",
            backgroundColor: "var(--color-sage-mist)",
          }}
        >
          <div>
            <h3
              className="text-botanical-ink"
              style={{ fontSize: "clamp(20px, 2vw, 24px)", fontWeight: 700 }}
            >
              {protectionTitle}
            </h3>
            <p className="mt-3 max-w-[52ch] text-botanical-ink/80" style={TEXT.body}>
              {protectionIntro}
            </p>
            <p
              className="mt-5 max-w-[52ch] text-botanical-ink/65"
              style={{ fontSize: "14px", lineHeight: 1.6 }}
            >
              {protectionHow}
            </p>
          </div>
          <ul className="flex flex-col justify-center gap-3.5 md:border-l md:pl-10"
            style={{ borderColor: "var(--color-eucalyptus)" }}
          >
            {protectionBullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1 shrink-0">
                  <CheckIcon size={16} color="var(--color-forest-floor)" />
                </span>
                <span
                  className="text-botanical-ink/85"
                  style={{ fontSize: "15px", lineHeight: 1.55 }}
                >
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>
        </MobileDisclosure>
      </div>
    </section>
  );
}
