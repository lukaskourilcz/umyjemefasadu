import SectionHeading from "./SectionHeading";
import { useContent } from "../content";

/** The page's dark mid-section - grounds the pastel surfaces around it. */
export default function Process() {
  const { heading, intro, steps: STEPS, methods: METHODS } = useContent().process;
  return (
    <section
      id="postup"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-botanical-ink)" }}
    >
      <div className="container-page">
        <SectionHeading tone="dark" title={heading} intro={intro} />

        {/* Vertical timeline - mono numbers on a hairline rail. */}
        <ol className="mx-auto mt-14 flex max-w-[720px] flex-col fade-up">
          {STEPS.map((s, i) => (
            <li key={s.no} className="relative flex gap-6 md:gap-8">
              <div className="flex flex-col items-center">
                <span
                  className="font-fragment-mono pt-1"
                  style={{
                    color: "var(--color-forest-floor)",
                    fontSize: "15px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.no}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mt-3 w-px flex-1"
                    style={{ backgroundColor: "rgba(251,253,254,0.16)" }}
                  />
                )}
              </div>
              <div className={i < STEPS.length - 1 ? "pb-10" : ""}>
                <h3
                  className="text-cream-paper"
                  style={{ fontSize: "clamp(18px, 1vw + 14px, 20px)", fontWeight: 700 }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-cream-paper/70"
                  style={{ fontSize: "16px", lineHeight: 1.6 }}
                >
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Metody - s jedinou kartou drží mřížka střed (žádná prázdná půlka) */}
        <div
          className={`mx-auto mt-14 grid grid-cols-1 gap-5 fade-up ${
            METHODS.length > 1 ? "max-w-[900px] md:grid-cols-2" : "max-w-[560px]"
          }`}
        >
          {METHODS.map((m) => (
            <div
              key={m.title}
              className="flex flex-col items-start gap-4 rounded-[14px] border p-6 md:p-7"
              style={{
                backgroundColor: "rgba(251,253,254,0.06)",
                borderColor: "rgba(251,253,254,0.14)",
              }}
            >
              <h3
                className="text-cream-paper"
                style={{ fontSize: "clamp(18px, 1vw + 14px, 20px)", fontWeight: 700 }}
              >
                {m.title}
              </h3>
              <p
                className="text-cream-paper/70"
                style={{ fontSize: "16px", lineHeight: 1.6 }}
              >
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
