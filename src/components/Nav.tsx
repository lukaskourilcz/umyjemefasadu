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
  const toggleRef = useRef<HTMLButtonElement>(null);

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

  // Keep keyboard focus inside a predictable menu flow and prevent the page
  // behind the open mobile menu from scrolling.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        navRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1200px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = previousOverflow;
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
        backgroundColor: scrolled || open ? "rgba(251,251,252,0.82)" : "transparent",
        backdropFilter: scrolled || open ? "blur(10px)" : "none",
        borderBottom: scrolled || open ? "1px solid var(--color-lichen)" : "1px solid transparent",
      }}
    >
      <nav className="container-page relative flex items-center justify-between gap-4 py-4">
        {/* Původní levitující značka: před scrollováním vystupuje víc mimo
            navigaci, po scrollu se jen posune - samotné logo se nezmenšuje. */}
        <a
          href="#top"
          aria-label="Umyjeme Fasádu, domů"
          className={`pointer-events-none absolute z-10 opacity-[0.95] transition-all duration-300 ${
            scrolled
              ? "left-[8px] top-[6px] md:left-[12px] min-[1200px]:left-[24px]"
              : "left-[5px] top-[-5px] md:left-[10px] md:top-[1px] min-[1200px]:left-[50px]"
          }`}
        >
          <Logo
            source="nav"
            height={172}
            className="pointer-events-auto block h-[110px] w-auto drop-shadow-[0_8px_10px_rgba(16,24,32,0.4)] md:h-[180px]"
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
            ref={toggleRef}
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

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="max-h-[calc(100dvh-var(--nav-h,76px)-8px)] overflow-y-auto border-t bg-canvas min-[1200px]:hidden"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <div className="container-page flex flex-col gap-1 pb-5">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b py-3 font-bold text-text-muted hover:text-text"
                style={{ fontSize: "16px", borderColor: "var(--color-border-subtle)" }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 w-full sm:hidden"
            >
              {nav.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
