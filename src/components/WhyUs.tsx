import SectionHeading from "./SectionHeading";
import QuoteRotator from "./QuoteRotator";
import { TEXT } from "../lib/text";
import { useContent } from "../content";

export default function WhyUs() {
  const {
    heading,
    intro,
    guaranteeNumber,
    guaranteeUnit,
    guaranteeTitle,
    guaranteeDesc,
    points: POINTS,
  } = useContent().whyUs;
  return (
    <section id="proc-my" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <SectionHeading align="left" title={heading} intro={intro} />

          {/* Written guarantee, certificate-style. */}
          <div
            /* max-w-full: na úzkém displeji se „certifikát" smrskne a text
               se zalomí, místo aby vytlačil stránku do strany. */
            className="mx-auto mt-12 flex w-fit max-w-full overflow-hidden rounded-[18px] border fade-up"
            style={{ borderColor: "var(--color-eucalyptus)" }}
          >
            <div
              className="flex flex-col items-center justify-center px-9 py-8"
              style={{ backgroundColor: "var(--color-botanical-ink)" }}
            >
              <span
                className="text-cream-paper"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "50px",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {guaranteeNumber}
              </span>
              <span
                className="font-fragment-mono mt-1.5 uppercase text-cream-paper/60"
                style={{ fontSize: "13px", letterSpacing: "0.12em" }}
              >
                {guaranteeUnit}
              </span>
            </div>

            {/* Perforated coupon edge */}
            <div
              aria-hidden="true"
              className="border-l border-dashed"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            />

            <div className="flex flex-col justify-center gap-1.5 px-9 py-8">
              <span
                className="flex items-center gap-2.5 text-botanical-ink"
                style={{ fontSize: "20px", fontWeight: 700 }}
              >
                <svg width="24" height="24" viewBox="0 0 20 20" aria-hidden="true">
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
                {guaranteeTitle}
              </span>
              <p
                className="max-w-[24ch] text-botanical-ink/65"
                style={{ fontSize: "17px", lineHeight: 1.5, margin: 0 }}
              >
                {guaranteeDesc}
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
