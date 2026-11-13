# Footer reveal and Contact overlay

## Footer (`footer#contact`, chunk `265...` id 95930)
`footer#contact.relative.z-30.flex.min-h-[100svh].w-full.flex-col.bg-[#EDE6D6].text-[#2A2725].px-4.md:px-10.lg:block.lg:h-screen.lg:py-16`; inside `.footer-frame` (rounded outline card `rounded-[20px] md:rounded-[30px] border border-[#2A2725]/20`), two `.footer-rule` hairlines (`h-px origin-left scale-x-0 bg-[#2A2725]/20`), and many `.footer-reveal` items each wrapped in `overflow-hidden`.

One-shot timeline:
```ts
gsap.timeline({ scrollTrigger: { trigger: footer, start: innerWidth < 1024 ? 'top 92%' : 'top 82%', once: true }})
  .fromTo('.footer-frame',  { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut' })   // frame wipes in left to right
  .fromTo('.footer-rule',   { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: .7, ease: 'power3.out' }, '-=0.65')   // at .55
  .fromTo('.footer-reveal', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, stagger: .08, ease: 'expo.out' }, '-=0.35') // at .9
```
Absolute times: frame 0 to 1.2, rules .55 to 1.25, all reveal items from .9 (stagger .08 across about 17 items, last ends about 3.2 s). Desktop trigger at scroll about 24930 - 738 = 24192.
Links: `.footer-reveal` anchors `transition-opacity hover:opacity-60` (150 ms default), plus `data-hover-reveal` on most (char roll). "Open to work" pill: green dot with `animate-ping` (1 s `cubic-bezier(0,0,.2,1)` infinite, scale 2 and fade) over a solid dot (`#3FA85B`, ping layer `#3FA85B/70`). Opening "Contact" (button) mounts the overlay below.

## Contact overlay (chunk `1v84...` id 10396, React portal on `document.body`)
Panel: `fixed inset-0 z-[999] h-[100svh] overflow-hidden bg-[#2A2725] text-[#EDE6D6]`, `role=dialog aria-modal`, `data-lenis-prevent`; decorative blurred blob `h-[480px] w-[480px] rounded-full bg-[#EDE6D6]/[0.06] blur-3xl` (blur 64 px) top-right. Content max-width 1280 px.

### Open (useLayoutEffect when `open` true and mounted)
Initial: panel `clipPath: inset(100% 0 0 0)`, `.cx-content {opacity:1}`, `.cx-mask {yPercent:110}`, `.cx-fade {opacity:0, y:14}`, `.cx-line {scaleX:0}`.
```ts
gsap.timeline({ defaults:{ease:'power3.out'}, onComplete: () => gsap.set(panel, { clearProps:'clipPath' }) })
  .to(panel,       { clipPath:'inset(0% 0 0 0)', duration:.95, ease:'expo.inOut' }, 0)         // curtain rises from the bottom
  .to('.cx-line',  { scaleX:1, duration:.9, stagger:.08, ease:'power3.inOut' }, .55)
  .to('.cx-mask',  { yPercent:0, duration:.9, stagger:.07, ease:'expo.out' }, .6)               // the 2 headline lines
  .to('.cx-fade',  { opacity:1, y:0, duration:.7, stagger:.06 }, .8)                            // pills, paragraph, cards, social row
```
Reduced motion variant: masks/fades/lines set final instantly, panel clip `0.25 s ease none`.

### Close
```ts
set(panel, { clipPath:'inset(0% 0 0 0)' })
gsap.timeline({ onComplete: unmount })
  .to('.cx-content', { opacity:0, duration:.3, ease:'power2.in' })
  .to(panel, { clipPath:'inset(0 0 100% 0)', duration:.85, ease:'expo.inOut' }, .1)            // curtain exits upward
// reduced motion: panel opacity 0, .2 s, ease none
```
### Behaviours
- Scroll lock while open: `html` and `body` `overflow:hidden` and `padding-right = scrollbar width` (restored on close).
- Focus: close button focused (`preventScroll`), Tab is trapped between first/last focusable, `Escape` closes, focus returns to the opener.
- Copy-email button: clipboard write (fallback `execCommand`), swaps icon + label to a check and "Copied" for 1800 ms (`aria-live=polite`).
- Status pill: `h-1.5 w-1.5` dot with `animate-pulse` (2 s `cubic-bezier(.4,0,.6,1)` infinite, opacity to .5).
- Hover states are listed in `hover-focus-states.md`.
