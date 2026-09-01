import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";
import { useContent } from "../content";

export default function OrderProcess() {
  const { heading, intro, steps: STEPS } = useContent().orderProcess;
  return (
    /* Brandově růžový pruh mezi ceníkem a FAQ drží rytmus střídání povrchů.
       Nadpisy zůstávají černé, ostatní text je bílý (viz --color-blush-fg). */
    <section
      className="surface-blush scroll-mt-24 border-y py-20 md:py-28"
      style={{
        backgroundColor: "var(--color-blush)",
        borderColor: "var(--color-blush-border)",
      }}
    >
      <div className="container-page">
        <SectionHeading tone="blush" title={heading} intro={intro} />

        <ol className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 fade-up sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.no}>
              <div className="flex items-center gap-3">
                <span
                  className="font-fragment-mono"
                  style={{
                    fontSize: "14px",
                    color: "var(--color-blush-fg)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.no}
                </span>
                <span
                  className="h-px flex-1"
                  style={{ backgroundColor: "var(--color-blush-rule)" }}
                />
              </div>
              <h3
                className="mt-4 font-bold text-botanical-ink"
                style={TEXT.cardTitle}
              >
                {s.title}
              </h3>
              <p
                className="mt-2"
                style={{ ...TEXT.bodyTight, color: "var(--color-blush-fg)" }}
              >
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
