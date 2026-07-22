import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { ContentProvider, type Content } from "./content";

export function render(content: Content): string {
  return renderToString(
    <StrictMode>
      <ContentProvider value={content}>
        <App />
      </ContentProvider>
    </StrictMode>,
  );
}
