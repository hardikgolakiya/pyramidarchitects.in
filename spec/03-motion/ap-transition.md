# `.ap-transition`: white cloud bridge with centred statement ("villa to apartment") (chunk `265...` id 41238)

Markup: `section.ap-transition.relative.z-30.-mt-[50vh].h-[var(--h-m)].w-full.overflow-x-clip.bg-white.text-[#2A2725].lg:h-[var(--h-d)]`, style `--h-d:160vh; --h-m:80vh`, `aria-label` = transition description. The negative top margin (-50vh) tucks it under the previous section so the clouds overlap it (desktop section top at 16290 while the previous section ends 16740, height 1440 px).

Layers (same recipe as the About lead-in, but white):
- `.ap-transition-wash`: `absolute inset-x-0 bottom-0 top-[-40vh] z-[35] bg-white opacity-0` with the same mask `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,.25) 15%, rgba(0,0,0,.6) 30%, rgba(0,0,0,.9) 42%, #000 50%)`.
- Cloud wrapper `absolute left-0 top-[-42vh] md:top-[-52vh] z-30 h-[112vh] w-full` with two `.ap-transition-cloud` images (`cloud-1-cropped.webp` at `top-[25%] lg:top-0`, `cloud-2-full.webp` at `top-[20%] lg:top-[8%]`, `w-full max-w-none h-auto opacity-0`).
- Sticky copy: `div.sticky.top-0.z-40.flex.h-[100svh].w-full.items-center.justify-center.px-6.lg:h-screen` > `.ap-transition-copy.flex.flex-col.items-center.text-center.opacity-0` > eyebrow (`text-[10px] lg:text-xs uppercase tracking-[0.24em] mb-4 lg:mb-5`) + `h2.ap-transition-heading` (`font-serif max-w-[15ch] text-[clamp(2.25rem,9vw,8rem)] leading-[94%]`, two lines with `<br>`).

## Scrubbed timeline (`useGSAP` deps `[pathname]`, `revertOnUpdate`)
```ts
gsap.timeline({ scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 10%', scrub: .8, invalidateOnRefresh: true }})
  .fromTo(cloud[1], { yPercent: 10, opacity: 0 }, { yPercent: -30, opacity: 1, ease: 'none', duration: .3 }, 0)
  .fromTo(cloud[0], { yPercent: 20, opacity: 0 }, { yPercent: -20, opacity: 1, ease: 'none', duration: .5 }, 0)
  .fromTo(wash,     { opacity: 0 },               { opacity: 1,  ease: 'none', duration: .3 }, .5)
  .fromTo(copy,     { y: 36, opacity: 0 },        { y: 0, opacity: 1, ease: 'power3.out', duration: .55 }, .85)
  .to({}, { duration: .01 }, 1.55)                  // total 1.56
```
Scroll range desktop: 15390 to 16200 (810 px, 1 unit = 519 px): clouds 15390 to 15650 (front) / 15545 (back), wash 15650 to 15805, copy 15832 to 16118.

## Statement text reveal
`textReveal01(sectionScope)` is called from the same `useGSAP` and the heading has `data-reveal-01 data-reveal-local data-scroll data-duration="1" data-stagger="0.02"`: char mask reveal (yPercent 110 to 0, 1 s, .02 stagger, `expo.out`) fired once when the section top reaches 50% of the viewport (`start: 'clamp(top 50%)'`, trigger = nearest `section`). `data-reveal-local` excludes it from the global init so it is not split twice. The surrounding `.ap-transition-copy` also fades in via the scrub timeline. Revert function returned to `useGSAP`.

Purpose: the wipe from the cream/dark villa half into the white apartment half; the same cloud-and-mask pattern is reused (beige in About, white here). Cloud images are transparent webp with soft edges; if the client has no cloud art, a feathered radial gradient layer works with the same transforms.
