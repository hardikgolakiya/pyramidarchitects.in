# Build contract (all build agents read this first)

Goal: replicate https://stillform.homes block for block, transition for transition, header to footer, plus `/tour`, for Pyramid Architects. Nothing may be skipped. The spec in `spec/01..05` and the measured frames in `spec/03-motion/frames/` are the source of truth; `spec/raw/` holds the reference HTML/CSS/JS for exact class names and values.

## Asset rule (from the client)
Every image, video, 3D model, texture and audio slot stays BLANK until the client sends assets phase by phase. Use `components/ui/Placeholder.tsx` (`<Placeholder slot="hero" tone="light|dark|none" label="..."/>`) sized by its parent exactly like the reference media (same box, radius, aspect, object-fit behaviour, transforms and animations). Animations must still run on the blank boxes. Do not copy, hotlink or recreate the reference site's photos, models, audio or copy.
Exceptions that ARE available: logos `/brand/*` (use `/brand/logo-wordmark-currentcolor.svg` or `/brand/logo-mark-currentcolor.svg` via CSS mask or inline when colour must follow text/mix-blend), founders `/team/*`, contact details in `content/site.ts`.

## Copy
Brand copy for Pyramid Architects: use `content/about-us.md`, `content/contact-us.md` and neutral placeholder copy from `spec/05-content-build/content-slots.md` (same length budget as the reference so layouts match). Put every string in your own `content/<area>.ts` file; no literal copy inside components. Brand split "STILL / FORM" becomes `site.brandSplit` ("PYRAMID" / "ARCHITECTS").

## Stack already installed (do NOT add npm packages; ask main via the board if truly needed)
next 16.4 (App Router, Turbopack), react 19.3, tailwindcss 4.3 (CSS-first, tokens in `app/globals.css`, custom variant `ls:` = landscape phone), gsap 3.15 incl. ScrollTrigger + SplitText (import from `@/lib/gsap`: `gsap, ScrollTrigger, SplitText, useGSAP, MQ`), lenis (already running globally, `window.__lenis`), clsx + tailwind-merge (`cn` from `@/lib/cn`). Icons: inline SVG. No three.js yet: the 3D viewer and tour scenes are blank stages (Placeholder tone dark / night bg) with all surrounding UI (rails, HUD, counters, hints, buttons, panels) fully built and animated.

## Global behaviours already provided
- `components/providers/SmoothScroll.tsx` Lenis + ScrollTrigger sync and route scroll reset.
- `components/providers/TextEffects.tsx`: any element with `data-reveal-01` (+ `data-scroll`, `data-duration`, `data-stagger`, `data-ease`, `data-reveal-local`) gets the masked char reveal; any `data-hover-reveal` gets the two-layer text roll. Exported helpers `textReveal01(scope, includeLocal)` and `hoverReveal(scope)` for local use.
- Boot gate: the Preloader must set `document.body.dataset.bootLoaderComplete = "true"` and dispatch `window.dispatchEvent(new Event("bootloader:complete"))` when it finishes; hero intro and text reveals wait for it.
- `useContact()` from `components/providers/ContactProvider.tsx` → `openContact(triggerEl)`, `closeContact()`, `open`, `trigger`.
- `useReducedMotion()` in `hooks/`.

## File ownership (each agent writes ONLY its files; replace the stub, keep the default export name, no props)
| Agent | Files |
|---|---|
| shell | `components/layout/{SiteNav,Preloader,ContactOverlay,SiteFooter}.tsx`, `components/ui/*` (except Placeholder.tsx), `content/shell.ts` |
| hero-about | `components/sections/hero/*`, `components/sections/about/*`, `content/home-hero-about.ts` |
| explorer | `components/sections/explorer/*`, `content/explorer.ts` |
| residences | `components/sections/residence-slides/*`, `components/sections/cloud-transition/*`, `content/residences.ts` |
| apartment-tour | `components/sections/apartment/*`, `components/sections/tour-teaser/*`, `content/apartment-tour.ts` |
| tour | `app/tour/page.tsx`, `components/tour/*`, `content/tour.ts` |
Shared files (`app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `lib/*`, `components/providers/*`, `content/site.ts`) belong to main: request changes on the board in `spec/SHARED.md` (`FROM → main: ...`). You may add section-scoped CSS via Tailwind classes or a `<style>` in your component; for keyframes needed globally, request on the board.

## Rules
1. Match the reference exactly: DOM structure, Tailwind classes/values, breakpoints (md 768, lg 1024, `ls:`), pins, scrub values, easings, durations, z-index, ids (`top, about, marquee-transition, residence-slides, residence-02, residence-02-tour, contact, site-menu`).
2. Use `useGSAP({ scope })` + `gsap.matchMedia()` with `MQ.desktop`, `MQ.mobile`, `MQ.reduced`; kill everything on unmount.
3. Verify with `npx tsc --noEmit` and `npx eslint <your files>` (PATH: `export PATH=$HOME/.local/node/bin:$PATH`). Do NOT run `next dev`, `next build`, or use the browser tools: main runs one dev server and does browser QA after integration to avoid the shared-pane conflicts seen earlier.
4. Do not commit or push.
5. When done append `DONE <agent>` to the board in `spec/SHARED.md` with files written, any deviations, and anything main must wire (e.g. global CSS, layout changes).
