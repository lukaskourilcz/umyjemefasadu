import { CheckIcon } from "./icons";

/** Trust strip - a pink gradient banner (mirrors the blue stats banner). */
const ITEMS = [
  "Pojištěno u Generali",
  "Ekologické přípravky",
  "Ochrana 5 – 10 let",
  "Roky zkušeností",
];

export default function TrustStrip() {
  return (
    <section
      className="py-12 md:py-14"
      style={{
        background:
          "linear-gradient(120deg, var(--color-warm-loam), var(--color-magenta-deep))",
      }}
    >
      <div className="container-page flex flex-col items-center gap-7 text-center">
        <span
          className="micro-label whitespace-nowrap"
          style={{
            color: "var(--color-cream-paper)",
            opacity: 0.85,
            fontSize: "clamp(18px, 5vw, 28px)",
          }}
        >
          Proč nám klienti věří
        </span>
        {/* Mobile: tidy 2x2 grid with a divider between columns. From sm up:
            outlined pills in a centered row. */}
        <div className="relative grid w-full max-w-md grid-cols-2 gap-y-5 sm:flex sm:w-auto sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-3">
          {/* One continuous white divider between the two columns (mobile only) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 sm:hidden"
            style={{ backgroundColor: "var(--color-cream-paper)" }}
          />
          {ITEMS.map((item) => (
            <div
              key={item}
              className="flex items-center justify-center gap-2 px-4 py-1.5 sm:rounded-full sm:border-2 sm:px-5 sm:py-2.5"
              style={{ borderColor: "rgba(27,165,224,0.5)" }}
            >
              <CheckIcon size={18} color="var(--color-cream-paper)" />
              <span
                className="font-akkurat font-bold"
                style={{ fontSize: "15px", color: "var(--color-cream-paper)" }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
