# 03 Motion and interaction: overview

Source of truth: the Turbopack chunks in `spec/raw/js` (decompiled by hand) plus `spec/raw/css/3be7mmba3usfq.css`. Values below are the literal numbers in the code. Spot checks in the live site (1440x900) matched: pin spacer heights, end-state transforms (hero wrap scale 1.12, hero content y -80, clouds yPercent -30/-20, marquee card 384x342 radius 4px growing to 100vw x 100vh radius 0).

Caveat: the shared built-in browser was being navigated/resized by other agents during the session, so scrub mid-points were not sampled continuously. Timeline maths in these files is derived from the code and cross-checked against the measured pin geometry.

## Libraries (all from the code, no framer-motion on this site)

| Library | Version evidence | Used for |
|---|---|---|
| GSAP core | `gsap` (chunk `0e8x1k9azfdsv.js`, ids 89970) | every tween/timeline, `gsap.matchMedia`, `gsap.ticker` |
| ScrollTrigger | chunk `1v84rdd_g9_xm.js` id 83495 | scrub, pin, once-triggers |
| `@gsap/react` `useGSAP` | chunk `2xipugk_40kza.js` id 65747 | scoped contexts, `revertOnUpdate`, `contextSafe` |
| GSAP SplitText | `S.version="3.15.0"` (chunk `1v84...` id 47742) | char/word/line masks for reveal text and hover text |
| Lenis | `a="1.3.26"` (inline class in `2xipugk...` id 30322) | smooth wheel scroll, driven by GSAP ticker |
| three.js + `@react-three/fiber` + drei + camera-controls | chunk `265hf...` id 1776 | marquee-transition 3D villa viewer, ink-dissolve shader |
| three.js + R3F + Rapier physics | chunks `3jmgvrsil9p03.js`, `3g-3vm...` | `/tour` walkthrough |
| CSS transitions/keyframes (Tailwind v4) | `3be7mmba3usfq.css` | hover/focus, `animate-ping`, `animate-pulse` |
| IntersectionObserver | about slider, R3F | autoplay gate |

Not present: Framer Motion / motion, Locomotive, Swiper (the "swiper" class names are plain divs animated with GSAP), CSS scroll-driven animations.

Plugin registration (every section module): `gsap.registerPlugin(ScrollTrigger, useGSAP)`; SplitText registered inside the text-reveal module.

## Global scroll engine (SmoothScroll component, chunk `2xipugk` id 30322)

```ts
// mounts once in the root layout, renders <div class="contents"> as scope
history.scrollRestoration = 'manual'            // useLayoutEffect on mount
const lenis = new Lenis({
  autoRaf: false,
  smoothWheel: !matchMedia('(prefers-reduced-motion: reduce)').matches,
  // everything else = Lenis 1.3.26 defaults:
  // lerp 0.1, duration undefined, wheelMultiplier 1, touchMultiplier 1,
  // syncTouch false (touch = native scroll), infinite false, anchors false,
  // orientation vertical, overscroll true, respectReducedMotion true
})
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add(t => lenis.raf(t * 1000))       // GSAP ticker drives Lenis
gsap.ticker.lagSmoothing(0)
// cleanup: ticker.remove, lenis.off, lenis.destroy
```

Lenis wheel smoothing: each wheel delta is added to `targetScroll`; per frame `value += (target - value) * (1 - exp(-0.1 * 60 * dt))` (about 9.5 percent of the gap per 60 fps frame, settle roughly 0.5 s). Default easing function `min(1, 1.001 - 2^(-10 t))` only applies to programmatic `scrollTo` with a `duration`, which the site never passes.

On every route change (`usePathname` dependency):
```ts
lenis.scrollTo(0, { immediate: true, force: true }); window.scrollTo(0, 0)
ScrollTrigger.clearScrollMemory()
// after 3 nested requestAnimationFrame: same scroll reset + ScrollTrigger.refresh()
// plus setTimeout(reset, 100)
```
Elements with `data-lenis-prevent` (the contact modal `[role=dialog]`) keep native scrolling.

CSS also sets `html{scroll-behavior:smooth;scroll-padding-top:1rem}`. There is no `lenis.css` in the bundle, so `#anchor` link clicks (nav, hero links) are handled by the browser (native smooth scroll) and Lenis picks the movement up from native scroll events. To rebuild faithfully keep both; if you drop native smooth scroll, call `lenis.scrollTo(hash, {offset:-16})` instead.

## Page timeline in scroll pixels (desktop 1440x900, vh = 900; measured)

Page height 25830 px.

| Section | Top (px) | Pin start to end (px) | Pin length | ST config |
|---|---|---|---|---|
| Hero (`section.sticky top-0 z-0`) | 0 | n/a (CSS sticky, covered by About) | | |
| `#about` (stage pinned) | 900 | 900 to 3780 | 320% = 2880 | scrub .8 |
| About lead-in tween | n/a | 0 to 810 | | scrub .8 |
| `#marquee-transition` | 4680 | 4680 to 12960 | 920vh = 8280 | scrub .8, height 1020vh |
| `#residence-slides` | 13860 | 13860 to 15840 | 220% = 1980 | state machine |
| `.ap-transition` ("Not every space...") | 16290 (overlaps by -50vh) | sticky inner, ST 15390 to 16200 | | scrub .8 |
| `#residence-02` | 17730 | 17730 to 22230 | 500% = 4500 | scrub .8 intro (100%), then state machine |
| `#residence-02-tour` | 23130 | 23130 to 24030 | 100% = 900 | time-based, pinned |
| `footer#contact` | 24930 | n/a | | once at top 82% |

Section files in this folder:
`loader-boot.md`, `nav-menu.md`, `hero.md`, `about-cloud-parallax.md`, `marquee-transition.md`, `residence-slides.md`, `ap-transition.md`, `residence-02.md`, `tour-teaser.md`, `footer-contact.md`, `text-reveal-and-hover-reveal.md`, `hover-focus-states.md`, `page-transitions.md`, `reduced-motion.md`.

## Shared patterns

1. Mask reveal: wrapper `block overflow-hidden` (with `-mb-[0.18em] -mt-[0.05em] pb-[0.18em] pt-[0.05em]` padding trick so descenders are not clipped) and inner `yPercent:110 -> 0`. Used for nearly all copy.
2. `gsap.matchMedia()` with `(min-width:1024px)` vs `(max-width:1023px)` (and a landscape-phone query `(orientation:landscape) and (max-height:500px) and (max-width:1023px)` treated as "desktop" in `#residence-slides` and `#residence-02`). Cleanup via `mm.revert()` returned from `useGSAP`.
3. State machine on pinned sections: a paused timeline with labels (`s0,s1,..`) plus a plain `ScrollTrigger.create({pin, onUpdate})` that computes the target state from progress and calls `timeline.tweenTo(label, {ease:'none'})` (time-based, not scrubbed). Scroll direction reverses it because `tweenTo` to an earlier label plays backwards.
4. `invalidateOnRefresh:true` and `anticipatePin:1` on all pins. After fonts load: `document.fonts.ready.then(() => ScrollTrigger.refresh())` in About.
5. Easing vocabulary: `none`, `power2.in/out/inOut`, `power3.out/inOut`, `expo.out/inOut`, `back.out(1.8|2)`, `power1.inOut/out`. CSS: `cubic-bezier(0.22,1,0.36,1)` (easeOutQuint-like, 500 ms) for the menu icon and contact card; Tailwind default `cubic-bezier(.4,0,.2,1)` at 150 ms for `transition-*`; `ease-out` `cubic-bezier(0,0,.2,1)`.
6. `will-change: transform` on images with scrubbed inner scale (`.ap-img-inner`, `.tour-inner`, `.rs-img`) and on masked text children.

## Z-index stack (motion-relevant)
loader 200, tour loader 300, contact modal 999, rotate warning 9999 (inline) / 999 (CSS), nav 50, section stacks 20/30/35/40/50 as noted per file.

## Placeholder policy
Animated copy and image slots keep their class names (`.about-word`, `.ap-piece`, ...). Brand text, image files and the villa GLB are client supplied. Counts that drive timing (7 about images/tiles, 3 apartment slides, 2 residence slides, 7 villa views, 3 x 8 marquee brand words) must be kept or the timeline constants recomputed (formulas given per file).

## Measured clarifications (frame-sampler)
- GSAP `power2` is cubic (t^3) and `power3` is quartic (t^4). Do not translate them to CSS `ease-in`/`ease-out`; hero content fade `power2.in`: y(41 px) = -4 = -80*(41/111)^3.
- About slider autoplay period 2.03 s; incoming slide `expo.out` is within 2% by 0.5 s.
- Marquee extra windows: prompt gone at +270 px, track gone at +720 px, HUD on at y 911 (p .11), first view change at y 7561, last view from y 12132.
- Raw samples, per-scene tables and confidence levels: `frames/README.md`.
