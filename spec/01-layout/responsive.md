# Responsive behaviour (`/`) at 375 / 768 / 1024 / 1440

Breakpoints that change layout: `md` 768 (48rem), `lg` 1024 (64rem), `sm` 640 only for hero actions row + marquee HUD row + tour loader subtitle. No `xl`/`2xl` rules in markup; large screens scale through `vw` units and clamps. Plus the `LS` landscape-phone variant (landscape, height <= 500, width <= 1023) which re-tunes almost every section for 812x375-class devices.
Doc height: 375x812 = 21 356 | 768x1024 = 26 931 | 1024x768 = 22 041 | 1440x900 = 25 830.

## Section table (all px measured)
| Item | 375x812 | 768x1024 | 1024x768 | 1440x900 |
|---|---|---|---|---|
| Nav padding-x / height | 24 / 52 | 40 / 52 | 40 / 52 | 40 / 52 |
| Hero h1 size | 45 (clamp 12vw) | 80 (5rem) | 90.24 (5.64rem) | 90.24 |
| Hero h1 position | x24 y130 | x40 y164 | x40 y54 (top 7%) | x40 y63 |
| Hero actions | column | row gap 20 | row, text-lg | row |
| Hero meta | 2x2 grid @ bottom 13% | flex row @ bottom 13% | flex row, vertically centred, 18px | same |
| About stage box rest | 330x325 @ x23 y195 | 614x389 @ x77 y266 | 471x292 @ x266 y184 | 662x342 @ x374 y216 |
| About gallery tiles | none (hidden) | none | 6 tiles + title (3.5vw=35.8) | 6 tiles (title 50.4) |
| About paragraph | 28px, full-width stacked under "About" label | 40px, stacked | 53.2px (5.2vw), 10-col, label col 2/12 | 74.9px |
| About pin extra | 1.6vh | 1.6vh | 3.2vh | 3.2vh |
| Marquee text | 40 | 76.8 | 76.8 (7.5vw) | 108 (7.5vw) |
| Marquee window | 263x227 | 288x287 | 384x292 | 384x342 |
| Marquee rail | right-4 top-38% scale .9 | same | right-10 top-50% scale 1 | same |
| Marquee HUD title / counter | 30 / 36 | 36 / 48 | 60 / 96 | 60 / 96 |
| Slides inset / radius | 12 / 28 | 20 / 36 | 32 / 36 | 32 / 36 |
| Slides layout | stacked rows (text on top, photo bottom, each `calc(50% - 6px)`) | stacked | side by side 2 cols | side by side |
| Slides h2 | 32 | 60 | 45 (4.4vw) | 63.4 |
| ap-transition height | 80vh = 650 | 80vh = 819 | 160vh = 1229 | 160vh = 1440 |
| ap-transition heading | 36 | 69 | 92 | 128 (clamp max 8rem) |
| Residence 02 hero h2 | 45 | 88 (clamp max 5.5rem) | 71.7 (7vw) | 100.8 |
| Residence 02 text panel | bottom area: x6%..94%, y56%..84% | same | right column x74%..97%, y18%..76% | same (x1066 w331) |
| Residence 02 "Inside the apartment" label | hidden | hidden | shown | shown |
| Tour box rest | 92% x 70% @ 4%/12% | same | 62% x 72% @ 19%/14% | same |
| Tour keyboard legend (WASD) | hidden | hidden | shown | shown |
| Footer | min-h 100svh flex-col; stacked | flex-col; h2 99.8 | `lg:block` h-screen, py-16, 2-col grid | same |

## Mobile (<768) specifics
- `main` has `overflow-x-clip`; clouds/tile layers are wider/offset than viewport and are clipped.
- Hero uses `100svh` so mobile browser chrome does not clip; stage heights everywhere use `100svh` below lg and `100vh` at lg.
- Page gutters: 24px (px-6) for nav/hero/about/ap; 12px for slides stage, 16px for footer outer + 20px footer frame padding.
- About: no tile gallery; only box morph + text.
- Footer tagline (top-right) hidden; bottom row stacks.

## Tablet 768-1023
- Same as mobile structure, with `md:` padding bumps (px-10 nav, p-5 slides, p-8 caption, rounded 36).
- Hero actions stay in one row, meta becomes a flex row.
- Still **no** two-column splits (slides stack; Residence-02 text sits under centre of the image).

## Desktop >=1024
- Introduces: gallery tiles in About; side-by-side slides; apartment text column on the right; 160vh transition; larger pin distances (about 3.2vh); WASD legend and "Drag to rotate" hint; footer becomes block layout with fixed 100vh height.
- Typography scales in `vw` (`5.2vw`, `4.4vw`, `7vw`, `7.5vw`, `2.8vw`, `3.5vw`), so 1440 is simply ~1.41x of 1024 for those.

## Landscape phone (LS) overrides (examples)
Hero title 2.25rem at top-[18%], actions in a row, meta bottom-14; about slot 70% x 60% (left 15%, top 25%), grid cols 2/10; slides become 2-col side-by-side with p-3 and radius 20; residence-02 text panel right column (left 73%); footer px-4 py-3 with 2-col grid and horizontal bottom row; arrows 32px.

## Portrait phone/tablet on `/tour`
Custom CSS shows `.rotate-device-warning` full-screen (z-999, `#0f0f0f`, flex-column centred) when `(max-width:1024px) and (orientation:portrait)`; hidden otherwise. Content: wordmark top-left, lock badge (96px circle with ping ring), eyebrow "Landscape mode", serif title (`clamp(2.25rem,10vw,3.5rem)` leading 96%) "Turn your device, sideways.", caption (xs uppercase tracking .14em, max-w-xs). (The SSR markup's utility classes say z-[9999]/bg-blue-900 but the custom rule above wins: measured computed z 999, bg rgb(15,15,15).)

## Rebuild guidance
- Implement as mobile-first Tailwind with `md:`/`lg:` exactly as in `sections.md`; add a `ls` custom variant `@custom-variant ls (@media (orientation:landscape) and (max-height:500px) and (max-width:1023px))`.
- Use `svh` for stage heights at <lg and `vh`/`screen` at lg.
- Pin scenes via GSAP ScrollTrigger (`pin: stage, end: "+=<n>vh"`, `pinSpacing:true`) with distances from `overview.md`.
