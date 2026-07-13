import SectionHeading from "./SectionHeading";
import { CheckIcon } from "./icons";
import { useContent } from "../content";
import { TEXT } from "../lib/text";

/**
 * „Proč si nechat vyčistit fasádu" — edukační/marketingová sekce nahoře na
 * stránce. Vysvětluje přínos čištění a ochranu proti vodě (impregnaci).
 */
export default function WhyClean() {
  const {
    heading,
    paragraphs,
    bullets,
    protectionTitle,
    protectionIntro,
    protectionBullets,
    protectionHow,
  } = useContent().whyClean;

  return (
    <section id="proc-cistit" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading title={heading} />

        <div className="mx-auto mt-8 max-w-[760px] fade-up">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-botanical-ink/80"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.7, marginTop: i === 0 ? 0 : 16 }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* Tři přínosy */}
        <ul className="mx-auto mt-10 grid max-w-[900px] grid-cols-1 gap-4 fade-up sm:grid-cols-3">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="rounded-[14px] border px-5 py-5 text-botanical-ink"
              style={{
                borderColor: "var(--color-eucalyptus)",
                backgroundColor: "var(--color-cream-paper)",
                fontSize: "15px",
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              {b}
            </li>
          ))}
        </ul>

        {/* Ochrana proti vodě */}
        <div
          className="mx-auto mt-8 max-w-[900px] rounded-[16px] border p-7 fade-up md:p-9"
          style={{
            borderColor: "var(--color-eucalyptus)",
            backgroundColor: "var(--color-sage-mist)",
          }}
        >
          <h3
            className="text-botanical-ink"
            style={{ fontSize: "clamp(20px, 2vw, 24px)", fontWeight: 700 }}
          >
            {protectionTitle}
          </h3>
          <p className="mt-3 max-w-[60ch] text-botanical-ink/80" style={TEXT.body}>
            {protectionIntro}
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {protectionBullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">
                  <CheckIcon size={16} color="var(--color-forest-floor)" />
                </span>
                <span className="text-botanical-ink/80" style={{ fontSize: "15px", lineHeight: 1.5 }}>
                  {b}
                </span>
              </li>
            ))}
          </ul>
          <p
            className="mt-5 border-t pt-4 text-botanical-ink/65"
            style={{ borderColor: "var(--color-eucalyptus)", fontSize: "14px", lineHeight: 1.6 }}
          >
            {protectionHow}
          </p>
        </div>
      </div>
    </section>
  );
}
