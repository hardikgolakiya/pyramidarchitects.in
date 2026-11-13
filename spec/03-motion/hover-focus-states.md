# Hover, focus and press states

Defaults from the compiled Tailwind v4 CSS: `--default-transition-duration:.15s`, `--default-transition-timing-function:cubic-bezier(.4,0,.2,1)`; `.transition-colors|opacity|transform|all` use those unless a `duration-*`/`ease-*` is set. `--ease-out:cubic-bezier(0,0,.2,1)`. Hover rules are plain `:hover` (Tailwind v4 wraps them in `@media (hover:hover)`), so touch devices get no sticky hover. Colours: ink `#2A2725`, cream `#EDE6D6`.

| Element | Property change | Duration / easing |
|---|---|---|
| Any `[data-hover-reveal]` text (nav items, hero links, footer links, CTA, contact button) | two-layer character roll up, see `text-reveal-and-hover-reveal.md` | enter .4 s stagger .02, leave .35 s stagger .015, `power3.out`; mouse only |
| Nav MENU button (hover opens panel) | dots gap 2px to 5px + rotate 45deg | 500 ms `cubic-bezier(0.22,1,0.36,1)` |
| Nav list items | non-hovered items `opacity .4` (hovered/focused 1) | 300 ms (default ease) |
| Hero links arrow `→` | `group-hover:translate-x-1` (4 px) | `duration-300` |
| About carousel arrows (40 px circles, bg cream) | `hover:scale-105` | `transition-transform` 150 ms |
| About carousel arrows focus-visible | `outline outline-2 outline-offset-2 outline-[#2A2725]` | instant |
| Tour teaser CTA pill (`border-white/70`, white text) | `hover:bg-white hover:text-[#2A2725]` | `transition-colors duration-300` |
| Tour teaser CTA focus-visible | `outline outline-2 outline-offset-4 outline-white` | instant |
| Footer links and buttons | `hover:opacity-60` | `transition-opacity` 150 ms |
| "Open to work" dot | `animate-ping` (scale to 2, fade, 75% keyframe) over a solid dot | 1 s `cubic-bezier(0,0,.2,1)` infinite |
| Contact overlay: close button (pill, `border-[#EDE6D6]/25`) | hover `bg-[#EDE6D6] text-[#2A2725]`; the "x" icon `group-hover:rotate-90` | colours 300 ms; icon 500 ms `cubic-bezier(.22,1,.36,1)` |
| Contact overlay: option cards (`rounded-2xl md:rounded-3xl border-[#EDE6D6]/20 bg-[#EDE6D6]/[0.04]`) | a cream layer `absolute inset-0 origin-bottom scale-y-0` becomes `scale-y-100` on `group-hover` and `group-focus-visible` (fills from the bottom); text turns `#2A2725`; arrow icon `group-hover:rotate-45` | 500 ms `cubic-bezier(0.22,1,0.36,1)` for fill and rotate; text colour 500 ms |
| Contact overlay: focus-visible on cards/email/copy | `outline outline-2 outline-offset-4 outline-[#EDE6D6]` (copy: offset 2) | instant |
| Contact overlay: email link arrow | `group-hover:-translate-y-0.5 translate-x-0.5` | 300 ms |
| Contact overlay: copy button | `hover:opacity-85` | 300 ms |
| Contact overlay: social pills | `hover:bg-[#EDE6D6] hover:text-[#2A2725]` (also `focus-visible`, outline none) | 300 ms colours |
| Contact overlay: "Open to new work" pill dot | `animate-pulse` | 2 s `cubic-bezier(.4,0,.6,1)` infinite |
| 3D HUD rail dots (marquee-transition) | active 14 px with `ring-4 ring-white/20`, done 8 px white/80, todo 8 px outline white/40 | `transition-all duration-300` |
| /tour "Back to site" button (fixed bottom-left) | `hover:bg-[#2A2725] hover:text-[#EDE6D6]`; its arrow `group-hover:-translate-x-1` | 300 ms |
| /tour "Customize" mobile button | `active:scale-95` | `transition-transform` 150 ms |
| /tour customizer panel buttons | `hover:-translate-y-0.5 hover:border-gray-300` (inactive), selected amber border/bg with shadow `0 2px 10px -2px rgba(245,158,11,.45)`; swatch ring `group-hover:scale-110`, ring border `group-hover:border-gray-300` | `transition-all duration-150`, swatch `duration-150 ease-out` |
| /tour crosshair dot | `scale-[2.5] opacity-100` over interactables (else `scale-100 opacity-60`), `mix-blend-difference` | `duration-300 ease-out` |
| /tour touch joystick knob | translates with the drag | `transition-transform duration-75` |
| /tour error "Try again" pill | `hover:bg-[#EDE6D6] hover:text-[#2A2725]` | 300 ms |

Cursor: `pointer` on `[data-hover-reveal]` (CSS). There is no custom cursor on the main page.

Focus ring rule of thumb used across the site: 2 px solid outline in the element's foreground colour (`#2A2725` on cream, `#EDE6D6` on dark, white on imagery), offset 2 to 4 px, applied only on `:focus-visible`. Links in dark bands and the nav inherit `outline` from the browser default if not overridden.

Keyboard open/close for the menu: see `nav-menu.md` (Escape, outside click, focus-out).
