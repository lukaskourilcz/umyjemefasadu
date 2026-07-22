import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useContent } from "../content";

type Item = { src: string; alt: string; label: string };

/** Videa se v pásu poznají podle přípony (stejné pravidlo jako administrace). */
const isVideo = (src: string) => /\.(webm|mp4|m4v|mov)(\?|$)/i.test(src);

/* Pás zarovnaný s .container-page: vnitřní odsazení kopíruje jeho okraje,
   ale přesahující dlaždice smí vyjet až k hraně okna. */
const stripInset = "max(24px, calc((100vw - var(--page-max)) / 2))";

function Tile({ item }: { item: Item }) {
  const figureRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const video = isVideo(item.src);
  const [mediaReady, setMediaReady] = useState(false);
  const imageSrc =
    reduced && item.src.endsWith("tlakove-myti-akce.webp")
      ? "/media/pic14.webp"
      : item.src;

  useEffect(() => {
    const element = figureRef.current;
    if (!element) return;
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
  }, []);

  // Klipy hrají jen na obrazovce (a nikdy pod reduced-motion).
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
  }, [mediaReady, reduced]);

  return (
    <figure
      ref={figureRef}
      className="card-hover relative m-0 h-[340px] w-[260px] shrink-0 snap-start overflow-hidden rounded-[14px] border md:h-[430px] md:w-[330px]"
      style={{
        borderColor: "var(--color-eucalyptus)",
        backgroundColor: "var(--color-sage-mist)",
      }}
    >
      {mediaReady && video ? (
        <video
          ref={videoRef}
          src={item.src}
          aria-label={item.alt}
          loop
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : mediaReady ? (
        <img
          src={imageSrc}
          alt={item.alt}
          loading="lazy"
          draggable={false}
          width="600"
          height="800"
          className="h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="h-full w-full bg-surface" />
      )}

      {/* Scrim + mono popisek, komponované do fotky jako u referencí. */}
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
        {video && (
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M1.5 1 L9 5 L1.5 9 Z" fill="currentColor" />
          </svg>
        )}
        {item.label}
      </figcaption>
    </figure>
  );
}

/**
 * „Přímo z akce" — horizontální pás fotek a krátkých klipů z reálných
 * zakázek. Dlaždice drží jednotnou výšku a přirozený poměr stran, na užších
 * displejích se pás posouvá (scroll-snap); klipy se přehrávají samy.
 */
export default function FieldWork() {
  const { eyebrow, heading, intro, items } = useContent().fieldWork;
  return (
    <section id="z-akce" className="scroll-mt-24 overflow-hidden py-20 md:py-28">
      <div className="container-page">
        <SectionHeading label={eyebrow} title={heading} intro={intro} />
      </div>

      <div
        tabIndex={0}
        aria-label="Fotografie a videa z realizací, posouvatelná vodorovně"
        className="fade-up mt-12 overflow-x-auto pb-3 md:mt-14"
        style={{
          scrollSnapType: "x proximity",
          scrollPaddingInline: stripInset,
          scrollbarWidth: "thin",
        }}
      >
        <div
          className="flex w-max items-stretch gap-4 md:gap-5"
          style={{ paddingInline: stripInset }}
        >
          {items.map((item, i) => (
            <Tile key={`${item.src}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
