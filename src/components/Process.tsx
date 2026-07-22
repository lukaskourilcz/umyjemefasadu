import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useContent } from "../content";

const isVideo = (src: string) => /\.(webm|mp4|m4v|mov)(\?|$)/i.test(src);

/** The page's dark mid-section - grounds the pastel surfaces around it. */
export default function Process() {
  const { heading, intro, steps: STEPS, methods: METHODS, sideVideo, sideVideoAlt, sideVideoLabel } = useContent().process;
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    const element = figureRef.current;
    if (!element || !sideVideo) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMediaReady(true);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [sideVideo]);

  // Klip hraje jen na obrazovce (a nikdy pod reduced-motion) — stejný
  // přístup jako dlaždice v Hero a v pásu „Přímo z akce".
  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduced || !mediaReady) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mediaReady, reduced, sideVideo]);

  return (
    <section
      id="postup"
      className="scroll-mt-24 py-20 md:py-28"
      style={{ backgroundColor: "var(--color-botanical-ink)" }}
    >
      <div className="container-page">
        <SectionHeading label="Náš postup" tone="dark" title={heading} intro={intro} />

        <div className="mx-auto mt-14 grid max-w-[960px] items-center gap-10 fade-up lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          {/* Vertical timeline - mono numbers on a hairline rail. */}
          <ol className="flex flex-col">
            {STEPS.map((s, i) => (
              <li key={s.no} className="relative flex gap-6 md:gap-8">
                <div className="flex flex-col items-center">
                  <span className="font-fragment-mono pt-1 text-[15px] tracking-[.02em] text-forest-floor">{s.no}</span>
                  {i < STEPS.length - 1 && <span aria-hidden="true" className="mt-3 w-px flex-1 bg-cream-paper/15" />}
                </div>
                <div className={i < STEPS.length - 1 ? "pb-10" : ""}>
                  <h3 className="text-cream-paper" style={{ fontSize: "clamp(18px, 1vw + 14px, 20px)", fontWeight: 700 }}>{s.title}</h3>
                  <p className="mt-2 text-cream-paper/70" style={{ fontSize: "16px", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          {sideVideo && (
            <figure ref={figureRef} className="relative m-0 mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-[14px] border bg-black" style={{ borderColor: "rgba(251,253,254,0.14)" }}>
              {mediaReady && isVideo(sideVideo) ? (
                <video ref={videoRef} src={sideVideo} aria-label={sideVideoAlt} loop muted playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover object-center" />
              ) : mediaReady ? (
                <img
                  src={
                    reduced && sideVideo.endsWith("tlakove-myti-postup.webp")
                      ? "/media/pic12.webp"
                      : sideVideo
                  }
                  alt={sideVideoAlt}
                  loading="lazy"
                  width="400"
                  height="711"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <div aria-hidden="true" className="absolute inset-0 bg-text" />
              )}
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(0deg,rgba(16,24,32,.74),rgba(16,24,32,0))" }} />
              <figcaption className="font-fragment-mono absolute inset-x-0 bottom-0 p-4 text-[10px] uppercase tracking-[.1em] text-cream-paper/85">{sideVideoLabel}</figcaption>
            </figure>
          )}
        </div>

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
