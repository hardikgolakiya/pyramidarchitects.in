# Shared coordination board

Reference site: https://stillform.homes (pages: `/` and `/tour`). Goal: a pixel-faithful design/behaviour spec so the layout can be rebuilt for Pyramid Architects. Brand copy, logo, photos, founder details and domain will be supplied later by the client, so every spec must describe slots/roles and keep placeholders, not hard-code the reference site's identity.

## Raw material (already downloaded, read-only)
- `spec/raw/index.html`, `spec/raw/tour.html` – server-rendered HTML of both routes
- `spec/raw/css/*.css` – compiled Tailwind/Next CSS
- `spec/raw/js/*.js` – Next.js (Turbopack) chunks
- `spec/raw/sitemap.xml`
- Detected stack: Next.js (App Router, Turbopack), fonts Familjen Grotesk + Instrument Serif (Google Fonts via next/font), images under `/assets/images/*.webp`.
- Live site can be inspected with the built-in browser (`mcp__Claude_Browser__*`), tabs and viewport emulation (mobile 375, tablet 768, desktop). Section anchor of interest: `/#marquee-transition`.

## Agents and owned output files (write ONLY your own files)
| # | Agent | Owns |
|---|---|---|
| 1 | layout | `spec/01-layout/*.md` – routes, section order, DOM tree, grid/flex, breakpoints, per-section measurements |
| 2 | design-system | `spec/02-design-system/*.md` + `spec/02-design-system/tokens.css` / `tokens.json` – fonts, type scale, colours, spacing, radii, shadows, z-index |
| 3 | motion | `spec/03-motion/*.md` – every animation, scroll effect, marquee transition, hover/focus state, timing/easing, libraries, JS behaviour |
| 4 | assets-seo | `spec/04-assets-seo/*.md` – image inventory (role, size, aspect, placement, alt, loading), fonts files, favicon, meta/OG/SEO, sitemap/robots, performance notes |
| 5 | content-build | `spec/05-content-build/*.md` – component inventory, copy slots with placeholder text, forms/links/CTAs, `/tour` page, recommended project structure and build order |

## Rules
1. Measure, don't guess: give exact px/rem/%/clamp() values, class names, hex/oklch values, durations, easings, as found in the CSS/JS/DOM.
2. Keep it replicable: each file should let a developer rebuild that part without opening the reference site.
3. Do not copy the reference site's image files or its proprietary text into the deliverable; record roles, dimensions and placeholders instead. Fonts are open-licence Google Fonts and may be named/used.
4. Cross-team: when you find something another agent owns, append a line to the message board below (`FROM → TO: note`) instead of editing their files. Also send it with SendMessage to that agent if that tool is available to you. Read the board before finishing and reconcile conflicts.
5. When done, append `DONE <agent>` to the board with the list of files written and any open questions.

## Message board (append only)
design-system → ALL: Stack is Tailwind v4 (CSS-first). Custom variant `ls` = `@media (orientation:landscape) and (max-height:500px) and (max-width:1023px)` (phone landscape) used on nearly every section; breakpoints sm640/md768/lg1024. Core colours: sand #EDE6D6, ink #2A2725 (hard-coded arbitrary values). See spec/02-design-system/tokens.css.
design-system → layout: `.rotate-device-warning` (shown only on /tour, portrait <=1024px) and `html scroll-behavior:smooth; section[id] scroll-margin-top:20px` are in the global CSS. Section bg order and z-index map are in 02-design-system/spacing-radius-shadow.md and colors.md.
design-system → motion: text-reveal helpers (`[data-reveal-01]`, `.char-mask`, `.hover-reveal-*`) CSS is documented in typography.md; hover easings: duration 300/500ms, signature ease cubic-bezier(.22,1,.36,1); css ping 1s / pulse 2s keyframes.
design-system → content-build: contact modal (z-999, ink bg, mailto rows + copy-email pill + social pills) styling is in components-styling.md; it is rendered from JS chunk 1v84rdd_g9_xm.js. Brand strings in nav/preloader/footer ("STILL / FORM", "Space, considered.") are placeholders.
design-system → assets-seo: fonts are next/font self-hosted woff2 (Familjen 3 subsets variable 400-700; Instrument Serif 400 normal+italic, italic unused so can be dropped).
DONE design-system: spec/02-design-system/{typography.md,colors.md,spacing-radius-shadow.md,components-styling.md,tokens.css,tokens.json}. Open: visual hover states beyond classes not browser-tested; preloader/modal values read from JS source.
- assets-seo → layout/motion: all images are plain `<img>` (no next/image/srcset/lazy); about collage tiles are `hidden` below lg; `hero5.webp` is used as the WebGL marquee texture (not in HTML). Per-image rendered sizes are in 04-assets-seo/image-inventory.md.
- assets-seo → content-build: reference OG image URL is `http://localhost:3000/...` and 404s; `/tour` canonical points to `/` and its title is "3d Tour"; social links in footer are the original developer's. Fixes listed in 04-assets-seo/favicon-meta.md. Wordmark is live text, no logo file.
- assets-seo → design-system: fonts are Familjen Grotesk (variable 400-700) + Instrument Serif (400 normal+italic), swap, with size-adjusted fallbacks; details in 04-assets-seo/fonts.md. Body bg rgb(10,10,10), sections #EDE6D6.
- assets-seo → motion: `/tour` loads a 2.2 MB Rapier WASM chunk (44yc3rrrxvbae.js), gsap+Lenis+Swiper+three on `/`; preloader asset list with weights in js/2xipugk_40kza.js.
DONE assets-seo — files: spec/04-assets-seo/{image-inventory,fonts,favicon-meta,seo-routing,performance,placeholder-assets}.md. Open: mobile (375) image rect measurements are approximate (browser emulation stayed at 1440 width); Lighthouse scores not run.

content-build → ALL: Findings. (1) No forms/APIs exist: contact is a full-screen overlay (portal, z-[999]) with mailto: + clipboard copy; opened from nav "Contact", footer "Contact" and footer availability pill. (2) Footer/overlay socials + email in the reference belong to an individual dev (portfolio author), not the featured brand: all TODO-CLIENT. (3) Stack: Next 16.x, React 19 + React Compiler, Tailwind v4, GSAP 3.15 + ScrollTrigger, Lenis, three r186, R3F, drei, rapier, zustand, nipplejs, react-icons. (4) /tour is static prerender, canonical wrongly "/", og:image points to localhost:3000 (bug). (5) Nav "Stays" -> #residence-02; hash ids to keep: top, about, marquee-transition, residence-slides, residence-02, residence-02-tour, contact, site-menu.
content-build → motion/layout: Section class hooks used in my inventory: .about-tile(-l/-r), .about-slot-center/.about-slot-inline, .about-box/.about-slide, .marquee-track/.marquee-canvas, .rs-slide/.rs-swiper-item, .ap-img/.ap-text/.ap-piece, .tour-box/.tour-piece, .footer-reveal/.footer-rule, [data-reveal-01|data-reveal-local|data-scroll|data-hover-reveal|data-hud-text]. Marquee runway is height:1020vh; cloud transition vars --h-d:160vh --h-m:80vh. Explorer camera presets + 7 stage list are in raw/js/265hf09g46rmm.js (e_ object, ep array).
content-build → assets-seo: asset paths used by JS beyond HTML: /assets/models/{vill_draco,apartment,bed1-3,smallbed1-2,cupboard1-2,tv1-3,sofa1-2,commode1,countertop,fridge,mirror-512}.glb, /assets/audio/{balcony,bedroom,kitchen,livingRoom}-tone.mp3, footstep, opening-door, close-door, lofi, /assets/textures/{sky/*.png, ground/ground_05_*_1k.jpg, yard/ground_tiles_21_*_1k.jpg}, hero5.webp, side.webp.
DONE content-build — files in spec/05-content-build/: component-inventory.md, content-slots.md, tour-page.md, forms-and-links.md, tech-stack.md, project-structure.md, build-order.md, client-inputs-checklist.md. Open questions: exact E/Q hint strings and /tour camera/eye-height not in static HTML (verify live; shared browser pane was being driven by other agents and redirected away from /tour); whether ContactOverlay is mounted on /tour unverified.
content-build → design-system/assets-seo: reconciled: custom variant named `ls` in tech-stack.md; Swiper noted on /.
layout → motion: Pin/scroll architecture in 01-layout/overview.md ("Scroll architecture"): pin distances about 1.6vh (<1024)/3.2vh (>=1024), marquee 9.2vh (section inline height 1020vh), slides 2.2vh, residence-02 5vh, tour box 1vh; ap-transition + hero are CSS sticky. Also: scripted fast scrolling on `/` twice auto-navigated the tab to `/tour` (title "3d Tour") — likely a scroll-end route push from #residence-02-tour; please confirm in JS. Nav starts at y=-20 (entrance tween) then 0.
layout → design-system: z-index scale (0/20/30/35/40/50/200/300/999) in 01-layout/overview.md; bg tokens #EDE6D6 paper, #2A2725 ink; fluid type uses clamp()+vw (5.2vw, 4.4vw, 7vw, 7.5vw, 2.8vw, 3.5vw); custom `ls` variant (landscape, max-h 500, max-w 1023); breakpoints sm640/md768/lg1024.
layout → content-build: /tour page has only nav, loader, back button, "Click to look around" pill, canvas and a portrait-only rotate warning (01-layout/tour-page.md). Section ids: about, marquee-transition, residence-slides, residence-02, residence-02-tour, contact; .ap-transition has no id.
layout → assets-seo: hero image is the LCP (img.hero-image object-cover, 100svh). Rest-state frames for images are in 01-layout/sections.md (about slot 46%x38% etc, tour-box 62%x72%, ap thumbnails ~124x162 @1440).
DONE layout — files: spec/01-layout/overview.md, sections.md, responsive.md, tour-page.md. Open questions: exact marquee/GSAP scroll tween values (motion); whether /tour auto-route exists; mid-scroll states of residence-02 thumbnails only sampled at 3 points; contact button behaviour (no href).
layout → ALL: correction — the /tour auto-navigation I suspected was most likely caused by the shared browser pane being driven by other agents; treat it as unconfirmed. Contact = overlay (see content-build/design-system).
motion → assets-seo/content-build: Swiper is NOT in any JS chunk (grep clean); "rs-swiper"/"about-slide" are plain divs animated with GSAP. No framer-motion either. Lenis 1.3.26 + GSAP/ScrollTrigger/SplitText 3.15 + three/R3F only. The marquee-transition JS also needs hero5.webp as WebGL texture and vill_draco.glb (boot loader weights 1,1,1,1,4).
motion → layout: confirmed pin lengths (desktop): about +=320% (mobile +=160%), marquee 920vh (pin stage, end "bottom bottom"), residence-slides +=220%, residence-02 +=500% (intro scrub 100%), tour teaser default end (100vh, time-based timeline), ap-transition is scrub only (start top bottom, end top 10%). No scroll-end route push exists in the JS; /tour navigation only via click on .tour-box / CTA (router.push) or nav link.
motion → design-system: motion easing vocabulary and CSS cubic-beziers listed in 03-motion/overview.md and hover-focus-states.md.
DONE motion — files in spec/03-motion/: overview.md, loader-boot.md, nav-menu.md, hero.md, about-cloud-parallax.md, marquee-transition.md, residence-slides.md, ap-transition.md, residence-02.md, tour-teaser.md, footer-contact.md, text-reveal-and-hover-reveal.md, hover-focus-states.md, page-transitions.md, reduced-motion.md. Open: mid-scroll scrub frames not sampled continuously (shared browser pane was being resized/navigated by other agents), end states and pin geometry were verified; /tour in-scene physics/audio/pointer-lock motion only summarised (not documented in depth).

frame-sampler → motion: mid-scroll frames measured at 1440/768/375 (spec/03-motion/frames/). Formulas confirmed; corrections in frames/corrections.md: .ap-piece count is 15 (5/room); residence-02 state-1 next thumb rests at opacity .9; tour teaser can start early on big scroll jumps; "loader stalls at 99" was a hidden-pane rAF throttle (screenshot wakes it) — measure with browser_batch [screenshot, javascript_tool]. Use scrollTo({behavior:"instant"}) because html has scroll-behavior:smooth.
DONE frame-sampler — files: spec/03-motion/frames/{README,hero-about-lead,about-pin,marquee,residence-slides,ap-transition,residence-02,tour-teaser,footer,responsive,corrections}.md + samples.json. Not measured: shader uniforms/R3F state, ls (landscape phone), reduced motion, mid-frames of thumbnail/image hops, HUD fade, one-shot hints.

motion: corrections from frames/corrections.md merged into residence-02, tour-teaser, loader-boot, overview (main session).
