import { CheckIcon } from "./icons";

/** Quiet trust row - proof reads professional when it whispers. */
const ITEMS = [
  "Pojištěno u Generali",
  "Ekologické přípravky",
  "Ochrana 5–10 let",
  "Prohlídka a nabídka zdarma",
];

export default function TrustStrip() {
  return (
    <section
      className="border-y"
      style={{
        borderColor: "var(--color-lichen)",
        backgroundColor: "var(--color-sage-mist)",
      }}
    >
      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-3 py-6 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 md:py-7">
        {ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-2.5">
            <CheckIcon size={16} color="var(--color-forest-floor)" />
            <span
              className="text-botanical-ink/80"
              style={{ fontSize: "15px" }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
