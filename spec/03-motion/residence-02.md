# `#residence-02`: clip-path image reveal, then a 3-room carousel in one pinned stage (chunk `265...` id 83317)

`section#residence-02.relative.z-30.w-full.bg-[#EDE6D6]` > `.ap-stage.relative.h-screen.w-full.overflow-hidden.bg-white` > `div.absolute.inset-0` containing 3 `.ap-img` wrappers (each `absolute overflow-hidden` holding `img.ap-img-inner.object-cover.will-change-transform`), hero title block (bottom-left, `text-white`), text column (3 stacked `.ap-text`), bottom-left label with counter (`.ap-label`). Nav item "Stays" links here. Both ScrollTriggers share trigger `.ap-stage`, `start:'top top'`.

Whole section scroll: spacer 5400 px = pin 500% (4500 px) + 900; absolute pin from 17730 to 22230 (desktop).

## Layout slots (percent of the stage, per image state; animated with GSAP on `left/top/width/height/borderRadius/opacity`)
```ts
const SLOTS = {
 desktop: { hero:{l:0,t:0,w:100,h:100,r:0,o:1}, main:{l:27,t:3.4,w:45,h:93.2,r:28,o:1},
            prev:{l:16.6,t:3.4,w:8.6,h:18,r:18,o:1}, next:{l:74,t:78.6,w:8.6,h:18,r:18,o:1},
            out:{l:16.6,t:3.4,w:8.6,h:18,r:18,o:0}, wait:{l:74,t:78.6,w:8.6,h:18,r:18,o:0} },
 mobile:  { hero:{0,0,100,100,0,1}, main:{l:4,t:3,w:92,h:50,r:28,o:1},
            prev:{l:4,t:84,w:22,h:12,r:18,o:1}, next:{l:74,t:84,w:22,h:12,r:18,o:1},
            out:{l:4,t:84,w:22,h:12,r:18,o:0}, wait:{l:74,t:84,w:22,h:12,r:18,o:0} } }
// desktop set = (min-width:1024px), or landscape phone; mobile = max-width:1023px (matchMedia conditions object)
slotFor(img, step): step===0 ? (img===0 ? hero : wait)
                    : k = img - (step-1);  k<=-2 ? out : k===-1 ? prev : k===0 ? main : k===1 ? next : wait
```
So the active room is a large rounded card in the middle (desktop 45% wide), the previous room is a small thumbnail top-left of it, the next room a thumbnail bottom-right; text sits in the right column (`lg:left-[74%] lg:right-[3%] lg:top-[18%] lg:bottom-[24%]`, mobile `left-[6%] right-[6%] top-[56%] bottom-[16%]`).

Initial setup (inside matchMedia): images `set({...slotFor(i,0), zIndex: 3-i})`, inner `scale` 1 for image 0 and 1.2 for the rest, `.ap-hero-piece` and every `.ap-piece` `{yPercent:110, opacity:0}`, `.ap-label {opacity:0}`.

## A. Intro scrub (end `+=100%` = 900 px)
```ts
gsap.timeline({ defaults:{ease:'none'}, scrollTrigger:{ trigger: stage, start:'top top', end:'+=100%', scrub:.8, invalidateOnRefresh:true }})
  .fromTo(img0,      { clipPath: desktop ? 'inset(24% 32% 24% 32% round 28px)' : 'inset(30% 8% 30% 8% round 28px)' },
                     { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease:'power2.inOut', duration:1 }, 0)
  .fromTo(inner0,    { scale: 1.3 }, { scale: 1, ease:'power2.inOut', duration:1 }, 0)
  .fromTo(stage,     { backgroundColor:'#FFFFFF' }, { backgroundColor:'#EDE6D6', duration:.4 }, .6)
```
(The picture opens like a window from white into a full-bleed image.)

## B. Pin and state machine (end `+=500%`)
```ts
const D = 3, F = 130 + 110*D + 40            // 500 (percent of viewport height)
const w = gsap.timeline({ paused:true })
w.addLabel('hidden', 0)
 .fromTo(heroPieces, {yPercent:110, opacity:0}, {yPercent:0, opacity:1, duration:.8, stagger:.09, ease:'power3.out', immediateRender:false}, 0)
 .addLabel('s0', 1)
for (let e = 1; e <= D; e++) {
  const t = 1 + (e-1)*1.2, first = e === 1
  images.forEach((img, i) => {
    const from = slotFor(i, e-1), to = slotFor(i, e)
    if (from !== to) {
      const waitToNext = from === wait && to === next
      w.to(img, { ...css(to), duration: (first && i===0) ? 1.1 : .9, ease:'power3.inOut' }, (waitToNext && first) ? t + .6 : t)
    }
    const sFrom = i === active(e-1) ? 1 : 1.2, sTo = i === active(e) ? 1 : 1.2          // active(e) = e===0 ? 0 : e-1
    if (sFrom !== sTo) w.to(inners[i], { scale: sTo, duration: .9, ease:'power3.inOut' }, t)
  })
  if (active(e) !== active(e-1)) { w.set(images[active(e)], {zIndex:3}, t); w.set(images[active(e-1)], {zIndex:2}, t) }
  if (first) {
    w.fromTo(heroPieces, {yPercent:0, opacity:1}, {yPercent:-110, opacity:0, duration:.4, stagger:.05, ease:'power2.in', immediateRender:false}, t)
     .to(label, { opacity:1, duration:.6 }, t + .6)
  } else {
    w.fromTo(texts[e-2], {yPercent:0, opacity:1}, {yPercent:-110, opacity:0, duration:.2, stagger:.03, ease:'power2.in', immediateRender:false}, t)
     .to(countCol, { yPercent: -(100/D)*(e-1), duration:.6, ease:'power3.inOut' }, t)
  }
  w.to(texts[e-1], { yPercent:0, opacity:1, duration:.7, stagger:.06, ease:'power3.out' }, t + (first ? .55 : .35))
   .set({}, {}, t + 1.2).addLabel('s' + e, t + 1.2)
}
w.seek('hidden')
ScrollTrigger.create({ trigger: stage, start:'top top', end:`+=${F}%`, pin:true, anticipatePin:1,
  onUpdate(self) {
    const i = self.progress * F, a = (i - 100 - 30) / 110
    const s = a >= .6 ? Math.min(D, Math.floor(a - .6) + 1) : (i >= 90 ? 0 : -1)
    if (s !== state) { state = s; tween?.kill(); tween = w.tweenTo(s < 0 ? 'hidden' : 's' + s, { ease:'none' }) }
  }})
```
Label times: `s0` 1, `s1` 2.2, `s2` 3.4, `s3` 4.6 seconds; `tweenTo(label, {ease:'none'})` plays at real time, so each step takes its label distance (hidden to s0 about 1 s, each room change 1.2 s), forward or reverse.

State thresholds (`i` = percent of one viewport height scrolled since pin start; px = i x 9 on 900 px tall viewport, add 17730 for absolute):

| State | i from | pin scroll px | Visual |
|---|---|---|---|
| -1 hidden | 0 | 0 | image opening (intro scrub 0 to 900), no titles |
| 0 hero | 90 | 810 | hero title pieces rise in |
| 1 | 196 | 1764 | room 1 card appears in middle, hero title leaves, room-1 text + "Inside the ..." label + counter 01 |
| 2 | 306 | 2754 | carousel advances: room 2 main, room 1 becomes top-left thumb, counter to 02 |
| 3 | 416 | 3744 | room 3 main, room 1 thumb fades out, counter 03 |
| end | 500 | 4500 | pin releases |

## Pieces
- `.ap-hero-piece` (3 nodes: eyebrow + 2 headline lines) and `.ap-piece` (5 per room, 15 total: eyebrow, 2 headline lines, paragraph, details; room k uses indices 5k..5k+4) all sit inside mask wrappers (`-mb-[0.18em] -mt-[0.05em] block overflow-hidden pb-[0.18em] pt-[0.05em]`) so `yPercent 110 to 0` reads as a rise from a baseline. Exit goes to -110.
- Counter label: `.ap-label` (`bottom-[3.4%] left-[2.6%] z-20 hidden lg:flex` and shown on landscape phones, `text-[11px] uppercase tracking-[0.18em]`): "Inside the apartment" + a 1.4em-high window (`block h-[1.4em] overflow-hidden`) containing `.ap-count-col` (flex column of 01/02/03, `tabular-nums`) moved by `yPercent -(100/3)*(e-1)` (each `yPercent` is of the column's own height, so one step = one digit) + "/ 03" at 50% opacity.
- Text sizes: eyebrow `text-[10px] tracking-[0.2em] uppercase`, h2 `lg:text-[2.8vw] leading-[.98] tracking-[-0.04em]` (`clamp(1.75rem,6.5vw,2.75rem)` below), copy `max-w-[24rem] text-xs md:text-sm`, details `text-[10px] uppercase tracking-[0.16em] opacity-70`; hero title `lg:text-[7vw] leading-[.92] tracking-[-0.05em]` (`clamp(2.75rem,12vw,5.5rem)`), bottom gradient over text for legibility is not used; text is white over the full-bleed image.

`useGSAP` deps `[pathname]`, `revertOnUpdate:true`; cleanup `matchMedia.revert()`.

## Measured correction (frame-sampler)
In state 1 the "next" thumbnail (second room, slot `74,78.6,8.6,18`) rests at opacity 0.9 (0.901 on mobile), not 1: its `wait -> next` tween starts at t+.6 for .9 s while label `s1` sits at t+1.2, so `tweenTo('s1')` stops before it finishes. It reaches 1 in state 2. Copying this is optional; the difference is visually negligible. See `frames/residence-02.md`.
