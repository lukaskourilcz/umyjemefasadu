import { useEffect, useRef } from "react";
import SectionHeading from "./SectionHeading";
import { useContent } from "../content";
import MobileDisclosure from "./MobileDisclosure";
import { UI } from "../i18n";

const stroke = {
  fill: "none",
  stroke: "#101820",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const TITLE_STYLE = { fontSize: "19px", fontWeight: 700 } as const;
const DESC_STYLE = { fontSize: "15px", lineHeight: 1.55 } as const;

/** Photo-led service card with a single illustrative photo (no slider). */
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
      className={`card-hover flex flex-col overflow-hidden rounded-[14px] border ${className}`}
      style={{
        borderColor: "var(--color-eucalyptus)",
        backgroundColor: "var(--color-cream-paper)",
      }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={img}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
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
  const featuredVideo = featured.video;
  const featuredVideoAlt = featured.videoAlt;
  const featuredVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = featuredVideoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [featuredVideo]);

  return (
    <section id="sluzby" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading label={UI.labelServices} title={heading} intro={intro} />

        {/* Bento - řádek 1: velká featured karta + jedna menší vedle;
            řádek 2: tři stejné foto karty. No breakpoint leaves an orphan. */}
        <MobileDisclosure label={UI.labelServices}>
        <div className="mt-8 grid grid-cols-1 gap-4 fade-up sm:mt-12 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {/* Featured */}
          <article
            className="relative min-h-[420px] overflow-hidden rounded-[14px] sm:col-span-2 sm:min-h-[460px] lg:min-h-0"
          >
            <video
              ref={featuredVideoRef}
              src={featuredVideo}
              poster={featured.image}
              aria-label={featuredVideoAlt}
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover object-center"
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
              className={i === photoCards.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}
            />
          ))}
        </div>
        </MobileDisclosure>
      </div>
    </section>
  );
}
