import { useEffect, useRef } from "react";
import SectionHeading from "./SectionHeading";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useContent } from "../content";

/** The page's dark mid-section - grounds the pastel surfaces around it. */
export default function Process() {
  const {
    heading,
    intro,
    steps: STEPS,
    methods: METHODS,
    video,
    videoAlt,
    videoLabel,
  } = useContent().process;
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  // Klip hraje jen na obrazovce (a nikdy pod reduced-motion) — stejný
  // přístup jako dlaždice v Hero a v pásu „Přímo z akce".
  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, video]);

  return (
    <section
      id="postup"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-botanical-ink)" }}
    >
      <div className="container-page">
        <SectionHeading tone="dark" title={heading} intro={intro} />

        {/* Vertical timeline - mono numbers on a hairline rail. */}
        <ol className="mx-auto mt-14 flex max-w-[720px] flex-col fade-up">
          {STEPS.map((s, i) => (
            <li key={s.no} className="relative flex gap-6 md:gap-8">
              <div className="flex flex-col items-center">
                <span
                  className="font-fragment-mono pt-1"
                  style={{
                    color: "var(--color-forest-floor)",
                    fontSize: "15px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.no}
                </span>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="mt-3 w-px flex-1"
                    style={{ backgroundColor: "rgba(251,253,254,0.16)" }}
                  />
                )}
              </div>
              <div className={i < STEPS.length - 1 ? "pb-10" : ""}>
                <h3
                  className="text-cream-paper"
                  style={{ fontSize: "clamp(18px, 1vw + 14px, 20px)", fontWeight: 700 }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-cream-paper/70"
                  style={{ fontSize: "16px", lineHeight: 1.6 }}
                >
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Široký klip - postup v praxi. Horizontální formát vyvažuje
            svislou časovou osu; bez souboru se blok nevykreslí. */}
        {video && (
          <figure
            className="relative m-0 mx-auto mt-14 aspect-video w-full max-w-[900px] overflow-hidden rounded-[14px] border fade-up"
            style={{ borderColor: "rgba(251,253,254,0.14)" }}
          >
            <video
              ref={videoRef}
              src={video}
              aria-label={videoAlt}
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{
                background:
                  "linear-gradient(0deg, rgba(16,24,32,0.62) 0%, rgba(16,24,32,0) 100%)",
              }}
            />
            <figcaption
              className="font-fragment-mono absolute inset-x-0 bottom-0 flex items-center gap-2 p-5 uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                color: "rgba(251,253,254,0.92)",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M1.5 1 L9 5 L1.5 9 Z" fill="currentColor" />
              </svg>
              {videoLabel}
            </figcaption>
          </figure>
        )}

        {/* Metody - volitelné doplňkové karty; bez položek se blok nevykreslí. */}
        {METHODS.length > 0 && (
          <div
            className={`mx-auto mt-14 grid grid-cols-1 gap-5 fade-up ${
              METHODS.length > 1 ? "max-w-[900px] md:grid-cols-2" : "max-w-[560px]"
            }`}
          >
            {METHODS.map((m) => (
              <div
                key={m.title}
                className="flex flex-col items-start gap-4 rounded-[14px] border p-6 md:p-7"
                style={{
                  backgroundColor: "rgba(251,253,254,0.06)",
                  borderColor: "rgba(251,253,254,0.14)",
                }}
              >
                <h3
                  className="text-cream-paper"
                  style={{ fontSize: "clamp(18px, 1vw + 14px, 20px)", fontWeight: 700 }}
                >
                  {m.title}
                </h3>
                <p
                  className="text-cream-paper/70"
                  style={{ fontSize: "16px", lineHeight: 1.6 }}
                >
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
