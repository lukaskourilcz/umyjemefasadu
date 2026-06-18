import { useEffect, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { href: "#sluzby", label: "Služby" },
  { href: "#postup", label: "Postup" },
  { href: "#proc-my", label: "Proč my" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="top"
      className="sticky top-0 z-50 w-full transition-colors duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(251,253,246,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--color-lichen)"
          : "1px solid transparent",
      }}
    >
      <nav className="container-page flex items-center justify-between gap-4 py-4">
        {/* Left — nav links */}
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

        {/* Center — wordmark */}
        <div className="flex flex-1 justify-start md:justify-center">
          <Logo />
        </div>

        {/* Right — CTA pair */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <a href="#kontakt" className="btn-ghost hidden sm:inline-flex">
            Kontakt
          </a>
          <a href="#kontakt" className="btn-primary">
            Nezávazná poptávka
          </a>
        </div>
      </nav>
    </header>
  );
}
