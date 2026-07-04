import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useRafScroll } from "../hooks/useRafScroll";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import fasada1 from "../assets/fasada1.webm";
import fasada2 from "../assets/fasada2.webm";
import fasada3 from "../assets/fasada3.webm";
import fasada4 from "../assets/fasada4.webm";

export default function Hero({ backdrop }: { backdrop: ReactNode }) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Subtle, slow background parallax - the painted landscape drifts and
  // breathes as you scroll while the headline stays crisp. Disabled under
  // reduced-motion. Extra 12% headroom (top -12% / height 124%) prevents
  // edges from showing as the layer translates.
  useRafScroll(() => {
    const el = parallaxRef.current;
    if (!el || reduced) return;
    const y = window.scrollY;
    // Slow drift (0.18×) plus a barely-there zoom for atmospheric depth.
    const shift = Math.min(y * 0.18, 140);
    const scale = 1 + Math.min(y * 0.00006, 0.05);
    el.style.transform = `translate3d(0, ${shift}px, 0) scale(${scale})`;
  });

  return (
    <section
      className="relative overflow-hidden"
      style={{
        marginTop: "calc(var(--nav-h, 76px) * -1)",
        paddingTop: "var(--nav-h, 76px)",
      }}
    >
      {/* Full-bleed painted landscape, occupying ~40% of the viewport,
          bleeding behind the headline without competing. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 -z-10">
        <div
          ref={parallaxRef}
          className="absolute will-change-transform"
          style={{ top: "-12%", left: 0, width: "100%", height: "124%" }}
        >
          {backdrop}
        </div>
        {/* Cream wash so the headline always holds contrast over the scene */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(251,253,254,0.55) 0%, rgba(251,253,254,0.15) 28%, rgba(251,253,254,0) 48%, rgba(251,253,254,0.85) 82%, rgba(251,253,254,1) 100%)",
          }}
        />
      </div>

      <div className="container-page grid items-center gap-14 pb-16 pt-[72px] md:grid-cols-2 md:gap-14 md:pb-10 md:pt-[96px]">
        {/* Copy first on phones (the collage would otherwise push the value
            proposition below the fold); collage left / copy right from md up. */}
        <div className="order-1 flex flex-col items-start text-left md:order-2">
          <span className="micro-label mb-8 text-botanical-ink/60 fade-up">
            Fasády · Střechy · Dlažba
          </span>

          <h2
            className="max-w-[18ch] text-balance break-words text-botanical-ink mt-2 fade-up"
            style={{
              fontWeight: 500,
              fontSize: "clamp(32px, 5.2vw, 53px)",
              lineHeight: 1.04,
            }}
          >
            Vrátíme fasádě čistý vzhled bez drahé rekonstrukce.
          </h2>

          <p
            className="mt-7 max-w-[52ch] text-botanical-ink/75 fade-up"
            style={{ fontSize: "var(--text-body)", lineHeight: 1.65 }}
          >
            Tlakovým mytím horkou vodou a&nbsp;šetrnou chemií odstraníme plísně,
            řasy, saze i&nbsp;prach. Povrch zůstane čistý a&nbsp;chráněný
            na&nbsp;další roky.
          </p>

          <div className="mt-10 flex w-full flex-wrap items-center justify-start gap-3 fade-up md:w-auto">
            <a href="#kontakt" className="btn-primary w-full sm:w-auto">
              Získat nezávaznou cenovou nabídku
            </a>
            <a href="#postup" className="btn-ghost w-full sm:w-auto">
              Jak to probíhá
            </a>
          </div>
        </div>

        {/* Decorative video collage. Purely visual: not clickable and not
            zoomable; tiles crop via object-cover so they sit neatly side by side. */}
        <div className="order-2 fade-up md:order-1" aria-hidden="true">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex flex-1 flex-col gap-3 sm:gap-4">
              <VideoTile video={VIDEOS[0]} />
              <VideoTile video={VIDEOS[1]} />
            </div>
            <div className="flex flex-1 flex-col gap-3 pt-8 sm:gap-4 sm:pt-12">
              <VideoTile video={VIDEOS[2]} />
              <VideoTile video={VIDEOS[3]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Video = { src: string; position?: string; tone: string };
const VIDEOS: Video[] = [
  {
    src: fasada1,
    position: "top",
    tone: "linear-gradient(150deg, #cfe7f6 0%, #a9d4ee 100%)",
  },
  {
    src: fasada2,
    position: "top",
    tone: "linear-gradient(150deg, #d7eefb 0%, #bfe2f5 100%)",
  },
  {
    src: fasada3,
    position: "top",
    tone: "linear-gradient(150deg, #c7d6de 0%, #aebfc8 100%)",
  },
  {
    src: fasada4,
    position: "top",
    tone: "linear-gradient(150deg, #dbeaf3 0%, #b9d8ec 100%)",
  },
];

function VideoTile({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  // The four clips total several MB - defer playback (and the bulk of the
  // download, thanks to preload="metadata") until the tile is on screen, and
  // pause again off-screen. Under reduced-motion the clips never play; the
  // poster frame from the metadata load stands in as a still.
  useEffect(() => {
    const el = ref.current;
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
  }, [reduced]);

  return (
    <div
      className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-[12px] border"
      style={{ borderColor: "var(--color-eucalyptus)", background: video.tone }}
    >
      <video
        ref={ref}
        src={video.src}
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        style={{ objectPosition: video.position }}
      />
    </div>
  );
}
