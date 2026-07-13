import SectionHeading from "./SectionHeading";
import { useContent } from "../content";

/**
 * „Rizika znečištěné fasády" — navazuje na sekci „Proč čistit". Tři hlavní
 * rizika a závěrečné doporučení (pravidelná údržba).
 */
export default function Risks() {
  const { heading, intro, items, solutionTitle, solutionDesc } =
    useContent().risks;

  return (
    <section
      id="rizika"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sage-mist)" }}
    >
      <div className="container-page">
        <SectionHeading title={heading} intro={intro} />

        <ol className="mx-auto mt-14 grid max-w-[1000px] grid-cols-1 gap-5 fade-up md:grid-cols-3">
          {items.map((r) => (
            <li
              key={r.no}
              className="flex flex-col rounded-[14px] border p-6 md:p-7"
              style={{
                borderColor: "var(--color-eucalyptus)",
                backgroundColor: "var(--color-cream-paper)",
              }}
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-full"
                style={{
                  backgroundColor: "var(--color-botanical-ink)",
                  color: "var(--color-cream-paper)",
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                {r.no}
              </span>
              <h3
                className="mt-4 text-botanical-ink"
                style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.25 }}
              >
                {r.title}
              </h3>
              <p
                className="mt-2 text-botanical-ink/75"
                style={{ fontSize: "15px", lineHeight: 1.6 }}
              >
                {r.desc}
              </p>
            </li>
          ))}
        </ol>

        {/* Řešení */}
        <div
          className="mx-auto mt-8 flex max-w-[1000px] flex-col gap-3 rounded-[16px] p-7 fade-up md:flex-row md:items-center md:gap-8 md:p-9"
          style={{ backgroundColor: "var(--color-botanical-ink)" }}
        >
          <h3
            className="shrink-0 text-cream-paper"
            style={{
              fontSize: "clamp(20px, 2.2vw, 26px)",
              fontWeight: 700,
              maxWidth: "16ch",
            }}
          >
            {solutionTitle}
          </h3>
          <p
            className="text-cream-paper/75"
            style={{ fontSize: "15px", lineHeight: 1.65 }}
          >
            {solutionDesc}
          </p>
        </div>
      </div>
    </section>
  );
}
