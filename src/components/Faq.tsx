import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";

const FAQ = [
  {
    q: "Jak dlouho vydrží fasáda čistá?",
    a: "Po vyčištění nanášíme nanoimpregnaci, která brání opětovnému růstu plísní a usazování nečistot. Podle typu fasády, povětrnostních podmínek a okolí se její účinek pohybuje zhruba mezi 5 a 10 lety.",
  },
  {
    q: "Nepoškodí tlakové mytí omítku?",
    a: "Ne. Tlak, teplotu vody i trysky volíme vždy podle typu a stavu omítky. U citlivějších povrchů sáhneme po šetrnější variantě bez horké vody, s přípravkem a aktivní pěnou.",
  },
  {
    q: "Jsou použité přípravky bezpečné?",
    a: "Ano. Používáme ekologické a bezpečné přípravky, které jsou ohleduplné k okolí i k povrchu budovy. Zároveň jsme pojištěni u pojišťovny Generali.",
  },
  {
    q: "Kolik to bude stát?",
    a: "Cenu stanovujeme individuálně podle konkrétního objektu. Přijedeme na nezávaznou prohlídku zdarma, objekt zaměříme a připravíme cenovou nabídku na míru, bez poplatků a závazků.",
  },
  {
    q: "Co všechno umíte vyčistit?",
    a: "Fasády, střechy, dlažbu i chodníky. Odstraníme plísně, mech, řasy, saze, prach i graffiti a nečistoty, které na povrch nepatří. Nabízíme také nátěry a opravy fasád.",
  },
];

export default function Faq() {
  return (
    <section className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading title="Co se nejčastěji ptáte" />

        {/* Divider list - the calmest section on the page. */}
        <div
          className="mx-auto mt-12 flex max-w-[820px] flex-col border-t fade-up"
          style={{ borderColor: "var(--color-eucalyptus)" }}
        >
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group border-b"
              style={{ borderColor: "var(--color-eucalyptus)" }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6">
                <span
                  className="font-bold text-botanical-ink"
                  style={{ fontSize: "18px", fontFamily: "var(--font-display)" }}
                >
                  {item.q}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                  className="shrink-0 transition-transform duration-300 group-open:rotate-45"
                >
                  <path
                    d="M7 2 V12 M2 7 H12"
                    stroke="#101820"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </summary>
              <p className="pb-6 pr-8 text-botanical-ink/75" style={TEXT.body}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
