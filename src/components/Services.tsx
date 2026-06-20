import SectionHeading from "./SectionHeading";
import { TEXT } from "../lib/text";
import PhotoCarousel from "./PhotoCarousel";
import type { CarouselPhoto } from "./PhotoCarousel";
import pic1 from "../assets/pic1.webp";
import pic2 from "../assets/pic2.webp";
import pic3 from "../assets/pic3.webp";
import pic4 from "../assets/pic4.webp";
import pic5 from "../assets/pic5.webp";
import pic6 from "../assets/pic6.webp";
import pic7 from "../assets/pic7.webp";
import pic8 from "../assets/pic8.webp";
import pic9 from "../assets/pic9.webp";
import pic10 from "../assets/pic10.webp";

// Reference photo carousel - the 10 optimized reference photos.
const PHOTOS: CarouselPhoto[] = [
  { src: pic1 },
  { src: pic10 },
  { src: pic3 },
  { src: pic4 },
  { src: pic5 },
  { src: pic6 },
  { src: pic7 },
  { src: pic8 },
  { src: pic9 },
  { src: pic2 },
];

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
    title: "Mytí a čištění fasád",
    desc: "Tlakové mytí horkou vodou v kombinaci se speciální chemií. Odstraníme organické nečistoty (plísně, řasy a lišejníky) i anorganické (saze, prach a mastnota). Tlak, teplotu i trysky volíme podle typu a stavu omítky.",
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
    desc: "Vrátíme střeše původní barvu a zbavíme ji mechu, řas a nánosů. Šetrný postup s ohledem na typ krytiny, který prodlouží její životnost a obnoví odvod vody.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M3 18 L14 7 L25 18 Z" {...stroke} />
        <path d="M18 11 L18 5.5 L20.5 5.5 L20.5 13.5" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Čištění dlažby a chodníků",
    desc: "Důkladné tlakové čištění dlažby, teras, chodníků a zámkové dlažby. Odstraníme zelený povlak, mech i zašlou špínu ze spár a vrátíme povrchům čistý, svěží vzhled.",
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
    desc: "Citlivé odstranění graffiti, postřiků a posprejování z fasád i veřejných ploch, bez poškození podkladu. Plochu lze následně ošetřit ochranným nátěrem proti dalšímu posprejování.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M6 18 L16 8 L20 12 L10 22 H6 Z" {...stroke} />
        <path d="M16 8 L19 5 L23 9 L20 12" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Nanoimpregnace",
    desc: "Na vyčištěnou fasádu naneseme speciální nanoimpregnaci, která brání opětovnému růstu plísní a usazování nečistot. Podle typu fasády a podmínek vydrží její účinek zhruba 5–10 let.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 4 C 8 11, 6 15, 6 18 a8 8 0 0 0 16 0 c0-3-2-7-8-14 Z" {...stroke} />
        <path d="M11 17 a3 3 0 0 0 3 3" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Nátěry a opravy fasád",
    desc: "Opravíme drobné vady a oživíme barvu kvalitním fasádním nátěrem. Fasáda tak získá nejen čistotu, ale i novou ochranu a sjednocený, svěží vzhled.",
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
          label=""
          title="Kompletní čištění fasád, střech i dlažby"
          intro="Od fasád přes střechy až po dlažbu. Postup, tlak i přípravky volíme podle typu a stavu každého povrchu."
        />

        <div className="mt-14 fade-up">
          <PhotoCarousel photos={PHOTOS} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="card fade-up group relative overflow-hidden"
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              {/* Gradient tint that eases in on hover (opacity animates - a
                  gradient background-image itself can't be transitioned). Blue
                  and pink alternate across the cards. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                style={{
                  backgroundImage:
                    i % 2 === 0
                      ? "linear-gradient(135deg, #eaf6fd 0%, #c6e4fa 100%)"
                      : "linear-gradient(135deg, #fdeef5 0%, #f6d2e4 100%)",
                }}
              />

              <div className="relative flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--color-moss-veil)" }}
                  >
                    {s.icon}
                  </span>
                  <h3
                    className="font-akkurat font-bold text-botanical-ink"
                    style={TEXT.cardTitle}
                  >
                    {s.title}
                  </h3>
                </div>
                <p
                  className="font-akkurat text-botanical-ink/75"
                  style={TEXT.body}
                >
                  {s.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
