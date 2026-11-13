# `/tour` page layout

Purpose: full-screen interactive 3D walkthrough (three.js canvas). Metadata title "3d Tour". No footer, no scroll (document height == viewport: 768 @1024x768).

## DOM (rendered, after hydration)
```
body.min-h-full.flex.flex-col
 div[hidden]; div.contents
 nav (same global nav as `/`, fixed z-50, mix-blend-difference)
 div.rotate-device-warning  (portrait <=1024px only; fixed inset-0; custom CSS z-999 bg #0f0f0f; see responsive.md)
     inner: gradient overlay (bg-gradient-to-t from-black/40), top wordmark (px-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-lg tracking-tight),
            centre block (px-8 text-center): lock badge (relative mb-10 h-24 w-24; ping ring bg-white/40; inner circle border-white/50 bg-white/10 backdrop-blur-sm),
            eyebrow row (mb-4 gap-2 text-[10px] uppercase tracking-[0.2em] white/70, h-px w-6 lines both sides) "Landscape mode",
            h2.font-serif text-[clamp(2.25rem,10vw,3.5rem)] leading-[96%] 2 masked lines, p.mt-6.max-w-xs text-xs uppercase leading-[1.7] tracking-[0.14em] white/75
            bottom spacer h-[max(1.5rem,env(safe-area-inset-bottom))]
 div.w-screen.h-screen.flex                     <- page root (100vw x 100vh)
   div.fixed.inset-0.z-[300] (loader; see overview.md)
   div.absolute.inset-0.z-50.pointer-events-none                         <- HUD layer
       div.absolute.inset-0.flex.items-center.justify-center.z-50.pointer-events-none
            div.h-1.5.w-1.5 (6px) rounded-full bg-white mix-blend-difference scale-100 opacity-60 (crosshair dot, scales on hover), shadow 0 0 4px rgba(0,0,0,.3)
       a.group.pointer-events-auto.absolute.left-6.bottom-6.md:left-10.md:bottom-8   "<- Back to site" (href "/")
            flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#2A2725]/15 bg-[#EDE6D6]/90 text-[#2A2725] shadow-lg backdrop-blur-md text-[11px] md:text-xs uppercase tracking-[0.18em]; hover: bg-[#2A2725] text-[#EDE6D6], arrow translate-x -1 ; measured 154x38 at x40 y(vh-70)
       div.absolute.left-1/2.top-6.-translate-x-1/2 > div (pill, same style as back button, not interactive) "Click to look around"   (appears after load; 203x38 at x410 y24 @1024)
   div.relative.w-full.h-full.overflow-hidden (pointer-events:auto) > div.w-full.h-full > canvas (three.js, fills 100% x 100%)
 div.hidden[aria-hidden]
```
SSR HTML contains everything except the in-scene pill; the canvas is created client side (default 300x150 until the renderer sizes it to the parent).

## Layout facts
- Root is exactly viewport-sized; canvas = viewport. Pointer-lock style "click to look around" interaction (WASD move, E interact, Q customise; these key hints are advertised on `/` in the tour card, not on `/tour` itself).
- HUD safe offsets: back button 24px (mobile) / 40px (md+) from left, 24 / 32px from bottom. Nav MENU stays at top-right; nav wordmark top-left (nav z-50 vs HUD layer z-50 in a lower stacking context -> nav is later in DOM? nav is earlier; HUD layer is inside `w-screen` which has no z -> HUD z-50 vs nav z-50: DOM order makes the HUD layer paint above nav; both areas do not overlap so no clash).
- Loader z-300 covers nav while loading (shown "Private Residence Tour", counter 00-99, bar). In headless test the counter stalled at 99 (model/asset load), so the loader may remain until the 3D model finishes.
- Portrait <=1024 devices see the rotate warning instead of the scene (scene is landscape-only).
- Responsive: only back-button offsets and text sizes change (`md:`); loader paddings px-5 -> md:px-8; subtitle `ARCHITECTURE - INTERIORS - DETAILS` visible from `sm`.
- `/tour` is entered from `/` via nav "Tour", the CTA `Enter Residence 02 ->`; returning uses "Back to site" (href `/`).
