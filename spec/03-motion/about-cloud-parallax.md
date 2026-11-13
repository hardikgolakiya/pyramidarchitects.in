# About: cloud parallax lead-in, tile gallery, image-into-sentence pin (`section#about`, chunk `265...` id 85705)

`section#about.relative.z-20.overflow-x-clip.bg-[#EDE6D6]`. Inside: two layers above the stage (clouds z-30, cream wash `.about-bg` z-[35]) and the stage (`.about-stage`, `h-[100svh] lg:h-screen`, z-40, `overflow-hidden`) which is what gets pinned.

Layers:
- Cloud wrapper `absolute left-0 top-[-42vh] md:top-[-52vh] z-30 h-[112vh] w-full pointer-events-none aria-hidden`, two PNG-like webp clouds (`cloud-1-cropped-beige`, `cloud-2-full-beige`, both `w-[100%] max-w-none h-auto opacity-0`, tops `top-[25%] lg:top-0` and `top-[20%] lg:top-[8%]`), class `.about-cloud`.
- `.about-bg`: `absolute inset-x-0 bottom-0 top-[-40vh] z-[35] bg-[#EDE6D6] opacity-0` with mask `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,.25) 15%, rgba(0,0,0,.6) 30%, rgba(0,0,0,.9) 42%, #000 50%)`. It is a soft cream fade that covers the hero.
- Stage children: `.about-slot-center` (invisible placeholder rect where the image box first sits), `.about-gallery` (headline `.about-tile` + 6 image tiles), `.about-text-layer` (sentence), `.about-box` (the image slider, absolute, `z-50`, `rounded-xl`, opacity 0).

Slot rect (the `.about-box` is animated to these measured rects):
- `.about-slot-center`: `left-[6%] top-[24%] h-[40%] w-[88%]`; md `left-[10%] top-[26%] h-[38%] w-[80%]`; lg `left-[26%] top-[24%] h-[38%] w-[46%]`; landscape phone `left-[15%] top-[25%] h-[60%] w-[70%]`.
- `.about-slot-inline`: inline-block placeholder inside the paragraph: `h-[0.82em] w-[1.7em] mb-[0.14em] mr-[0.18em] align-bottom`, so the image sits at the start of the sentence.

## A. Lead-in timeline (parallax; `trigger: #about`)
```ts
const tl = gsap.timeline({ scrollTrigger: {
  trigger: about, start: 0,
  end: () => about.getBoundingClientRect().top + scrollY - 0.1 * innerHeight,   // 810 px at 900 vh
  scrub: .8, invalidateOnRefresh: true }})
tl.to(heroWrap,    { scale: 1.12, ease: 'none' }, 0)                             // no duration given: GSAP default .5
  .to(heroContent, { y: -80, opacity: 0, ease: 'power2.in', duration: .25 }, 0)
  .fromTo(cloud[1], { yPercent: 10, opacity: 0 }, { yPercent: -30, opacity: 1, ease: 'none', duration: .3 }, 0)
  .fromTo(cloud[0], { yPercent: 20, opacity: 0 }, { yPercent: -20, opacity: 1, ease: 'none', duration: .5 }, 0)
  .fromTo(aboutBg,  { opacity: 0 },               { opacity: 1,  ease: 'none', duration: .3 }, .5)
  .fromTo(tiles,    { opacity: 0, y: 56, scale: .86 }, { opacity: 1, y: 0, scale: 1, ease: 'expo.out', duration: .55, stagger: .07 }, .85)
  .fromTo(aboutBox, { opacity: 0 },               { opacity: 1, ease: 'none', duration: .3 }, .85)
  .to({}, { duration: .01 }, 1.55)                                                // shorter than the tiles tween, so total = 1.82
```
Total timeline length is 1.82 time units (the tiles tween ends last: start .85 + 6 x .07 stagger = 1.27, plus .55 = 1.82; the padding tween at 1.55 is shorter than that), mapped linearly onto 0 to 810 px (1 unit = about 445 px). Per-unit scroll positions: hero scale 0 to .5 (0 to 222 px), hero content 0 to .25 (0 to 111 px), back cloud 0 to .3 (0 to 134 px), front cloud 0 to .5 (0 to 222 px), cream wash .5 to .8 (222 to 356 px), box fade and tiles from .85 (378 px) to 1.82 (810 px). `tiles` = `.about-tile` (7 nodes: headline + 6 image tiles in DOM order).

Verified live (scroll 600+, i.e. past timeline end): cloud0 `translateY(-110px) op 1`, cloud1 `translateY(-270px) op 1`, bg op 1, box op 1, left tile `translate 0 0.06 op 1`.

Mobile (<1024): same timeline (no matchMedia). The 6 image tiles have `hidden lg:block`, so on phones only the headline tile animates in.

Parallax logic: the clouds start below their rest position and fade in while rising, 30 and 20 percent of their own height, back (index 1) a bit faster than front (index 0), overlapping the hero's bottom and then the About stage.

## B. Pinned stage: image box travels (`gsap.matchMedia`)

### Desktop `(min-width:1024px)`
```ts
const e = gsap.timeline({ defaults:{ease:'none'}, scrollTrigger:{
  trigger: stage, start:'top top', end:'+=320%', pin:true, scrub:.8, anticipatePin:1, invalidateOnRefresh:true }})
rect = el => ({ x: el.left - stage.left, y: el.top - stage.top, w, h })            // relative to stage
inset = { left: .03*stage.clientWidth, top: .03*stage.clientHeight, width: .94*W, height: .94*H, borderRadius: 24 }
e.fromTo(box, {left:rect(center).x, top:rect(center).y, width:rect(center).w, height:rect(center).h, borderRadius:12},
              {...inset, ease:'power2.inOut', duration:1}, 0)                       // box grows to 94% x 94% of the stage
 .to(leftTiles,  { x:'-48vw', scale:.9, ease:'power2.in', duration:.2, stagger:.03 }, 0)   // tiles fly out sideways
 .to(rightTiles, { x:'48vw',  scale:.9, ease:'power2.in', duration:.2, stagger:.03 }, 0)
 .to(gallery,    { autoAlpha:0, duration:.25 }, 0)
 .to(arrows,     { autoAlpha:0, duration:.2 }, 1.5)
 .fromTo(box, {...inset}, {left:rect(inline).x, top:rect(inline).y, width:rect(inline).w, height:rect(inline).h,
                           borderRadius:8, ease:'power3.inOut', duration:1.2, immediateRender:false}, 1.5)  // shrinks into the sentence
 .fromTo(textLayer, {opacity:0}, {opacity:1, duration:.3, immediateRender:false}, 1.7)
 .fromTo(words, {yPercent:110}, {yPercent:0, ease:'power3.out', duration:.5, stagger:.03}, 1.9)
 .fromTo(rule,  {scaleX:0}, {scaleX:1, transformOrigin:'left center', duration:.5}, 2.4)
 .fromTo(copy,  {y:20, opacity:0}, {y:0, opacity:1, ease:'power3.out', duration:.4}, 2.8)
```
Timeline total 3.2 units over 2880 px: 1 unit = 900 px. Scroll (absolute) = 900 + 900 t: box grows 900 to 1800, tiles exit 900 to 1080, arrows fade 2250, box shrinks into sentence 2250 to 3330 (t 1.5 to 2.7), text layer 2430, words 2610 to 3060 (+ stagger .03 x 16 = .48 more; 17 words), rule 3060, supporting copy 3420 to 3780.

### Mobile `(max-width:1023px)`
`end:'+=160%'`, `scrub:.6`, timeline length 1.95: gallery fade `.3`, arrows fade `.2`; box from center slot to inline slot in one `power3.inOut` tween, duration 1.1, radius 12 to 4; text layer at .5; words at .7 (stagger .025); rule at 1.3 (.4); copy at 1.55 (.4).

Rect values use functions (`() => O(el).x`) so they recompute on refresh.

Text structure: paragraph words are split from a constant sentence into `<span class="-mb-[0.1em] -mt-[1em] mr-[0.25em] inline-block overflow-hidden pb-[0.2em] pt-[0.1em] align-bottom"><span class="about-word inline-block">word</span></span>`. Type size `lg:text-[5.2vw] leading-[80%] tracking-[-0.045em]`, mobile `clamp(1.75rem,7vw,2.5rem)`.

## C. Image slider inside `.about-box` (7 slides, `.about-slide`)
Init: `gsap.set(slides, {xPercent:100}); gsap.set(slides[0], {xPercent:0})`. Arrow buttons and autoplay call `go(dir)`:
```ts
next = (cur + dir + n) % n
set(slides[next], { xPercent: 100*dir, zIndex: 2 }); set(slides[cur], { zIndex: 1 })
to(slides[cur],  { xPercent: -30*dir, duration: 1, ease: 'expo.out' })      // parallax drift of outgoing slide
to(slides[next], { xPercent: 0,       duration: 1, ease: 'expo.out', onComplete: () => locked = false })
// input locked while animating (u.current)
```
Autoplay: `setInterval(() => go(1), 2000)` while the stage is at least 20 percent visible (IntersectionObserver threshold .2), restarted after any arrow click, never started under `prefers-reduced-motion`. Because the stage is pinned for 2880 px the slider is visible for the whole pin. Arrows: `h-10 w-10 rounded-full bg-[#EDE6D6]`, `bottom-4 left-1/2`, hover `scale-105` (150 ms), focus-visible outline 2px offset 2px `#2A2725`.

`document.fonts.ready.then(() => ScrollTrigger.refresh())` runs after setup (text metrics change the inline slot size).
