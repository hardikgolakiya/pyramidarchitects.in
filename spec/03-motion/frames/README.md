# Mid-scroll frame sampling (frame-sampler)

Purpose: measure the in-between frames of every scroll scene of `https://stillform.homes/` and check them against the formulas in `../overview.md`, `../about-cloud-parallax.md`, `../marquee-transition.md`, `../residence-slides.md`, `../ap-transition.md`, `../residence-02.md`, `../tour-teaser.md`, `../footer-contact.md`, `../hero.md`. Date measured 2026-11-13. Raw numbers: `samples.json`. Deviations: `corrections.md`.

Files: `hero-about-lead.md`, `about-pin.md`, `marquee.md`, `residence-slides.md`, `ap-transition.md`, `residence-02.md`, `tour-teaser.md`, `footer.md`, `responsive.md`, `corrections.md`, `samples.json`.

## Headline result
The documented formulas hold almost everywhere. Every scrubbed scene was reproduced to within rounding (card growth, clouds, box travel, view counter, progress bar, rail fill). Real differences are small and listed in `corrections.md` (piece count of `.ap-piece`, the next thumbnail left at opacity 0.9 in residence-02 state 1, tour teaser start trigger on big scroll jumps, the loader "stall" being a hidden-pane artefact).

## Method
- Built-in browser pane, 1440x900 (dpr 1), then 768x1024 and 375x812 (both emulation presets really changed `innerWidth`: 768 / 375, `devicePixelRatio` 2). Reset with `preset desktop` at the end.
- IMPORTANT environment fact: while the Browser pane is "hidden" (always, for an agent), `requestAnimationFrame` is throttled to ~0 fps, so GSAP/Lenis/the boot loader do not advance (this is why earlier agents saw the loader stall at 00/99). Taking a screenshot wakes the pane for ~15-30 s. Every measurement call therefore used `browser_batch` = `[computer screenshot scale 0.1, javascript_tool]`. Keep a single JS call under ~20 s or it dies when the pane sleeps again. With the pane awake the loader finishes normally (`z-[200]` element ends `display:none`, counter 100) in a few seconds.
- `html{scroll-behavior:smooth}` makes `window.scrollTo(0,y)` animate, so reads happen mid-scroll. Use `window.scrollTo({top:y, behavior:'instant'})`. `window.lenis` is only `{version}` (instance not exposed); `gsap`/`ScrollTrigger` are not global either, so progress was computed from `scrollY` and known pin starts; shader/R3F uniforms were not reachable (see "not measured").
- After each jump: wait 1.0 s (scrub .8) or 1.5-2.1 s (state machines, `tweenTo` 1.1-1.2 s), then 2-3 rAFs, then read `getBoundingClientRect`, `getComputedStyle` (opacity, transform, clip-path, border-radius, background). Ascending scroll order, jumps of one sample step.
- Time-based tweens (slider, swiper hop, tour teaser, footer) were sampled with an rAF loop recording `performance.now()` offsets.

## Sampling script (reusable; paste in the page console)
```js
const g=(s,i)=>document.querySelectorAll(s)[i||0];
const rect=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(v=>Math.round(v*10)/10)};
const tr=e=>{const m=getComputedStyle(e).transform;if(m==='none')return [0,0,1];
  const a=m.match(/\((.+)\)/)[1].split(',').map(Number);return a.length===6?[a[4],a[5],a[0]]:[a[12],a[13],a[0]]};
const op=e=>+getComputedStyle(e).opacity;
async function walk(from,to,n,settleMs,fn){const out=[];
  for(let i=0;i<=n;i++){const y=Math.round(from+(to-from)*i/n);
    scrollTo({top:y,behavior:'instant'});
    await new Promise(r=>setTimeout(r,settleMs));
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    out.push([Math.round(scrollY),...fn()])}
  return out}
// example: marquee card growth, 1% steps (pin start 4680, 8280 px long at 900 vh)
await walk(4680,4680+0.12*8280,12,1050,()=>[...rect(g('.marquee-canvas')),op(g('.marquee-prompt')),op(g('.marquee-track'))]);
```
Selectors used: `.hero-image-wrap .hero-content .about-cloud .about-bg .about-tile .about-box .about-stage .about-text-layer .about-word .about-slide .marquee-canvas .marquee-prompt .marquee-track .marquee-stage .bg-blue-900 [data-hud-text] .rs-swiper .rs-swiper-item .rs-img .rs-line .ap-transition-cloud .ap-transition-wash .ap-transition-copy .ap-stage .ap-img .ap-img-inner .ap-hero-piece .ap-piece .ap-label .ap-count-col .tour-box .tour-inner .tour-piece .tour-fade .tour-hint .footer-frame .footer-rule .footer-reveal`.
To reproduce time series: `scrollTo` then loop `requestAnimationFrame`, push `[performance.now()-t0, ...values]` every 100-250 ms.

## Pin geometry (1440x900 measured, matches docs)
| Section | top | height | pin |
|---|---|---|---|
| about | 900 | 3780 | 900-3780 |
| marquee-transition | 4680 | 9180 | 4680-12960 |
| residence-slides | 13860 | 2880 | 13860-15840 |
| ap-transition | 16290 | 1440 | scrub 15390-16200 |
| residence-02 | 17730 | 5400 | 17730-22230 |
| residence-02-tour | 23130 | 1800 | 23130-24030 |
| footer#contact | 24930 | 900 | once at 24192 |
Page height 25830. At 768x1024: 26931. At 375x812: 21356.

## Confidence per scene
| Scene | Confidence | Note |
|---|---|---|
| Hero exit + About lead-in | high | 21 samples at 5% of 810; all tweens fit documented timings; ease names confirmed (GSAP power2 = cubic, power3 = quartic) |
| About pin (box travel, tiles, words) | high | 21 samples; slider 2.03 s interval, expo.out confirmed |
| Marquee grow + HUD views | high | 1% steps over 0-12%; view boundaries confirmed to 1 px; ink shader only visually (screenshots) |
| residence-slides | medium-high | threshold bracketed 300/330 px, swiper hop curve measured; image/line mid-frames not captured (main thread stalls while sampling many elements) |
| ap-transition | high | 21 samples |
| residence-02 intro + states | high | 21 intro samples, every state threshold bracketed; mid-transition frames of room cards not captured |
| tour teaser | high | time series reproduced the documented timeline (power2.inOut box, 1.45/2.15/4.25 s cues) |
| footer | high | time series reproduced; trigger bracketed (24100 no, 24250 yes) |
| 768 / 375 | medium | 25% steps only, same logic, mobile branch confirmed |

## Not measured
- ShaderMaterial uniforms (`uProgress`, `uTime`) and R3F camera/part opacities: not reachable (no globals); checked only via screenshots (image intact at p 0.115 and 0.15, mostly dissolved to the 3D scene by p 0.19, fully 3D at 0.225) and via the HUD numbers.
- Landscape-phone variants (`ls`), reduced motion, hover states.
- Intermediate frames of the `rs-img`/`.ap-img` thumbnail hops: sampling that many elements per frame blocked the main thread for ~1 s, so only end states and the swiper x curve were taken.
- HUD fade `duration-700` and one-shot hints (`rotate-hint`, `rail-hint`).
- Boot loader frame series (documented elsewhere).
