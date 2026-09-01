import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ContentProvider, loadContent, type Content } from "./content";
import { LOCALE, META, stripLocale } from "./i18n";

const root = createRoot(document.getElementById("root")!);

// Administrace žije na /dev — načítá se jen tam, na běžný web nepřidává váhu.
// Toleruje koncové lomítko i velikost písmen (/dev, /dev/, /DEV) a jazykový
// prefix (/de/dev spravuje německou mutaci).
const isAdmin =
  stripLocale(window.location.pathname).replace(/\/+$/, "").toLowerCase() ===
  "/dev";

/**
 * Barvy z administrace → CSS proměnné. Inline styl na <html> přebije hodnoty
 * z Tailwind @theme, takže celý web (tlačítka, ikony, akcenty) se přebarví
 * bez zásahu do kódu. Odvozené odstíny (hover) počítá color-mix.
 */
function applyTheme(theme: Content["theme"]) {
  const el = document.documentElement.style;
  if (/^#[0-9a-f]{6}$/i.test(theme.primary)) {
    el.setProperty("--color-warm-loam", theme.primary);
    el.setProperty(
      "--color-magenta-deep",
      `color-mix(in srgb, ${theme.primary}, #000 18%)`,
    );
  }
  if (/^#[0-9a-f]{6}$/i.test(theme.secondary)) {
    el.setProperty("--color-forest-floor", theme.secondary);
    el.setProperty(
      "--color-cyan-deep",
      `color-mix(in srgb, ${theme.secondary}, #000 18%)`,
    );
  }
}

/** Nastaví obsah meta tagu (podle name= nebo property=), pokud existuje. */
function setMeta(selector: string, content: string) {
  document.head
    .querySelector<HTMLMetaElement>(selector)
    ?.setAttribute("content", content);
}

/**
 * Hlavička dokumentu pro aktuální jazyk. `index.html` je psaný česky —
 * na `/de` se titulek, popisky, og tagy i strukturovaná data přepíšou
 * německou variantou, aby náhledy odkazů i vyhledávače viděly správný jazyk.
 */
function applyDocumentMeta() {
  document.documentElement.lang = META.htmlLang;
  document.title = META.title;
  setMeta('meta[name="description"]', META.description);
  setMeta('meta[property="og:locale"]', META.ogLocale);
  setMeta('meta[property="og:title"]', META.ogTitle);
  setMeta('meta[property="og:description"]', META.ogDescription);
  setMeta('meta[property="og:image:alt"]', META.ogImageAlt);
  setMeta('meta[property="og:url"]', META.canonical);
  setMeta('meta[name="twitter:title"]', META.twitterTitle);
  setMeta('meta[name="twitter:description"]', META.twitterDescription);
  document.head
    .querySelector<HTMLLinkElement>('link[rel="canonical"]')
    ?.setAttribute("href", META.canonical);

  // LocalBusiness: firma je stejná, mění se jen jazykové údaje.
  const ld = document.head.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"]',
  );
  if (ld) {
    try {
      const data = JSON.parse(ld.text);
      data.description = META.businessDescription;
      data.areaServed = META.areaServed;
      data.knowsAbout = META.knowsAbout;
      data.url = META.canonical;
      ld.text = JSON.stringify(data);
    } catch {
      // Poškozená strukturovaná data web nerozbijí — necháme je být.
    }
  }
}

/**
 * FAQPage strukturovaná data pro vyhledávače — generují se z živého obsahu,
 * takže po každé úpravě otázek v administraci zůstávají v synchronu.
 */
function injectFaqJsonLd(content: Content) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: META.htmlLang,
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  });
  document.head.appendChild(script);
}

async function boot() {
  const content = await loadContent(LOCALE);
  applyTheme(content.theme);

  if (isAdmin) {
    const { default: Admin } = await import("./admin/Admin.tsx");
    root.render(
      <StrictMode>
        <Admin initialContent={content} />
      </StrictMode>,
    );
    return;
  }

  applyDocumentMeta();
  injectFaqJsonLd(content);
  root.render(
    <StrictMode>
      <ContentProvider value={content}>
        <App />
      </ContentProvider>
    </StrictMode>,
  );
}

void boot();
