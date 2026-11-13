# Text reveal (`data-reveal-01`) and hover text roll (`data-hover-reveal`)

Module: chunk `1v84rdd_g9_xm.js` id 47742, mounted once in the root as a hidden `<div ref class="hidden" aria-hidden>` using `useGSAP(init, {scope, dependencies:[pathname], revertOnUpdate:true})`, so it re-runs on route change.

## Init sequence
```ts
const start = () => document.fonts?.ready ? document.fonts.ready.then(run) : run()
document.body.dataset.bootLoaderComplete === 'true' ? start() : window.addEventListener('bootloader:complete', start, { once: true })
run = () => { textReveal01(document); hoverReveal(document); ScrollTrigger.refresh() }
```

## `textReveal01(root)` (global call excludes `[data-reveal-local]`)
CSS first: `[data-reveal-01]{visibility:hidden}` then GSAP sets `visibility:visible` on init (no flash of text). Helper CSS:
```css
[data-reveal-01]>*{margin-bottom:-.18em}
[data-reveal-01] .word-mask,[data-reveal-01] .char-mask{vertical-align:top}
[data-reveal-01] .line-mask,[data-reveal-01] .word-mask,[data-reveal-01] .char-mask{overflow-clip-margin:.06em;overflow:clip}
[data-reveal-01] .line-mask>*,[data-reveal-01] .word-mask>*,[data-reveal-01] .char-mask>*{will-change:transform;padding-bottom:.18em}
```
Per element:
```ts
SplitText.create(el, {
  type: 'chars, words, lines', mask: 'chars', autoSplit: true,       // re-splits on width change (ResizeObserver, 200 ms debounce) and font load
  linesClass: 'line', wordsClass: 'word', charsClass: 'char',
  onSplit(self) {
    const duration = parseFloat(el.dataset.duration); const stagger = parseFloat(el.dataset.stagger)
    const vars = { yPercent: 110, duration: isNaN(duration) ? 1 : duration, stagger: isNaN(stagger) ? .02 : stagger,
                   immediateRender: true, ease: el.dataset.ease || 'expo.out' }
    if (el.hasAttribute('data-scroll'))
      vars.scrollTrigger = { trigger: el.closest('section') || el, start: 'clamp(top 50%)', once: true }
    return gsap.from(self.chars, vars)               // returned tween is time-matched to the previous one on re-split
  }})
```
Attributes: `data-reveal-01` (value `true` or `"chars"`, value is not read), `data-scroll` (play when section top hits 50% viewport, else play immediately), `data-duration`, `data-stagger`, `data-ease`, `data-reveal-local` (skip global init; the owning section calls `textReveal01(scope)` itself). Cleanup `revert()` on every split instance.

Used on: hero headline, hero meta labels and tagline, About headline tile (`data-scroll`), the statement heading in the transition section (`data-scroll`, local), the tour teaser paragraph.

## `hoverReveal(root)`: two-layer character roll
Applies to every `[data-hover-reveal]` with non-empty text (guarded by `data-hover-reveal-initialized`). CSS: `[data-hover-reveal]{vertical-align:top;cursor:pointer;display:inline-block}`, `.hover-reveal-track{line-height:inherit;display:grid;overflow:hidden}`, `.hover-reveal-line{white-space:pre;grid-area:1/1;display:block}` (both lines overlap in the same grid cell), `.hover-reveal-char{will-change:transform;display:inline-block}`.

DOM built: `track[aria-hidden]` > `line A` (original text) + `line B` (same text), each split into `.hover-reveal-char` spans (`aria:'none'`; the element's accessible name is lost to aria-hidden only on the duplicates, real text restored on revert). Initial `A.chars yPercent 0`, `B.chars yPercent 110`.
```ts
el.addEventListener('mouseenter', () => {
  gsap.to(A.chars, { yPercent: -110, duration: .4,  stagger: .02,  ease: 'power3.out', overwrite: 'auto' })
  gsap.to(B.chars, { yPercent: 0,    duration: .4,  stagger: .02,  ease: 'power3.out', overwrite: 'auto' }) })
el.addEventListener('mouseleave', () => {
  gsap.to(A.chars, { yPercent: 0,    duration: .35, stagger: .015, ease: 'power3.out', overwrite: 'auto' })
  gsap.to(B.chars, { yPercent: 110,  duration: .35, stagger: .015, ease: 'power3.out', overwrite: 'auto' }) })
```
Mouse only (no focus handler, no touch), so keyboard focus does not roll. Used on nav items, hero links, footer links, tour CTA, About/footer small links, contact button.
