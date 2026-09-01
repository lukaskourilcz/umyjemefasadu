import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useContent } from "../content";
import MobileDisclosure from "./MobileDisclosure";
import { UI } from "../i18n";

type StudyImage = { src: string; alt: string };

const iconStroke = {
  fill: "none",
  stroke: "var(--color-forest-floor)",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const pinStroke = { ...iconStroke, stroke: "rgba(251,253,254,0.85)" };

const PinIcon = (
  <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 18 C 6 13.5, 3.5 10.5, 3.5 7.8 a6.5 6.5 0 0 1 13 0 C 16.5 10.5, 14 13.5, 10 18 Z" {...pinStroke} />
    <circle cx="10" cy="7.8" r="2.2" {...pinStroke} />
  </svg>
);

const AreaIcon = (
  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
    <rect x="3" y="3" width="14" height="14" rx="1.5" {...iconStroke} />
    <path d="M7 13 L13 7 M13 10.5 V7 H9.5" {...iconStroke} />
  </svg>
);

const ClockIcon = (
  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="7" {...iconStroke} />
    <path d="M10 6.5 V10 L12.5 12" {...iconStroke} />
  </svg>
);

const MethodIcon = (
  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 3 C 6.8 7, 5.5 9.3, 5.5 11.2 a4.5 4.5 0 0 0 9 0 C 14.5 9.3, 13.2 7, 10 3 Z" {...iconStroke} />
    <path d="M8.3 11.5 a1.8 1.8 0 0 0 1.8 1.8" {...iconStroke} />
  </svg>
);

// Ikony k údajům zakázky zůstávají v kódu, přiřazují se podle popisku faktu
// (klíčová slova jsou pro každý jazyk v src/i18n.ts).
function factIcon(label: string) {
  const l = label.toLowerCase();
  if (UI.factArea.some((k) => l.includes(k))) return AreaIcon;
  if (UI.factDuration.some((k) => l.includes(k))) return ClockIcon;
  return MethodIcon;
}

const SLIDE_MS = 7000;

/**
 * Auto-advancing photo stack with the job title composed onto the photo -
 * story-style progress segments along the top, city + object type over the
 * bottom scrim. Under reduced-motion nothing auto-plays; segments become
 * static markers.
 */
function StudyCarousel({
  images,
  city,
  type,
}: {
  images: StudyImage[];
  city: string;
  type: string;
}) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  // One timeout per slide (also resets cleanly after a manual jump).
  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % images.length),
      SLIDE_MS,
    );
    return () => clearTimeout(id);
  }, [index, reduced, images.length]);

  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      {images.map((img, i) => {
        const active = i === index;
        return (
          <img
            key={i}
            src={img.src}
            alt={active ? img.alt : ""}
            aria-hidden={!active}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: active ? 1 : 0,
              transform: active && !reduced ? "scale(1.07)" : "scale(1)",
              transition: reduced
                ? "opacity 300ms ease"
                : `opacity 700ms ease, transform ${SLIDE_MS + 700}ms linear`,
            }}
          />
        );
      })}

      {/* Scrims: light at the top for the segments, firm at the bottom for
          the title. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-14"
        style={{
          background:
            "linear-gradient(180deg, rgba(16,24,32,0.35) 0%, rgba(16,24,32,0) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{
          background:
            "linear-gradient(0deg, rgba(16,24,32,0.72) 0%, rgba(16,24,32,0) 100%)",
        }}
      />

      {/* Progress segments - tap/click to jump */}
      <div className="absolute inset-x-5 top-1 flex gap-1.5">
        {images.map((_img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Fotka ${i + 1} z ${images.length}`}
            aria-current={i === index}
            className="flex-1 cursor-pointer py-2"
          >
            <span
              className="block h-[3px] overflow-hidden rounded-full"
              style={{ backgroundColor: "rgba(251,253,254,0.45)" }}
            >
              {i === index && (
                <span
                  key={index}
                  className="progress-fill block h-full w-full rounded-full"
                  style={{
                    backgroundColor: "var(--color-cream-paper)",
                    animationDuration: `${SLIDE_MS}ms`,
                  }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Title, composed onto the photo */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-6 pb-5 md:p-7 md:pb-6">
        <span className="flex items-center gap-1.5">
          {PinIcon}
          <span
            className="font-fragment-mono uppercase"
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              color: "rgba(251,253,254,0.85)",
            }}
          >
            {city}
          </span>
        </span>
        <h3
          className="mt-1 text-cream-paper"
          style={{
            fontSize: "clamp(20px, 1.8vw, 24px)",
            fontWeight: 700,
            lineHeight: 1.1,
            textShadow: "0 1px 12px rgba(16,24,32,0.35)",
          }}
        >
          {type}
        </h3>
      </div>
    </div>
  );
}

export default function References() {
  const { heading, intro, studies: STUDIES } = useContent().references;
  return (
    <section
      id="galerie"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sage-mist)" }}
    >
      <div className="container-page">
        <SectionHeading label={UI.labelReferences} title={heading} intro={intro} />

        <MobileDisclosure label={UI.labelReferences}>
        <div className="mx-auto mt-8 grid max-w-[1080px] grid-cols-1 gap-5 fade-up sm:mt-14 sm:grid-cols-2 md:gap-6">
          {STUDIES.map((s, si) => (
            <article
              key={`${s.type}-${s.city}-${si}`}
              className="card-hover flex flex-col overflow-hidden rounded-[14px] border"
              style={{
                borderColor: "var(--color-eucalyptus)",
                backgroundColor: "var(--color-cream-paper)",
              }}
            >
              <StudyCarousel images={s.images} city={s.city} type={s.type} />

              {/* Spec strip - one compact line of job facts */}
              <dl
                className="flex items-center border-b"
                style={{ borderColor: "var(--color-lichen)", margin: 0 }}
              >
                {s.facts.map((f, i) => (
                  <div
                    key={`${f.label}-${i}`}
                    className={`flex items-center gap-2 py-3 ${
                      i === 0
                        ? "shrink-0 pl-6 md:pl-7"
                        : "min-w-0 flex-1 border-l pl-4"
                    } pr-4`}
                    style={
                      i > 0 ? { borderColor: "var(--color-lichen)" } : undefined
                    }
                  >
                    <dt className="sr-only">{f.label}</dt>
                    <span aria-hidden="true" className="shrink-0">
                      {factIcon(f.label)}
                    </span>
                    {/* Delší údaje se zalomí na dva řádky místo „…" */}
                    <dd
                      className="text-botanical-ink/85"
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        margin: 0,
                        lineHeight: 1.35,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p
                className="px-6 pb-6 pt-4 text-botanical-ink/70 md:px-7"
                style={{ fontSize: "15px", lineHeight: 1.65, margin: 0 }}
              >
                {s.desc}
              </p>
            </article>
          ))}
        </div>
        </MobileDisclosure>
      </div>
    </section>
  );
}
