# `#residence-slides`: two-slide split panel (pinned, state machine) (chunk `265...` id 49393)

`section#residence-slides.relative.z-20.w-full.bg-[#EDE6D6]` > `.rs-stage.relative.h-screen.w-full.overflow-hidden.p-3.md:p-5.lg:p-8` > `div.relative.h-full.w-full` containing, per slide, a `.rs-slide` text card layer, plus one `.rs-swiper` image panel. Two slides (data array `o`):

| # | text bg / fg | image side | copy slots |
|---|---|---|---|
| 1 | `#2A2725` / `#FFFFFF` | right | 3-line headline, paragraph, counter |
| 2 | `#ffffff` / `#2A2725` | left | 3-line headline, paragraph, counter |

Layout: desktop (`lg` and landscape phone) is two columns, `.rs-slide` = `grid lg:grid-cols-2`, text card in the column opposite the image; mobile is two rows (text row on top, image panel `absolute inset-x-0 bottom-0 h-[calc(50%-6px)]`). Cards `rounded-[28px] md:rounded-[36px]` (landscape phone 20 px), padding `p-5 md:p-8 lg:p-10`, gap between panels 12 px (`gap-3`, the swiper uses `calc(50%-6px)`). `.rs-swiper` is `z-50 isolate overflow-hidden` and holds one `.rs-swiper-item` (z i+1) per slide with `img.rs-img.will-change-transform`. Headline `lg:text-[4.4vw]` (`clamp(2rem,8vw,3.75rem)` below), leading .95, tracking -.04em, each line wrapped in a mask span (`-mb-[0.15em] -mt-[0.05em] overflow-hidden pb-[0.15em] pt-[0.05em]`) around `.rs-line`. Counter: two 48 to 56 px circles `01` and `02` (second at opacity .4, `-space-x-px`), copy `max-w-[22rem]`.

## 1. Intro (once)
```ts
gsap.timeline({ defaults:{ease:'power3.out'}, scrollTrigger:{ trigger: stage, start:'top 75%', once:true }})
  .fromTo(text0,  {yPercent:105}, {yPercent:0, duration:1.1}, 0)
  .fromTo(swiper, {yPercent:105}, {yPercent:0, duration:1.1}, .12)
  .fromTo(img0,   {scale:1.25},   {scale:1,     duration:1.6}, .12)
  .fromTo(lines0, {yPercent:110, opacity:0}, {yPercent:0, opacity:1, duration:.8, stagger:.08}, .5)
  .fromTo([counter0, copy0], {y:16, opacity:0}, {y:0, opacity:1, duration:.7, stagger:.1}, .9)
```
Triggers when the stage top reaches 75% of the viewport (scroll 13185 on desktop), before the pin starts at 13860.

## 2. Pinned slide change (time-based, not scrubbed)
```ts
// matchMedia desktop: "(min-width:1024px), (orientation:landscape) and (max-height:500px) and (max-width:1023px)", mobile: "(max-width:1023px)"
set(items.slice(1), { yPercent: -100 }); set(imgs.slice(1), { scale: 1.35, yPercent: 15 })
set(texts.slice(1), { yPercent: 105 }); set(lines.slice(1), { yPercent: 110, opacity: 0 }); set(counterCopy.slice(1), { y: 16, opacity: 0 })
const tl = gsap.timeline({ paused: true }); tl.addLabel('s0', 0)
// for slide t >= 1, r = (t-1) * 1.1, flip = isDesktop && slides[t].imageSide !== slides[0].imageSide, f = firstSide==='right' ? -1 : 1
tl.to(swiper,   { xPercent: flip ? 100*f : 0, x: flip ? 12*f : 0, duration: .9, ease: 'power3.inOut' }, r)   // image panel hops to the other column
  .to(items[t-1], { yPercent: 100, duration: .8, ease: 'power3.inOut' }, r + .05)       // old image slides down out
  .to(items[t],   { yPercent: 0,   duration: .8, ease: 'power3.inOut' }, r + .05)       // new image slides down in from above
  .to(imgs[t],    { scale: 1, yPercent: 0,   duration: .9, ease: 'power2.out' }, r + .05)
  .to(imgs[t-1],  { scale: 1.35, yPercent: -15, duration: .8, ease: 'power2.in' }, r + .05)
  .to(texts[t],   { yPercent: 0, duration: .9, ease: 'power3.inOut' }, r)               // new text card rises
  .to(lines[t],   { yPercent: 0, opacity: 1, duration: .5, stagger: .06, ease: 'power3.out' }, r + .5)
  .to([counter[t], copy[t]], { y: 0, opacity: 1, duration: .4, stagger: .08, ease: 'power3.out' }, r + .65)
  .addLabel('s' + t, r + 1.1)

ScrollTrigger.create({ trigger: stage, start: 'top top', end: `+=${(n-1)*120 + 100}%` /* 220% */, pin: true, anticipatePin: 1,
  onUpdate(self) {
    const t = self.progress * ((n-1)*120 + 100) / 120
    const idx = t < .3 ? 0 : Math.min(n-1, Math.floor(t - .3) + 1)
    if (idx !== current) { current = idx; tween?.kill(); tween = tl.tweenTo('s' + idx, { ease: 'none' }) }
  }})
```
Pin: 220% = 1980 px (spacer 2880 measured, starts 13860). Slide 2 is triggered at progress .1636 (scroll 324 px into the pin, absolute 14184) and slide 1 is restored below that, each transition taking 1.1 s of real time (`tweenTo` with `ease:'none'`, so a time-based playback independent of scroll speed). After the swap the section stays pinned for the remaining ~1650 px.

On mobile `flip` is always false (`xPercent 0`): the image panel stays in the bottom row and the text cards and images stack with the same Y animations.
