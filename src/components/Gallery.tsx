import { useState } from "react";
import SectionHeading from "./SectionHeading";

/**
 * Before / after reference gallery - the single highest-impact trust element
 * for a cleaning business. Items are wired through a data array so real photos
 * drop straight in: replace `before`/`after` with image paths (e.g. files in
 * public/reference/) and the placeholder panels become <img> automatically.
 */
type Item = {
  label: string;
  before?: string; // e.g. "/reference/dum-1-pred.jpg"
  after?: string; // e.g. "/reference/dum-1-po.jpg"
};

// TODO: replace with real before/after photos once supplied by the client.
const ITEMS: Item[] = [
  { label: "Rodinný dům, fasáda" },
  { label: "Střecha, odstranění mechu" },
  { label: "Zámková dlažba, terasa" },
];

export default function Gallery() {
  return (
    <section
      id="galerie"
      className="scroll-mt-24 py-20 md:py-28"
      style={{
        background:
          "linear-gradient(180deg, var(--color-lichen) 0%, var(--color-cream-paper) 42%)",
      }}
    >
      <div className="container-page">
        <SectionHeading
          label=""
          title="Před čištěním a po něm"
          intro="Skutečné zakázky před čištěním a po něm. Posuvníkem porovnáte stav fasády, střechy i dlažby."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <article
              key={item.label}
              className="fade-up overflow-hidden rounded-[20px] border"
              style={{
                borderColor: "var(--color-eucalyptus)",
                transitionDelay: `${(i % 3) * 60}ms`,
              }}
            >
              <BeforeAfter item={item} />
              <p
                className="font-akkurat px-5 py-4 font-bold text-botanical-ink"
                style={{ fontSize: "15px", letterSpacing: "-0.04em" }}
              >
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ item }: { item: Item }) {
  const [pos, setPos] = useState(50);
  const hasPhotos = Boolean(item.before && item.after);

  return (
    <div className="relative aspect-[4/3] select-none">
      {/* AFTER (full) */}
      <Layer src={item.after} kind="after" show={hasPhotos} />
      {/* BEFORE - full-size, revealed from the left via clip-path (no distortion) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Layer src={item.before} kind="before" show={hasPhotos} />
      </div>

      {/* Divider handle */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="h-full w-0.5" style={{ backgroundColor: "var(--color-cream-paper)" }} />
        <div
          className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
          style={{ backgroundColor: "var(--color-cream-paper)", boxShadow: "var(--shadow-subtle)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M7 4 L3 9 L7 14 M11 4 L15 9 L11 14"
              fill="none"
              stroke="var(--color-forest-floor)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Slider input */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Porovnání před a po"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}

function Layer({
  src,
  kind,
  show,
}: {
  src?: string;
  kind: "before" | "after";
  show: boolean;
}) {
  if (show && src) {
    return (
      <img
        src={src}
        alt={kind === "before" ? "Před čištěním" : "Po čištění"}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    );
  }
  // Placeholder until real photos are supplied.
  const isBefore = kind === "before";
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundColor: isBefore ? "var(--color-eucalyptus)" : "var(--color-moss-veil)",
      }}
    >
      <span
        className="micro-label"
        style={{ color: "var(--color-botanical-ink)", opacity: 0.55 }}
      >
        {isBefore ? "Před" : "Po"}
      </span>
    </div>
  );
}
