import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";
import { useContent } from "../content";

export default function Faq() {
  const { heading, items: FAQ } = useContent().faq;
  return (
    <section className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading label="FAQ" title={heading} />

        {/* Divider list - the calmest section on the page. */}
        <div
          className="mx-auto mt-12 flex max-w-[820px] flex-col border-t fade-up"
          style={{ borderColor: "var(--color-eucalyptus)" }}
        >
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group border-b"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6">
                <span
                  className="font-bold text-botanical-ink"
                  style={{ fontSize: "18px", fontFamily: "var(--font-display)" }}
                >
                  {item.q}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 group-open:rotate-45"
                >
                  <path
                    d="M7 2 V12 M2 7 H12"
                    stroke="#101820"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </summary>
              <div className="pb-6 pr-8">
                <p className="text-botanical-ink/75" style={TEXT.body}>
                  {item.a}
                </p>
                {item.cta && (
                  <a href={item.cta.href} className="btn-primary mt-5">
                    {item.cta.label}
                  </a>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
