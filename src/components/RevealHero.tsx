import { useState } from "react";
import { phoneHref, useContent } from "../content";

type Props = {
  before?: string;
  after?: string;
};

/**
 * Conversion-first opening with an authentic, keyboard-operable before/after
 * comparison. The offer and contact paths are visible immediately; the media
 * supports the message instead of forcing a scroll interaction.
 */
export default function RevealHero({ before, after }: Props) {
  const { revealHero, hero, business, contact } = useContent();
  const [position, setPosition] = useState(50);
  const area = contact.areas[0] || business.address;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b bg-canvas"
      style={{ borderColor: "var(--color-border-subtle)" }}
    >
      <div className="container-page grid min-h-[calc(100svh-var(--nav-h,76px))] items-center gap-10 pb-16 pt-24 md:pb-20 md:pt-36 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16 lg:pt-32">
        <div className="relative z-10 max-w-[650px]">
          <p className="section-eyebrow font-fragment-mono uppercase">{hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="mt-5 max-w-[14ch] text-text"
            style={{
              fontSize: "clamp(2.35rem, 5.4vw, 5rem)",
              fontWeight: 650,
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
            }}
          >
            {hero.title}
          </h1>
          <p
            className="mt-6 max-w-[58ch] text-text-muted"
            style={{ fontSize: "clamp(1rem, .45vw + .92rem, 1.2rem)", lineHeight: 1.65 }}
          >
            {hero.body}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="#kontakt" className="btn-primary min-h-12">
              {revealHero.cta}
            </a>
            <a
              href={phoneHref(business.phone)}
              className="btn-ghost min-h-12"
              aria-label={`Zavolat na ${business.phone}`}
            >
              Zavolat {business.phone.replace("+420 ", "")}
            </a>
          </div>

          <div
            className="mt-7 flex items-start gap-3 border-l-2 pl-4"
            style={{ borderColor: "var(--color-accent)" }}
          >
            <svg
              className="mt-0.5 shrink-0 text-accent"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                d="M10 18c4-4.6 6-7.5 6-10a6 6 0 1 0-12 0c0 2.5 2 5.4 6 10Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle cx="10" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            <p className="text-sm leading-6 text-text-muted">
              <strong className="text-text">Působíme z Hodonína.</strong> {area}
            </p>
          </div>
        </div>

        <figure className="m-0 w-full">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-[16px] border bg-surface"
            style={{ borderColor: "var(--color-border)" }}
          >
            <img
              src={before}
              alt="Fasáda před čištěním"
              width="1140"
              height="906"
              fetchPriority="high"
              decoding="sync"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <img
                src={after}
                alt="Fasáda po čištění"
                width="1134"
                height="860"
                fetchPriority="high"
                decoding="sync"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(16,24,32,.2)]"
              style={{ left: `${position}%`, transform: "translateX(-50%)" }}
            >
              <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white text-text shadow-md">
                <svg width="22" height="14" viewBox="0 0 22 14">
                  <path
                    d="m7 2-5 5 5 5M15 2l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>

            <span className="absolute left-3 top-3 rounded-[8px] bg-text/82 px-3 py-2 text-xs font-bold uppercase tracking-[.08em] text-text-inverse sm:left-4 sm:top-4">
              {revealHero.labelAfterPrefix} {revealHero.labelAfterSuffix}
            </span>
            <span className="absolute right-3 top-3 rounded-[8px] bg-text/82 px-3 py-2 text-xs font-bold uppercase tracking-[.08em] text-text-inverse sm:right-4 sm:top-4">
              {revealHero.labelBeforePrefix} {revealHero.labelBeforeSuffix}
            </span>
          </div>

          <label className="mt-4 block text-sm font-semibold text-text">
            Posuňte porovnání před a po
            <input
              type="range"
              min="5"
              max="95"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
              aria-valuetext={`${position} % fotografie po čištění`}
              className="comparison-range mt-2 block w-full"
            />
          </label>
        </figure>
      </div>
    </section>
  );
}
