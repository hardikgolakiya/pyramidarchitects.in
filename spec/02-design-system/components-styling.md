# Component styling (buttons, links, pills, cards, borders)

All values are Tailwind classes taken from the markup. Colours: `sand` #EDE6D6, `ink` #2A2725 (see colors.md). Focus ring everywhere is `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-{2|4} focus-visible:outline-<contrast colour>`; no default `ring` focus.

## Links / text CTAs
**Hero text link (arrow CTA)** — `a.group flex items-center gap-3 py-1.5 text-sm uppercase md:text-base lg:py-0 lg:text-lg`; label `span[data-hover-reveal].border-b.border-white` (1px white underline, text swaps/rolls on hover via hover-reveal), then arrow `span.inline-block.transition-transform.duration-300.group-hover:translate-x-1` ("→"). Two links stacked on mobile (`gap-0`), row `sm:gap-5`. White on photo.
**Nav logo** `a.text-xl.font-medium.leading-none` (no underline). **MENU** `button.flex.items-center.gap-2.text-base.font-bold.leading-none.tracking-tight` + 2x2 dot grid (4 `i.block.h-[3px].w-[3px].rounded-full.bg-current`, `grid grid-cols-2`, gap 2px -> opens wider). Menu items `.menu-item block text-base font-bold uppercase leading-[1.15] tracking-tight`, right-aligned, `data-hover-reveal`. Nav wrapper `fixed left-0 top-0 z-50 w-full px-6 py-4 text-white mix-blend-difference md:px-10`.
**Footer link** `block py-1 lg:py-0 transition-opacity hover:opacity-60` + hover-reveal. Back-to-top and Contact button use the same class set. Links have no underline and no colour change.
**Hover reveal text effect**: two stacked copies, characters translate on hover (JS: `data-hover-reveal`). Underline-free.

## Buttons
| Component | Classes (essentials) | States |
|---|---|---|
| Outline pill CTA `.tour-fade` ("Enter Residence 02 →") | `inline-block rounded-full border border-white/70 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300` | hover `bg-white text-[#2A2725]`; focus outline 2px white offset 4 |
| Round arrow buttons (about carousel) | `flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE6D6] text-[#2A2725] transition-transform` (`ls` 32px) | hover `scale-105`; focus outline 2px ink offset 2. Container `absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3` |
| Back-to-site pill (/tour) | `group flex items-center gap-2.5 rounded-full border border-[#2A2725]/15 bg-[#EDE6D6]/90 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] md:text-xs text-[#2A2725] shadow-lg backdrop-blur-md transition-colors duration-300` ; pos `absolute left-6 bottom-6 md:left-10 md:bottom-8` | hover `bg-[#2A2725] text-[#EDE6D6]`; arrow "←" `group-hover:-translate-x-1` |
| Modal close | `group flex items-center gap-2 rounded-full border border-[#EDE6D6]/25 py-2 pl-4 pr-3 text-sm font-semibold leading-none transition-colors duration-300` + X icon (two `h-px w-3.5` rotated bars in `h-4 w-4`, rotates 90deg on hover, 500ms) | hover `bg-[#EDE6D6] text-[#2A2725]`; focus outline #EDE6D6 offset 4 |
| Modal copy-email button | `flex items-center gap-2 rounded-full bg-[#EDE6D6] px-4 py-2.5 text-xs font-semibold text-[#2A2725] transition-opacity duration-300` | hover `opacity-85`; label toggles Copy / Copied (1800ms) |
| Modal social icon pill | `flex items-center gap-2 rounded-full border border-[#EDE6D6]/20 p-2.5 text-xs text-[#EDE6D6]/75 transition-colors duration-300` (+ label `sm:px-4 sm:py-2`) | hover/focus `bg-[#EDE6D6] text-[#2A2725]`; icon size 14 |
| Rail dot (HUD) | button `relative z-10 flex h-5 w-5 items-center justify-center rounded-full cursor-pointer` with inner `span.block.rounded-full.border.transition-all.duration-300`: active `h-3.5 w-3.5 border-white ring-4 ring-white/20`, inactive `h-2 w-2 border-white/40` | |
| Hint (pulse) button | inner `h-9 w-9 rounded-full bg-white text-[#2A2725] shadow-lg` + pulsing ring `bg-white/60` | |
| Slide counter | `flex -space-x-px text-sm`; each `flex h-12 w-12 items-center justify-center rounded-full border border-current md:h-14 md:w-14`, inactive `opacity-40` | |
| kbd keycap | `inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-white/70 px-1.5 font-sans text-[11px] font-medium tracking-normal` | |

## Pills / chips
- Status chip (modal): `inline-flex items-center gap-2 rounded-full border border-[#EDE6D6]/20 bg-[#EDE6D6]/[0.04] px-3 py-1.5 text-xs text-[#EDE6D6]/80` + 6px pulsing dot `#9ED8A8`.
- "Open to work" (footer): button `flex items-center gap-2.5 py-1 text-[11px] tracking-[0.12em] text-[#2A2725]/70 transition-opacity hover:opacity-60`, dot `h-2 w-2 rounded-full bg-[#3FA85B]` with `animate-ping bg-[#3FA85B]/70` halo; wrapper `-m-2 overflow-hidden p-2` so the halo isn't clipped.
- Email pill (modal): `rounded-full border border-[#EDE6D6]/25 bg-[#EDE6D6]/[0.04] p-1.5 pl-5 sm:inline-flex sm:gap-6`.

## Cards
| Card | Spec |
|---|---|
| Residence text card `.rs-text` | `relative flex flex-col justify-between overflow-hidden rounded-[28px] p-5 md:rounded-[36px] md:p-8 lg:p-10` (`ls` 20px radius p-4). Colour alternates via inline style: slide A bg #2A2725 / text #FFFFFF, slide B bg #FFFFFF / text #2A2725. Inside: H2 top, bottom row `flex items-end justify-between gap-6` with counter + copy. |
| Residence image panel `.rs-swiper` | `overflow-hidden rounded-[28px] md:rounded-[36px]`, grid halves `lg:w-[calc(50%-6px)]` with 12px gap |
| About tile (images) | `absolute hidden overflow-hidden rounded-xl opacity-0 lg:block`, image `h-full w-full object-cover` |
| About carousel box `.about-box` | `absolute z-50 overflow-hidden rounded-xl opacity-0`, slides stacked `absolute inset-0 object-cover` |
| Marquee canvas | `rounded-sm overflow-hidden`, `h-[28vh] w-[min(70vw,18rem)]`, lg `h-[38vh] w-[min(72vw,24rem)]` |
| Tour photo box `.tour-box` | `absolute overflow-hidden rounded-[28px]` ; mobile `left-[4%] top-[12%] h-[70%] w-[92%]`, lg `left-[19%] top-[14%] h-[72%] w-[62%]` |
| Footer frame `.footer-frame` | `rounded-[20px] border border-[#2A2725]/20 px-5 py-6 md:rounded-[30px] md:px-10 md:py-10`, transparent fill |
| Modal contact row | `group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[#EDE6D6]/20 bg-[#EDE6D6]/[0.04] px-5 py-4 md:rounded-3xl md:px-6 md:py-5`; hover: absolute sand layer `origin-bottom scale-y-0 -> scale-y-100` (500ms `cubic-bezier(.22,1,.36,1)`) and text turns ink; trailing 40px round arrow icon (rotates 45deg on hover) |

## Overlays / scrims
- Hero: image + `absolute inset-0 bg-black/35`.
- HUD gradient: `bg-gradient-to-t from-black/60 via-black/25 to-transparent px-6 pb-6 pt-20 lg:px-10 lg:pb-8 lg:pt-28`.
- HUD progress: track `h-[2px] w-full bg-white/25`; fill `origin-left bg #fff` with glow; 7 tick marks `h-2 w-px bg-white/50`; knob `h-2.5 w-2.5 rounded-full` #fff glow.
- Rail line: `w-px bg-white/20` with a filled `bg #fff` (origin-top, scaleY) line over it.
- Preloader: fixed full-screen ink bg; progress `h-[3px] bg-[#EDE6D6]/10` track, fill `bg-[#EDE6D6]` `origin-left`.
- Section "washes": `bg-[#EDE6D6]` / `bg-white` full-bleed layers (opacity animated) with cloud PNGs masked at top by linear-gradient.

## Rules, dividers
- About rule `h-px w-full bg-[#2A2725]`; footer rules `h-px origin-left scale-x-0 bg-[#2A2725]/20` (animate scaleX to 1); modal rule `h-px bg-[#EDE6D6]/20` (`cx-line`).
- Eyebrow dash `span.h-px.w-6.bg-white/60` before small caps labels.

## Image treatment
`object-cover`, `h-full w-full`, `will-change-transform` on parallax images; hero image full-bleed with overlay; `object-position` set inline (50% 50%, 45% 50%). Images are never given shadows or borders; rounding is applied on the wrapper with `overflow-hidden`.

## Cursor / selection
`cursor-pointer` on interactive spans; `select-none` on hero; `pointer-events-none` on decorative layers (many). No custom scrollbar or ::selection styles in the CSS.
