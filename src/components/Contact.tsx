import SectionHeading from "./SectionHeading";

export default function Contact() {
  return (
    <section id="kontakt" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <div
          className="fade-up overflow-hidden rounded-[20px] border"
          style={{
            backgroundColor: "var(--color-cream-paper)",
            borderColor: "var(--color-botanical-ink)",
          }}
        >
          <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-2 md:items-center md:p-14">
            <div>
              <SectionHeading
                align="left"
                label="Kontakt"
                title="Pošleme vám nezávaznou cenovou nabídku"
                intro="Napište nebo zavolejte — domluvíme termín prohlídky zdarma a navrhneme řešení přesně pro vaši fasádu."
              />
            </div>

            <div className="flex flex-col gap-5">
              <a
                href="tel:+420775222760"
                className="group flex items-center justify-between gap-4 rounded-[20px] border p-6 transition-colors"
                style={{
                  backgroundColor: "var(--color-sage-mist)",
                  borderColor: "var(--color-eucalyptus)",
                }}
              >
                <span>
                  <span className="micro-label block text-botanical-ink/60">
                    Telefon
                  </span>
                  <span
                    className="font-akkurat font-bold text-botanical-ink"
                    style={{ fontSize: "22px", letterSpacing: "-0.04em" }}
                  >
                    +420 775 222 760
                  </span>
                </span>
                <Arrow />
              </a>

              <a
                href="mailto:info@umyjemefasadu.cz"
                className="group flex items-center justify-between gap-4 rounded-[20px] border p-6 transition-colors"
                style={{
                  backgroundColor: "var(--color-sage-mist)",
                  borderColor: "var(--color-eucalyptus)",
                }}
              >
                <span>
                  <span className="micro-label block text-botanical-ink/60">
                    E-mail
                  </span>
                  <span
                    className="font-akkurat font-bold text-botanical-ink"
                    style={{ fontSize: "22px", letterSpacing: "-0.04em" }}
                  >
                    info@umyjemefasadu.cz
                  </span>
                </span>
                <Arrow />
              </a>

              <a href="tel:+420775222760" className="btn-primary mt-1 w-full">
                Zavolat hned
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path
        d="M5 11 H17 M12 6 L17 11 L12 16"
        fill="none"
        stroke="#0a1d08"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
