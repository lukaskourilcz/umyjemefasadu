import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { href: "#sluzby", label: "Služby" },
  { href: "#postup", label: "Postup" },
  { href: "#proc-my", label: "Proč my" },
  { href: "#galerie", label: "Reference" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publish the live nav-row height so the hero can offset itself exactly
  // (the bar overlaps the hero, and its height differs per breakpoint).
  useEffect(() => {
    const row = navRef.current?.querySelector("nav");
    if (!row) return;
    const setVar = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${Math.round(row.getBoundingClientRect().height)}px`
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
    const mq = window.matchMedia("(min-width: 768px)");
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
        backgroundColor: scrolled || open ? "rgba(251,253,246,0.82)" : "transparent",
        backdropFilter: scrolled || open ? "blur(10px)" : "none",
        borderBottom:
          scrolled || open
            ? "1px solid var(--color-lichen)"
            : "1px solid transparent",
      }}
    >
      <nav className="container-page flex items-center justify-between gap-4 py-4">
        {/* Left — desktop nav links */}
        <div className="hidden flex-1 items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-akkurat font-bold text-botanical-ink/80 transition-colors hover:text-botanical-ink"
              style={{ fontSize: "14px" }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Center — logo */}
        <div className="flex flex-1 justify-start md:justify-center">
          <Logo />
        </div>

        {/* Right — CTA pair (desktop) + menu toggle (mobile) */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <a href="#kontakt" className="btn-ghost hidden md:inline-flex">
            Kontakt
          </a>
          <a
            href="#kontakt"
            className="btn-primary hidden whitespace-nowrap sm:inline-flex"
          >
            Nezávazná poptávka
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border md:hidden"
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

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-out md:hidden"
        style={{ maxHeight: open ? "420px" : "0px" }}
      >
        <div className="container-page flex flex-col gap-1 pb-5">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-akkurat border-b py-3 font-bold text-botanical-ink/80"
              style={{ fontSize: "16px", borderColor: "var(--color-lichen)" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="btn-primary mt-4 w-full"
          >
            Nezávazná poptávka
          </a>
        </div>
      </div>
    </header>
  );
}
