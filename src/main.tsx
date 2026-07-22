import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ContentProvider, loadContent, type Content } from "./content";

const root = createRoot(document.getElementById("root")!);

// Administrace žije na /dev — načítá se jen tam, na běžný web nepřidává váhu.
// Toleruje koncové lomítko i velikost písmen (/dev, /dev/, /DEV).
const isAdmin =
  window.location.pathname.replace(/\/+$/, "").toLowerCase() === "/dev";

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
    el.setProperty(
      "--color-action-hover",
      `color-mix(in srgb, ${theme.primary}, #000 18%)`,
    );
    el.setProperty(
      "--color-magenta-deep",
      `color-mix(in srgb, ${theme.primary}, #000 18%)`,
    );
  }
  if (/^#[0-9a-f]{6}$/i.test(theme.secondary)) {
    el.setProperty("--color-accent", theme.secondary);
    el.setProperty("--color-forest-floor", theme.secondary);
    el.setProperty(
      "--color-cyan-deep",
      `color-mix(in srgb, ${theme.secondary}, #000 18%)`,
    );
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
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  });
  document.head.appendChild(script);
}

async function boot() {
  const content = await loadContent();
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
