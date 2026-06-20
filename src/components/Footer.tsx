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
      <div className="container-page flex flex-row items-center justify-between gap-5 pt-14 pb-28 md:gap-10 md:py-14">
        <a href="#top" aria-label="Umyjeme Fasádu, domů" className="shrink-0">
          <Logo variant="full" height={192} className="h-[96px] w-auto md:h-[192px]" />
        </a>

        {/* Legal + contact (in place of the former nav links) */}
        <div className="flex flex-col items-end gap-5 text-right md:gap-24">
          <span className="micro-label text-botanical-ink/60">
            {/* TODO: doplňte skutečné IČO firmy */}
            © {new Date().getFullYear()} Umyjeme Fasádu s.r.o.
            <br />
            IČO 00000000
          </span>
          <div className="flex flex-col items-end gap-2">
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
