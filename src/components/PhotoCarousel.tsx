import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND_GRADIENT } from "../lib/constants";

/**
 * Horizontal photo carousel - up to ~10 photos. Native scroll-snap drives the
 * motion (so touch swipe and trackpad work for free); the arrows scroll by one
 * card. Real photos drop straight in: give each item a `src` and the placeholder
 * tiles become <img> automatically.
 */
export type CarouselPhoto = {
  src?: string; // e.g. "/reference/akce-1.jpg"
  alt?: string;
  tone?: string; // placeholder fill until a real photo is supplied
};

export default function PhotoCarousel({ photos }: { photos: CarouselPhoto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => (
          <figure
            key={i}
            data-card
            className="group relative m-0 aspect-[4/3] w-[82%] shrink-0 snap-start overflow-hidden rounded-[20px] border sm:w-[48%] lg:w-[31.5%]"
            style={{
              borderColor: "var(--color-eucalyptus)",
              background:
                p.tone ?? "linear-gradient(150deg, #d7eefb 0%, #bfe2f5 100%)",
            }}
          >
            {p.src && (
              <img
                src={p.src}
                alt={p.alt ?? ""}
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover opacity-[0.85] transition duration-500 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
              />
            )}
            {/* Brand tint, alternating blue/pink; fades out on hover. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.12] transition-opacity duration-500 ease-out group-hover:opacity-0"
              style={{
                background: i % 2 === 0 ? BRAND_GRADIENT.blue : BRAND_GRADIENT.pink,
              }}
            />
          </figure>
        ))}
      </div>

      {/* Prev / Next - disabled at the respective ends */}
      <Arrow dir="prev" onClick={() => scrollByCard(-1)} disabled={atStart} />
      <Arrow dir="next" onClick={() => scrollByCard(1)} disabled={atEnd} />
    </div>
  );
}

function Arrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const isPrev = dir === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? "Předchozí" : "Další"}
      className="absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:grid"
      style={{
        left: isPrev ? "-8px" : undefined,
        right: isPrev ? undefined : "-8px",
        backgroundColor: "var(--color-cream-paper)",
        boxShadow: "var(--shadow-subtle)",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path
          d={isPrev ? "M11 4 L6 9 L11 14" : "M7 4 L12 9 L7 14"}
          fill="none"
          stroke="#1ba5e0"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
