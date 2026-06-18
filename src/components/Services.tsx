import SectionHeading from "./SectionHeading";

type Service = {
  title: string;
  desc: string;
  icon: JSX.Element;
};

const stroke = {
  fill: "none",
  stroke: "#0a1d08",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SERVICES: Service[] = [
  {
    title: "Mytí fasád",
    desc: "Tlakové mytí horkou vodou s pečlivou regulací tlaku a teploty podle typu omítky. Odstraníme plísně, řasy, lišejníky i usazené saze a prach.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M5 23 V8 L14 4 L23 8 V23" {...stroke} />
        <path d="M10 23 V14 H18 V23" {...stroke} />
        <path d="M5 23 H23" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Čištění střech",
    desc: "Vrátíme střeše původní barvu a zbavíme ji mechu a nánosů. Šetrný postup, který prodlouží životnost krytiny.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M4 13 L14 5 L24 13" {...stroke} />
        <path d="M6 13 V23 H22 V13" {...stroke} />
        <path d="M11 23 V17 H17 V23" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Dlažba a chodníky",
    desc: "Důkladné tlakové čištění dlažby, teras a chodníků. Odstraníme zelený povlak, mech i zašlou špínu mezi spárami.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <rect x="4" y="4" width="8" height="8" rx="1.5" {...stroke} />
        <rect x="16" y="4" width="8" height="8" rx="1.5" {...stroke} />
        <rect x="4" y="16" width="8" height="8" rx="1.5" {...stroke} />
        <rect x="16" y="16" width="8" height="8" rx="1.5" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Odstranění graffiti",
    desc: "Citlivé odstranění graffiti a postřiků z fasád i veřejných ploch bez poškození podkladu.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M6 18 L16 8 L20 12 L10 22 H6 Z" {...stroke} />
        <path d="M16 8 L19 5 L23 9 L20 12" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Nanoimpregnace",
    desc: "Speciální nanoimpregnace, která brání opětovnému růstu plísní a usazování nečistot. Fasáda zůstane v kondici minimálně 8 let.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 4 C 8 11, 6 15, 6 18 a8 8 0 0 0 16 0 c0-3-2-7-8-14 Z" {...stroke} />
        <path d="M11 17 a3 3 0 0 0 3 3" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Nátěry fasád",
    desc: "Opravíme drobné vady a oživíme barvu kvalitním nátěrem. Fasáda získá nejen čistotu, ale i novou ochranu.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <rect x="5" y="4" width="14" height="7" rx="1.5" {...stroke} />
        <path d="M19 7 H23 V12 H14 V11" {...stroke} />
        <path d="M14 12 V16 H12 V24 H16 V16 H14" {...stroke} />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="sluzby" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          label="Naše služby"
          title="Vše, co vaše budova potřebuje k novému začátku"
          intro="Od fasád přes střechy až po dlažbu — používáme moderní technologie, kvalitní přípravky a férový přístup."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="card fade-up flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1"
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-moss-veil)" }}
              >
                {s.icon}
              </span>
              <h3
                className="font-akkurat font-bold text-botanical-ink"
                style={{ fontSize: "20px", letterSpacing: "-0.04em" }}
              >
                {s.title}
              </h3>
              <p
                className="font-akkurat text-botanical-ink/75"
                style={{ fontSize: "16px", lineHeight: 1.6, letterSpacing: "-0.04em" }}
              >
                {s.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
