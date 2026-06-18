import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Logo from "./Logo";

export default function Hero({ backdrop }: { backdrop: ReactNode }) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Subtle, slow background parallax — the painted landscape drifts and
  // breathes as you scroll while the headline stays crisp. Disabled under
  // reduced-motion. Extra 12% headroom (top -12% / height 124%) prevents
  // edges from showing as the layer translates.
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      // Slow drift (0.18×) plus a barely-there zoom for atmospheric depth.
      const shift = Math.min(y * 0.18, 140);
      const scale = 1 + Math.min(y * 0.00006, 0.05);
      el.style.transform = `translate3d(0, ${shift}px, 0) scale(${scale})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
              "linear-gradient(180deg, rgba(251,253,254,0.55) 0%, rgba(251,253,254,0.15) 30%, rgba(251,253,254,0) 55%, rgba(251,253,254,0.6) 100%)",
          }}
        />
      </div>

      <div className="container-page flex flex-col items-center pb-[120px] pt-[72px] text-center md:pb-[150px] md:pt-[96px]">
        <div className="mb-8 flex justify-center fade-up">
          <Logo variant="full" height={180} className="h-[132px] w-auto md:h-[180px]" />
        </div>
        <span className="tag mb-8 fade-up">Fasády · Střechy · Dlažba</span>

        <h1
          className="font-akkurat max-w-[18ch] text-balance text-botanical-ink fade-up"
          style={{
            fontWeight: 400,
            fontSize: "clamp(36px, 6vw, 53px)",
            lineHeight: 1.0,
            letterSpacing: "-2.12px",
          }}
        >
          Vrátíme vaší fasádě svěžest a&nbsp;necháme&nbsp;ji znovu&nbsp;dýchat.
        </h1>

        <p
          className="font-akkurat mt-7 max-w-[52ch] text-botanical-ink/75 fade-up"
          style={{ fontSize: "18px", lineHeight: 1.67, letterSpacing: "-0.72px" }}
        >
          Odstraníme veškeré nečistoty, které na fasádu nepatří — plísně, řasy,
          saze i prach. Tlakové mytí horkou vodou v&nbsp;kombinaci se šetrnou
          chemií oživí barvy a&nbsp;ochrání povrch na&nbsp;dlouhé roky.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 fade-up">
          <a href="#kontakt" className="btn-primary">
            Získat nezávaznou cenovou nabídku
          </a>
          <a href="#postup" className="btn-ghost">
            Jak to probíhá
          </a>
        </div>
      </div>
    </section>
  );
}
