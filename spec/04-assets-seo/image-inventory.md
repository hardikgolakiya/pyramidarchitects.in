# Image / media inventory (https://stillform.homes `/` and `/tour`)

Source: `spec/raw/index.html`, `spec/raw/tour.html`, `spec/raw/js/*.js`, `spec/raw/css/*.css`, plus live `curl`, image headers and browser `naturalWidth` / `getBoundingClientRect()` at a 1440x900 viewport. No image files are stored in this deliverable. Filenames below are the reference site's; the rebuild will use client assets (see `placeholder-assets.md`).

## Global facts
- All raster images are **plain `<img>` tags**, NOT `next/image`. There are no `/_next/image?...` URLs, no `srcset`, no `sizes`, no `width`/`height` attributes, no `loading="lazy"`, no `decoding`, no `fetchpriority` on any image. `currentSrc` equals `src` everywhere. (Rebuild recommendation: use `next/image` with `sizes`; the markup below documents the ORIGINAL behaviour.)
- Format: all `.webp`, served from `/assets/images/` (public folder). Header: `content-type: image/webp`, `cache-control: public, max-age=604800` (7 days), Cloudflare `cf-cache-status: HIT`, strong ETag.
- Preloading: every image is preloaded by `<link rel="preload" as="image" href=...>` in the `<head>` (no `fetchPriority`, no `imagesrcset`). 10 preloads in the document head, 7 more emitted later in the stream (see `performance.md`). Because every image is eager (`loading=auto`), the whole page pulls ~3.4 MB (3.375 MB) of images on first load.
- Classes shared by content images: `h-full w-full object-cover` (computed `object-fit: cover; object-position: 50% 50%` unless noted). Cloud PNG-like overlays: `h-auto w-full max-w-none opacity-0` (computed `object-fit: fill`).
- `will-change-transform` is set on the parallax/zoom images (`rs-img`, `ap-img-inner`, `tour-inner`).
- Alt text pattern: decorative images (clouds, the 6 tile thumbnails) use `alt=""`; hero, slider, residence images carry descriptive alt. Tile duplicates in the slider use the pattern `"<BRAND> interior N"` (N = 1..7 index). See the alt column.
- Page background `#EDE6D6` (beige), body `rgb(10,10,10)`. The beige clouds exist so they blend with the `#EDE6D6` section; the non-beige cloud variants blend with the second section background (check design-system spec for exact value).

## Raster images (intrinsic sizes read from the WebP headers)
| # | File | Role / slot | Where used (DOM / JS) | Intrinsic px (AR) | Bytes | Alpha | Rendered size @1440x900 (scroll 0 / initial) | Fit / position | Alt |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `hero3.webp` | Hero background (cinematic exterior) | `<section sticky top-0 h-[100svh]>` > `.hero-image-wrap absolute inset-0 pointer-events-none` > `img.hero-image`; a `div.absolute.inset-0 bg-black/35` overlay sits on top | 1672x941 (1.777, 16:9) | 178,418 | no | 1555x972 (slightly larger than the viewport because of a scale animation) | cover, 50% 50% | `"<Brand> private residence"` |
| 2 | `hero5.webp` | Marquee WebGL texture (image shown through the big text marquee in `#marquee-transition`). Not in the HTML; only in JS (`<MarqueeCanvas image="/assets/images/hero5.webp">`, component `eb`) and in the preloader asset list. Loaded at runtime via `img` initiator at ~286 ms | `js/265hf09g46rmm.js`, `js/2xipugk_40kza.js` (preloader list, weight 1) | 1672x941 (16:9) | 197,020 | no | drawn to a `<canvas class="marquee-canvas pointer-events-none absolute left-1/2 top-1/2">` | texture mapped cover-like in shader (see motion spec) | n/a (canvas) |
| 3 | `cloud-1-cropped-beige.webp` | Transition cloud layer A over beige background (About section entry) | `img.about-cloud` x1, wrapper `pointer-events-none absolute left-0 top-[-42vh] ...`; classes `absolute top-[25%] lg:top-0 left-[-0%] h-auto w-[100%] max-w-none opacity-0` | 1440x550 (2.618) | 142,418 | yes | 1440x550 (width 100% of container, height auto) | fill (natural ratio) | `""` |
| 4 | `cloud-2-full-beige.webp` | Transition cloud layer B (beige) | `img.about-cloud`; `absolute top-[20%] lg:top-[8%] left-[-0%] h-auto w-[100%] max-w-none opacity-0` | 1440x900 (1.6) | 310,794 | yes | 1440x900 | fill | `""` |
| 5 | `cloud-1-cropped.webp` | Cloud layer A, second transition (villa -> apartment) | `img.ap-transition-cloud` in `section[aria-label="Transition from villa to apartment"]`; `absolute left-0 top-[25%] h-auto w-full max-w-none opacity-0 lg:top-0` | 1440x550 (2.618) | 96,436 | yes | 1440x550 | fill | `""` |
| 6 | `cloud-2-full.webp` | Cloud layer B, second transition | `img.ap-transition-cloud`; `absolute left-0 top-[20%] h-auto w-full max-w-none opacity-0 lg:top-[8%]` | 1440x900 (1.6) | 166,020 | yes | 1440x900 | fill | `""` |
| 7 | `patio-front-clean.webp` | About collage tile (left column #1, large) AND slide 1 of the about slider | tile: `.about-tile.about-tile-l.absolute.hidden...` (hidden below `lg`); slider: `.about-box > img.about-slide.absolute.inset-0` | 1522x688 (2.212) | 221,862 | no | tile 400x412; slide 662x342 | cover, 50% 50% | tile `""`; slide `"<Brand> interior 1"` |
| 8 | `living-room-clean.webp` | tile left #2 + slide 2 | same patterns | 1522x688 | 125,378 | no | tile 298x213; slide 662x342 | cover | tile `""`; slide `"... interior 2"` |
| 9 | `kitchen-clean.webp` | tile left #3 + slide 3 | same | 1522x688 | 91,704 | no | tile 325x245; slide 662x342 | cover | `""` / `"... interior 3"` |
| 10 | `exterior-garden-clean.webp` | tile right #1 + slide 4 | `.about-tile.about-tile-r` | 1522x688 | 228,140 | no | tile 249x212; slide 662x342 | cover | `""` / `"... interior 4"` |
| 11 | `top.webp` | tile right #2 + slide 5 | same | 1672x941 (16:9) | 264,274 | no | tile 421x313; slide 662x342 | cover | `""` / `"... interior 5"` |
| 12 | `nightSide.webp` | tile right #3 + slide 6 + Residence slider slide 2 (`rs-img`, alt "Warmly lit interior") | three usages | 1672x941 | 180,704 | no | tile 384x375; about slide 662x342; rs slide 921x1129 | cover | `""` / `"... interior 6"` / `"Warmly lit interior"` |
| 13 | `landscape-house-clean.webp` | about slider slide 7 (no tile) | `img.about-slide` | 1522x688 | 171,144 | no | 662x342 | cover | `"... interior 7"` |
| 14 | `side.webp` | Residence 01 slider slide 1 (portrait crop of a landscape image) | `section#residence-slides` > `.rs-swiper-item.absolute.inset-0.overflow-hidden` > `img.rs-img` | 1448x1086 (1.333, 4:3) | 139,632 | no | 682x836 | cover, 50% 50% | `"<Brand> private residence"` |
| 15 | `apartment-living.webp` | Residence 02 image A (large, animates from small to full) | `.ap-img.absolute.overflow-hidden` > `img.ap-img-inner` `style="object-position:50% 50%"` | 1672x941 | 313,632 | no | 1872x1170 at measurement time (mid-animation, scaled) | cover, 50% 50% | `"Sunlit living area with a linen sofa and oak floor"` |
| 16 | `apartment-bedroom.webp` | Residence 02 image B | same, `object-position:50% 50%` | 1672x941 | 265,652 | no | 149x194 at measurement time (small thumbnail state) | cover, 50% 50% | `"Bedroom with a deep red headboard and a window onto the trees"` |
| 17 | `apartment-bedroom-2.webp` | Residence 02 image C | same, `object-position:45% 50%` | 1672x941 | 70,280 | no | 149x194 (thumbnail state) | cover, **45% 50%** | `"Second bedroom with sheer curtains and an olive tree"` |
| 18 | `apartment-tour.webp` | "Step inside" tour teaser (golden hour) | `section#residence-02-tour` > `.tour-box.absolute.left-[4%].top-[12%].h-[70%].w-[9..]` > `img.tour-inner` | 1672x941 | 211,532 | no | 1071x778 | cover, 50% 50% | `"Residence 02 at golden hour, the living room glowing behind tall glass doors"` |

Alt-text rule for rebuild: content images get one full descriptive sentence (subject + notable material/light, no "image of"); decorative clouds and duplicated collage tiles get `alt=""`; slider slides may use `"<Brand> interior N"` as a fallback pattern but descriptive alt is better.

Notes on sizes: elements marked "mid-animation" are scroll-driven (GSAP/ScrollTrigger) so `getBoundingClientRect()` is not the layout size; consult `spec/01-layout` and `spec/03-motion`. `.about-tile` collage items are `hidden` (display none) below `lg` (1024px); at 375 px only the slider (`about-slide`, 330x325 on mobile because the box becomes ~square) is visible.

Rendered sizes at mobile (JS measurement at 375 emulation was unreliable because the pane stayed 1440 wide; the slider box on mobile read 330x325 and `tour-inner` 414x682, `rs-img` is full-bleed 100% x viewport height of its swiper item).

## Image reuse map (same file used several times, one network fetch)
`patio-front-clean`, `living-room-clean`, `kitchen-clean`, `exterior-garden-clean`, `top`, `nightSide` each appear twice (collage tile + slider slide). `nightSide` appears a third time in the Residence slider. Total distinct raster files referenced by the pages: **18** (17 in HTML + `hero5` via JS), 3,375,040 bytes combined (about 3.22 MiB).

## Canvas / WebGL media
- `/` has two `<canvas>`: (a) `canvas.marquee-canvas` (marquee text-through-image texture, `hero5.webp`), (b) an unclassed `canvas` (R3F/Three scene for the villa model `vill_draco.glb`; `style="display:block"`). Size at 1440x900: not measured stable; DPR-scaled to container.
- `/tour` has one R3F `<canvas style="display:block">` (300x150 default until the layout sizes it); 0 `<img>` elements on this route.

## 3D models, textures, audio (loaded at runtime from JS, HTTP 200, all cacheable static files)
Bytes = body downloaded via curl (Cloudflare compresses nothing for these binary types).
| File | Type | Bytes | Used by |
|---|---|---|---|
| `/assets/models/vill_draco.glb` | glb (Draco compressed) | 1,262,996 | `/` villa scene (`js/2xipugk_40kza.js` preloader, weight 4; also `js/265hf09g46rmm.js`) |
| `/assets/models/apartment.glb` | glb | 1,032,072 | `/tour` shell |
| `/assets/models/bed1.glb` `bed2.glb` `bed3.glb` | glb | 344,652 / 258,116 / 320,732 | `/tour` furniture variants (bed1 loaded by default) |
| `smallbed1.glb` `smallbed2.glb` | glb | 207,432 / 264,616 | `/tour` |
| `cupboard1.glb` `cupboard2.glb` | glb | 186,740 / 148,104 | `/tour` |
| `tv1.glb` `tv2.glb` `tv3.glb` | glb | 266,344 / 257,100 / 256,408 | `/tour` |
| `commode1.glb` | glb | 225,804 | `/tour` |
| `sofa1.glb` `sofa2.glb` | glb | 271,588 / 197,064 | `/tour` |
| `countertop.glb` `fridge.glb` `mirror-512.glb` | glb | 54,552 / 11,964 / 305,024 | `/tour` |
| `/assets/textures/sky/{px,nx,py,ny,pz,nz}.png` | PNG cube map (6 faces) | px 164,993; nx 159,461 (others similar) | `/tour` skybox (also referenced in the `/` bundle chunk) |
| `/assets/textures/ground/ground_05_{baseColor,normal_gl,ambientOcclusion,height,metallic,roughness}_1k.jpg` | 1k PBR JPGs | baseColor 340,426; normal 465,079 | `/tour` ground |
| `/assets/textures/yard/ground_tiles_21_{baseColor,normal_gl,ambientOcclusion,height,metallic,roughness}_1k.jpg` | 1k PBR JPGs | baseColor 122,774 | `/tour` yard |
| `/assets/audio/{balcony-tone,bedroom-tone,kitchen-tone,livingRoom-tone}.mp3` | MP3 ambience | 85,965 / 66,081 / 67,629 / 72,237 | `/tour` per-room ambience |
| `/assets/audio/{opening-door,close-door,footstep}.mp3` | MP3 SFX | 65,280 / 18,390 / 121,252 | `/tour` |
| `/assets/audio/lofi.mp3` | MP3 music | 935,227 | `/tour` background music |
| Draco decoder: `https://www.gstatic.com/draco/versioned/decoders/1.5.5/draco_wasm_wrapper.js` + `draco_decoder.wasm` (also `draco_decoder.js`) | third-party CDN | n/a | DRACOLoader path |

Observed `/tour` runtime fetches in 8 s: apartment.glb, bed1, smallbed1, cupboard1, tv1, commode1, sofa1, countertop, fridge, mirror-512 (the "1" variants), i.e. about 2.9 MB of models before first interaction.

## Icons / SVG (inline, no files)
- Two 16x16 inline SVGs (`viewBox="0 0 16 16" fill="none" aria-hidden="true"`) in the hero CTA buttons (arrow-type glyphs).
- react-icons (Feather-style, `stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em"`): `.rail-hint-icon text-xl` (drag/scroll hint, residence slider), `.rotate-hint-icon text-2xl` (rotate-device hint), `.tour-hint-icon text-xl` (tour teaser hint).
- `/tour`: `.lock-icon text-4xl` Phosphor-style filled icon (`fill="currentColor" stroke-width="0" viewBox="0 0 256 256"`), shown in the "Turn your device, sideways" portrait lock screen.
- Other inline-icon families come from the shared chunk `react-icons` (GenIcon). Sizes use `1em` with Tailwind `text-*` classes.
- Logo: **there is no logo image or SVG**. The wordmark is live text (`<a href="/" class="text-xl font-medium leading-none">STILL / FORM</a>` in the nav, `mix-blend-difference`, white). Rebuild with text or the client's SVG logo.
- No video elements; no `<picture>`/`<source>`; no `<iframe>`.
