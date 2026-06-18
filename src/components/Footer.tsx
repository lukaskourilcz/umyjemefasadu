import Logo from "./Logo";

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--color-sage-mist)",
        borderColor: "var(--color-lichen)",
      }}
    >
      <div className="container-page flex flex-col gap-10 py-14">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <Logo />
            <p
              className="font-akkurat max-w-[36ch] text-botanical-ink/70"
              style={{ fontSize: "14px", letterSpacing: "-0.04em" }}
            >
              Profesionální mytí a čištění fasád, střech a dlažby. Každá budova si
              zaslouží druhou šanci vypadat svěže.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { href: "#sluzby", label: "Služby" },
              { href: "#postup", label: "Postup" },
              { href: "#proc-my", label: "Proč my" },
              { href: "#kontakt", label: "Kontakt" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-akkurat font-bold text-botanical-ink/80 transition-colors hover:text-botanical-ink"
                style={{ fontSize: "14px" }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--color-lichen)" }}
        >
          <span className="micro-label text-botanical-ink/60">
            {/* TODO: doplňte skutečné IČO firmy */}
            © {new Date().getFullYear()} Umyjeme Fasádu s.r.o. · IČO 00000000
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="tel:+420775222760"
              className="font-fragment-mono text-botanical-ink/70 hover:text-botanical-ink"
              style={{ fontSize: "14px", letterSpacing: "0.02em" }}
            >
              +420 775 222 760
            </a>
            <a
              href="mailto:info@umyjemefasadu.cz"
              className="font-fragment-mono text-botanical-ink/70 hover:text-botanical-ink"
              style={{ fontSize: "14px", letterSpacing: "0.02em" }}
            >
              info@umyjemefasadu.cz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
