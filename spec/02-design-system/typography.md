# Typography

Source: `raw/css/3be7mmba3usfq.css`, class names in `raw/index.html`/`tour.html`, JS chunk `1v84rdd_g9_xm.js` (contact modal). Values marked (v) were verified with `getComputedStyle` at 375 / 768 / 1440 px.

## Font families (Google Fonts via `next/font/google`)
| Role | Family | Weights / styles | CSS var | Fallback (next/font metric-adjusted) |
|---|---|---|---|---|
| Sans (default, `body`, `font-sans`) | **Familjen Grotesk** | variable 400-700, normal only (no italic loaded) | `--font-familjen-grotesk` | `"Familjen Grotesk Fallback"` = local Arial, size-adjust 94.59%, ascent 108.37%, descent 23.79%, line-gap 0 |
| Serif (`font-serif`, display) | **Instrument Serif** | 400 only, normal + italic files loaded (italic is NOT used anywhere in the markup) | `--font-instrument-serif` | `"Instrument Serif Fallback"` = local Times New Roman, size-adjust 83.94%, ascent 117.94%, descent 36.93%, line-gap 0 |

- `font-display: swap`; latin + latin-ext + vietnamese subsets (3 woff2 for Familjen, 2 normal + 2 italic for Instrument).
- Variables are applied as classes on `<html>`: `class="{familjen.variable} {instrument.variable} h-full antialiased"`. `antialiased` = `-webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale`.
- Tailwind v4 theme maps: `--default-font-family: var(--font-familjen-grotesk)`; `font-sans` = Familjen Grotesk, `font-serif` = Instrument Serif (declared via `@theme inline { --font-sans: var(--font-familjen-grotesk); --font-serif: var(--font-instrument-serif); }`). Computed `body` font-family: `"Familjen Grotesk","Familjen Grotesk Fallback",sans-serif` (v).
- Base: `html{line-height:1.5}`, body 16px/24px, weight 400, `letter-spacing: normal`.
- Rule of thumb: **serif (Instrument Serif, regular 400) only for big display statements** (hero H1, "A quieter way to live" tile, transition heading, footer H2, contact modal H2/row titles, rotate-device H2). **Everything else is Familjen Grotesk**; big grotesk headings use weight 400 with tight negative tracking; labels are tiny, uppercase, wide-tracked.
- No italic, no bold in headings. Weights used: 400 (default), 500 (`font-medium`: logo, marquee, kbd, preloader), 600 (`font-semibold`: footer brand, modal buttons), 700 (`font-bold`: MENU + menu items).
- Numerals: `tabular-nums` on counters (HUD "01", preloader "00", AP counter).

## Tailwind default scale in use (theme vars from the CSS)
text-xs .75rem/1.333 · sm .875/1.4286 · base 1/1.5 · lg 1.125/1.5556 · xl 1.25/1.4 · 2xl 1.5/1.3333 · 3xl 1.875/1.2 · 4xl 2.25/1.1111 · 5xl 3/1 · 6xl 3.75/1 · 8xl 6/1.
Tracking tokens: tight -0.025em, normal 0, wide .025em. Leading: tight 1.25, relaxed 1.625.
Breakpoints (Tailwind v4 defaults): sm 40rem, md 48rem, lg 64rem, xl 80rem, 2xl 96rem. Custom variant used everywhere (call it `ls`): `@media (orientation:landscape) and (max-height:500px) and (max-width:1023px)` (phone landscape); contact modal uses `(orientation:landscape) and (max-height:500px)`.

## Per-element type spec
Columns: mobile (<768, measured at 375) / md (768+) / lg (1024+, measured at 1440). `ls` = phone-landscape override. "LH" line-height, "LS" letter-spacing.

### Display / headings
| Element (class hook) | Family | Mobile | md | lg | LH | LS | Transform | Colour |
|---|---|---|---|---|---|---|---|---|
| Hero H1 `h1.hero-title-line` | serif 400 | `clamp(2.75rem,12vw,4.5rem)` = 45px @375 | `5rem` (80px) | `5.64rem` (90.24px) | 94% (42.3 / 75.2 / 84.83px) | normal | none | #fff |
| Hero H1 `ls` | | 2.25rem | | | | | | |
| About tile "A quieter way to live" `.about-tile` | serif | `text-3xl` 30px | 30px | `3.5vw` (50.4px @1440) | `leading-tight` 1.25 (37.5 / 63px) | normal | none | #2A2725 |
| About statement `.about-text-layer p` (word-split) | sans 400 | `clamp(1.75rem,7vw,2.5rem)` (28px @375, 40px @768) | same clamp | `5.2vw` (74.88px) | 1.05 mobile/md, **80%** at lg (59.9px) | **-0.045em** (-1.26 / -1.8 / -3.37px) | none | #2A2725 |
| About statement `ls` | | 1.75rem | | | | | | |
| Marquee `.marquee-track` | sans **500** | `clamp(2.5rem,10vw,8rem)` (40px @375, 76.8 @768) | same | `clamp(3.5rem,7.5vw,8rem)` (108px @1440) | `leading-none` 1 | **-0.07em** | none (source text is uppercase) | #2A2725; items `mx-[0.2em]` |
| Residence slide H2 `.rs-text h2` | sans 400 | `clamp(2rem,8vw,3.75rem)` (32px @375, 60px @768) | same | `4.4vw` (63.36px) | 0.95 | -0.04em | none | white on dark card / #2A2725 on white card |
| Residence H2 `ls` | | `3.4vw` | | | | | | |
| Transition heading `.ap-transition-heading` | serif | `clamp(2.25rem,9vw,8rem)` (36px @375; 69.12 @768) | same | same clamp (128px @1440 cap) | 94% | normal | none | #2A2725; `max-w-[15ch]`, centred |
| AP hero H2 (`font-sans` after `.ap-hero-piece`) | sans | `clamp(2.75rem,12vw,5.5rem)` | same | `7vw` (100.8px) ; `ls` 7vw | 0.92 | -0.05em | none | white |
| AP text H2 `.ap-text h2` | sans | `clamp(1.75rem,6.5vw,2.75rem)` (28px @375; 44px @768) | same | `2.8vw` (40.32px); `ls` 2.8vw | 0.98 (27.4 / 43.1 / 39.5px) | -0.04em | none | #2A2725 |
| Tour H2 "Step inside." | sans | `clamp(2.75rem,12vw,5.5rem)` | same | `7.5vw` (108px) | 0.9 | -0.05em | none | white |
| Footer H2 | serif | `clamp(3rem,13vw,7rem)` (48.75px @375; 99.84 @768) | same | `clamp(2.75rem,8vw,7rem)` (112px @1440) ; `ls` 2.5rem | 0.88 (98.56px @1440) | -0.03em | none | #2A2725; `max-w-[12ch]` |
| HUD title `h3[data-hud-text]` | sans | `text-3xl` | `text-4xl` | `text-6xl` | `leading-none` | -0.04em | none | white |
| HUD number "01" | sans, tabular-nums | `text-4xl` | `text-5xl` | `text-8xl` (96px) | none (1) | -0.05em | none | white |
| Contact modal H2 | serif | `clamp(2rem,min(5.4vw,8.5vh),4.5rem)`; `ls(h<=500)` `clamp(1.5rem,9vh,2.25rem)` | | | 1 | -0.03em | none | #EDE6D6; second line `#EDE6D6/50` |
| Contact row title | serif | `clamp(1.35rem,min(2.6vw,4vh),2rem)` | | | `leading-tight` | -0.02em | none | |
| Rotate-device H2 (/tour, portrait <=1024) | serif | `clamp(2.25rem,10vw,3.5rem)` | | | 96% | normal | none | white |
| Preloader brand | sans 500 | `clamp(1.5rem,2.5vw,2.75rem)` | | | none | -0.055em | none | #EDE6D6 |
| Preloader number | sans 500 tabular | `clamp(1.75rem,2.8vw,3rem)` | | | none | -0.05em | none | #EDE6D6 |
| Tour preloader caption | sans 400 | `clamp(0.75rem,1.5vw,1rem)` | | | tight | 0.12em | uppercase | #EDE6D6/70 |

### Body copy
| Element | Mobile | md | lg | LH | LS | Colour |
|---|---|---|---|---|---|---|
| Hero tagline `.hero-bottom p` | 14px (`text-sm`) | 16px | 18px | **120%** (16.8/19.2/21.6) | normal | #fff |
| About supporting copy `.about-supporting-copy` (`max-w-[350px]`) | 14px | 14px | 18px | 1.35 (18.9 / 24.3) | -0.01em | #2A2725 |
| `.rs-copy` (`max-w-[22rem]`) | 12px | 16px | 16px | 1.4 (22.4 at 16) | -0.01em | inherits card colour |
| AP body `p.max-w-[24rem]` | 12px | 14px | 14px | 1.5 (`ls`: 11px / 1.4) | -0.01em | #2A2725 |
| Tour body copy | 12px | 14px | 14px | 1.5 | -0.01em | white |
| Footer tagline | 18px (`text-lg`) | 20px (`text-xl`) ; `ls` text-sm | 20px | 1.2 | normal | #2A2725 |
| Footer links/columns `grid text-sm` | 14px | 14px | 16px | Tailwind default (text-sm 1.4286 = 20px; text-base 1.5 = 24px) | normal | #2A2725 |
| Contact modal paragraph | `text-sm` | 15px | 15px | `leading-relaxed` 1.625 | normal | #EDE6D6/65 |

### Labels / UI text (all Familjen Grotesk 400, uppercase unless noted)
| Element | Size (mobile / md / lg) | LH | LS | Colour |
|---|---|---|---|---|
| Nav logo `nav a` "STILL / FORM" | 20px (`text-xl`) all, weight 500 | none (1) | normal | white (nav has `mix-blend-difference`) |
| Nav MENU button | 16px, **700** | none | `tracking-tight` -0.025em (-0.4px) | white |
| Menu items `.menu-item` | 16px, **700**, uppercase | 1.15 (18.4px) | -0.025em | white |
| Hero CTA links `.hero-actions a` | 14px / 16px / 18px (`text-sm md:text-base lg:text-lg`; `ls` text-xs) | Tailwind default for size (20 / 24 / 28px) | normal | white; label has `border-b border-white` |
| Hero meta `p` (4 items) | 11px / 14px / 18px (`ls` 10px) | 16.5 / 20 / 28px | **0.18em** (1.98 / 2.52 / 3.24px) | white |
| "About" eyebrow | 10px | 15px (1.5) | 0.18em | #2A2725 |
| "Scroll to enter" `.marquee-prompt` | 10px | 15px | 0.2em | `text-black/55` |
| HUD eyebrow "Structure" / "of 07" / "Drag to rotate" | 10px | 1.5 | 0.2em | white/70, /60, /80 |
| HUD subtitle `p[data-hud-text]` | 12px / 14px (md) | 1.333/1.4286 | 0.14em | white/75 |
| `.ap-transition-copy p` eyebrow ("Residence 02") | 10px mobile / **12px lg** (`lg:text-xs`) | 15 / 16px | **0.24em** | #2A2725 |
| `.ap-hero-piece` eyebrow, `.ap-text p:first` eyebrow | 10px | 15px | 0.2em | white / #2A2725 |
| AP meta line (`opacity-70`) | 10px (`ls` 9px) | **1.6** | 0.16em | #2A2725 @70% |
| `.ap-label` ("Inside the apartment 01/03") | 11px | 16.5px | 0.18em | #2A2725; counter `tabular-nums`, "/ 03" `opacity-50` |
| `.tour-piece` eyebrow | 12px | 16px | 0.2em | white |
| Controls list `ul.tour-piece` | 10px | | 0.18em | white |
| `kbd` keycap | 11px **500** | | normal | white |
| `.tour-fade` CTA pill | 11px | 16.5px | 0.18em | white |
| Slide counter `.rs-counter span` | 14px (`text-sm`; `ls` xs) | 20px | normal | currentColor |
| Footer top row (brand/tagline, bottom row) | 12px / 14px (md) ; `ls` 12 / 11px | | 0.12em | #2A2725; brand weight 600 + 0.08em |
| Footer column headings ("Explore","Follow") | 12px (`ls` 10px) | | 0.12em | #2A2725/65 |
| Footer small print | 10px / 11px (md) / `ls` 9px | | 0.12em | #2A2725/55 |
| "Open to work" button | 11px (not uppercase) | | 0.12em | #2A2725/70 |
| Rotate-device small | 10px eyebrow 0.2em; body 12px, leading 1.7, tracking 0.14em, white/75 | | | |
| Back-to-site pill (/tour) | 11px / 12px md | | 0.18em | #2A2725 |
| Preloader caption /tour | 10px 0.2em #EDE6D6/60; 9px 0.18em /40 (sm+) | | | |
| Contact modal: close btn | 14px 600 leading-none | | | |
| Contact modal: chip "Open to new work" | 12px | | | #EDE6D6/80 |
| Contact modal: row note | 12px, opacity .6 | | | |
| Contact modal: email link | 15px / 18px md | | | |
| Contact modal: Copy button | 12px 600 | | | #2A2725 on #EDE6D6 |

## Reveal-text helpers (affect line box, keep when replicating)
- `[data-reveal-01]{visibility:hidden}` until JS splits it; `[data-reveal-01]>*{margin-bottom:-.18em}`; `.word-mask/.char-mask/.line-mask{overflow:clip; overflow-clip-margin:.06em; vertical-align:top}` with inner `padding-bottom:.18em; will-change:transform`.
- `.ap-transition-heading .char-mask{display:inline-block; overflow:clip; overflow-clip-margin:.06em; vertical-align:top}`.
- Hand-rolled line masks in markup: wrapper `-mb-[0.15em|0.18em] -mt-[0.05em] block overflow-hidden pb-[0.15em|0.18em] pt-[0.05em]` (neutral: the padding compensates tight line-height so descenders aren't clipped); about words: wrapper `-mb-[0.1em] -mt-[1em] mr-[0.25em] inline-block overflow-hidden pb-[0.2em] pt-[0.1em] align-bottom`.
- `[data-hover-reveal]` (nav/menu/footer/CTA text): `display:inline-block; cursor:pointer; vertical-align:top`; inner `.hover-reveal-track{display:grid;overflow:hidden;line-height:inherit}`, `.hover-reveal-line{grid-area:1/1;white-space:pre;display:block}`, `.hover-reveal-char{display:inline-block;will-change:transform}` (two stacked copies of the text, chars slide up on hover; timings belong to motion spec).

## Tailwind v4 equivalents
```css
@import "tailwindcss";
@theme inline {
  --font-sans: var(--font-familjen-grotesk);
  --font-serif: var(--font-instrument-serif);
}
```
```ts
// next/font
import { Familjen_Grotesk, Instrument_Serif } from "next/font/google";
export const sans  = Familjen_Grotesk({ subsets:["latin","latin-ext","vietnamese"], variable:"--font-familjen-grotesk", display:"swap" }); // variable wght 400-700
export const serif = Instrument_Serif({ subsets:["latin","latin-ext"], weight:"400", style:["normal","italic"], variable:"--font-instrument-serif", display:"swap" });
```
Tailwind v3 equivalent: `fontFamily:{ sans:['var(--font-familjen-grotesk)','sans-serif'], serif:['var(--font-instrument-serif)','serif'] }` (see `tokens.json` -> `tailwind`).
Add a custom variant for phone landscape: `@custom-variant ls (@media (orientation:landscape) and (max-height:500px) and (max-width:1023px));`
