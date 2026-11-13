# `#residence-02-tour`: "Step inside" teaser that expands and links to /tour (chunk `265...` id 13095)

`section#residence-02-tour.relative.z-30.w-full.bg-[#EDE6D6].text-white` > `.tour-stage.relative.h-screen.w-full.overflow-hidden.bg-[#EDE6D6]` > `.tour-box.absolute...overflow-hidden.rounded-[28px]` (clickable, `onClick` = enter tour) > `img.tour-inner.will-change-transform.object-cover` + overlay column `absolute top-8 inset-0 flex flex-col justify-between p-6 md:p-10`.
Overlay: top row eyebrow (`.tour-piece text-xs uppercase tracking-[0.2em]`) + (lg only) key legend list `ul.tour-piece` (`W A S D Move`, `E Interact`, `Q Customize`; each key `kbd h-7 min-w-7 rounded-md border border-white/70 text-[11px]`); bottom: h2 (`.tour-piece`, `text-[clamp(2.75rem,12vw,5.5rem)] lg:text-[7.5vw] leading-[.9] tracking-[-0.05em]`), paragraph (`.tour-piece`, `data-reveal-01`), CTA pill (`a.tour-fade`, `rounded-full border border-white/70 px-6 py-3 text-[11px] uppercase tracking-[0.18em]`), and a decorative tap hint (`.tour-hint`, `absolute right-4 top-4 h-9 w-9`) holding a white circle with a click icon and a pulsing ring `.tour-hint-ring`.

Start geometry (set per matchMedia): desktop `left:19% top:14% width:62% height:72% borderRadius:28px`; mobile `left:4% top:12% width:92% height:70% borderRadius:28px`. Initial sets: `.tour-piece {yPercent:110}` (each wrapped in a mask span), `.tour-fade {opacity:0, y:16}`, `.tour-hint {opacity:0, scale:.6}`.

## Timeline (not scrubbed: plays in real time once the stage hits the top; ScrollTrigger only pins)
```ts
gsap.timeline({ defaults:{ ease:'none' },
  scrollTrigger:{ trigger: stage, start:'top top', pin:true, anticipatePin:1 }})   // default end "bottom top" = +=100vh pin (900 px; spacer 1800 px)
  .to(box, { left:'0%', top:'0%', width:'100%', height:'100%', borderRadius:0, ease:'power2.inOut', duration:1 }, 0)
  .fromTo(inner, { scale:1.2 }, { scale:1, duration:1 }, 0)
  .to(pieces, { yPercent:0, ease:'power3.out', duration:.9, stagger:.08 }, 1)         // eyebrow, key legend, headline, paragraph
  .to(fade,   { opacity:1, y:0, ease:'power3.out', duration:.7 }, 1.45)              // CTA pill
  .to(hint,   { opacity:1, scale:1, duration:.4, ease:'back.out(2)' }, 2.15)
  .to(hintIcon, { y:-5, duration:.35, repeat:5, yoyo:true, ease:'power1.inOut' }, 2.15)
  .fromTo(hintRing, { scale:1, opacity:.6 }, { scale:2, opacity:0, duration:.7, repeat:2, ease:'power1.out' }, 2.15)
  .to(hint, { opacity:0, scale:.6, duration:.4, ease:'power2.in' }, 4.25)
  .to({}, { duration:.35 })                                                          // end padding, total about 5.0 s
```
Because `toggleActions` is the default (`play none none none`) the timeline plays once forward when the pin starts and does not reverse on scroll back. Pin start absolute 23130, pin end 24030, then the footer arrives at 24930 (the pin spacer adds 900 px beyond that).

## Interaction (click-through)
CTA label text "Enter ... " with arrow. Hover: `transition-colors duration-300 hover:bg-white hover:text-[#2A2725]`; focus-visible `outline outline-2 outline-offset-4 outline-white`; label char-roll (`data-hover-reveal`). The entire `.tour-box` and the CTA share `handleEnter(e)`:
```ts
e?.preventDefault(); if (busy) return; busy = true
if (!matchMedia('(min-width:1024px)').matches) {
  const el = document.documentElement, rf = el.requestFullscreen || el.webkitRequestFullscreen
  if (rf && !document.fullscreenElement && !document.webkitFullscreenElement) try { rf.call(el, { navigationUI:'hide' })?.catch(()=>{}) } catch {}
}
router.push('/tour')
```
and a hidden prefetch helper calls `router.prefetch('/tour')` (see `page-transitions.md`). The 3D walkthrough is meant for landscape, so on touch devices the page goes fullscreen first (the `/tour` route shows the rotate-to-landscape screen in portrait).

## Measured correction (frame-sampler)
Under normal scrolling the timeline plays when the pin starts. A large scroll jump (programmatic or fast scrollbar drag) starts it early (seen from y 22500, even 21500 after a jump from 0). It does not re-trigger or reverse; the box stays full-bleed. Rest geometry before play: 893x648 at page y 23256 (62% x 72% of the viewport, left 19%, top 14%). Measured real-time timeline matches the one above. See `frames/tour-teaser.md`.
