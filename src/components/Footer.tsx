import { useRef } from "react";
import Logo from "./Logo";
import { useContent, phoneHref, emailHref } from "../content";

export default function Footer() {
  const { business, nav, footer } = useContent();
  const LINKS = nav.links;
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--color-sage-mist)",
        borderColor: "var(--color-lichen)",
      }}
    >
      {/* Extra bottom padding below lg keeps the fixed CallBar clear of content. */}
      <div className="container-page pt-14 pb-28 lg:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <a href="#top" aria-label="Umyjeme Fasádu, domů" className="shrink-0 self-start">
            <Logo height={192} className="h-[clamp(88px,26vw,116px)] w-auto md:h-[160px]" />
          </a>

          <nav aria-label="Patička" className="flex flex-wrap gap-x-8 gap-y-2 md:pt-2">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-bold text-botanical-ink/70 transition-colors hover:text-botanical-ink"
                style={{ fontSize: "14px" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-2 md:items-end md:pt-2 md:text-right">
            <a
              href={phoneHref(business.phone)}
              className="font-fragment-mono text-botanical-ink/70 hover:text-botanical-ink"
              style={{ fontSize: "14px", letterSpacing: "0.02em" }}
            >
              {business.phone}
            </a>
            <a
              href={emailHref(business.email)}
              className="font-fragment-mono text-botanical-ink/70 hover:text-botanical-ink"
              style={{ fontSize: "14px", letterSpacing: "0.02em" }}
            >
              {business.email}
            </a>
            <span className="micro-label text-botanical-ink/75">{business.hours}</span>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-4 border-t pt-6 md:flex-row md:items-start md:justify-between"
          style={{ borderColor: "var(--color-lichen)" }}
        >
          <span className="micro-label text-botanical-ink/75">
            © {new Date().getFullYear()}{" "}
            {footer.legalLine.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </span>
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="micro-label self-start text-botanical-ink/75 underline underline-offset-4 hover:text-botanical-ink md:self-auto"
          >
            {footer.privacyLabel}
          </button>
        </div>
      </div>

      {/* Privacy policy - placeholder text until the real policy exists. */}
      <dialog
        ref={dialogRef}
        className="m-auto w-[min(92vw,640px)] rounded-[14px] p-0 backdrop:bg-black/50"
        style={{
          backgroundColor: "var(--color-cream-paper)",
          color: "var(--color-botanical-ink)",
        }}
      >
        <div className="flex flex-col gap-4 p-7 md:p-9">
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>{footer.privacyTitle}</h2>
          {footer.privacyBody.map((para, i) => (
            <p
              key={i}
              style={{ fontSize: "15px", lineHeight: 1.6 }}
              className="text-botanical-ink/75"
            >
              {para}
            </p>
          ))}
          <form method="dialog" className="mt-2 self-end">
            <button className="btn-ghost">Zavřít</button>
          </form>
        </div>
      </dialog>
    </footer>
  );
}
