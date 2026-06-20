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
    <section
      className="scroll-mt-24 py-20 md:py-28"
      style={{
        background: "linear-gradient(160deg, #fef7fa 0%, #fcedf4 100%)",
      }}
    >
      <div className="container-page">
        <SectionHeading label="" title="Co se nejčastěji ptáte" />

        <div className="mx-auto mt-12 flex max-w-[820px] flex-col gap-3">
          {FAQ.map((item, i) => (
            <details
              key={item.q}
              className="group fade-up rounded-[20px] border"
              style={{
                backgroundColor: "var(--color-cream-paper)",
                borderColor: "var(--color-eucalyptus)",
                transitionDelay: `${i * 50}ms`,
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6">
                <span
                  className="font-akkurat font-bold text-botanical-ink"
                  style={{ fontSize: "18px", letterSpacing: "-0.04em" }}
                >
                  {item.q}
                </span>
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform duration-300 group-open:rotate-45"
                  style={{ backgroundColor: "var(--color-moss-veil)" }}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14">
                    <path
                      d="M7 2 V12 M2 7 H12"
                      stroke="#101820"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p
                className="font-akkurat px-6 pb-6 text-botanical-ink/75"
                style={TEXT.body}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
