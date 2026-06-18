import type { ReactNode } from "react";

export default function Hero({ backdrop }: { backdrop: ReactNode }) {
  return (
    <section className="relative -mt-[73px] overflow-hidden pt-[73px]">
      {/* Full-bleed painted landscape, occupying ~40% of the viewport,
          bleeding behind the headline without competing. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 -z-10">
        <div className="absolute inset-0">{backdrop}</div>
        {/* Cream wash so the headline always holds contrast over the scene */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(251,253,246,0.55) 0%, rgba(251,253,246,0.15) 30%, rgba(251,253,246,0) 55%, rgba(251,253,246,0.45) 100%)",
          }}
        />
      </div>

      <div className="container-page flex flex-col items-center pb-[120px] pt-[88px] text-center md:pb-[150px] md:pt-[120px]">
        <span className="tag mb-8 fade-up">Mytí a čištění fasád</span>

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
