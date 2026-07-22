# fable-suggestions.md — UX modernization audit

Audit of the full landing page (all 18 components + `index.css` + `index.html`).
Focus: removing "AI slop" patterns, making the site feel modern and professional,
and tightening mobile/tablet responsiveness.

Priorities: **P0** = looks broken/unfinished to a visitor · **P1** = high-impact modernization · **P2** = polish.

---

## 1. AI-slop tells (things that make it look generated)

### 1.1 Five identical card-grid sections in a row — P1

`Services` (3×2 grid) → `Process` (3 cards) → `WhyUs` (4 check-cards) → `Gallery` (3 cards) → `OrderProcess` (4 columns). Every section is the same recipe: _icon-in-a-tinted-circle + bold title + 75%-opacity gray paragraph_, in a symmetric grid with staggered `fade-up` delays. This uniform rhythm is the single strongest "made by Claude" tell.

**Fix:** vary the layout language per section.

- `OrderProcess.tsx` is already the most modern section on the page (mono number + hairline rule, no card chrome). Extend that editorial language instead of boxes.
- Rebuild `Services.tsx` as a **bento layout**: one large featured card ("Mytí a čištění fasád") using a real photo/video (`pic*.webp` / `fasada*.webm`), with smaller quieter cells around it. You already own strong real imagery — for a cleaning trade it converts far better than abstract line icons.
- Convert `WhyUs.tsx` points from check-cards to a plain list with hairline dividers (drop the `lichen` card fill and the check-in-circle badge).

### 1.2 Icon-in-circle everywhere — P1

`moss-veil` circle + stroke icon appears in Services, Process, WhyUs, FAQ, OrderProcess. Kill the circle chip; let icons stand free at a larger size (32–40px), or replace with photography/numerals. One accent shape per page reads intentional; five reads templated.

### 1.3 `fade-up` on nearly every DOM node — P1

Staggered `transitionDelay` reveals on every card/heading/button (`useFadeUpReveal` + ~30 `fade-up` usages) is the signature AI motion pattern.

**Fix:** reveal at **section level only** (one fade per section, no per-card stagger), or drop reveals entirely and let `RevealHero` be the page's single signature motion. Also remove `logo-float` (index.css:201) — a levitating drop-shadowed logo reads gimmicky, not premium.

### 1.4 Decorative gradient tints over real photos/videos — P1

- Hero collage tiles: 25%-opacity pink/blue gradient over each video (`Hero.tsx:138-164`).
- Carousel: 12% tint that fades on hover (`PhotoCarousel.tsx:74-81`).
- Service cards: alternating pink/blue gradient wash on hover (`Services.tsx:135-144`).

Tinting real work-photos with brand gradients hides the product (clean facades) and is a classic slop decoration. **Fix:** show photos untinted; express brand color only in CTAs, links and one accent band.

### 1.5 Gradient stat band with soft numbers — P1

`Stats.tsx`: full-width cyan gradient + three big numbers, where "100 % ekologické přípravky" and "0 Kč za prohlídku" aren't really stats. Every AI landing page has this band.

**Fix:** either replace with real proof (m² cleaned, number of completed jobs, years of experience) once numbers exist, or fold the two honest claims into `WhyUs`/hero and delete the section.

### 1.6 TrustStrip as a loud gradient banner — P1

A full-bleed magenta band with four check-pills directly under the hero (`TrustStrip.tsx`) competes with the hero CTA, and its "micro-label" is scaled up to 28px (a mono uppercase _heading_ — micro-label misuse, `TrustStrip.tsx:26`).

**Fix:** replace with a quiet single-row trust line (small monochrome icons + text: "Pojištěno u Generali · Ekologické přípravky · Ochrana 5–10 let") placed under the hero CTAs. Loud banners read ad-like; quiet proof reads professional.

### 1.7 A different pastel gradient behind every section — P2

Process = blue gradient, Gallery = lichen fade, FAQ = pink gradient, Stats = cyan, TrustStrip = magenta. The alternating-pastel-band scroll is template-ish.

**Fix:** pick one surface rhythm: cream canvas + at most one mist-tinted band (e.g. Process) + one dark/ink moment (see 2.4). Remove the pink FAQ gradient — FAQ should be the calmest section on the page.

### 1.8 Copy: "Poskytneme lesk pro vaši fasádu" — P2

The `RevealHero` headline is awkward marketing-speak in Czech ("poskytneme lesk"). Something direct and concrete works better with the before/after visual, e.g. **"Umyjeme vaši fasádu"** (it's literally the brand name) or "Z šedé fasády zase bílá".

### 1.9 Leftover template artifacts — P0

- `public/leaf.svg` is still the favicon (`index.html:8`) — a leaf icon from the old "botanical journal" theme on a facade-cleaning brand.
- Footer ships `IČO 00000000` with a TODO (`Footer.tsx:26-30`).
- `index.css` still says "Adaline — botanical journal at dawn" and tokens are named `botanical-ink`, `forest-floor`, `moss-veil`… harmless internally, but rename when convenient (P2) — it confuses every future edit.

---

## 2. Modernization (structure & visual language)

### 2.1 Double hero / buried CTA — P1

The page opens with a 200vh scroll-jacked `RevealHero`, followed by a _second_ full hero (`Hero.tsx`) with the actual H1 + CTAs. A visitor must scroll ~2 viewports before seeing any value proposition or button.

**Fix (pick one):**

- Overlay the primary CTA ("Nezávazná poptávka" / phone) on `RevealHero` itself, bottom-left next to the caption; or
- Shorten the track to ~130vh on desktop and ~110vh on mobile (`RevealHero.tsx:90`) so the second hero arrives after one flick; or
- Merge: make the before/after reveal _the_ hero backdrop with H1 + CTAs on top, and delete the second hero's collage column.

### 2.2 Heading hierarchy is inverted — P0

The first heading on the page is an `<h2>` (`RevealHero.tsx:126`) and the `<h1>` comes a full section later (`Hero.tsx:77`). Swap: RevealHero's headline should be the `<h1>`, and the second hero heading an `<h2>` (or restructure per 2.1). Cheap fix, matters for SEO + screen readers.

### 2.3 Typography: escape the "Inter everywhere" look — P1

Inter 400/700 with aggressive negative tracking is the default AI aesthetic.

- Give **headings** a characterful grotesk (e.g. Space Grotesk, or a Fontshare face like General Sans / Clash Grotesk) and keep Inter for body. One font swap changes the perceived brand more than any layout change.
- Remove the universal `* { letter-spacing: -0.04em }` (`index.css:63-66`) — global negative tracking hurts small-size legibility; scope tight tracking to headings only.
- Replace the ~40 inline `style={{ fontSize: "18px" … }}` blocks and `lib/text.ts` px presets with fluid tokens in `@theme` (`clamp()`-based `--text-h2`, `--text-body`, …). Today the scale is fixed px, so type doesn't adapt between phone → tablet → desktop, and every tweak means touching a dozen files.

### 2.4 Add one dark "ink" moment — P2

Everything is cream/pastel; the page has no tonal anchor. Modern trade sites almost always ground the page with one dark section. Best candidates: invert the **footer** to `botanical-ink` background (cream text, magenta CTA), or make the **Contact** card dark. Also upgrade the footer content: section links, service area, GDPR/privacy line — current footer is only a logo + two contacts, thin for a professional CZ business.

### 2.5 Contact section is a thin conversion point — P1

`Contact.tsx` is just two link cards. For the only conversion surface on the page:

- Add a **minimal form** (jméno, telefon, zpráva — 3 fields max) posting to email/Formspree; many visitors won't call.
- Add service area ("Působíme v … a okolí") and response expectation ("Ozveme se do 24 hodin") — concrete promises are the modern trust pattern.
- Fix the odd `pl-3 md:pl-0` asymmetric padding (`Contact.tsx:16`).

### 2.6 Two "process" sections — P2

`Process` (3 steps + 2 method cards) and `OrderProcess` (4 steps) are both step-flows; visitors can't tell "how we clean" from "how to order" at a glance. Merge into one section with two clearly-labelled tracks, or retitle strongly and move the METHODS cards into `Services`.

### 2.7 Gallery ships placeholders — P0

`Gallery.tsx` renders three gray "Před/Po" placeholder sliders (TODO at line 16). To a visitor this reads _unfinished website_. Until real before/after pairs exist, hide the section — the `RevealHero` and carousel already show real results. (`dirty-hero.webp`/`clean-hero.webp` could also seed one real slider item.)

---

## 3. Responsiveness — mobile & tablet

### 3.1 Mobile hero order & CTA alignment — P0

- In `Hero.tsx:57-106` the video collage renders **above** the headline on mobile — users scroll past 4 autoplaying videos before reading the H1. Add `order-2 md:order-1` / `order-1 md:order-2` so copy comes first on phones.
- CTA row uses `justify-end … md:justify-start` (`Hero.tsx:98`) — buttons are **right-aligned on phones**, which looks like a bug. Should be `justify-start`, with `.btn-primary` full-width (`w-full sm:w-auto`) on small screens.

### 3.2 200vh scroll track on mobile — P1

Two full viewports of thumb-scrolling through `RevealHero` before any content is heavy on phones. Reduce the track to ~120–140vh under `md`, or complete the reveal faster (progress × 1.5 clamp).

### 3.3 Nav logo overlap window (1024–1199px) — P1

Center links show from `lg:` (1024px, `Nav.tsx:86`) but the comment/intent says 1200px, and the absolutely-positioned 180px logo only moves right at `min-[1200px]`. Between 1024–1199 the floating logo can collide with the centered links. Either show links from `min-[1200px]:` or shrink the logo in that window. Longer-term: a 180px-tall floating logo overlapping page content is itself dated — a ~44–56px lockup inside the bar is the modern norm and removes this whole class of bugs.

### 3.4 Video weight on mobile — P1

The four hero collage videos total **~6.3 MB** and all autoplay at load (`Hero.tsx`), on top of the LCP hero images.

- Add `preload="metadata"` + `poster` (webp frame) to each `<video>`.
- Play/pause via `IntersectionObserver`; pause when off-screen.
- Under `prefers-reduced-motion`, show the poster instead of autoplaying (currently videos play regardless — the only motion on the site that ignores the preference).
- Consider serving static webp stills below `md` instead of video.
- Preload the true LCP asset: `<link rel="preload" as="image" href={dirty-hero.webp}>` in `index.html`.

### 3.5 CallBar on portrait tablets — P2

`CallBar` is `md:hidden` (`CallBar.tsx:14`), so a 768–1023px portrait tablet gets neither the call bar; verify the nav CTA is reliably visible there (it is from `sm:` — OK), but consider `lg:hidden` so tablets keep tap-to-call.

### 3.6 Slider keyboard focus is invisible — P2

The before/after `<input type="range">` is `opacity-0` over the whole card (`Gallery.tsx:105-113`), so keyboard users get no visible focus. Mirror `:focus-visible` from the input onto the handle (e.g. `input:focus-visible + …` ring on the divider knob).

### 3.7 Small-screen typography — P2

`RevealHero` headline uses `lineHeight: 0.75` with glass boxes per line — verify diacritics (Ř, Á) don't clip on 320px-wide screens at the 42px clamp floor. TrustStrip pills at `border-2` + 15px text wrap awkwardly around 360px; the 2×2 grid fallback handles it, but re-test after 1.6's redesign.

---

## 4. Quick wins (small, do anytime)

| #   | Item                                                                 | File                                |
| --- | -------------------------------------------------------------------- | ----------------------------------- |
| 1   | Replace leaf favicon with brand mark                                 | `index.html:8`, `public/leaf.svg`   |
| 2   | Real IČO + address in footer & LocalBusiness JSON-LD                 | `Footer.tsx`, `index.html:63`       |
| 3   | Add `FAQPage` JSON-LD (FAQ content already exists)                   | `index.html`, `Faq.tsx`             |
| 4   | Fix mobile CTA `justify-end` → `justify-start`                       | `Hero.tsx:98`                       |
| 5   | Copy-first column order on mobile hero                               | `Hero.tsx:57-71`                    |
| 6   | H1/H2 swap between the two heroes                                    | `RevealHero.tsx:126`, `Hero.tsx:77` |
| 7   | Hide placeholder Gallery until real photos                           | `Gallery.tsx`                       |
| 8   | `preload="metadata"` + posters on hero videos                        | `Hero.tsx`                          |
| 9   | Remove `logo-float` animation                                        | `index.css:201`, `Nav.tsx:71`       |
| 10  | Self-host/subset fonts (drop unused Inter 500, Fragment Mono italic) | `index.html:55-60`                  |

---

## 5. Suggested order of work

1. **P0 batch** — quick wins 1–7 above (one small PR, fixes "unfinished" signals).
2. **Hero consolidation** (2.1 + 3.1 + 3.2 + 3.4) — biggest UX win, one coherent PR.
3. **De-slop pass** (1.1–1.6): Services bento, WhyUs list, TrustStrip → quiet trust row, Stats removal/merge, motion reduction.
4. **Typography & tokens** (2.3) — heading font + fluid scale, delete inline px styles.
5. **Contact upgrade + dark footer** (2.4 + 2.5).
