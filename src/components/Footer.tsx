import Logo from "./Logo";
import { CONTACT } from "../lib/constants";

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--color-sage-mist)",
        borderColor: "var(--color-lichen)",
      }}
    >
      <div className="container-page flex flex-row items-center justify-between gap-3 pt-14 pb-28 md:gap-10 md:py-14">
        <a href="#top" aria-label="Umyjeme Fasádu, domů" className="shrink-0">
          {/* Fluid on phones so the logo + contact never overflow narrow screens;
              fixed 192px from md up. */}
          <Logo
            height={192}
            className="h-[clamp(88px,26vw,116px)] w-auto md:h-[192px]"
          />
        </a>

        {/* Legal + contact (in place of the former nav links) */}
        <div className="flex min-w-0 flex-col items-end gap-5 text-right md:gap-24">
          <span className="micro-label text-botanical-ink/60">
            {/* TODO: doplňte skutečné IČO firmy */}
            © {new Date().getFullYear()} Umyjeme Fasádu s.r.o.
            <br />
            IČO 00000000
          </span>
          <div className="flex flex-col items-end gap-2">
            <a
              href={CONTACT.phoneHref}
              className="font-fragment-mono text-botanical-ink/70 hover:text-botanical-ink"
              style={{ fontSize: "clamp(12px, 3.4vw, 14px)", letterSpacing: "0.02em" }}
            >
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={CONTACT.emailHref}
              className="font-fragment-mono text-botanical-ink/70 hover:text-botanical-ink"
              style={{ fontSize: "clamp(12px, 3.4vw, 14px)", letterSpacing: "0.02em" }}
            >
              {CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
