/**
 * Obsahový model webu — jediný zdroj pravdy pro VŠECHNY texty a obrázky.
 *
 * Web čte tato data za běhu ze souboru `public/content.json`
 * (viz `loadContent`). Administrace na `/dev` je stejná struktura
 * upravovaná ve formuláři a ukládaná zpět do `content.json`.
 *
 * Když sem přidáte nové pole, doplňte ho i do `defaultContent.ts`
 * (a ideálně do administrace v `src/admin/schema.tsx`).
 */

export type NavLink = { href: string; label: string };

export type Fact = { label: string; value: string };

export type StudyImage = { src: string; alt: string };

export type Content = {
  /** Sdílené kontaktní údaje (nav, patička, kontakt, mobilní lišta). */
  business: {
    phone: string; // vč. mezinárodní předvolby, např. +420 775 222 760
    email: string;
    hours: string; // např. Po–Pá 7:00–18:00
  };

  /** Barvy webu — hex hodnoty, aplikují se za běhu jako CSS proměnné. */
  theme: {
    /** Hlavní akční barva (tlačítka, CTA). */
    primary: string;
    /** Doplňková barva (ikony, odkazy, akcenty). */
    secondary: string;
  };

  nav: {
    links: NavLink[];
    cta: string;
  };

  /** Úvodní „před / po" hero se skrolovacím odhalením. */
  revealHero: {
    beforeImage: string;
    afterImage: string;
    headlineLines: string[]; // tři řádky velkého nadpisu
    labelBeforePrefix: string; // „Před"
    labelBeforeSuffix: string; // „vyčištěním"
    labelAfterPrefix: string; // „Po"
    labelAfterSuffix: string; // „vyčištění"
    cta: string;
    scrollCue: string; // „Skrolujte"
  };

  /** Druhý hero: nadpis + text + koláž videí/gifů. */
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    videos: string[]; // 4 videa/gify
  };

  trustStrip: {
    items: string[];
  };

  /** „Proč si nechat vyčistit fasádu" — marketingová/edukační sekce nahoře. */
  whyClean: {
    heading: string;
    paragraphs: string[];
    bullets: string[];
    protectionTitle: string;
    protectionIntro: string;
    protectionBullets: string[];
    protectionHow: string;
  };

  /** „Rizika znečištěné fasády" — sekce nahoře. */
  risks: {
    heading: string;
    intro: string;
    items: { no: string; title: string; desc: string }[];
    solutionTitle: string;
    solutionDesc: string;
    /** Text tlačítka pod doporučením (vede na kontakt). */
    solutionCta: string;
  };

  services: {
    heading: string;
    intro: string;
    featured: { image: string; alt: string; title: string; desc: string };
    tintCards: { title: string; desc: string }[];
    photoCards: { image: string; alt: string; title: string; desc: string }[];
  };

  process: {
    heading: string;
    intro: string;
    steps: { no: string; title: string; desc: string }[];
    methods: { title: string; desc: string }[];
  };

  whyUs: {
    heading: string;
    intro: string;
    cta: string;
    guaranteeNumber: string;
    guaranteeUnit: string;
    guaranteeTitle: string;
    guaranteeDesc: string;
    points: { title: string; desc: string }[];
    /** Zobrazit rotující reference zákazníků? Zapněte, až budete mít skutečné. */
    quotesVisible: boolean;
    quotesLabel: string;
    quotes: { text: string; name: string; meta: string }[];
  };

  stats: {
    /** Zobrazit sekci na webu? */
    visible: boolean;
    items: { value: string; label: string }[];
  };

  team: {
    /** Zobrazit sekci na webu? */
    visible: boolean;
    heading: string;
    intro: string;
    image: string;
    imageAlt: string;
    members: { name: string; role: string; exp: string; bio: string }[];
  };

  references: {
    heading: string;
    intro: string;
    studies: {
      type: string;
      city: string;
      facts: Fact[];
      desc: string;
      images: StudyImage[];
    }[];
  };

  pricing: {
    heading: string;
    intro: string;
    rows: { service: string; price: string; note: string }[];
    footnote: string;
    cta: string;
  };

  orderProcess: {
    heading: string;
    intro: string;
    steps: { no: string; title: string; desc: string }[];
  };

  faq: {
    heading: string;
    items: { q: string; a: string }[];
  };

  advice: {
    heading: string;
    intro: string;
    badge: string;
    articles: { no: string; title: string; excerpt: string }[];
  };

  contact: {
    heading: string;
    body: string;
    promises: string[];
    areasLabel: string;
    areas: string[];
    phoneLabel: string;
    emailLabel: string;
    hours: string;
    /** Prázdné = formulář otevře e-mail. Jinak URL (např. Formspree). */
    formEndpoint: string;
    formNameLabel: string;
    formNamePlaceholder: string;
    formPhoneLabel: string;
    formPhonePlaceholder: string;
    formMessageLabel: string;
    formMessagePlaceholder: string;
    formSubmit: string;
    formSending: string;
    formError: string;
    /** Předmět e-mailu, který formulář předvyplní (bez vlastního serveru). */
    mailtoSubject: string;
    /** Vysvětlivka pod formulářem, když se odesílá přes e-mail. */
    mailtoNote: string;
    sentTitle: string;
    sentBody: string;
    consent: string;
  };

  footer: {
    legalLine: string;
    privacyLabel: string;
    privacyTitle: string;
    privacyBody: string[];
  };

  callBar: {
    inquiry: string;
    call: string;
  };
};
