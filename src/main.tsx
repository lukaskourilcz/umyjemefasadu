import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ContentProvider, isPreview, loadContent, type Content } from "./content";

const rootElement = document.getElementById("root")!;

// Administrace žije na /dev — načítá se jen tam, na běžný web nepřidává váhu.
// Toleruje koncové lomítko i velikost písmen (/dev, /dev/, /DEV).
const isAdmin = window.location.pathname.replace(/\/+$/, "").toLowerCase() === "/dev";

/**
 * Barvy z administrace → CSS proměnné. Inline styl na <html> přebije hodnoty
 * z Tailwind @theme, takže celý web (tlačítka, ikony, akcenty) se přebarví
 * bez zásahu do kódu. Odvozené odstíny (hover) počítá color-mix.
 */
function applyTheme(theme: Content["theme"]) {
  const el = document.documentElement.style;
  if (/^#[0-9a-f]{6}$/i.test(theme.primary)) {
    el.setProperty("--color-action", theme.primary);
    el.setProperty("--color-warm-loam", theme.primary);
    el.setProperty("--color-action-hover", `color-mix(in srgb, ${theme.primary}, #000 18%)`);
    el.setProperty("--color-magenta-deep", `color-mix(in srgb, ${theme.primary}, #000 18%)`);
  }
  if (/^#[0-9a-f]{6}$/i.test(theme.secondary)) {
    el.setProperty("--color-accent", theme.secondary);
    el.setProperty("--color-forest-floor", theme.secondary);
    el.setProperty("--color-cyan-deep", `color-mix(in srgb, ${theme.secondary}, #000 38%)`);
  }
}

/**
 * FAQPage strukturovaná data pro vyhledávače — generují se z živého obsahu,
 * takže po každé úpravě otázek v administraci zůstávají v synchronu.
 */
function injectJsonLd(id: string, data: unknown) {
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}

function injectStructuredData(content: Content) {
  injectJsonLd("business-json-ld", {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: content.business.companyName,
    image: "https://www.umyjemefasadu.cz/og-image.png",
    logo: "https://www.umyjemefasadu.cz/logo.svg",
    url: "https://www.umyjemefasadu.cz/",
    telephone: content.business.phone.replace(/\s/g, ""),
    email: content.business.email,
    identifier: `IČO ${content.business.companyId}`,
    address: content.business.address,
    priceRange: "$$",
    description: content.hero.body,
    areaServed: content.contact.areas,
    knowsAbout: [
      "mytí fasád",
      "čištění střech",
      "čištění dlažby",
      "odstranění graffiti",
      "nanoimpregnace",
    ],
  });

  injectJsonLd("faq-json-ld", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  });
}

async function boot() {
  const content = await loadContent();
  applyTheme(content.theme);

  if (isAdmin) {
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) robots.content = "noindex, nofollow, noarchive";
    const { default: Admin } = await import("./admin/Admin.tsx");
    rootElement.replaceChildren();
    document.documentElement.classList.remove("admin-route");
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <Admin initialContent={content} />
      </StrictMode>,
    );
    return;
  }

  injectStructuredData(content);
  const app = (
    <StrictMode>
      <ContentProvider value={content}>
        <App />
      </ContentProvider>
    </StrictMode>
  );
  if (rootElement.hasChildNodes() && !isPreview()) hydrateRoot(rootElement, app);
  else createRoot(rootElement).render(app);
}

void boot();
