import { CheckIcon } from "./icons";
import { useContent } from "../content";

/** Quiet trust row - proof reads professional when it whispers. */
export default function TrustStrip() {
  const ITEMS = useContent().trustStrip.items;
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
