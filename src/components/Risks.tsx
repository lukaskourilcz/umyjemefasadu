import SectionHeading from "./SectionHeading";
import { useContent } from "../content";
import { TEXT } from "../lib/text";
import MobileDisclosure from "./MobileDisclosure";

/**
 * „Rizika znečištěné fasády" — navazuje na sekci „Proč čistit". Tři rizika
 * v editorial mřížce (mono čísla na vlasové lince, stejný jazyk jako Postup
 * a Objednávka) a tmavý závěr s doporučením a výzvou k akci.
 */
export default function Risks() {
  const { heading, intro, items, solutionTitle, solutionDesc, solutionCta } = useContent().risks;

  return (
    <section
      id="rizika"
      className="scroll-mt-24 border-y py-20 md:py-28"
      style={{
        backgroundColor: "var(--color-sage-mist)",
        borderColor: "var(--color-lichen)",
      }}
    >
      <div className="container-page">
        <SectionHeading label="Rizika" title={heading} intro={intro} />

        <MobileDisclosure label="Zobrazit rizika a doporučené řešení">
          <ol className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 gap-x-8 gap-y-10 fade-up md:mt-14 md:grid-cols-3">
            {items.map((r) => (
              <li key={r.no}>
                <div className="flex items-center gap-3">
                  <span
                    className="font-fragment-mono"
                    style={{
                      fontSize: "14px",
                      color: "var(--color-forest-floor)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {r.no}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1"
                    style={{ backgroundColor: "var(--color-eucalyptus)" }}
                  />
                </div>
                <h3 className="mt-4 font-bold text-botanical-ink" style={TEXT.cardTitle}>
                  {r.title}
                </h3>
                <p className="mt-2 text-botanical-ink/75" style={TEXT.bodyTight}>
                  {r.desc}
                </p>
              </li>
            ))}
          </ol>

          {/* Doporučení - tmavý závěr sekce s výzvou k akci. */}
          <div
            className="mx-auto mt-14 grid max-w-[1000px] grid-cols-1 gap-6 rounded-[14px] p-8 fade-up md:grid-cols-[1fr_auto] md:items-center md:gap-10 md:p-10"
            style={{ backgroundColor: "var(--color-botanical-ink)" }}
          >
            <div>
              <h3
                className="text-cream-paper"
                style={{ fontSize: "clamp(20px, 2.2vw, 26px)", fontWeight: 700 }}
              >
                {solutionTitle}
              </h3>
              <p
                className="mt-3 max-w-[62ch] text-cream-paper/75"
                style={{ fontSize: "15px", lineHeight: 1.65 }}
              >
                {solutionDesc}
              </p>
            </div>
            <a
              href="#kontakt"
              className="group flex min-w-[250px] items-center gap-4 rounded-[12px] border px-5 py-4 text-cream-paper transition-colors hover:bg-cream-paper/[.06] md:justify-self-end"
              style={{ borderColor: "rgba(27,165,224,.42)" }}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-forest-floor/15 text-forest-floor">
                <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M5 19 V10 L12 4.5 L19 10 V19"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 19 V14 H15 V19 M4 19 H20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-fragment-mono text-[10px] uppercase tracking-[.12em] text-forest-floor">
                  Posouzení objektu
                </span>
                <span className="mt-1 whitespace-nowrap text-[15px] font-bold">{solutionCta}</span>
              </span>
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                aria-hidden="true"
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  d="M1 7 H16 M11 2 L16 7 L11 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </MobileDisclosure>
      </div>
    </section>
  );
}
