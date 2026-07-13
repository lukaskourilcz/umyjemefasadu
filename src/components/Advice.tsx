import SectionHeading from "./SectionHeading";
import { useContent } from "../content";

export default function Advice() {
  const { heading, intro, badge, articles: ARTICLES } = useContent().advice;
  return (
    <section
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sage-mist)" }}
    >
      <div className="container-page">
        <SectionHeading title={heading} intro={intro} />

        {/* Editorial columns - hairline rules instead of card chrome. */}
        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 fade-up md:grid-cols-3">
          {ARTICLES.map((a) => (
            <article
              key={a.no}
              className="flex flex-col gap-3 border-t pt-5"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="font-fragment-mono text-forest-floor"
                  style={{ fontSize: "14px", letterSpacing: "0.02em" }}
                >
                  {a.no}
                </span>
                <span className="micro-label text-botanical-ink/45">
                  {badge}
                </span>
              </div>
              <h3
                className="text-botanical-ink"
                style={{ fontSize: "19px", fontWeight: 700 }}
              >
                {a.title}
              </h3>
              <p
                className="text-botanical-ink/75"
                style={{ fontSize: "15px", lineHeight: 1.6 }}
              >
                {a.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
