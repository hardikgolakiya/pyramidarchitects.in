# Layout overview (stillform.homes -> rebuild spec)

Stack: Next.js App Router, Tailwind CSS v4 (utilities inline in markup), GSAP ScrollTrigger (pin-spacers observed in DOM), three.js `<canvas>` for 3D. Brand text/logo are placeholders (`BRAND`, `STILL / FORM` = wordmark slot).

## Routes
| Route | Type | Document height | Notes |
|---|---|---|---|
| `/` | long scroll-driven page, 9 stacked blocks (see `sections.md`) | 1440x900: 25 830 px (=28.7 vh); 1024x768: 22 041; 768x1024: 26 931; 375x812: 21 356 | Preloader overlay on first load |
| `/tour` | single full-viewport 3D scene, no scroll (`body` height = 100vh) | = viewport | Reached from `Enter Residence 02` link (`href="/tour"`) and nav `Tour`. See `tour-page.md` |

Sitemap lists only `/` and `/tour`. Anchors on `/`: `#top` (the `<main>`), `#about`, `#marquee-transition`, `#residence-slides`, `#residence-02`, `#residence-02-tour`, `#contact` (footer). A transition section (`.ap-transition`) has no id.

Note: during measurement the shared browser tab was sometimes navigated to `/tour` / resized by other agents sharing the pane, so an auto-route at scroll end is NOT confirmed (earlier suspicion retracted). Contact (nav, footer) opens a full-screen overlay (z-999) documented by design-system/content-build.

## Global CSS (custom, non-utility)
```css
html { scroll-behavior: smooth; scroll-padding-top: 1rem }
section[id] { scroll-margin-top: 20px }
body { background: var(--background); color: var(--foreground); font-family: var(--font-familjen-grotesk), sans-serif }  /* classes: min-h-full flex flex-col; html: h-full antialiased + 2 font vars */
:root { --background:#fff; --foreground:#171717 }  /* @media (prefers-color-scheme:dark): #0a0a0a / #ededed (every section sets its own bg so this is only visible beneath) */
.rotate-device-warning { display:none }
@media screen and (max-width:1024px) and (orientation:portrait){ .rotate-device-warning{ display:flex; position:fixed; inset:0; z-index:999; background:#0f0f0f; color:#fff; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:24px } }
```
Colors used by layout: paper `#EDE6D6`, ink `#2A2725`, white `#FFFFFF`, black. (Owned by design-system; listed only for readability.)

## Tailwind breakpoints (v4 defaults, from compiled CSS)
`sm 40rem (640)`, `md 48rem (768)`, `lg 64rem (1024)`, `xl 80rem`, `2xl 96rem` (only sm/md/lg are actually used in markup).
Custom variant used everywhere, written in markup as `[@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:` -> in this spec abbreviated **`LS:`** (short landscape phone: landscape, height <= 500px, width <= 1023px). A second variant without max-width exists for the loader/overlays only (`(orientation:landscape) and (max-height:500px)`).
Effective layout modes on `/`:
1. **mobile** < 768 (base)
2. **tablet** 768-1023 (`md:`)
3. **desktop** >= 1024 (`lg:`); no `xl` changes; content scales with `vw` so 1440 is a pure scale of 1024 layout.
4. **LS** overrides for landscape phones (e.g. 812x375).
Tested widths: 375x812, 768x1024, 1024x768, 1440x900 (all numbers in this folder are measured at these).

## Viewport units
`svh` is used for pinned stages on mobile (`h-[100svh]`) and `h-screen` (100vh) at `lg:`; `100svh == vh` in the emulator. Scroll lengths are expressed in `vh` multiples of the viewport height.

## Global shell (present on every route)
```
html.h-full.antialiased.<font vars>
 body.min-h-full.flex.flex-col
  div[hidden]                       (Next suspense placeholder)
  div.contents
  nav  (fixed, global header)
  ...page content...
  <overlay loader>                  (fixed, `/` : z-[200]; `/tour`: z-[300])
```
### Header / nav (`<nav>`)
`fixed left-0 top-0 z-50 w-full px-6 py-4 text-white mix-blend-difference md:px-10` -> always on top, `mix-blend-mode: difference` with white text so it inverts over beige/dark/photo sections. Height 52px closed (py 16 + 20px content). Padding-x 24px (<768) / 40px (>=768).
```
nav
 div.flex.items-start.justify-between
  a[href=/].text-xl(20px).font-medium.leading-none     wordmark "STILL / FORM" (115x20 @ x=24|40)
  div.flex.flex-col.items-end
   button[aria-expanded][aria-controls=site-menu].flex.items-center.gap-2.text-base(16).font-bold.leading-none.tracking-tight   "MENU" + 2x2 dot grid
     span.grid.grid-cols-2 (gap 2px, rotates 45deg + gap 5px when open; transition 500ms cubic-bezier(0.22,1,0.36,1))
       4x i.block.h-[3px].w-[3px].rounded-full.bg-current
   div#site-menu.overflow-hidden (height animated 0 -> auto, `inert` when closed)
     ul.flex.flex-col.items-end.pt-3.text-right
       li.overflow-hidden.pb-[0.1em] > a|button.menu-item.block.text-base.font-bold.uppercase.leading-[1.15].tracking-tight
```
Menu items (4): Residence -> `#marquee-transition`; Stays -> `#residence-02`; Tour -> `/tour`; Contact -> button (no href; opens/scroll to contact). Open menu is NOT a full-screen overlay: it is a right-aligned dropdown list beneath the MENU button (rows ~25.5px tall, top-right at x = viewport-40). Hover effect on items: `data-hover-reveal` (text-roll; motion agent).
Nav is identical on `/tour`.

### Loader overlay
`/`: `fixed inset-0 z-[200] flex flex-col justify-center bg-[#2A2725] text-[#EDE6D6]`; row 1 `flex items-end justify-between px-2`: wordmark `font-medium text-[clamp(1.5rem,2.5vw,2.75rem)] tracking-[-0.055em]` + counter `00..100` `text-[clamp(1.75rem,2.8vw,3rem)] tabular-nums`; below `mt-7 h-[3px] w-full bg-[#EDE6D6]/10` progress bar with inner `h-full origin-left bg-[#EDE6D6]` (scaleX 0->1). Removed after load.
`/tour`: `fixed inset-0 z-[300] flex flex-col justify-center bg-[#2A2725] text-[#EDE6D6]`, same bar plus row with `px-5 md:px-8`: wordmark | `Private Residence Tour` (`clamp(0.75rem,1.5vw,1rem)` uppercase tracking-[0.12em], 70% opacity) | counter; below `mt-6` row: `Preparing your tour experience` (10px, tracking .2em, 60%) and `sm:` visible `ARCHITECTURE · INTERIORS · DETAILS` (9px, 40%).

### Footer
Is the last block of `<main>` on `/` (id `contact`); `/tour` has none. See `sections.md` #9.

## Z-index stack (page `/`, low -> high)
| z | Layer |
|---|---|
| 0 | `section.sticky` HERO (pinned at top by CSS sticky, scrolled over by next sections) |
| 20 | `#about` (relative) ; also `#residence-slides` |
| 30 | `.ap-transition`, `#residence-02`, `#residence-02-tour`, footer `#contact` (all `relative z-30`); inside about/transition: clouds layer `z-30` |
| 35 | `.about-bg` and `.ap-transition-wash` (gradient-masked wash, opacity 0 -> 1 on scroll) |
| 40 | `.about-stage` (about pin-spacer also gets z 40), `.ap-transition > .sticky`, `.marquee-canvas` (inside marquee stage) |
| 50 | `.about-box` (the morphing image frame), `.rs-swiper`, nav `z-50` |
| 200 | loader overlay |
Inside marquee-stage: track `z-10`, prompt `z-30`, 3D layer `z-[30]`, canvas window `z-40`. Inside 3D layer HUD: all `z-10`.
Nav (z-50, first in DOM, root stacking context) stays above all content: `#about` and `#residence-slides` are z-20 stacking contexts, so their inner z-50 layers (`.about-box`, `.rs-swiper`) cannot exceed the nav. Loader (z-200) covers everything.

## Scroll architecture (how heights are made)
Every long scene is: `<section>` (relative) > `.pin-spacer` (injected by ScrollTrigger: `position:relative; height = stage + pinDistance; padding-bottom = pinDistance`) > stage (`h-screen`/`100svh`, `overflow-hidden`, pinned). Rebuild: stage `position: sticky; top:0; height:100vh` inside a wrapper whose height = `100vh + pin distance` gives the same layout without GSAP, or use ScrollTrigger `pin:true, end:"+=<distance>"`.

Measured pin distances (extra scroll beyond one viewport height, `vh` = viewport height):
| Scene | <1024 (mobile+tablet) | >=1024 |
|---|---|---|
| About stage | 1.6 vh (375: 1299 of 812; 768: 1638 of 1024) | 3.2 vh (1440: 2880; 1024: 2458 of 768) |
| Marquee transition | 9.2 vh (section `height:1020vh` inline -> 10.2 vh incl. stage) | same |
| Residence slides | 2.2 vh | 2.2 vh (1440: 1980) |
| Residence 02 | 5 vh | 5 vh (1440: 4500) |
| Residence 02 tour box | 1 vh | 1 vh (1440: 900) |
`.ap-transition` and hero are CSS-sticky (not GSAP pin-spacers).
Cumulative page height at 1440x900: hero 900 (sticky, 0..900) | about 900..4680 | marquee 4680..13860 | slides 13860..16740 (ap-transition overlaps by -450 so it starts 16290) | ap-transition 16290..17730 | residence-02 17730..23130 | tour 23130..24930 | footer 24930..25830.
