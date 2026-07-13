import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";
import { useContent } from "../content";

export default function OrderProcess() {
  const { heading, intro, steps: STEPS } = useContent().orderProcess;
  return (
    <section className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading title={heading} intro={intro} />

        <ol className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 fade-up sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.no}>
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
