import { useRef } from "react";
import Logo from "./Logo";
import { CONTACT } from "../lib/constants";

const LINKS = [
  { href: "#sluzby", label: "Služby" },
  { href: "#postup", label: "Postup" },
  { href: "#proc-my", label: "Proč my" },
  { href: "#galerie", label: "Reference" },
  { href: "#cenik", label: "Ceník" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Footer() {
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
          <a
            href="#top"
            aria-label="Umyjeme Fasádu, domů"
            className="shrink-0 self-start"
          >
            <Logo
              height={192}
              className="h-[clamp(88px,26vw,116px)] w-auto md:h-[160px]"
            />
          </a>

          <nav
            aria-label="Patička"
            className="flex flex-wrap gap-x-8 gap-y-2 md:pt-2"
          >
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
              href={CONTACT.phoneHref}
              className="font-fragment-mono text-botanical-ink/70 hover:text-botanical-ink"
              style={{ fontSize: "14px", letterSpacing: "0.02em" }}
            >
              {CONTACT.phoneDisplay}
            </a>
            <a
              href={CONTACT.emailHref}
              className="font-fragment-mono text-botanical-ink/70 hover:text-botanical-ink"
              style={{ fontSize: "14px", letterSpacing: "0.02em" }}
            >
              {CONTACT.email}
            </a>
            <span className="micro-label text-botanical-ink/50">
              Po–Pá 7:00–18:00
            </span>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-4 border-t pt-6 md:flex-row md:items-start md:justify-between"
          style={{ borderColor: "var(--color-lichen)" }}
        >
          <span className="micro-label text-botanical-ink/60">
            {/* TODO: doplňte skutečné IČO, DIČ, sídlo a spisovou značku. */}
            © {new Date().getFullYear()} Umyjeme Fasádu s.r.o. · IČO 00000000 ·
            DIČ CZ00000000
            <br />
            Lorem ipsum 123, 602 00 Brno · sp. zn. C 00000 vedená u KS v Brně
          </span>
          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="micro-label self-start text-botanical-ink/60 underline underline-offset-4 hover:text-botanical-ink md:self-auto"
          >
            Ochrana osobních údajů
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
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>
            Zásady ochrany osobních údajů
          </h2>
          {/* TODO: nahraďte skutečnými zásadami zpracování osobních údajů. */}
          <p style={{ fontSize: "15px", lineHeight: 1.6 }} className="text-botanical-ink/75">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Správcem
            osobních údajů je Umyjeme Fasádu s.r.o. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p style={{ fontSize: "15px", lineHeight: 1.6 }} className="text-botanical-ink/75">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Osobní údaje zpracováváme
            výhradně za účelem vyřízení poptávky.
          </p>
          <form method="dialog" className="mt-2 self-end">
            <button className="btn-ghost">Zavřít</button>
          </form>
        </div>
      </dialog>
    </footer>
  );
}
