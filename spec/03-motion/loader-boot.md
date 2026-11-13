# Boot loader (home only) and route-ready signalling

Component: BootLoader (chunk `2xipugk` id 64250), wraps the whole app on `/`. If the very first pathname starts with `/tour` it renders children only (no boot loader; `/tour` has its own loader, see `page-transitions.md`) and sets `document.body.dataset.bootLoaderComplete="true"` + dispatches `bootloader:complete`.

## Markup / look
`div.fixed.inset-0.z-[200].flex.flex-col.justify-center.overflow-hidden.bg-[#2A2725].text-[#EDE6D6]`, `aria-hidden` once ready.
Row: brand wordmark left (`font-sans text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-none tracking-[-0.055em]`), percent counter right (`text-[clamp(1.75rem,2.8vw,3rem)] font-medium tabular-nums tracking-[-0.05em]`, zero padded two digits, 00..100). Under it (mt-7): track `h-[3px] w-full bg-[#EDE6D6]/10`, fill `h-full origin-left bg-[#EDE6D6] will-change-transform` animated with `scaleX(value/100)`, `role=progressbar aria-valuemin 0 aria-valuemax 100`. Verified live: wordmark + counter ("54") + thin bar vertically centred on `#2A2725`.

## Phase 1: weighted progress
While loading: `document.body.style.overflow = document.documentElement.style.overflow = 'hidden'`.
Assets and weights: fonts ready 1, `hero5.webp` 1, `cloud-1-cropped-beige.webp` 1, `cloud-2-full-beige.webp` 1, villa GLB (`/assets/models/vill_draco.glb`, fetched with `cache:'force-cache'` and streamed byte progress capped .99) 4. Total weight 8.
```ts
progress = sum(weight_i * done_i) / 8 * 100     // done_i is max progress seen, 0..1
gsap.to(state, { value: progress, duration: .5, ease: 'power2.out', overwrite: true, onUpdate: render })
```
`render` sets bar `scaleX(value/100)` and counter `Math.round(value)`. Failed asset: logged, counted as done.

## Phase 2: exit (after all assets resolved)
```ts
gsap.timeline({ onComplete })
  .to(state, { value: 100, duration: .3, ease: 'power2.out', overwrite: true, onUpdate: render })
  .to(loaderEl, { clipPath: 'inset(0 0 100% 0)', duration: 1.15, ease: 'expo.inOut' })   // wipes upward (bottom edge rises to top)
// onComplete: display:none, restore overflow, body.dataset.bootLoaderComplete='true',
//             window.dispatchEvent(new Event('bootloader:complete'))
```
Reduced motion: clip duration `.25` instead of `1.15` (only guard in this file).

## Consumers of `bootloader:complete`
- Text reveal (`data-reveal-01`) and hover-reveal init wait for it (then `document.fonts.ready`).
- `/tour` route prefetch (requestIdleCallback, timeout 4000, else setTimeout 2000; skipped on `saveData` or `slow-2g`/`2g`).

Note: the hero GSAP intro (`.hero-image` scale etc.) runs at mount, i.e. under the loader, so by the time the clip-reveal ends it is mostly finished. The char reveals of the hero wait for the event and therefore play as the loader leaves.

## Reference snippet
```ts
export function bootLoader(assets: {src:string; w:number; kind:'img'|'bin'}[]) {
  const total = 1 + assets.reduce((a,b)=>a+b.w,0), seen = new Array(assets.length+1).fill(0)
  const st = { value: 0 }
  const set = (i:number,v:number)=>{ seen[i]=Math.max(seen[i],v)
    const p = (seen[0]*1 + assets.reduce((a,x,k)=>a+seen[k+1]*x.w,0))/total*100
    gsap.to(st,{value:p,duration:.5,ease:'power2.out',overwrite:true,onUpdate:render}) }
  // after all done:
  gsap.timeline({onComplete:finish})
    .to(st,{value:100,duration:.3,ease:'power2.out',overwrite:true,onUpdate:render})
    .to(el,{clipPath:'inset(0 0 100% 0)',duration:reduced?.25:1.15,ease:'expo.inOut'})
}
```

## Measured correction (frame-sampler)
The loader does not stall at 99. `requestAnimationFrame` is throttled to about 0 fps while the Browser pane is hidden, which freezes GSAP and the loader counter. With the pane awake it reaches 100 and the `z-[200]` element ends `display:none` within a few seconds. `window.lenis` exposes only `{version}`; `gsap` and `ScrollTrigger` are not global.
