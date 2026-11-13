# Page transitions: `/` to `/tour` (and back)

There is no animated page-exit/enter choreography (no overlay wipe, no View Transitions API, no AnimatePresence). The transition is: client-side navigation + a loader on the destination.

## Leaving `/`
1. Trigger: click on `.tour-box` (the expanded picture) or the "Enter ..." CTA in `#residence-02-tour` (also the nav item "Tour", a Next `<Link href="/tour">`; the hero "Experience ..." link scrolls to `#residence-02-tour`, it does not navigate).
2. Handler: `preventDefault`, single-fire guard, on viewports < 1024 px call `document.documentElement.requestFullscreen({navigationUI:'hide'})` (or `webkitRequestFullscreen`), errors swallowed, then `router.push('/tour')`.
3. Prefetch: a helper component runs `router.prefetch('/tour')` after the boot loader finishes (`bootloader:complete`), via `requestIdleCallback(..., {timeout:4000})` or `setTimeout 2000`; skipped when `navigator.connection.saveData` or `effectiveType` is `slow-2g`/`2g`. The GLB models for `/tour` are additionally preloaded one at a time every 1500 ms after the tour mounts (`useGLTF.preload`, same data-saver guard).
4. Scroll: Lenis resets scroll to 0 immediately on every pathname change (`scrollTo(0,{immediate:true,force:true})`, `ScrollTrigger.clearScrollMemory()`, `history.scrollRestoration='manual'`), then after 3 rAFs does it again plus `ScrollTrigger.refresh()`.
5. All route-bound GSAP contexts (`useGSAP({dependencies:[pathname], revertOnUpdate:true})`: About/ap-transition/residence sections, text-reveal) are reverted when the pathname changes; the home components unmount with the route.

## Arriving on `/tour`
- Route has its own loader overlay (`div.fixed.inset-0.z-[300].flex.flex-col.justify-center.bg-[#2A2725].text-[#EDE6D6]`, `role=status aria-live=polite`): left wordmark, centre "Private Residence Tour" label (`text-[clamp(0.75rem,1.5vw,1rem)] uppercase tracking-[0.12em] text-[#EDE6D6]/70`), counter 00 to 100 (`text-[clamp(1.75rem,2.8vw,3rem)] tabular-nums`), 3 px progress bar (`scaleX`), status line (`Preparing your tour experience` / `Entering the residence` / `Some files could not load`), tiny line "ARCHITECTURE . INTERIORS . DETAILS" (`hidden sm:block text-[9px] tracking-[0.18em] text-[#EDE6D6]/40`), optional "Try again" pill that reloads.
- Progress: tied to the three.js loading manager (`useProgress`): `gsap.to(state,{value:min(maxSeen,99),duration:.5,ease:'power2.out',overwrite:true,onUpdate})`; when the scene reports ready (two nested `requestAnimationFrame` after first render): `timeline.to(state,{value:100,duration:.3,ease:'power2.out'}).to(overlay,{opacity:0,duration:.7,ease:'power2.inOut'})`, then the overlay unmounts. The home boot loader is NOT used here: if the first-ever pathname starts with `/tour` the boot wrapper renders children directly and signals `bootLoaderComplete` itself.
- Entering from the home page by client navigation the home boot loader has already finished (`display:none`), so only the tour loader shows. The cut is therefore: teaser section (full-bleed picture) then a hard swap to the dark `#2A2725` loader, 0.7 s fade-out to the 3D scene. The matching cue is that the teaser picture has just expanded to full-bleed, the same as the scene's opening view.
- `Back to site` link (fixed `left-6 bottom-6 md:left-10 md:bottom-8`, `href="/"`, `prefetch={false}`): navigation back lands at scroll 0 of `/`; the boot loader does not replay (it is mounted once per full page load; on a client navigation back the wrapper keeps `bootLoaderComplete`). A hard refresh on `/` replays the boot loader.
- Portrait phones/tablets (`@media screen and (max-width:1024px) and (orientation:portrait)`) show the rotate-device warning (see below) over the scene.

## Rotate-device warning (`.rotate-device-warning`, chunk `14sbrd6gjzroj.js`)
CSS: `display:none` by default; in `@media screen and (max-width:1024px) and (orientation:portrait)` it becomes `display:flex; position:fixed; inset:0; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:24px; color:#fff; background-color:#0f0f0f; z-index:999`; the Tailwind utility classes on the element (`bg-blue-900 z-[9999]`) take precedence in the DOM: brand-blue `#1c398e` background, `role=alert`.
Animation (`useGSAP`, scope = warning), executed on mount even while hidden:
```ts
gsap.from('.lock-line',  { yPercent: 110, duration: .9, ease: 'power3.out', stagger: .08, delay: .1 })   // headline lines + sentence rise from masks
gsap.from('.lock-badge', { opacity: 0, scale: .8, duration: .7, ease: 'back.out(1.8)' })
if (!reduced) {
  gsap.to('.lock-icon', { rotation: 90, duration: .9, ease: 'power2.inOut', repeat: -1, yoyo: true, repeatDelay: .8 })
  gsap.fromTo('.lock-ring', { scale: 1, opacity: .5 }, { scale: 1.8, opacity: 0, duration: 1.8, ease: 'power1.out', repeat: -1 })
}
```
Layout: top-left wordmark, gradient `from-black/40` at the bottom, centre badge `h-24 w-24 rounded-full border border-white/50 bg-white/10 backdrop-blur-sm` with a 4xl rotate icon and a `bg-white/40` ring that pulses; eyebrow "Landscape mode" (`text-[10px] uppercase tracking-[0.2em] text-white/70` flanked by 24 px rules); serif heading "Turn your device, sideways." (`clamp(2.25rem,10vw,3.5rem)`, leading 96%, per-line masks); explanatory sentence (`text-xs uppercase tracking-[0.14em] text-white/75 max-w-xs`).

## Rebuild recipe
Use the framework router for the navigation, keep the 3D page lazy-loaded with its own full-screen loader that fades out in 0.7 s, preserve the fullscreen request on touch, and reset scroll on route change. If a richer cross-route transition is wanted (the reference has none), the teaser's `.tour-box` already reaches `left0 top0 100% x 100% radius 0`, so a FLIP-style continuation into the scene is the natural place to add one.
