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
          {/* Tichý odkaz místo dalšího magenta tlačítka - hlavní CTA drží
              horní lišta a sekce Proč my. Nad odkazem stojí kreslený domek
              s otevřenými stěnami: podtržené tlačítko tvoří jeho základy. */}
          <div className="justify-self-start md:justify-self-end">
            <svg
              viewBox="0 0 240 88"
              aria-hidden="true"
              className="block w-full text-cream-paper"
              style={{ maxWidth: 260 }}
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* střecha s přesahem a hřebenem */}
                <path d="M14 46 L120 8 L226 46" />
                {/* komín na pravém svahu střechy */}
                <path d="M176 28 V14 H192 V22" />
                {/* stěny - dole otevřené, dosedají na podtržení odkazu */}
                <path d="M34 42 V88 M206 42 V88" />
                {/* okno s křížem */}
                <path d="M100 54 H140 V80 M100 54 V80 M120 54 V80 M100 67 H140" />
                {/* jiskra čistoty vlevo */}
                <path d="M62 58 V70 M56 64 H68" opacity="0.7" />
              </g>
            </svg>
            <a
              href="#kontakt"
              className="group mt-1 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap font-bold text-cream-paper"
              style={{ fontSize: "15px" }}
            >
              <span className="underline decoration-1 underline-offset-8">
                {solutionCta}
              </span>
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
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
        </div>
      </div>
    </section>
  );
}
