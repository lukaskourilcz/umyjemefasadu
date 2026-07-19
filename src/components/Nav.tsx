import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useScrolledPast } from "../hooks/useScrolledPast";
import { useContent } from "../content";

export default function Nav() {
  const { nav } = useContent();
  const LINKS = nav.links;
  const scrolled = useScrolledPast(12);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Publish the live nav-row height so the hero can offset itself exactly
  // (the bar overlaps the hero, and its height differs per breakpoint).
  useEffect(() => {
    const row = navRef.current?.querySelector("nav");
    if (!row) return;
    const setVar = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${Math.round(row.getBoundingClientRect().height)}px`,
      );
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(row);
    return () => ro.disconnect();
  }, []);

  // Close the mobile menu on Escape or when the viewport grows to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1200px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <header
      id="top"
      ref={navRef}
      className="sticky top-0 z-50 w-full transition-colors duration-300"
      style={{
        backgroundColor:
          scrolled || open ? "rgba(251,251,252,0.82)" : "transparent",
        backdropFilter: scrolled || open ? "blur(10px)" : "none",
        borderBottom:
          scrolled || open
            ? "1px solid var(--color-lichen)"
            : "1px solid transparent",
      }}
    >
      <nav className="container-page relative flex items-center justify-between gap-4 py-4">
        {/* Compact transparent wordmark floats without changing bar height. */}
        <a
          href="#top"
          aria-label="Umyjeme Fasádu, domů"
          className="pointer-events-none absolute left-[18px] top-[14px] z-10 md:left-[16px] md:top-[12px] min-[1200px]:left-[50px]"
        >
          <Logo
            source="nav"
            height={42}
            className="pointer-events-auto relative block h-[25px] w-auto drop-shadow-[0_1px_1px_rgba(255,255,255,.7)] md:h-[35px]"
          />
        </a>

        {/* Left - spacer; the logo (positioned absolutely above) overlaps this
            corner without inflating the bar height. */}
        <div className="flex-1" />

        {/* Center - nav links, shown from 1200px where the full-size logo clears
            them; below that the hamburger takes over. */}
        <div className="hidden flex-1 items-center justify-center gap-7 min-[1200px]:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap font-bold text-botanical-ink/80 transition-colors hover:text-botanical-ink"
              style={{ fontSize: "14px" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Right - CTA pair (desktop) + menu toggle (mobile) */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <a
            href="#kontakt"
            className="btn-primary hidden whitespace-nowrap px-6 py-3 sm:inline-flex"
          >
            {nav.cta}
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border min-[1200px]:hidden"
            style={{ borderColor: "var(--color-eucalyptus)" }}
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? (
                <path
                  d="M5 5 L15 15 M15 5 L5 15"
                  stroke="#101820"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6 H17 M3 10 H17 M3 14 H17"
                  stroke="#101820"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel - capped to the space under the bar and scrollable,
          so all links stay reachable however many the admin adds. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-out min-[1200px]:hidden"
        style={{
          maxHeight: open ? "calc(100dvh - var(--nav-h, 76px) - 8px)" : "0px",
          overflowY: open ? "auto" : "hidden",
        }}
      >
        <div className="container-page flex flex-col gap-1 pb-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b py-3 font-bold text-botanical-ink/80"
              style={{ fontSize: "16px", borderColor: "var(--color-lichen)" }}
            >
              {l.label}
            </a>
          ))}
          {/* Only show the CTA here when it isn't already in the bar (the bar's
              CTA appears from sm up), so it never duplicates. */}
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="btn-primary mt-4 w-full sm:hidden"
          >
            {nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
