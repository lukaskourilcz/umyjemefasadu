import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";
import { useContent } from "../content";

export default function OrderProcess() {
  const { heading, intro, steps: STEPS } = useContent().orderProcess;
  return (
    // Mist band mezi ceníkem a FAQ - drží rytmus střídání povrchů stránky.
    <section
      className="scroll-mt-24 border-y py-20 md:py-28"
      style={{
        backgroundColor: "var(--color-sage-mist)",
        borderColor: "var(--color-lichen)",
      }}
    >
      <div className="container-page">
        <SectionHeading title={heading} intro={intro} />
        <p className="mt-6 text-sm font-semibold text-text-muted sm:hidden">
          Posunutím do strany projdete všechny kroky.
        </p>

        <ol className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 fade-up sm:mt-14 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.no} className="w-[78vw] max-w-[310px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink">
              <div className="flex items-center gap-3">
                <span
                  className="font-fragment-mono"
                  style={{
                    fontSize: "14px",
                    color: "var(--color-forest-floor)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.no}
                </span>
                <span
                  className="h-px flex-1"
                  style={{ backgroundColor: "var(--color-eucalyptus)" }}
                />
              </div>
              <h3
                className="mt-4 font-bold text-botanical-ink"
                style={TEXT.cardTitle}
              >
                {s.title}
              </h3>
              <p className="mt-2 text-botanical-ink/75" style={TEXT.bodyTight}>
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
