import SectionHeading from "./SectionHeading";
import { useContent } from "../content";
import { TEXT } from "../lib/text";

/**
 * „Rizika znečištěné fasády" — navazuje na sekci „Proč čistit". Tři rizika
 * v editorial mřížce (mono čísla na vlasové lince, stejný jazyk jako Postup
 * a Objednávka) a tmavý závěr s doporučením a výzvou k akci.
 */
export default function Risks() {
  const { heading, intro, items, solutionTitle, solutionDesc, solutionCta } =
    useContent().risks;

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
        <SectionHeading title={heading} intro={intro} />

        <ol className="mx-auto mt-14 grid max-w-[1000px] grid-cols-1 gap-x-8 gap-y-10 fade-up md:grid-cols-3">
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
              <h3
                className="mt-4 font-bold text-botanical-ink"
                style={TEXT.cardTitle}
              >
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
          <a href="#kontakt" className="btn-primary justify-self-start md:justify-self-end">
            {solutionCta}
          </a>
        </div>
      </div>
    </section>
  );
}
