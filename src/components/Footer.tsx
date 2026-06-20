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
      <div className="container-page flex flex-col items-start justify-between gap-10 py-14 md:flex-row md:items-center">
        <Logo height={192} />

        {/* Legal + contact (in place of the former nav links) */}
        <div className="flex flex-col gap-24 md:items-end md:text-right">
          <span className="micro-label text-botanical-ink/60 md:text-right">
            {/* TODO: doplňte skutečné IČO firmy */}
            © {new Date().getFullYear()} Umyjeme Fasádu s.r.o.
            <br />
            IČO 00000000
          </span>
          <div className="flex flex-col gap-2 md:items-end">
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
