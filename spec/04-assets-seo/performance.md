# Performance notes

Measured 2026-11-13 on the live site (desktop pane 1440x900, Cloudflare edge, h3). Numbers marked "encoded" are `PerformanceResourceTiming.encodedBodySize`.

## Document
- `/`: 71,104 B HTML raw (71,471 decoded), 12.5 KB transferred (zstd), TTFB ~128 ms, `responseEnd` 134 ms, DOMContentLoaded 164 ms. Cloudflare Server-Timing: `cfEdge 7, cfWorker 22`.
- `/tour`: 20,413 B HTML raw.
- Page scroll height on `/` at 1440 wide: 25,830 px (about 28.7 viewports; scroll-driven pinned sections). Mobile emulation reported 23,176 px.
- No paint entries were readable (hidden pane); do not quote LCP/FCP from here. Run Lighthouse on the rebuild.

## Head resource hints (`/`, in order)
1. 3x `rel=preload as=font crossorigin type=font/woff2` (Instrument Serif italic latin `7ebf...`, Instrument Serif latin `e41d...`, Familjen Grotesk latin `f5ed...`).
2. 10x `rel=preload as=image`: `hero3`, `cloud-1-cropped-beige`, `cloud-2-full-beige`, `patio-front-clean`, `living-room-clean`, `kitchen-clean`, `exterior-garden-clean`, `top`, `nightSide`, `landscape-house-clean` (all webp).
3. `<link rel=stylesheet href=/_next/static/chunks/3be7mmba3usfq.css data-precedence=next>` (render-blocking, one CSS file).
4. `<link rel=preload as=script fetchPriority=low href=.../310vm2bl3xxpt.js>` (client entry preload, low priority).
5. 10 `<script async src=...>` chunks (below).
6. Streamed later in body: 7 more `rel=preload as=image`: `side`, `cloud-1-cropped`, `cloud-2-full`, `apartment-living`, `apartment-bedroom`, `apartment-bedroom-2`, `apartment-tour`. (React hoists the preloads emitted by `<img>` rendering; they come from React DOM resource hints, not hand-written.)
7. `<script src=.../0cz1d0mv5g_q7.js nomodule>` Next polyfills (112,594 B raw, 39 KB gz; only legacy browsers).
No `preconnect`/`dns-prefetch` (Draco decoder on `gstatic.com` and Cloudflare beacon are fetched cold; add `<link rel=preconnect href=https://www.gstatic.com crossorigin>`).
`/tour` head has the same 3 font preloads + css + script preload, no image preloads.

## JavaScript chunks (raw bytes / encoded transfer)
| Chunk | Raw | Encoded (approx) | Loaded on | Contents (inferred) |
|---|---|---|---|---|
| `1rj7ns8rte9vc.js` | 229,156 | 73 KB | both | React / react-dom |
| `2z-e6jheq0ftu.js` | 165,979 | 46 KB | both | Next client runtime |
| `19mx3mg6lkumu.js` | 28,907 | 8 KB | both | Next runtime |
| `turbopack-1vijxpa2bdysr.js` | 9,721 | 4 KB | both | Turbopack loader |
| `3fntmmi971322.js` | 14,377 | 4 KB | both | shared app code |
| `2xipugk_40kza.js` | 42,394 | 15 KB | both | preloader / loading screen (asset manifest with weights, `fetch(...,{cache:"force-cache"})` progress) |
| `0e8x1k9azfdsv.js` | 70,382 | 29 KB | both | gsap + ScrollTrigger |
| `1v84rdd_g9_xm.js` | 70,246 | 28 KB | both | gsap plugins, Lenis smooth scroll |
| `3g-3vm1p7v36q.js` | 1,073,810 | **298 KB** | both | three.js + R3F + GLTFLoader + DRACOLoader |
| `265hf09g46rmm.js` | 124,401 | 34 KB | `/` | home page client component (swiper, ScrollTrigger sections, marquee canvas, footer; icons) |
| `310vm2bl3xxpt.js` | 5,364 | 2 KB | `/` | client entry (preloaded) |
| `3jmgvrsil9p03.js` | 99,219 | 28 KB gz | `/tour` | tour page (pointer-lock controls, audio, models list, Rapier hooks) |
| `44yc3rrrxvbae.js` | **2,236,376** | **~834 KB gz** | `/tour` | Rapier physics WASM glue, wasm inlined as base64 |
| `14sbrd6gjzroj.js`, `05uzk4e3bxs9w.js` | 3,924 / 170 | <2 KB | `/tour` | route stubs |
| `css/3be7mmba3usfq.css` | 70,128 | 13 KB (brotli) | both | single Tailwind v4 CSS (includes `@layer`, `lab()` fallbacks) |

JS transferred on `/` first load: about 540 KB encoded (11 chunks). `/tour` JS: **1,326,169 B encoded** (the Rapier chunk dominates). Libraries: Next.js 15/16 + React 19, Tailwind v4, GSAP + ScrollTrigger, Lenis, Swiper, three, @react-three/fiber (+ drei likely), Rapier, react-icons.

## Heavy runtime loads
- `/` fetches `vill_draco.glb` (1.26 MB) twice in the timing log at ~186 ms and ~294 ms (preloader and the 3D scene both request it; second is served from cache with `force-cache`) and `hero5.webp` twice (img + texture). Draco decoder wasm loaded from `gstatic.com` (version 1.5.5).
- A preloader (`2xipugk_40kza.js`) holds the UI behind a loading screen driven by a weighted asset list: items `{type:"image"|"binary", src, weight}` with `hero5.webp` w1, both beige clouds w1, `vill_draco.glb` w4; progress is computed from `content-length` (use `Content-Length`-friendly hosting or fall back to counts).
- `/tour` fetches about 2.9 MB of GLB (apartment 1.03 MB + 9 furniture models) before interaction; textures (sky 6 PNG, 2x 1k PBR sets) and 8 MP3 files (lofi 935 KB) load as needed. Total tour media payload if everything loads: ~7.8 MB (models ~4.6 MB, audio ~1.4 MB, textures ~1.8 MB).

## Image payload
18 raster images = 3.375 MB (all eager and preloaded; none lazy). The about collage and slider reuse 7 files. Lighthouse-relevant: "Properly size images" will flag 1672 px sources rendered at 149-662 px; "Defer offscreen images" flags everything below the hero. Rebuild plan: `next/image` with `sizes`, `priority` only on hero, `loading=lazy` otherwise, 3 responsive widths (640/1280/1920) per image, AVIF/WebP, blur placeholders; drop preloads for below-the-fold images.

## Lighthouse-relevant observations
- LCP candidate: `hero3.webp` (178 KB, preloaded, no `fetchpriority=high`; the loader overlay hides it initially, so real LCP depends on the preloader completing).
- CLS: fonts use size-adjusted fallbacks; images have no `width/height` but sit in absolutely-positioned fixed-aspect boxes (no shift). `[data-reveal-01]{visibility:hidden}` keeps reveal text invisible until JS runs (content invisible without JS; FCP/LCP depend on hydration).
- TBT: three.js + GSAP + Lenis + Swiper hydrate on first load; the 298 KB three chunk is loaded on `/` even though the 3D scene is only the villa canvas. Consider `next/dynamic` with `ssr:false` for canvases and loading Rapier only on `/tour`.
- Text hidden while JS loads; no `<noscript>` fallback.
- Accessibility affecting scoring: nav links on `mix-blend-difference` (contrast variable), decorative cloud images correctly `alt=""`, hero alt present, no skip link, no `prefers-reduced-motion` handling confirmed here (see motion spec).
- Third parties: Cloudflare Web Analytics beacon only (`static.cloudflareinsights.com`, 0 transfer in log, injected by Cloudflare).
- Caching: hashed `/_next/static` immutable 1 year; `/assets` 7 days; HTML `s-maxage=1y` with Next revalidation on deploy. OpenNext cache header `x-nextjs-cache: MISS` on first hit.
