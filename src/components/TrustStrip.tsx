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
          className="micro-label"
          style={{
            color: "var(--color-cream-paper)",
            opacity: 0.85,
            fontSize: "28px",
          }}
        >
          Proč nám klienti věří
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {ITEMS.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-full border-2 px-5 py-2.5"
              style={{ borderColor: "rgba(27,165,224,0.5)" }}
            >
              <CheckIcon size={18} color="var(--color-cream-paper)" />
              <span
                className="font-akkurat font-bold"
                style={{ fontSize: "16px", color: "var(--color-cream-paper)" }}
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
