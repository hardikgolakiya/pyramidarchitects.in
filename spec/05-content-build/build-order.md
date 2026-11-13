# Build order and acceptance checks

Work top to bottom; each step ends with a check that must pass before moving on. Visual targets come from `spec/01-layout`, `02-design-system`, `03-motion`; this file only sequences the work. Test at 375x812, 768x1024, 1440x900 and a landscape phone (812x375).

## Phase 0 - Foundation
1. **Scaffold**: `create-next-app` (TS, App Router, Tailwind v4, ESLint, pnpm), enable `reactCompiler`, add deps (gsap, lenis, three stack lazily later). Check: `pnpm build` passes; deployed preview on Vercel loads a blank page.
2. **Tokens + fonts**: import `tokens.css`, wire `next/font` (Familjen Grotesk, Instrument Serif), `@custom-variant landscape-short`. Check: a type-specimen test page matches the type scale (sans body, serif headings; no FOUT/CLS; fonts preloaded).
3. **Content layer**: create `content/*.ts` with all placeholders from content-slots.md. Check: no literal copy inside components (grep).
4. **Providers**: Lenis + ScrollTrigger sync, `ContactProvider`, `useReducedMotion`. Check: smooth scrolling works; `ScrollTrigger.refresh` after fonts/images load; `data-lenis-prevent` respected.

## Phase 1 - Shell
5. **SiteNav**: fixed, `mix-blend-difference`, toggle with dot-grid animation, height-animated `#site-menu`, `inert` when closed, 4 items. Check: toggle `aria-expanded` flips; keyboard tab skips closed items; text inverts over light/dark sections; hash links smooth-scroll.
6. **Preloader**: counter + progress bar tied to real asset progress, then exit and intro trigger. Check: shows <= ~2s on cached load; no scroll while visible; `role=progressbar` values update; skipped instantly with reduced motion.
7. **Reveal / RollLink / ArrowLink / PillButton / PulseHint** primitives. Check: Storybook-like test page: masked line reveal does not clip descenders (mask padding `pb-[0.18em]`), hover roll matches.

## Phase 2 - Home sections (in page order; each pinned section needs `ScrollTrigger.refresh()` ordering check)
8. **Hero** (sticky, z-0). Check: 100svh at all sizes (no URL-bar jump), title/CTAs/meta positions per breakpoints incl. landscape-phone variant; CTAs scroll to correct ids; image `object-cover` crops OK at 9:16.
9. **About** (clouds, gradient-mask wash, tiles, caption, word-by-word headline, rule, supporting copy, carousel box flying to slot). Check: tiles hidden < lg; sequence plays in order on scroll up/down (scrub reversible); carousel prev/next works and wraps; no horizontal overflow (`overflow-x-clip`).
10. **Residence slides** (2 slides, text panels + wiping image panel). Check: layout stacks (rows) on mobile, columns on lg; counter chip `aria-label` updates; images swap exactly at slide boundary.
11. **Cloud transition** (white wash, 2 clouds, sticky copy; `-mt-[50vh]`, heights 80vh/160vh). Check: overlap with the previous section seamless (no seam line); heading reveals once, reversibly.
12. **Apartment stage** (3 images, 3 text blocks, counter column, hero text). Check: image/clip choreography per motion spec; text blocks swap with masked reveals; counter rolls 01-03; lg-only label hidden on mobile.
13. **Tour teaser** (box expands on scroll, controls legend, CTA + pulse hint). Check: CTA navigates to `/tour` client-side; legend hidden < lg; hint pulse visible and `aria-hidden`.
14. **Footer + ContactOverlay**: Check overlay: opens from 3 triggers; clip-path reveal; scroll locked with no layout shift; focus lands on Close; Tab loops; Esc closes and returns focus to the trigger; Copy shows "Copied" 1.8s and clipboard contains the email; `mailto:` cards carry encoded subject; reduced-motion path works; landscape phone scrolls inside.

## Phase 3 - 3D explorer (hardest; do after the static sections are stable)
15. **Model pipeline**: obtain/commission villa GLB with named groups (walls, floor, roof, pillars, stairs, windows/doors); Draco-compress. Check: file < 8MB; loads via `useGLTF` with decoder.
16. **ExplorerScene** (Canvas, FOV 50 / 75 under 768, camera presets, group opacity lerp, wire edges for inactive groups, lights). Check: each of 7 presets frames the right group on all breakpoints; no z-fighting; canvas disposed on unmount (no WebGL context leak when scrolling past).
17. **Marquee runway** (1020vh, track translate, window grow, cross-fade at `duration-700` to blue-900 stage, scroll progress -> stage index). Check: scroll through section forward/back repeatedly: no stuck states; clicking rail dots and dragging HUD knob scrubs scroll position/stage; HUD text re-animates; "of 07" counter correct; mobile rail scale-90 and position `top-[38%]`; `Drag to rotate` hint shows only lg and disappears after first drag; nav `#marquee-transition` lands at start.
18. **Perf pass for home**: lazy-load 3D after hero is idle; ensure Lighthouse perf (mobile) >= 70, CLS < 0.05, hero LCP < 2.5s.

## Phase 4 - /tour
19. **Route shell**: page, metadata, `RotateDeviceWarning`, `TourPreloader`, `BackToSite`, `Crosshair`. Check: rotate warning only on portrait touch; preloader states incl. forced error.
20. **Scene**: Physics, apartment GLB, ground, lights, sky cubemap, furniture, zone sensors. Check: collisions block walls; no falling through floor; shadows ok; 60fps on mid hardware.
21. **Controls**: keyboard + pointer lock, joystick on touch, interact (E), customize (Q). Check: all inputs work; Esc exits lock; touch UI hidden on desktop.
22. **Customization**: store + panel (walls/floor palettes, 5 furniture style groups), "walk away to close". Check: material colours update live; selections persist while on page; panel contextual to the looked-at object.
23. **Audio**: gesture-gated, zone crossfade, footsteps, doors, lofi bed; mute toggle. Check: nothing plays before first gesture; zone change fades; mute persists.

## Phase 5 - Finish
24. **SEO/assets**: metadata per route, canonical fix, OG image, sitemap, robots, favicon, JSON-LD. Check: Lighthouse SEO 100; social debugger shows card; canonical `/tour` self-referential.
25. **A11y**: keyboard-only pass, focus outlines on every control, landmarks (`nav`, `main`, `footer`), alt texts final, reduced-motion pass (no pinned scrubs; static layouts). Check: axe has no serious issues; screen reader announces HUD stage changes and preloader progress.
26. **QA matrix**: Chrome, Safari (iOS 17+, desktop), Firefox, Edge; iOS Safari `100svh`, pointer lock absent on iOS (touch path only). Check: no console errors; no horizontal scroll at any width 320-1920.
27. **Content swap-in**: replace placeholders with client assets/copy (see client-inputs-checklist.md); re-verify length budgets in content-slots.md. Check: grep for `TODO-CLIENT` returns 0 before launch.
28. **Launch**: domain, redirects, analytics, Vercel production deploy, post-deploy smoke test (Playwright against prod). 
