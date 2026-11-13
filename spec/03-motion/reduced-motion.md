# `prefers-reduced-motion` handling (what the reference does, and the gaps)

The reference only guards a handful of effects, always with `matchMedia('(prefers-reduced-motion: reduce)')` read once at the time the effect runs (no live listener except where noted). There is no global CSS `@media (prefers-reduced-motion)` rule in the compiled stylesheet.

## Guarded (reduced behaviour)
| Where | Normal | Reduced |
|---|---|---|
| Lenis (`SmoothScroll`) | `smoothWheel: true` | `smoothWheel: false` (native wheel scrolling). Lenis also has `respectReducedMotion:true` by default, so programmatic `scrollTo` becomes immediate |
| Boot loader exit | clip-path wipe 1.15 s `expo.inOut` | 0.25 s |
| Contact overlay open | curtain .95 s + staggered masks/lines/fades | masks, fades, lines set to final state; curtain 0.25 s `ease:none` |
| Contact overlay close | content fade .3 + curtain .85 s | overlay `opacity 0` .2 s |
| About image carousel autoplay | `setInterval 2000` while visible | never starts (checked each time it would restart); arrows still work (1 s `expo.out`) |
| Rotate-device warning | icon rotation yoyo and ring pulse loop forever | loops omitted (entrance of lines/badge still plays) |

## Not guarded (still animates under reduced motion)
- All ScrollTrigger scrub and pin choreography: hero exit, cloud parallax, About tiles/box travel, marquee-transition (card growth, ink shader, camera flights), residence slides, apartment carousel, tour teaser, footer reveal.
- Free-running loops: marquee track (`xPercent -33.333` over 20 s), ink shader `uTime`, `animate-ping`, `animate-pulse`, tour teaser hint pulses.
- Text reveal (SplitText), hover char roll, nav menu open, hero load intro.
- `html{scroll-behavior:smooth}` stays on.

## Recommended rebuild policy (improves on the reference)
```ts
const reduce = matchMedia('(prefers-reduced-motion: reduce)')
// 1. Lenis: smoothWheel = !reduce.matches (as reference)
// 2. gsap.matchMedia({ reduce: '(prefers-reduced-motion: reduce)', ok: '(prefers-reduced-motion: no-preference)' }):
//    ok     -> all current timelines
//    reduce -> keep pins/states but replace scrubbed moves by instant end-states:
//              ScrollTrigger.create({ pin }) with no scrub; set final transforms; reveals with duration .01 or opacity-only fades (<=.25 s)
//    marquee track: gsap.set(track, { xPercent: 0 }) and no loop; ink shader: uProgress stepped, no uTime drift
//    3D viewer: setLookAt(..., false) (no damping) and skip rotate hint
// 3. CSS: @media (prefers-reduced-motion: reduce){ .animate-ping,.animate-pulse{animation:none} html{scroll-behavior:auto} }
// 4. Add a listener (reduce.addEventListener('change', ...)) to revert/re-run contexts
```
Keep content reachable without motion: text starts hidden only via `[data-reveal-01]{visibility:hidden}` until JS runs, so provide a `<noscript>`/`no-js` fallback that sets `visibility:visible` (the reference has none).
