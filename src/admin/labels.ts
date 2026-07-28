/**
 * Lidsky čitelné české popisky pro administraci. Klíče odpovídají názvům polí
 * v obsahovém modelu (`src/content/schema.ts`). Co tu není, zobrazí se pod
 * původním názvem klíče.
 */

/** Pořadí a názvy hlavních sekcí v administraci. */
export const SECTIONS: { key: string; title: string; help?: string }[] = [
  { key: "business", title: "Firma a kontaktní údaje", help: "Název firmy, sídlo, IČO, telefon, e-mail a otevírací doba. Používají se v celém webu." },
  { key: "theme", title: "Vzhled — barvy webu", help: "Hlavní barva se používá pro tlačítka a výzvy, doplňková pro ikony a akcenty. Změna se hned promítne do náhledu; na web se dostane po publikaci." },
  { key: "nav", title: "Horní menu", help: "Odkazy v horní liště a text hlavního tlačítka." },
  { key: "revealHero", title: "Úvod — fotka před / po", help: "Velká úvodní fotka s odhalením a nadpisem." },
  { key: "hero", title: "Úvod — sekce s videi", help: "Nadpis, text, tlačítka a koláž videí/gifů." },
  { key: "trustStrip", title: "Pruh důvěry", help: "Krátké body pod úvodem (pojištění, ekologie…)." },
  { key: "whyClean", title: "Proč čistit fasádu, střechu a dlažbu", help: "Edukační sekce o fasádě, bloky o střeše a dlažbě, ochrana proti vodě s nanoimpregnací a široká fotografie výsledku." },
  { key: "risks", title: "Rizika znečištěné fasády", help: "Tři rizika a doporučené řešení s výzvou k bezplatné prohlídce." },
  { key: "services", title: "Služby", help: "Hlavní video služby s náhradní fotografií a jednotlivé foto karty." },
  { key: "process", title: "Postup čištění", help: "Kroky postupu a malé doprovodné video vedle časové osy." },
  { key: "whyUs", title: "Proč my + reference", help: "Body proč my, záruka a rotující reference zákazníků." },
  { key: "stats", title: "Čísla / statistiky", help: "Čísla v pruhu (m², zakázky…). Vypnuto — zapněte přepínačem, až budete mít reálná čísla." },
  { key: "team", title: "Náš tým", help: "Fotka týmu a členové. Vypnuto — zapněte přepínačem a doplňte reálné foto a text." },
  { key: "references", title: "Vybrané zakázky", help: "Konkrétní zakázky s fotkami a údaji." },
  { key: "pricing", title: "Ceník", help: "Orientační ceník a poznámky." },
  { key: "orderProcess", title: "Jak objednat", help: "Kroky od poptávky k nabídce." },
  { key: "faq", title: "Časté dotazy", help: "Otázky a odpovědi." },
  { key: "contact", title: "Kontaktní sekce", help: "Závěrečná výzva a formulář." },
  { key: "footer", title: "Patička", help: "Právní údaje a ochrana osobních údajů." },
  { key: "callBar", title: "Mobilní lišta", help: "Tlačítka spodní lišty na mobilu." },
];

/** Popisky jednotlivých polí. */
export const LABELS: Record<string, string> = {
  // sdílené
  title: "Nadpis",
  heading: "Nadpis sekce",
  intro: "Úvodní text",
  desc: "Popis",
  label: "Popisek",
  value: "Hodnota",
  name: "Jméno",
  role: "Role",
  exp: "Praxe",
  bio: "Medailonek",
  cta: "Text tlačítka",
  text: "Text",
  meta: "Doplněk (město · služba)",
  q: "Otázka",
  a: "Odpověď",
  excerpt: "Úryvek",
  no: "Pořadové číslo",
  price: "Cena",
  note: "Poznámka",
  service: "Služba",
  eyebrow: "Malý popisek nahoře",
  body: "Text",
  ctaPrimary: "Hlavní tlačítko",
  ctaSecondary: "Druhé tlačítko",
  href: "Odkaz (kotva, např. #kontakt)",
  // média
  image: "Obrázek",
  imageAlt: "Popis obrázku (SEO a přístupnost)",
  imageLabel: "Popisek na obrázku",
  images: "Fotky",
  alt: "Popis obrázku (pro čtečky a SEO)",
  videos: "Videa / gify",
  beforeImage: "Fotka PŘED",
  afterImage: "Fotka PO",
  src: "Soubor",
  video: "Video (webm/mp4)",
  videoAlt: "Popis videa (pro čtečky a SEO)",
  videoLabel: "Popisek na videu",
  sideVideo: "Malé video vedle postupu",
  sideVideoAlt: "Popis malého videa",
  sideVideoLabel: "Popisek malého videa",
  // kontakt
  phone: "Telefon",
  email: "E-mail",
  hours: "Otevírací doba",
  companyName: "Oficiální název firmy",
  address: "Sídlo firmy",
  companyId: "IČO",
  // reveal hero
  headlineLines: "Řádky velkého nadpisu",
  labelBeforePrefix: "Štítek PŘED — 1. slovo",
  labelBeforeSuffix: "Štítek PŘED — 2. slovo",
  labelAfterPrefix: "Štítek PO — 1. slovo",
  labelAfterSuffix: "Štítek PO — 2. slovo",
  scrollCue: "Popisek pod tlačítkem (skrolujte)",
  // seznamy sekcí
  links: "Odkazy v menu",
  items: "Položky",
  points: "Body",
  quotes: "Reference zákazníků",
  quotesLabel: "Popisek nad referencemi",
  members: "Členové týmu",
  steps: "Kroky",
  methods: "Metody",
  rows: "Řádky ceníku",
  studies: "Zakázky",
  facts: "Údaje o zakázce",
  articles: "Články",
  badge: "Štítek",
  promises: "Sliby (odrážky)",
  areas: "Oblasti působení",
  areasLabel: "Popisek oblastí",
  footnote: "Poznámka pod ceníkem",
  featured: "Hlavní (velká) karta",
  tintCards: "Barevné karty",
  photoCards: "Foto karty",
  // záruka
  guaranteeNumber: "Záruka — číslo",
  guaranteeUnit: "Záruka — jednotka",
  guaranteeTitle: "Záruka — nadpis",
  guaranteeDesc: "Záruka — popis",
  // patička
  legalLine: "Právní řádek (IČO, adresa…)",
  privacyLabel: "Odkaz na ochranu údajů",
  privacyTitle: "Ochrana údajů — nadpis",
  privacyBody: "Ochrana údajů — odstavce",
  // call bar
  inquiry: "Tlačítko poptávka",
  call: "Tlačítko zavolat",
  // formulář
  formEndpoint: "URL formuláře (prázdné = otevře e-mail)",
  formNameLabel: "Formulář — jméno",
  formPhoneLabel: "Formulář — telefon",
  formMessageLabel: "Formulář — zpráva",
  formMessagePlaceholder: "Formulář — nápověda ve zprávě",
  formSubmit: "Formulář — tlačítko",
  sentTitle: "Po odeslání — nadpis",
  sentBody: "Po odeslání — text",
  consent: "Souhlas se zpracováním údajů",
  phoneLabel: "Popisek telefonu",
  emailLabel: "Popisek e-mailu",
};

// nové sekce + přepínač viditelnosti
LABELS.visible = "Zobrazit sekci na webu";
LABELS.quotesVisible = "Zobrazit reference na webu";
// vzhled
LABELS.primary = "Hlavní barva (tlačítka, výzvy)";
LABELS.secondary = "Doplňková barva (ikony, akcenty)";
// formulář — doplňky
LABELS.formNamePlaceholder = "Formulář — nápověda ve jménu";
LABELS.formPhonePlaceholder = "Formulář — nápověda v telefonu";
LABELS.formSending = "Formulář — text při odesílání";
LABELS.formError = "Formulář — text při chybě";
LABELS.mailtoSubject = "Předmět e-mailu s poptávkou";
LABELS.mailtoNote = "Vysvětlivka pod formulářem (e-mail)";
LABELS.paragraphs = "Odstavce textu";
LABELS.bullets = "Odrážky";
LABELS.reasonsHeading = "Čištění střechy a dlažby — nadpis";
LABELS.reasons = "Bloky — střecha a dlažba";
LABELS.risksTitle = "Rizika — nadpis";
LABELS.risksIntro = "Rizika — úvodní text (lze nechat prázdné)";
LABELS.risks = "Rizika a problémy (popis lze nechat prázdný)";
LABELS.protectionTitle = "Ochrana proti vodě — nadpis";
LABELS.protectionIntro = "Ochrana proti vodě — úvod";
LABELS.protectionBullets = "Ochrana proti vodě — odrážky";
LABELS.protectionHow = "Ochrana proti vodě — jak to funguje";
LABELS.protectionNanoIntro = "Nanoimpregnace — úvodní text";
LABELS.protectionNanoLead = "Nanoimpregnace — věta uvádějící výhody";
LABELS.protectionNanoBullets = "Nanoimpregnace — hlavní výhody";
LABELS.solutionTitle = "Řešení — nadpis";
LABELS.solutionDesc = "Řešení — text";
LABELS.solutionCta = "Řešení — text tlačítka";

export function labelFor(key: string): string {
  return LABELS[key] ?? key;
}

/**
 * Klíče, jejichž hodnota je obrázek/video (nahrává se souborem, ne textem).
 * `src` je soubor uvnitř seznamu fotek, `videos` jsou soubory v poli řetězců.
 */
export const MEDIA_KEYS = new Set([
  "image",
  "beforeImage",
  "afterImage",
  "src",
  "video",
]);

/** Je pole (string[]) seznam médií? (podle názvu klíče) */
export function isMediaArrayKey(key: string): boolean {
  return key === "videos";
}

/** Klíče, jejichž hodnota je barva (upravují se výběrem barvy, ne textem). */
export const COLOR_KEYS = new Set(["primary", "secondary"]);
