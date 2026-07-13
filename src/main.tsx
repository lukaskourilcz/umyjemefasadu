import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ContentProvider, loadContent } from "./content";

const root = createRoot(document.getElementById("root")!);

// Administrace žije na /dev — načítá se jen tam, na běžný web nepřidává váhu.
const isAdmin = window.location.pathname.replace(/\/+$/, "") === "/dev";

async function boot() {
  const content = await loadContent();

  if (isAdmin) {
    const { default: Admin } = await import("./admin/Admin.tsx");
    root.render(
      <StrictMode>
        <Admin initialContent={content} />
      </StrictMode>,
    );
    return;
  }

  root.render(
    <StrictMode>
      <ContentProvider value={content}>
        <App />
      </ContentProvider>
    </StrictMode>,
  );
}

void boot();
