import SectionHeading from "./SectionHeading";

// TODO: nahraďte skutečnými orientačními cenami.
const ROWS = [
  { service: "Mytí a čištění fasád", price: "od 95 Kč/m²", note: "dle znečištění a výšky objektu" },
  { service: "Čištění střech", price: "od 120 Kč/m²", note: "dle typu krytiny" },
  { service: "Čištění dlažby a chodníků", price: "od 60 Kč/m²", note: "včetně spár" },
  { service: "Odstranění graffiti", price: "od 350 Kč/m²", note: "dle podkladu a barvy" },
  { service: "Nanoimpregnace", price: "od 85 Kč/m²", note: "ochrana 5–10 let" },
  { service: "Nátěry a opravy fasád", price: "individuálně", note: "dle rozsahu" },
];

export default function Pricing() {
  return (
    <section id="cenik" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          title="Orientační ceník"
          intro="Přesnou cenu stanovíme po prohlídce zdarma - záleží na typu povrchu, míře znečištění a přístupu k objektu."
        />

        <div
          className="mx-auto mt-12 max-w-[860px] border-t fade-up"
          style={{ borderColor: "var(--color-eucalyptus)" }}
        >
          {ROWS.map((r) => (
            <div
              key={r.service}
              className="grid grid-cols-1 gap-x-6 gap-y-1 border-b py-5 sm:grid-cols-[1fr_auto] sm:items-baseline"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            >
              <div>
                <span
                  className="text-botanical-ink"
                  style={{ fontSize: "17px", fontWeight: 700 }}
                >
                  {r.service}
                </span>
                <span
                  className="ml-3 text-botanical-ink/55"
                  style={{ fontSize: "14px" }}
                >
                  {r.note}
                </span>
              </div>
              <span
                className="font-fragment-mono text-botanical-ink"
                style={{ fontSize: "16px", letterSpacing: "0.02em" }}
              >
                {r.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-[860px] flex-col items-start gap-6 fade-up sm:flex-row sm:items-center sm:justify-between">
          <p className="text-botanical-ink/60" style={{ fontSize: "14px" }}>
            Ceny jsou orientační, bez DPH. Přesnou nabídku připravíme po
            bezplatné prohlídce objektu.
          </p>
          <a href="#kontakt" className="btn-ghost shrink-0">
            Chci přesnou nabídku
          </a>
        </div>
      </div>
    </section>
  );
}
