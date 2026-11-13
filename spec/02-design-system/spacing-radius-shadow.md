# Spacing, radius, shadow, z-index, misc tokens

Tailwind v4: `--spacing: .25rem` (1 unit = 4px, utilities are `calc(var(--spacing) * n)`). No custom spacing scale. Arbitrary values are used for precise offsets.

## Breakpoints
| Name | Min width | Notes |
|---|---|---|
| (base) | 0 | mobile, designed at 375 |
| `sm` | 40rem (640px) | hero actions go row; HUD footer row |
| `md` | 48rem (768px) | tablet; nav px-10 |
| `lg` | 64rem (1024px) | desktop layout (sections switch to fixed-viewport stage, vw-based type) |
| `xl` 80rem, `2xl` 96rem | declared, barely used |
| `ls` (custom) | `(orientation:landscape) and (max-height:500px) and (max-width:1023px)` | phone-landscape compaction of nearly everything |
| portrait warning | `@media screen and (max-width:1024px) and (orientation:portrait)` | `.rotate-device-warning` shows on /tour only: `fixed inset-0 z-[9999]` flex column, bg #0f0f0f in CSS (markup overrides with `bg-blue-900`), padding 24px |
| `hover:hover` | | hover styles wrapped in `@media (hover:hover)` by Tailwind v4 |

Page gutters: **`px-6` (24px) mobile, `md:px-10` (40px) tablet+/desktop** for nav, hero, about text layer. Footer: `px-4 md:px-10`. Contact modal: `px-5 md:px-10`, content `max-w-[1280px] mx-auto`. Text max widths used: `max-w-[350px]`, `[22rem]`, `[24rem]`, `max-w-xs 20rem`, `max-w-md 28rem`, `max-w-xl 36rem`, `max-w-[12ch]`, `[15ch]`.
Grid: about text layer is a 12-col grid, `gap-4 lg:gap-6`; label `col-span-12 lg:col-span-2`, text `lg:col-span-10`. Footer main grid `lg:grid-cols-[1fr_auto] lg:gap-16 gap-10`; link columns `grid-cols-2 gap-8 md:gap-12 lg:gap-20 lg:min-w-[360px]`.

## Spacing values actually used (Tailwind unit -> px)
0.5=2, 1=4, 1.5=6, 2=8, 2.5=10, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48, 14=56, 16=64, 20=80, 24=96, 28=112; arbitrary em paddings `0.05em/0.1em/0.14em/0.15em/0.18em/0.2em` (text masks) and % offsets (layout agent owns those).
Recurring patterns:
- Nav: `px-6 py-4 md:px-10` (height ~ 52px: logo 20px + 32px padding).
- Menu dropdown list: `pt-3`, `li overflow-hidden pb-[0.1em]`.
- Hero actions: `mt-4`, `flex-col gap-0` -> `sm:flex-row sm:gap-5`; each link `gap-3 py-1.5 lg:py-0`.
- Residence slide frame: `p-3 md:p-5 lg:p-8`, slide grid `gap-3` (12px); card padding `p-5 md:p-8 lg:p-10`; `ls` p-3/p-4.
- AP text block: `gap-3 lg:gap-5`; hero caption `p-6 md:p-8 lg:p-12 gap-4 lg:gap-5`.
- Tour overlay: `p-6 md:p-10`; heading/copy `gap-6 lg:gap-10`, copy stack `gap-5`.
- Footer: outer `pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:py-6 lg:py-16`; frame `px-5 py-6 md:px-10 md:py-10`; rules `my-8 md:my-16`; link column gap `gap-4`; link `py-1 lg:py-0`.
- Pills: `px-6 py-3` (CTA), `px-4 py-2.5` (back pill, copy btn), `px-3 py-1.5` (chip), `py-2 pl-4 pr-3` (modal close), `p-2.5` (social icon).
- Safe areas: `env(safe-area-inset-bottom|top|left|right)` used in footer, rotate warning, modal.
- Scroll: `html{scroll-behavior:smooth;scroll-padding-top:1rem}`, `section[id]{scroll-margin-top:20px}`.

## Radius
| Token | Value | Where |
|---|---|---|
| `rounded-sm` | .25rem 4px | marquee canvas image |
| `rounded-md` | .375rem 6px | `kbd` keycaps, modal Esc kbd |
| `rounded-xl` | .75rem 12px | about tiles + `.about-box` carousel frame |
| `rounded-2xl` | 1rem 16px | contact modal rows (mobile) |
| `rounded-3xl` | 1.5rem 24px | contact modal rows (`md:`) |
| `rounded-full` | 9999px | pills, round buttons, dots, counter circles, HUD knob |
| `rounded-[20px]` | 20px | footer frame (mobile), `ls` variants of cards |
| `rounded-[28px]` | 28px | residence cards `.rs-text`, image panel, `.tour-box`; `md:` -> 36px |
| `rounded-[30px]` | 30px | footer frame `md:` and up |
| `rounded-[36px]` | 36px | residence cards `md:` and up |
Pattern: large photo/card frames 28-36px (20px phone-landscape), media thumbnails 12px, controls fully round. Verified: `.rs-text` 28px @375, `.footer-frame` 20px @375, `.about-box` 12px, `.marquee-canvas` 4px.

## Borders & rules
Preflight `border:0 solid`. Widths: 1px (`border`), 3px bars (`h-[3px]`), 2px progress (`h-[2px]`), hairlines `h-px`/`w-px`. Colours/alphas in components-styling.md.

## Shadows / effects
| Token | Value | Where |
|---|---|---|
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0/.1), 0 4px 6px -4px rgb(0 0 0/.1)` | hint buttons (`rail-hint`, `tour-hint` inner white circle), /tour back pill |
| glow (inline) | `0 0 8px rgba(255,255,255,.45)` (progress fill / rail fill) ; `0 0 10px rgba(255,255,255,.6)` (knob) | HUD |
| crosshair dot (inline, /tour) | `0 0 4px rgba(0,0,0,.3)` | `w-1.5 h-1.5 bg-white rounded-full mix-blend-difference opacity-60` |
| `ring-4 ring-white/20` | 4px ring | active rail dot |
| `backdrop-blur-sm` 8px / `md` 12px | | rotate-hint button + lock badge / /tour back pill |
| `blur-3xl` 64px | | decorative 480px disc in contact modal (`bg-[#EDE6D6]/[0.06]`) |
| `mix-blend-difference` | | fixed `<nav>`, so white nav inverts over sand |
| mask on cloud images | `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,.25) 15%, rgba(0,0,0,.6) 30%, rgba(0,0,0,.9) 42%, #000 50%)` (`-webkit-mask-image` + `mask-image`) | cloud overlays |
| inline tilt `rotate` | -4deg, -2deg, 3deg, -6deg, 8deg | about tiles |

## Z-index map
`z-0` hero (sticky) · `z-10` inner content/HUD parts · `z-20` `#about`, `#residence-slides`, AP captions · `z-30` `.ap-transition`, `#residence-02`, `#residence-02-tour`, footer, cloud layers · `z-[35]` wash layers (`.about-bg`, `.ap-transition-wash`) · `z-40` about-stage, AP sticky, marquee canvas · `z-50` nav, about-box · `z-[200]` preloader (home) · `z-[300]` preloader (/tour) · `z-[999]` contact modal · `z-[9999]` rotate warning (/tour). Tokens: `--z-*` in tokens.css.

## Sizes of recurring controls
- Round arrow button 40x40 (`h-10 w-10`), `ls` 32x32.
- Counter circle 48 (`h-12 w-12`) / md 56 / `ls` 36.
- Rail button hit area 20x20 (`h-5 w-5`) with dot 14px (active) or 8px (inactive).
- Nav menu icon: 2x2 grid of 3px dots, gap 2px.
- kbd: `h-7 min-w-7 px-1.5` (28px).
- Hint buttons 36x36 (`h-9 w-9`); lock badge 96x96.
- Status dot 8px (`h-2 w-2`), modal dot 6px; ping `1s cubic-bezier(0,0,.2,1) infinite`, pulse `2s cubic-bezier(.4,0,.6,1) infinite`.
- Preloader bar 3px tall, `mt-7`.

## Transition tokens
Default duration .15s, ease `cubic-bezier(.4,0,.2,1)`. Used: `duration-300` (links, pills, arrows), `duration-500` (modal rows, nav dots), `duration-700` (HUD stage fade), `ease-out cubic-bezier(0,0,.2,1)`, signature ease `cubic-bezier(0.22,1,0.36,1)` (menu dots 500ms, modal fills/icon 500ms). GSAP eases (power3, expo) belong to the motion spec.
