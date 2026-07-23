# Umyjeme Fasádu

Czech lead-generation website for professional cleaning of facades, roofs, and
paving. Goal: more qualified enquiries and calls, backed by authentic before/after
evidence and a direct quote flow.

## Tech stack

- **Framework:** Vite + React + TypeScript
- **Rendering:** Static prerender (SSR build → static HTML), runtime fallback JSON
- **UI:** Tailwind CSS
- **Content admin:** lazy-loaded `/dev` editor, kept out of the public bundle
- **Testing:** Vitest, Playwright, axe-core (accessibility)

## Connected third parties

- **Resend** — sends the contact-form enquiry emails from a serverless function.
- **GitHub** — the `/dev` editor publishes edited content by committing to the repo.
- **Vercel** — hosting plus serverless functions for login, publishing, and contact.

## Key libraries

- `@axe-core/playwright` — automated accessibility checks (WCAG 2.2 AA target).
