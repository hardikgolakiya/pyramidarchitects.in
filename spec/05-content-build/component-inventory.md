# Component inventory

Component names below are the *recommended* names for the rebuild (the reference is Turbopack-minified, so original names are not recoverable). Evidence is from `spec/raw/index.html`, `tour.html` and the JS chunks. All colours are the reference tokens; the design-system agent owns the authoritative token file (`spec/02-design-system/`). Exact motion timings belong to `spec/03-motion/`; only the behaviour contract is noted here.

Reference palette used in code (for orientation): cream `#EDE6D6` (page bg), charcoal `#2A2725` (text / dark panels), white, blue-900 (3D stage bg), green dot `#3FA85B` / `#9ED8A8`. Fonts: `font-sans` = Familjen Grotesk, `font-serif` = Instrument Serif.

Legend: [S] server component OK, [C] must be a client component.

## 0. Page map

| Route | Composition |
|---|---|
| `/` | `<SiteNav/>` + `<Preloader/>` + `<main id="top">`: Hero, About, ArchitectureExplorer (marquee-transition), ResidenceSlides, CloudTransition, ApartmentStage (`#residence-02`), TourTeaser (`#residence-02-tour`), `<SiteFooter id="contact"/>`; `<ContactOverlay/>` mounted once (portal) |
| `/tour` | `<SiteNav/>` + `<RotateDeviceWarning/>` + `<TourPreloader/>` + `<TourExperience/>` (R3F canvas + HUD) |

Global layout wrapper: `<html lang="en" class="{fontVars} h-full antialiased"><body class="min-h-full flex flex-col">`; `<SmoothScrollProvider>` (Lenis) wraps `/` only (Lenis chunk is loaded with the home bundle, not /tour). `<ContactProvider>` (open/close state shared by nav, footer and overlay).

## 1. Global / shared components

### 1.1 SiteNav [C]
- Markup: `<nav class="fixed left-0 top-0 z-50 w-full px-6 py-4 text-white mix-blend-difference md:px-10">`; row `flex items-start justify-between`.
- Slots: `wordmark` (link to `/`, `text-xl font-medium leading-none`), `menuLabel` ("MENU").
- Menu toggle: button `aria-expanded`, `aria-controls="site-menu"`; label + 2x2 dot grid icon (`grid grid-cols-2`, dots 3px, gap 2px; animates `gap` and `transform` over 500ms `cubic-bezier(0.22,1,0.36,1)` when open).
- Menu panel `#site-menu`: `overflow-hidden`, height animates `0 -> auto` via GSAP/JS; `inert` while closed. List `flex flex-col items-end pt-3 text-right`; items `text-base font-bold uppercase leading-[1.15] tracking-tight`, each in `overflow-hidden pb-[0.1em]` mask (text-roll hover via `data-hover-reveal`).
- Props: `items: {label, href? , action?: 'openContact'}[]`.
- Items on `/`: Residence -> `#marquee-transition`; Stays -> `#residence-02`; Tour -> `/tour` (client route); Contact -> button, opens ContactOverlay.
- States: closed / open / item hover (text-roll, other items dim to opacity via 300ms transition). On `/tour` the same nav renders but Residence/Stays hash links resolve against `/` (in the reference they stay as bare hashes -> no-op on /tour; recommended fix: use `/#marquee-transition`).
- Used by: both routes.

### 1.2 Preloader (home) [C]
- `fixed inset-0 z-[200] flex flex-col justify-center bg-[#2A2725] text-[#EDE6D6]`.
- Content: wordmark (`font-sans text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-none tracking-[-0.055em]`) + counter `00..100` (`tabular-nums text-[clamp(1.75rem,2.8vw,3rem)]`), progress bar `h-[3px] w-full bg-[#EDE6D6]/10` with inner `origin-left scaleX(0..1)`; `role="progressbar" aria-valuemin=0 aria-valuemax=100 aria-valuenow`.
- Props: `progress: number` (from asset/`useProgress`), `onDone`.
- States: loading -> exit (slides/fades out; motion spec) -> unmounted, then Hero intro reveals start.

### 1.3 TourPreloader (/tour) [C]
- Same visual as 1.2 but `z-[300]`, adds centre label "Private Residence Tour" (`uppercase tracking-[0.12em]`, `/70`), status line below bar (3 states: "Preparing your tour experience" -> "Entering the residence" -> error "Some files could not load" + `Try again` button that calls `location.reload()`), and `ARCHITECTURE · INTERIORS · DETAILS` micro-label (`hidden sm:block text-[9px] tracking-[0.18em]`). `role="status" aria-live="polite"`.
- Driven by drei `useProgress` (assets: GLB models, audio, textures).

### 1.4 RotateDeviceWarning [C]
- `.rotate-device-warning fixed inset-0 z-[9999] flex flex-col bg-blue-900 text-white role="alert"`; shown only on `/tour` when viewport is portrait on a touch/mobile device (CSS media query on orientation/width, hidden in landscape and on desktop).
- Slots: wordmark, lock badge (96px circle, pulsing ring `.lock-ring`, rotate icon `text-4xl`), eyebrow "Landscape mode" flanked by 24px rules, h2 serif `text-[clamp(2.25rem,10vw,3.5rem)] leading-[96%]` in 2 masked lines (`.lock-line`), body `text-xs uppercase tracking-[0.14em] max-w-xs`. Safe-area paddings.

### 1.5 SiteFooter (`#contact`) [C]
- `<footer id="contact" class="relative z-30 flex min-h-[100svh] flex-col bg-[#EDE6D6] px-4 md:px-10 ... lg:block lg:h-screen lg:py-16">`; inner `.footer-frame` rounded-[20px] md:rounded-[30px] border `border-[#2A2725]/20`.
- Rows: (1) top bar: wordmark link + right-aligned tagline (md+). (2) animated hairline `.footer-rule` (scaleX 0 -> 1). (3) big serif headline (`clamp(3rem,13vw,7rem)` mobile, `clamp(2.75rem,8vw,7rem)` lg, `max-w-[12ch] leading-[0.88]`) + sub-line (`text-lg md:text-xl`) | two link columns "Explore" and "Follow". (4) second hairline. (5) bottom bar: copyright + availability line | availability pill button (pulsing green dot) | "Back to top".
- Props/slots: `wordmark`, `tagline`, `headline`, `subline`, `exploreLinks[]`, `socialLinks[]`, `contactLabel`, `copyright`, `availability`, `backToTopHref='#top'`.
- All lines use `.footer-reveal` inside `overflow-hidden` masks (text slides up on scroll-in; links use `data-hover-reveal`).
- Interactive: "Contact" button in Follow column and availability pill both open ContactOverlay (they are `<button>`s, not links).

### 1.6 ContactOverlay [C] (portal to `document.body`)
- Full-screen dialog: `fixed inset-0 z-[999] h-[100svh] bg-[#2A2725] text-[#EDE6D6]`, `role="dialog" aria-modal="true" aria-label="Contact" data-lenis-prevent`. Inner container `max-w-[1280px] px-5 md:px-10`.
- Layout: header row (wordmark | `Esc` kbd hint (md+) + Close pill button) / main grid `lg:grid-cols-[1.25fr_1fr]` / footer row (hairline, social icon pills list, small tagline `hidden sm:block`).
- Left column: status pill (pulsing green dot + availability text), h2 serif `text-[clamp(2rem,min(5.4vw,8.5vh),4.5rem)]` in two masked lines (second line `/50` opacity), intro paragraph (`max-w-md text-sm md:text-[15px]`), email capsule: `mailto:` link (with arrow-up-right icon) + "Copy"/"Copied" button (copies email to clipboard; fallback hidden-textarea `execCommand('copy')`; label resets after 1800ms; `aria-live="polite"`).
- Right column: 2 `ContactCard`s (see 1.7), each `mailto:EMAIL?subject=<encoded>`.
- Behaviour: mounts on open; clip-path reveal `inset(100% 0 0 0) -> inset(0)` 0.95s `expo.inOut`; closes with reverse (0.85s); `prefers-reduced-motion` => 0.25s clip / 0.2s fade, no stagger. Locks scroll (`overflow:hidden` on html/body + compensating `padding-right` for scrollbar width). Focus: moves to Close button on open, focus trap on Tab/Shift+Tab over `a[href], button:not([disabled]), [tabindex]`, Escape closes, focus restored to opener on close. Landscape phones (`orientation:landscape and max-height:500px`): content becomes scrollable, intro paragraph hidden, paddings tightened.
- Props: `{ open: boolean; onClose(): void }`. Config constants: `email`, `cards[]`, `socials[]`.
- No form, no network call: contact is purely `mailto:` + copy.

### 1.7 ContactCard [C]
- `<a>` card `rounded-2xl md:rounded-3xl border border-[#EDE6D6]/20 bg-[#EDE6D6]/[0.04] px-5 py-4 md:px-6 md:py-5`, hover: cream fill wipes up (`scale-y-0 -> 1`, 500ms `cubic-bezier(0.22,1,0.36,1)`), text flips to charcoal, circle arrow icon rotates 45deg.
- Props: `{ label, note, title, subject }`. Meta line `"{label} · {note}"` (`text-xs opacity-60`), title serif `clamp(1.35rem,min(2.6vw,4vh),2rem)`.

### 1.8 SocialPill [C]
- `<a target="_blank" rel="noopener noreferrer" aria-label>` `rounded-full border border-[#EDE6D6]/20 p-2.5 sm:px-4 sm:py-2 text-xs`, icon 14px + label (`hidden sm:inline`), hover inverts to cream bg / charcoal text.

### 1.9 RevealText (utility) [C]
- Wrapper pattern used everywhere: `<span class="block overflow-hidden pb-[0.18em] pt-[0.05em] -mb-[0.18em] -mt-[0.05em]"><span class="ap-piece block">line</span></span>`; GSAP animates inner `yPercent 110 -> 0`.
- Data-attribute API seen in DOM: `data-reveal-01="true|chars"` (line vs per-character split reveal), `data-reveal-local` (trigger relative to its own section), `data-scroll` (scroll-triggered rather than on load), `data-duration`, `data-stagger`. Recommended: a single `<Reveal as mode="lines|chars|words" scroll stagger duration>` component wrapping a custom splitter (no SplitText plugin was found in the bundle; splitting is hand-rolled with `Intl.Segmenter` when available, whitespace-aware).

### 1.10 HoverReveal / `data-hover-reveal` [C]
- 16 uses. Text-roll hover (duplicate text translates in on hover) applied to nav items, hero CTAs, footer links, tour CTA. Implement as `<RollLink>` using a masked duplicated label.

### 1.11 ArrowLink (CTA)
- `<a class="group flex items-center gap-3 py-1.5 text-sm uppercase md:text-base lg:text-lg"><span data-hover-reveal class="border-b border-white">Label</span><span class="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span></a>`.
- Variants: `dark|light` border colour; `back` variant (`←`, translate -x on hover).

### 1.12 PillButton
- `rounded-full border border-white/70 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-[#2A2725] focus-visible:outline-2 outline-offset-4 outline-white`. Used by TourTeaser CTA. Variants: `light` (white border, on photo) / `dark` (charcoal border).

### 1.13 PulseHint
- 36px white circle with arrow icon + expanding ring (`animate ping`-like, `bg-white/60`), `aria-hidden`. Used 2x: `tour-hint` (on the Enter CTA, shows to suggest clicking) and `rail-hint` (beside the stage rail). Prop: `className` for positioning.

### 1.14 SmoothScrollProvider [C]
- Lenis instance synced to GSAP ticker/ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`). Overlays set `data-lenis-prevent` so inner scroll works.

## 2. Home-page section components

### 2.1 Hero (`<section>` sticky, no id; main has `id="top"`)
- `sticky top-0 z-0 h-[100svh] lg:h-screen w-full overflow-hidden bg-black text-white select-none`.
- Layers: `HeroImage` (full-bleed `object-cover`, class `hero-image`, wrapped `.hero-image-wrap`; overlay `bg-black/35`) -> `.hero-content` (z-10).
- Slots: `title` (2 lines, serif, `text-[clamp(2.75rem,12vw,4.5rem)] md:text-[5rem] lg:text-[5.64rem] leading-[94%]`; position `left-6 top-[16%] md:left-10 lg:top-[7%]`), `cta1`, `cta2` (ArrowLinks; stack on mobile, row `sm:gap-5`), 4 `metaItems` (uppercase `text-[11px] tracking-[0.18em]` md:text-sm lg:text-lg; 2-col grid on mobile, flex space-between md+; vertically centred at lg), `bottomLine` (2-line centred statement `text-sm md:text-base lg:text-lg leading-[120%]`, at `bottom-6`).
- Landscape-phone variant: title 2.25rem, top 18%, CTAs in a row, meta at `bottom-14`.
- Behaviour: stays pinned (sticky) while About slides over it; text reveal on load after preloader (`data-reveal-01`), image scale/parallax on scroll (motion spec).
- CTAs: "Explore" -> `#marquee-transition` (smooth scroll), "Experience" -> `#residence-02-tour`.

### 2.2 AboutSection `#about`
- `relative z-20 bg-[#EDE6D6] text-[#2A2725] overflow-x-clip`. Stack of absolutely positioned layers: 2 `CloudLayer` images (beige, decorative, `h-auto w-full`, start opacity 0), `.about-bg` cream wash with gradient mask (`linear-gradient` 0%->#000 at 50%), `.about-stage` (100svh) containing:
  - `.about-slot-center`/`.about-slot-inline`: invisible geometry targets for the "box" to fly to (center slot at lg: `left-[26%] top-[24%] h-[38%] w-[46%]`; inline slot inside headline `h-[0.82em] w-[1.7em]`).
  - `.about-gallery`: one serif caption (`A quieter way to live`-type, `lg:text-[3.5vw]`) + 6 absolutely positioned rotated tiles (lg only; rotations -4/3/-2/-6/8/-4 deg; left group `.about-tile-l`, right group `.about-tile-r`; `rounded-xl`; positions in % given in layout spec).
  - `.about-text-layer`: 12-col grid; col-span-2 eyebrow ("About", `text-[10px] uppercase tracking-[0.18em]`) + col-span-10 headline (words each wrapped in an overflow mask, `.about-word`; size `clamp(1.75rem,7vw,2.5rem)` mobile, `lg:text-[5.2vw] lg:leading-[80%]`, `tracking-[-0.045em]`), hairline `.about-rule`, supporting copy (`max-w-[350px] text-sm lg:text-lg`, fades in).
  - `.about-box`: `rounded-xl` image carousel (7 stacked `.about-slide` images + prev/next circular buttons `h-10 w-10 bg-[#EDE6D6]`, `aria-label` Previous/Next image). The box tweens from tiles to the slot positions on scroll.
- Props: `eyebrow, headline(words[]), supporting, caption, tiles[{src,alt,pos,rotate}], slides[{src,alt}] (7)`, `clouds[2]`.
- Pinned scroll-scrub section (ScrollTrigger pin + timeline).

### 2.3 ArchitectureExplorer / MarqueeTransition `#marquee-transition`
- `<section class="relative bg-[#EDE6D6]" style="height:1020vh">` (10.2 viewport heights of scroll runway) containing `.marquee-stage` (`h-screen`, sticky/pinned).
- Layers (z): (10) `MarqueeTrack` - 3 identical rows of 8 repeated brand spans, `font-sans font-medium tracking-[-0.07em]`, `text-[clamp(2.5rem,10vw,8rem)] lg:text-[clamp(3.5rem,7.5vw,8rem)]`, `mx-[0.2em]`; translates horizontally on scroll. (40) `.marquee-canvas` - centred `h-[28vh] w-[min(70vw,18rem)] lg:h-[38vh] lg:w-[min(72vw,24rem)] rounded-sm` window that expands to fullscreen. (30) `Prompt` ("Scroll to enter" `text-[10px] uppercase tracking-[0.2em] text-black/55`, `bottom-8`). (30) `ModelStage` - `bg-blue-900` full-screen layer that cross-fades in (`transition-opacity duration-700`), holding the R3F `<Canvas>` and the HUD below; `pointer-events-none` until active.
- Sub-components inside ModelStage:
  - **StageRail** (right, `right-4 top-[38%] lg:right-10 lg:top-1/2`, scale-90 mobile): vertical line `w-px bg-white/20` with progress fill (scaleY 0->1, white, glow `0 0 8px rgba(255,255,255,.45)`) and 7 `<button title aria-label="Show {label}" aria-current>` dots (20px hit area; active dot 14px filled with `ring-4 ring-white/20`, inactive 8px outline `border-white/40`). Props: `stages[]`, `activeIndex`, `onSelect`. + `PulseHint` (`rail-hint`).
  - **RotateHint** (`hidden lg:flex`, `bottom-24`): circle icon + "Drag to rotate" caption; fades out after first interaction.
  - **StageHUD** (bottom gradient `from-black/60 via-black/25`): left: eyebrow with 24px rule + word ("Structure"), h3 stage title (`text-3xl md:text-4xl lg:text-6xl`), description (`text-xs md:text-sm uppercase tracking-[0.14em] text-white/75`), `role="status" aria-live="polite"`; right: big index `01` (`lg:text-8xl tabular-nums`) + "of 07"; bottom: 2px progress track with 6 tick marks at k/7 and a draggable knob (`h-2.5 w-2.5` white glow) - `data-hud-text` marks text that re-animates on stage change.
- Stages (7): Full View + Walls, Floor, Roof, Pillars, Stairs, Windows & Doors. Each has `label`, `stat` (one-line descriptor) and a camera preset `{pos:[x,y,z], targetOffset:[x,y,z]}`; mesh groups fade to opacity 1 for the active group and ~0.025 (solid) / ~0.09 (wire edges) for others (lerp 4*dt). Camera FOV 50 desktop, 75 below 768px.
- Behaviour: marquee scroll -> window grows -> cross-fade to 3D -> progress through stages (scroll-scrubbed; rail dots and knob are also clickable/draggable) -> release to next section.
- Needs: `useGLTF('/assets/models/<villa>.glb')` Draco-compressed; sky/env lighting; see tech-stack.md.

### 2.4 ResidenceSlides `#residence-slides`
- `relative z-20 bg-[#EDE6D6]`; `.rs-stage h-screen p-3 md:p-5 lg:p-8` pinned; contains 2 `.rs-slide` (absolute grid: `grid-rows-2 lg:grid-cols-2 lg:grid-rows-1`, landscape-phone also 2 cols) and one `.rs-swiper` image panel (`absolute isolate z-50 rounded-[28px] md:rounded-[36px]`; mobile: bottom half `h-[calc(50%-6px)]`, lg: right half `w-[calc(50%-6px)]`) with 2 stacked `.rs-swiper-item` images that wipe between each other.
- `TextPanel` (`.rs-text`): `rounded-[28px] md:rounded-[36px] p-5 md:p-8 lg:p-10`, flex column justify-between; bg/colour from props (`#2A2725`/white on slide 1; slide 2 has its own pair). Slots: `headline` 3 masked lines (`clamp(2rem,8vw,3.75rem)`, lg `4.4vw`, `leading-[0.95] tracking-[-0.04em]`), `counter` (two circular 48/56px chips "01"/"02", overlapped by -1px, 2nd at opacity-40; `aria-label="Slide n of 2"`), `copy` (`max-w-[22rem] text-xs md:text-base`).
- Props: `slides: {id, bg, fg, headline[3], copy, image:{src,alt}}[]` (2).
- Scroll-driven: each slide swaps while the stage is pinned.

### 2.5 CloudTransition (`.ap-transition`)
- `relative z-30 -mt-[50vh] h-[80vh] lg:h-[160vh] bg-white` (CSS vars `--h-m:80vh --h-d:160vh`), `aria-label="Transition from villa to apartment"`. Layers: white wash (gradient mask like About), 2 cloud PNG/WebP layers (white versions, `top-[-42vh] md:top-[-52vh] h-[112vh]`), sticky centre block (100svh) with eyebrow ("Residence 02" style, `text-[10px] lg:text-xs tracking-[0.24em]`) + serif h2 `max-w-[15ch] clamp(2.25rem,9vw,8rem) leading-[94%]` (reveal via `data-reveal-01 data-reveal-local data-scroll data-duration=1 data-stagger=0.02`).
- Props: `eyebrow, heading(2 lines), clouds[2]`.

### 2.6 ApartmentStage `#residence-02`
- `relative z-30 bg-[#EDE6D6]`; `.ap-stage h-screen bg-white overflow-hidden` pinned. 3 `.ap-img` (absolute, animated clip/size; each contains `.ap-img-inner` `object-cover` with own `object-position`), hero text group bottom-left (eyebrow + 2-line h2 `clamp(2.75rem,12vw,5.5rem)`, lg `7vw`, `leading-[0.92]`), 3 `.ap-text` blocks in a box (`bottom-[16%] left-[6%] right-[6%] top-[56%]`, lg: `left-[74%] right-[3%] top-[18%] bottom-[24%]`), each: eyebrow, h2 (2 lines, `clamp(1.75rem,6.5vw,2.75rem)` lg `2.8vw`), paragraph (`max-w-[24rem] text-xs md:text-sm`), tags line (`text-[10px] uppercase tracking-[0.16em] opacity-70`), and `.ap-label` counter bottom-left (lg only: caption + rolling number column `01/02/03` over `/ 03`).
- Props: `rooms: {image:{src,alt,objectPosition}, eyebrow, headline[2], body, tags}[]` (3), `intro: {eyebrow, headline[2]}`, `caption`.

### 2.7 TourTeaser `#residence-02-tour`
- `relative z-30 bg-[#EDE6D6] text-white`; `.tour-stage h-screen`; `.tour-box` rounded-[28px] image card (`left-[4%] top-[12%] h-[70%] w-[92%]`; lg `left-[19%] top-[14%] h-[72%] w-[62%]`) that scale-expands on scroll (`.tour-inner` parallax).
- Overlay: top row: eyebrow + (lg only) **ControlsLegend** `<ul aria-label="Walkthrough controls">` of 3 items: `[W][A][S][D] Move`, `[E] Interact`, `[Q] Customize` (kbd chips `h-7 min-w-7 rounded-md border border-white/70 text-[11px]`). Bottom: h2 (`clamp(2.75rem,12vw,5.5rem)` lg `7.5vw`, "step inside" style) + paragraph (`max-w-md text-xs md:text-sm`) + **PillButton** "Enter ... →" -> `/tour` (client navigation) with `PulseHint`.
- Props: `eyebrow, headline, body, cta:{label,href}, controls:{keys[],action}[]`, `image`.

## 3. /tour components (see tour-page.md for detail)

| Component | Notes |
|---|---|
| `TourExperience` [C] | `div.w-screen.h-screen.flex` root; hosts everything below |
| `TourCanvas` | `@react-three/fiber` Canvas inside `position:relative;width:100%;height:100%;overflow:hidden` wrapper, with `<Physics>` (rapier) |
| `Apartment` | GLB `apartment.glb` + furniture variants (`bed1-3, smallbed1-2, cupboard1-2, tv1-3, sofa1-2, commode1, countertop, fridge, mirror`) swapped via store |
| `ZoneSensor` x5 | invisible boxes named `living-room, balcony, bedroom-1, bedroom-2, kitchen&uility` (ambient audio tone + hint triggers) |
| `PlayerController` | WASD + mouse pointer-lock (desktop) or on-screen joystick (touch; nipplejs `.nipple`, right half look, left half move) |
| `Crosshair` | 6px white dot, `mix-blend-difference`, scales 2.5x and goes opacity 100 when `isHintVisible` |
| `InteractHint` | "Press E" style prompt when near interactable |
| `CustomizationPanel` | white card, `Customization` title; Walls/Floor segmented tabs; 5 colour swatches each; style pickers (Bed, Small Bed, Cupboard, TV Unit, Sofa); footer "Walk away to close" with amber pulse dot |
| `BackToSite` | `<a href="/">` pill bottom-left (`left-6 bottom-6 md:left-10 md:bottom-8`, `rounded-full bg-[#EDE6D6]/90 backdrop-blur-md text-[11px] uppercase tracking-[0.18em]`), arrow nudges left on hover |
| `AudioManager` | zone tones, footsteps, door open/close, lo-fi bed; autoplay gated by first user gesture |

Zustand store fields (from bundle): `isHintVisible, isPanelOpen, activeInteraction, activeTab('walls'|'floor'), wallColor('#F5F5F0'), floorColor('#DFCDB5'), mobileJoystick{x,y}, showHint(i), hideHint(), openPanel(tab), closePanel(), setActiveTab, setWallColor, setFloorColor` + `selectedBed/SmallBed/Cupboard/Tv/Sofa` with setters.

## 4. Component -> section matrix

| Component | Hero | About | Marquee | Slides | Cloud | Apartment | Teaser | Footer | Tour |
|---|---|---|---|---|---|---|---|---|---|
| RevealText | x | x | | x | x | x | x | x | x |
| HoverReveal/RollLink | x | | | | | | x | x | |
| ArrowLink | x | | | | | | | | x (back) |
| PillButton | | | | | | | x | | x |
| PulseHint | | | x | | | | x | | |
| CloudLayer | | x | | | x | | | | |
| ImageCarousel | | x | | | | | | | |
| ModelStage/StageRail/StageHUD | | | x | | | | | | |
| TextPanel | | | | x | | | | | |
| ContactOverlay | | | | | | | | x (+nav) | |
| SiteNav | x (global) | | | | | | | | x |

## 5. Accessibility contract (all components)
- Decorative images `alt=""` + `aria-hidden` containers (clouds, tiles); informative images carry descriptive alt (placeholders in content-slots.md).
- Nav toggle uses `aria-expanded/controls`, closed panel is `inert`.
- Overlay: dialog semantics + focus trap + Esc.
- HUD and preloaders use `role="status" aria-live="polite"`; rotate warning `role="alert"`.
- Respect `prefers-reduced-motion` (reference checks it in the contact overlay; recommended everywhere: skip scrub/parallax, show final states).
- All interactive elements have `focus-visible` outlines (`outline-2 outline-offset-2/4` in the section's text colour).
