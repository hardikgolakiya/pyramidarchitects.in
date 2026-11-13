# Hero (`section.sticky.top-0.z-0.h-[100svh].lg:h-screen.bg-black`, chunk `265...` id 20399)

The hero is CSS-sticky at top 0 with `z-0`; the next section (`#about`, `z-20`) scrolls over it. Hero parallax/fade on exit is driven from the About lead-in timeline (see `about-cloud-parallax.md`), which queries `.hero-image-wrap` and `.hero-content` globally.

Structure: `.hero-image-wrap` (absolute inset-0, pointer-events-none) > `img.hero-image` (object-cover) + `div.bg-black/35` overlay; `.hero-content` (absolute inset-0 z-10) > headline block (`absolute left-6 top-[16%] md:left-10 lg:top-[7%]`), `.hero-actions` links, `.hero-meta` row (4 small uppercase labels, `lg:inset-0 lg:flex lg:items-center`), `.hero-bottom` tagline (`absolute bottom-6`).

## Load intro (useGSAP, scope = hero, runs on mount, no ScrollTrigger)
```ts
gsap.timeline({ defaults: { ease: 'power3.out' } })
  .from('.hero-image',       { scale: 1.08, duration: 2,  ease: 'power2.out' })
  .from('.hero-actions',     { y: 20, opacity: 0, duration: .8 }, '-=0.2')   // t = 1.8
  .from('.hero-meta-inner',  { y: 15, opacity: 0, duration: .7 }, '-=0.4')   // t = 2.2
  .from('.hero-bottom-inner',{ y: 15, opacity: 0, duration: .7 }, '-=0.4')   // t = 2.5  (ends 3.2)
```
Absolute times: image 0 to 2.0 (scale 1.08 to 1), actions 1.8 to 2.6, meta 2.2 to 2.9, bottom 2.5 to 3.2. It starts at mount, so it plays under the boot loader (see `loader-boot.md`).

## Text reveals in the hero
- `h1.hero-title-line[data-reveal-01]` (two lines, `<br>`): per-char SplitText mask reveal, `yPercent 110 -> 0`, 1 s, stagger .02, `expo.out`, no scroll trigger, so it plays when `bootloader:complete` + fonts ready fire. Font: serif `clamp(2.75rem,12vw,4.5rem)`, md 5rem, lg 5.64rem, leading 94%.
- The four meta labels and the tagline carry `data-reveal-01="chars"` and run the same default char reveal.
- Landscape phone override: h1 `2.25rem`.

## Links (hover)
`Explore ...` (to `#marquee-transition`) and `Experience ...` (to `#residence-02-tour`): label `span[data-hover-reveal].border-b.border-white` (char roll, .4 s) + arrow `span.transition-transform.duration-300.group-hover:translate-x-1` (default ease `cubic-bezier(.4,0,.2,1)`). `pointer-events-auto` on links only (container is pointer-events none over the image).

## Scroll exit (owned by About timeline, scrub .8, scroll 0 to 810 on desktop)
- `.hero-image-wrap`: `scale 1 -> 1.12`, ease none, default duration .5 of a 1.82 timeline (so complete after about 220 px of scroll). Verified end state `matrix(1.12,0,0,1.12)`.
- `.hero-content`: `y 0 -> -80`, `opacity 1 -> 0`, `power2.in`, duration .25 of 1.82 (finished by about scroll 110 px; verified `translateY(-80px) opacity 0` at scroll 600).

## Reference
```ts
useGSAP(() => {
  gsap.timeline({defaults:{ease:'power3.out'}})
    .from('.hero-image',{scale:1.08,duration:2,ease:'power2.out'})
    .from('.hero-actions',{y:20,opacity:0,duration:.8},'-=0.2')
    .from('.hero-meta-inner',{y:15,opacity:0,duration:.7},'-=0.4')
    .from('.hero-bottom-inner',{y:15,opacity:0,duration:.7},'-=0.4')
},{scope:heroRef})
```
