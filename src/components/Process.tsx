import { useEffect, useRef, useState } from "react";
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
  const { fieldWork } = useContent();
  const clips = [
    { src: video, alt: videoAlt, label: videoLabel, position: "center 45%" },
    ...fieldWork.items
      .filter((item) => /\.(webm|mp4)(\?|$)/i.test(item.src))
      .map((item, index) => ({ ...item, position: ["center 35%", "center 30%", "center 42%"][index] ?? "center" })),
  ].filter((clip) => clip.src);
  const [activeClip, setActiveClip] = useState(0);
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
  }, [activeClip, reduced]);

  const currentClip = clips[activeClip] ?? clips[0];

  return (
    <section
      id="postup"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-botanical-ink)" }}
    >
      <div className="container-page">
        <SectionHeading label="Náš postup" tone="dark" title={heading} intro={intro} />

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

        {/* One focused stage keeps only a single clip mounted and decoded.
            The compact selector preserves access to all footage without four
            simultaneous autoplay streams competing for CPU and bandwidth. */}
        {currentClip && (
          <div className="mx-auto mt-14 max-w-[960px] fade-up">
            <figure
              className="relative m-0 aspect-[4/5] overflow-hidden rounded-[14px] border bg-black sm:aspect-video"
              style={{ borderColor: "rgba(251,253,254,0.14)" }}
            >
              <video
                key={currentClip.src}
                ref={videoRef}
                src={currentClip.src}
                aria-label={currentClip.alt}
                loop
                muted
                playsInline
                preload="metadata"
                className="process-video-in absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: currentClip.position }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
                style={{ background: "linear-gradient(0deg,rgba(16,24,32,.76),rgba(16,24,32,0))" }}
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5 text-cream-paper md:p-6">
                <span className="font-fragment-mono flex items-center gap-2 text-[11px] uppercase tracking-[.1em]">
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.5 1 L9 5 L1.5 9 Z" fill="currentColor" /></svg>
                  {currentClip.label}
                </span>
                <span className="font-fragment-mono text-[11px] text-cream-paper/60">
                  {String(activeClip + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>

            <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2" aria-label="Ukázky práce">
              {clips.map((clip, index) => {
                const active = index === activeClip;
                return (
                  <button
                    key={clip.src}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveClip(index)}
                    className="min-h-11 min-w-[190px] snap-start rounded-[12px] border px-4 py-3 text-left transition-colors"
                    style={{
                      borderColor: active ? "var(--color-forest-floor)" : "rgba(251,253,254,0.16)",
                      backgroundColor: active ? "rgba(27,165,224,0.14)" : "rgba(251,253,254,0.05)",
                    }}
                  >
                    <span className="font-fragment-mono mr-3 text-[11px] text-forest-floor">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-cream-paper/85">{clip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
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
