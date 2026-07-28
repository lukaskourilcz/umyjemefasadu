import { CheckIcon, RoofIcon, TilesIcon } from "./icons";
import { useContent } from "../content";
import { TEXT } from "../lib/text";
import MobileDisclosure from "./MobileDisclosure";

/**
 * Druhá půlka výkladu „Proč čistit": široká fotka výsledku, čištění střechy
 * a dlažby a pruh o ochraně proti vodě. Na stránce navazuje až za sekcí
 * Rizika, proto je to samostatná sekce a ne součást `WhyClean`.
 */

// Ikony podsekcí – střecha a dlažba (podle pořadí v obsahu).
const REASON_ICONS = [RoofIcon, TilesIcon];

export default function WhyCleanDetail() {
  const {
    reasonsHeading,
    reasons,
    protectionHeading,
    protectionTitle,
    protectionIntro,
    protectionBullets,
    protectionHow,
    protectionNanoIntro,
    protectionNanoLead,
    protectionNanoBullets,
    image,
    imageAlt,
    imageLabel,
  } = useContent().whyClean;

  return (
    <section id="cisteni-strechy-dlazby" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <figure
          className="relative m-0 overflow-hidden rounded-[14px] border fade-up"
          style={{ borderColor: "var(--color-eucalyptus)" }}
        >
          <img src={image} alt={imageAlt} loading="lazy" className="block h-auto w-full" />
          {/* Popisek je dvouřádkový na mobilu, proto přechod drží tmavý až do
              poloviny výšky a teprve pak vybledne. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-28"
            style={{
              background:
                "linear-gradient(0deg,rgba(16,24,32,.8) 0%,rgba(16,24,32,.64) 45%,rgba(16,24,32,0) 100%)",
            }}
          />
          <figcaption className="font-fragment-mono absolute inset-x-0 bottom-0 p-4 px-5 text-[11px] uppercase leading-[1.5] tracking-[.1em] text-cream-paper/90">
            {imageLabel}
          </figcaption>
        </figure>

        {/* Čištění střechy a dlažby – edukační bloky se stejnou stavbou jako
            výklad o fasádě: štítek s ikonou, otázka v nadpisu, výkladové
            odstavce a vedle nich panel s riziky.
            Ikony jsou v kódu, texty se editují v administraci. */}
        {reasons.length > 0 && (
          <div className="mt-16">
            <h3
              className="text-botanical-ink fade-up"
              style={{ fontSize: "clamp(22px, 2.2vw, 28px)", fontWeight: 700 }}
            >
              {reasonsHeading}
            </h3>

            <div className="mt-10 flex flex-col gap-12 md:gap-14">
              {reasons.map((r, i) => {
                const Icon = REASON_ICONS[i % REASON_ICONS.length];
                return (
                  <article
                    key={i}
                    className="grid grid-cols-1 items-start gap-8 border-t pt-9 fade-up lg:grid-cols-2 lg:gap-16"
                    style={{ borderColor: "var(--color-eucalyptus)" }}
                  >
                    <div>
                      <div className="flex items-center gap-3.5">
                        <span
                          aria-hidden="true"
                          className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px]"
                          style={{
                            backgroundColor: "var(--color-moss-veil)",
                            color: "var(--color-forest-floor)",
                          }}
                        >
                          <Icon size={26} />
                        </span>
                        <span
                          className="font-fragment-mono text-[11px] uppercase"
                          style={{ color: "var(--color-forest-floor)", letterSpacing: ".12em" }}
                        >
                          {r.title}
                        </span>
                      </div>

                      <h4
                        className="mt-5 max-w-[26ch] text-botanical-ink"
                        style={{
                          fontSize: "clamp(20px, 1.7vw, 24px)",
                          fontWeight: 700,
                          lineHeight: 1.25,
                        }}
                      >
                        {r.heading}
                      </h4>

                      <div className="mt-4 max-w-[58ch]">
                        {r.paragraphs.map((p, j) => (
                          <p
                            key={j}
                            className="text-botanical-ink/80"
                            style={{
                              fontSize: "var(--text-body)",
                              lineHeight: 1.7,
                              marginTop: j === 0 ? 0 : 14,
                            }}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Rizika – číslovaný seznam na vlasových linkách. Položky
                        bez popisu se vykreslí jako jednořádkové odrážky. */}
                    {r.risks.length > 0 && (
                      <div
                        className="rounded-[14px] border p-6 md:p-8"
                        style={{
                          borderColor: "var(--color-eucalyptus)",
                          backgroundColor: "var(--color-sage-mist)",
                        }}
                      >
                        <h5
                          className="text-botanical-ink"
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "17px",
                            fontWeight: 700,
                            lineHeight: 1.35,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {r.risksTitle}
                        </h5>
                        {r.risksIntro && (
                          <p
                            className="mt-2.5 text-botanical-ink/75"
                            style={{ fontSize: "15px", lineHeight: 1.6 }}
                          >
                            {r.risksIntro}
                          </p>
                        )}
                        <ul className="mt-5 flex flex-col">
                          {r.risks.map((it, j) => (
                            <li
                              key={j}
                              className="flex gap-4 border-t py-3.5 first:border-t-0 first:pt-0"
                              style={{ borderColor: "var(--color-eucalyptus)" }}
                            >
                              <span
                                className="font-fragment-mono shrink-0 pt-[3px] text-[12px]"
                                style={{ color: "var(--color-forest-floor)" }}
                              >
                                {String(j + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0">
                                <span
                                  className="block text-botanical-ink"
                                  style={{
                                    fontSize: "15.5px",
                                    fontWeight: 600,
                                    lineHeight: 1.45,
                                  }}
                                >
                                  {it.title}
                                </span>
                                {it.desc && (
                                  <p
                                    className="mt-1.5 text-botanical-ink/75"
                                    style={{ fontSize: "14.5px", lineHeight: 1.6 }}
                                  >
                                    {it.desc}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Nanoimpregnace – velký nadpis dělí sekci na čištění a ochranu. */}
        {protectionHeading && (
          <h3
            className="mt-16 text-botanical-ink fade-up"
            style={{ fontSize: "clamp(22px, 2.2vw, 28px)", fontWeight: 700 }}
          >
            {protectionHeading}
          </h3>
        )}

        {/* Ochrana proti vodě - klidný pruh se dvěma sloupci: vlevo vysvětlení,
            vpravo přínosy jako odškrtnutý seznam. */}
        <MobileDisclosure label="Jak chráníme fasádu proti vodě">
        <div
          className="mt-8 grid grid-cols-1 gap-8 rounded-[14px] border p-7 fade-up md:grid-cols-2 md:gap-12 md:p-10"
          style={{
            borderColor: "var(--color-eucalyptus)",
            backgroundColor: "var(--color-sage-mist)",
          }}
        >
          <div>
            {/* h4 – nadřazený nadpis pruhu je „Nanoimpregnace" nad kartou. */}
            <h4
              className="text-botanical-ink"
              style={{ fontSize: "clamp(20px, 2vw, 24px)", fontWeight: 700 }}
            >
              {protectionTitle}
            </h4>
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

          {/* Nanoimpregnace – co hydrofobní vrstva přináší navíc. Přes celou
              šířku pruhu, oddělená vlasovou linkou. */}
          {(protectionNanoIntro || protectionNanoBullets.length > 0) && (
            <div
              className="border-t pt-8 md:col-span-2 md:pt-9"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            >
              {protectionNanoIntro && (
                <p className="max-w-[80ch] text-botanical-ink/80" style={TEXT.body}>
                  {protectionNanoIntro}
                </p>
              )}
              {protectionNanoLead && (
                <p
                  className="mt-5 text-botanical-ink"
                  style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.5 }}
                >
                  {protectionNanoLead}
                </p>
              )}
              {protectionNanoBullets.length > 0 && (
                <ul className="mt-5 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
                  {protectionNanoBullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-1 shrink-0">
                        <CheckIcon size={16} color="var(--color-forest-floor)" />
                      </span>
                      <div className="min-w-0">
                        <span
                          className="block text-botanical-ink"
                          style={{ fontSize: "15px", fontWeight: 600, lineHeight: 1.45 }}
                        >
                          {b.title}
                        </span>
                        {b.desc && (
                          <p
                            className="mt-1 text-botanical-ink/75"
                            style={{ fontSize: "14.5px", lineHeight: 1.6 }}
                          >
                            {b.desc}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        </MobileDisclosure>
      </div>
    </section>
  );
}
