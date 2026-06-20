import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";

const STEPS = [
  {
    no: "01",
    title: "Poptávka",
    desc: "Ozvěte se nám telefonicky nebo e-mailem. Řekneme si, co potřebujete.",
  },
  {
    no: "02",
    title: "Prohlídka na místě",
    desc: "Domluvíme termín a přijedeme se na objekt podívat, zdarma a bez závazku.",
  },
  {
    no: "03",
    title: "Zaměření a posouzení",
    desc: "Technik objekt zaměří, posoudí typ a stav povrchu a navrhne vhodný postup.",
  },
  {
    no: "04",
    title: "Nezávazná nabídka",
    desc: "Připravíme cenovou nabídku na míru. Rozhodnutí je na vás, bez poplatků.",
  },
];

export default function OrderProcess() {
  return (
    <section className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          label=""
          title="Od poptávky k čisté fasádě ve čtyřech krocích"
          intro="Cenu vždy stanovujeme individuálně podle konkrétního objektu. Žádné poplatky ani závazky předem."
        />

        <ol className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.no} className="fade-up" style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="flex items-center gap-3">
                <span
                  className="font-fragment-mono"
                  style={{
                    fontSize: "14px",
                    color: "var(--color-forest-floor)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.no}
                </span>
                <span
                  className="h-px flex-1"
                  style={{ backgroundColor: "var(--color-eucalyptus)" }}
                />
              </div>
              <h3
                className="font-akkurat mt-4 font-bold text-botanical-ink"
                style={TEXT.cardTitle}
              >
                {s.title}
              </h3>
              <p
                className="font-akkurat mt-2 text-botanical-ink/75"
                style={TEXT.bodyTight}
              >
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
