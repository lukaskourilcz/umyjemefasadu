import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import pic1 from "../assets/pic1.webp";
import pic2 from "../assets/pic2.webp";
import pic3 from "../assets/pic3.webp";
import pic4 from "../assets/pic4.webp";
import pic5 from "../assets/pic5.webp";
import pic6 from "../assets/pic6.webp";
import pic7 from "../assets/pic7.webp";
import pic8 from "../assets/pic8.webp";
import pic9 from "../assets/pic9.webp";
import pic10 from "../assets/pic10.webp";

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

// TODO: nahraďte skutečnými zakázkami (objekt, rozsah, doba, postup, popis, fotky).
const STUDIES = [
  {
    type: "Bytový dům",
    city: "Brno",
    facts: [
      { icon: AreaIcon, label: "Rozsah", value: "1 250 m²" },
      { icon: ClockIcon, label: "Doba", value: "3 dny" },
      { icon: MethodIcon, label: "Postup", value: "horká voda" },
    ],
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Severní fasáda lorem ipsum plísně a řasy, sed do eiusmod tempor incididunt ut labore magna aliqua.",
    images: [
      { src: pic1, alt: "Mytí fasády bytového domu z montážní plošiny" },
      { src: pic4, alt: "Čištění fasády kloubovou plošinou" },
      { src: pic5, alt: "Umytá fasáda bytového domu" },
    ],
  },
  {
    type: "Rodinný dům",
    city: "Vyškov",
    facts: [
      { icon: AreaIcon, label: "Rozsah", value: "320 m²" },
      { icon: ClockIcon, label: "Doba", value: "1 den" },
      { icon: MethodIcon, label: "Postup", value: "aktivní pěna" },
    ],
    desc: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
    images: [
      { src: pic6, alt: "Čištění štítu rodinného domu z montážní plošiny" },
      { src: pic10, alt: "Ošetření fasády rodinného domu z plošiny" },
    ],
  },
  {
    type: "Řadový dům",
    city: "Blansko",
    facts: [
      { icon: AreaIcon, label: "Rozsah", value: "450 m²" },
      { icon: ClockIcon, label: "Doba", value: "2 dny" },
      { icon: MethodIcon, label: "Postup", value: "horká voda" },
    ],
    desc: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.",
    images: [
      { src: pic9, alt: "Práce z montážní plošiny u řadového domu" },
      { src: pic3, alt: "Náš tým při práci v ochranných pomůckách" },
    ],
  },
  {
    type: "Komerční objekt",
    city: "Hodonín",
    facts: [
      { icon: AreaIcon, label: "Rozsah", value: "780 m²" },
      { icon: ClockIcon, label: "Doba", value: "2 dny" },
      { icon: MethodIcon, label: "Postup", value: "graffiti" },
    ],
    desc: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi.",
    images: [
      { src: pic7, alt: "Odstraňování graffiti z podchodu" },
      { src: pic2, alt: "Probíhající čištění s informačním bannerem" },
      { src: pic8, alt: "Komerční objekt před čištěním fasády" },
    ],
  },
];

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
            key={img.src}
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
        {images.map((img, i) => (
          <button
            key={img.src}
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
  return (
    <section
      id="galerie"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-sage-mist)" }}
    >
      <div className="container-page">
        <SectionHeading
          title="Vybrané zakázky"
          intro="Konkrétní objekty, rozsah a postup - takhle vypadá naše práce v číslech i na fotkách."
        />

        <div className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-5 fade-up sm:grid-cols-2 md:gap-6">
          {STUDIES.map((s) => (
            <article
              key={`${s.type}-${s.city}`}
              className="flex flex-col overflow-hidden rounded-[14px] border"
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
                    key={f.label}
                    className={`flex min-w-0 flex-1 items-center gap-2 py-3.5 ${
                      i === 0 ? "pl-6 md:pl-7" : "border-l pl-4"
                    } pr-3`}
                    style={
                      i > 0 ? { borderColor: "var(--color-lichen)" } : undefined
                    }
                  >
                    <dt className="sr-only">{f.label}</dt>
                    <span aria-hidden="true" className="shrink-0">
                      {f.icon}
                    </span>
                    <dd
                      className="truncate text-botanical-ink/85"
                      style={{ fontSize: "14px", fontWeight: 500, margin: 0 }}
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
      </div>
    </section>
  );
}
