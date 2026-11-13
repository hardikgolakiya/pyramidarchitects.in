# Fixed nav and dropdown menu (chunk `2xipugk` id 25199)

`nav.fixed.left-0.top-0.z-50.w-full.px-6.py-4.text-white.mix-blend-difference.md:px-10` (blend-difference keeps it legible on cream and dark sections). Left: wordmark link (`text-xl font-medium leading-none`). Right: column with `MENU` button + collapsible list. Items: Residence (`#marquee-transition`), Stays (`#residence-02`), Tour (`/tour`, Next `<Link>`), Contact (button that opens the contact modal).

## Entrance
```ts
gsap.fromTo(nav, { y: -20, opacity: 1 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: .2 })
```
(opacity does not change, only a 20 px drop; it runs at mount underneath the loader.)

## Dropdown open/close
Timeline built once (paused), scope = menu wrapper:
```ts
gsap.set(panel, { height: 0 }); gsap.set('.menu-item', { yPercent: 110 })
tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
  .to(panel, { height: 'auto', duration: .5 }, 0)
  .to('.menu-item', { yPercent: 0, duration: .6, stagger: .05 }, .05)
// open:  tl.timeScale(1).play()      close: tl.timeScale(1.8).reverse()
```
Each `li` is `overflow-hidden pb-[0.1em]` so the item slides up out of a mask. Panel `id=site-menu` has `inert` when closed.

Triggers:
- Mouse: `pointerenter` on the right column (pointerType mouse only) opens immediately; `pointerleave` closes after a 150 ms timeout (cleared on re-enter).
- Click/keyboard: `pointerdown` records pointer type; click toggles unless it was a real mouse click (detail > 0 with mouse type), so hover users are not toggled shut by clicking.
- `Escape` closes and returns focus to the MENU button; `pointerdown` outside closes; `focusout` leaving the column closes; choosing an item closes.

## MENU icon (2x2 dots)
4 dots `3px` round, `grid grid-cols-2`. Closed: `gap:2px; transform:none`. Open: `gap:5px; transform:rotate(45deg)`. CSS `transition: gap 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)`.

## Item hover dimming
Hovering/focusing one item sets the others to `opacity:.4`, hovered 1, `transition: opacity 300ms` (default ease). Reset on list `mouseleave`/blur. Items also have `data-hover-reveal` (char roll, see `text-reveal-and-hover-reveal.md`).

## Reference
```ts
const tl = gsap.timeline({paused:true,defaults:{ease:'power3.out'}})
  .to(panel,{height:'auto',duration:.5},0).to(items,{yPercent:0,duration:.6,stagger:.05},.05)
open ? tl.timeScale(1).play() : tl.timeScale(1.8).reverse()
```
