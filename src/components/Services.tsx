import { useState } from "react";
import SectionHeading from "./SectionHeading";
import { useContent } from "../content";

const stroke = {
  fill: "none",
  stroke: "#101820",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TITLE_STYLE = { fontSize: "19px", fontWeight: 700 } as const;
const DESC_STYLE = { fontSize: "15px", lineHeight: 1.55 } as const;

/**
 * Draggable before/after reveal. Until real paired photos exist, the same
 * photo stands in for both states - the "before" side is dimmed (0.65 opacity
 * over ink) so the wipe is visible. Swap `before` for a real photo later.
 */
function BeforeAfterImage({ img, alt }: { img: string; alt: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[16/10] w-full select-none overflow-hidden">
      {/* AFTER - clean, full frame */}
      <img
        src={img}
        alt={alt}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* BEFORE - dimmed copy, revealed from the left via clip-path */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          backgroundColor: "var(--color-botanical-ink)",
        }}
      >
        <img
          src={img}
          alt=""
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.65 }}
        />
      </div>

      {/* Slider input - drives the reveal; pan-y keeps vertical page scroll
          working when the touch starts on the image. */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Porovnání před a po"
        className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
        style={{ touchAction: "pan-y" }}
      />

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div
          className="h-full w-0.5"
          style={{ backgroundColor: "var(--color-cream-paper)" }}
        />
      </div>
      <div
        className="pointer-events-none absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-forest-floor"
        style={{
          left: `${pos}%`,
          backgroundColor: "var(--color-cream-paper)",
          boxShadow: "var(--shadow-subtle)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M7 4 L3 9 L7 14 M11 4 L15 9 L11 14"
            fill="none"
            stroke="#1ba5e0"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/** Photo-led service card with the before/after reveal on top. */
function PhotoCard({
  img,
  alt,
  title,
  desc,
  className = "",
}: {
  img: string;
  alt: string;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[14px] border ${className}`}
      style={{
        borderColor: "var(--color-eucalyptus)",
        backgroundColor: "var(--color-cream-paper)",
      }}
    >
      <BeforeAfterImage img={img} alt={alt} />
      <div className="flex flex-col gap-1.5 p-5 md:p-6">
        <h3 className="text-botanical-ink" style={TITLE_STYLE}>
          {title}
        </h3>
        <p className="text-botanical-ink/75" style={DESC_STYLE}>
          {desc}
        </p>
      </div>
    </article>
  );
}

/** Compact tinted card for services without an authentic photo (yet). */
function TintCard({
  icon,
  title,
  desc,
  background,
}: {
  icon: JSX.Element;
  title: string;
  desc: string;
  background: string;
}) {
  return (
    <article
      className="flex flex-col justify-center gap-1.5 rounded-[14px] p-6 md:p-7"
      style={{ backgroundColor: background }}
    >
      {icon}
      <h3 className="mt-2 text-botanical-ink" style={TITLE_STYLE}>
        {title}
      </h3>
      <p className="text-botanical-ink/75" style={DESC_STYLE}>
        {desc}
      </p>
    </article>
  );
}

// Ikony dlaždicových karet zůstávají v kódu (nejsou editovatelné); text ano.
const TINT_ICONS: JSX.Element[] = [
  <svg width="32" height="32" viewBox="0 0 28 28">
    <rect x="4" y="4" width="8" height="8" rx="1.5" {...stroke} />
    <rect x="16" y="4" width="8" height="8" rx="1.5" {...stroke} />
    <rect x="4" y="16" width="8" height="8" rx="1.5" {...stroke} />
    <rect x="16" y="16" width="8" height="8" rx="1.5" {...stroke} />
  </svg>,
  <svg width="32" height="32" viewBox="0 0 28 28">
    <rect x="5" y="4" width="14" height="7" rx="1.5" {...stroke} />
    <path d="M19 7 H23 V12 H14 V11" {...stroke} />
    <path d="M14 12 V16 H12 V24 H16 V16 H14" {...stroke} />
  </svg>,
];
const TINT_BG = ["var(--color-moss-veil)", "var(--color-lichen)"];

export default function Services() {
  const { heading, intro, featured, tintCards, photoCards } =
    useContent().services;
  return (
    <section id="sluzby" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading title={heading} intro={intro} />

        {/* Bento - the flagship service is a full-bleed photo cell; two
            supporting services sit on tinted surfaces beside it, three more
            photo cells close the grid. No breakpoint leaves an orphan. */}
        <div className="mt-12 grid grid-cols-1 gap-4 fade-up sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {/* Featured */}
          <article
            className="relative min-h-[420px] overflow-hidden rounded-[14px] sm:col-span-2 sm:min-h-[460px] lg:row-span-2 lg:min-h-0"
          >
            <img
              src={featured.image}
              alt={featured.alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(16,24,32,0) 28%, rgba(16,24,32,0.5) 60%, rgba(16,24,32,0.9) 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-8 pb-9 md:p-11 md:pb-12">
              <h3
                className="text-cream-paper"
                style={{ fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 700 }}
              >
                {featured.title}
              </h3>
              <p
                className="max-w-[52ch] text-cream-paper/85"
                style={{ fontSize: "15px", lineHeight: 1.6 }}
              >
                {featured.desc}
              </p>
            </div>
          </article>

          {/* Right rail - tinted, icon-led */}
          {tintCards.map((card, i) => (
            <TintCard
              key={card.title || i}
              background={TINT_BG[i] ?? TINT_BG[0]}
              title={card.title}
              desc={card.desc}
              icon={TINT_ICONS[i] ?? TINT_ICONS[0]}
            />
          ))}

          {/* Bottom row - photo-led */}
          {photoCards.map((card, i) => (
            <PhotoCard
              key={card.title || i}
              img={card.image}
              alt={card.alt}
              title={card.title}
              desc={card.desc}
              className={
                i === photoCards.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
