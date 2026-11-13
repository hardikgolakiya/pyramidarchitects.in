# Colours

The palette is tiny: a warm sand / charcoal pair plus white/black and white-alpha overlays. Brand colours are placeholders for the client; keep the roles.

## Core palette (hard-coded as Tailwind arbitrary values `[#...]`, not theme vars)
| Token | Hex | Role |
|---|---|---|
| `--color-sand` | **#EDE6D6** | Page/section background on every light section (`#about`, `#marquee-transition`, `#residence-slides`, `#residence-02`, `#residence-02-tour`, footer). Also text colour on dark (contact modal, preloader), arrow-button fill, progress fill. |
| `--color-ink` | **#2A2725** | Main text on sand/white; dark slide card bg; hover-fill bg of outlined pills; contact-modal + preloader background; footer lines (at 20%); arrow icon colour. lab(15.91 1.095 1.848) ~ warm near-black. |
| `--color-white` | #FFFFFF | Hero/over-image text, `.ap-transition` + `.ap-stage` background, white slide card, HUD text. |
| `--color-black` | #000 | Hero bg fallback, hero overlay (`bg-black/35`), prompt text `black/55`. |
| `--color-night` | `blue-900` #1c398e (lab 26.15 15.75 -51.55) | 3D "structure" HUD stage background (`bg-blue-900`) and rotate-device overlay on /tour. |
| `--color-status` | #3FA85B | "Open to work" dot (+ ping at /70). |
| `--color-status-soft` | #9ED8A8 | Contact modal "Open to new work" dot (pulse). |

Contrast: ink on sand ~ 11:1; white on photography relies on `bg-black/35` overlay and bottom gradients.

## Theme-level variables (default Tailwind, in the CSS `@layer theme`)
`--color-amber-50 #fffbeb`, `amber-400 #fcbb00`, `amber-700 #b75000`, `blue-900 #1c398e`, gray-50..900 (`#f9fafb #f3f4f6 #e5e7eb #d1d5dc #99a1af #6a7282 #364153 #1e2939 #101828`), black, white. Only `blue-900`, black and white are actually used in the markup; the rest are tree-shaken leftovers (Tailwind v4 emits oklch/lab variants under `@supports (color:lab(0% 0 0))`; hex fallbacks above).

## Document-level variables (`globals.css`, outside layers)
```css
:root{--background:#fff;--foreground:#171717}
@media (prefers-color-scheme:dark){:root{--background:#0a0a0a;--foreground:#ededed}}
body{background:var(--background);color:var(--foreground);font-family:var(--font-familjen-grotesk),sans-serif}
```
Every section sets its own bg/text, so these only show in overscroll / behind content. Computed `body` colour in a dark-scheme browser = rgb(237,237,237) (v). Keep for parity or drop; deliver light-only if client prefers.

## Alpha usage (Tailwind slash opacity)
| Value | Where |
|---|---|
| white/20 | HUD rail track (`bg-white/20`), `ring-white/20` on active dot |
| white/25 | HUD progress track `bg-white/25` |
| white/40 | inactive rail dot border |
| white/50 | rail ticks, rotate-hint ring border, line accents |
| white/60 | pulse ring (`rail-hint-ring`, `tour-hint-ring`); eyebrow rule `h-px w-6` |
| white/70 | HUD eyebrow text; `.tour-fade` pill border (`border-white/70`); kbd border `white/70` |
| white/75, /80 | HUD subtitle, "Drag to rotate" |
| white/10 | rotate-hint button bg |
| black/35 | hero image overlay |
| black/55 | "Scroll to enter" text |
| gradient `from-black/60 via-black/25 to-transparent` (`bg-gradient-to-t`) | HUD bottom scrim (`pt-20 lg:pt-28`) |
| gradient `from-black/40 via-transparent to-transparent` | rotate-device scrim |
| ink/20 (`#2A2725/20`) | footer frame border, footer rules |
| ink/55, /65, /70 | footer small print, column headings, Open-to-work text |
| sand/04 (`#EDE6D6/[0.04]`) | contact-modal row + pill fills |
| sand/06 | contact-modal decorative blur disc (480px, `blur-3xl` 64px, at `-right-40 -top-40`) |
| sand/10 | preloader progress track |
| sand/20, /25 | contact-modal borders; sand/40, /45, /50, /60, /65, /70, /75, /80 text tints |
| tour pill: `bg-[#EDE6D6]/90` + `border-[#2A2725]/15` + `backdrop-blur-md` | "Back to site" pill on /tour |

## Hard-coded colours in JS (3D scene / progress; give to motion/build agents)
Scene palette seen in chunks: #F5F5F0, #DFCDB5, #F2EBD9, #EADBC8, #D8CFC4, #C8A896, #B8A890, #7D8C5A, #6B8CAE, #3A4F60, #354F79, #bcb9b3, #a0a0a0, #666666, #fcfcfc; glow `rgba(255,255,255,0.45|0.6)` on HUD progress knob; `rgba(251,191,36,0.25)` / `rgba(245,158,11,0.45)` amber highlight (interaction hint in 3D). Loader slides alternate card colours: `{bg:#2A2725,text:#FFFFFF}` and `{bg:#ffffff,text:#2A2725}` (inline styles on `.rs-text`).

## Section background sequence (top to bottom)
Hero (#000 + photo) -> `#about` sand (white-ish cloud PNG overlays) -> `#marquee-transition` sand, inner stage swaps to blue-900 -> `#residence-slides` sand with alternating ink / white cards -> `.ap-transition` **white** (wash `bg-white`) -> `#residence-02` sand wrapper with white `.ap-stage` -> `#residence-02-tour` sand w/ photo box -> footer sand. Contact modal / preloader: ink.

## Dark mode
No dark-mode UI. Only the unused `--background/--foreground` flip.

## Tailwind equivalents
```css
@theme {
  --color-sand: #EDE6D6;
  --color-ink:  #2A2725;
  --color-status: #3FA85B;
  --color-status-soft: #9ED8A8;
  --color-night: #1c398e;
}
```
Usage: `bg-sand text-ink`, `border-ink/20`, `text-ink/65`, `bg-sand/[0.04]`. See `tokens.css` and `tokens.json`.
