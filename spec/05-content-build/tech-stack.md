# Tech stack

## Detected in the reference (evidence)
| Layer | Finding | Evidence |
|---|---|---|
| Framework | Next.js App Router (RSC payload, `x-nextjs-prerender`, `/_next/static/chunks`), Turbopack build (`turbopack-*.js`, numeric module ids); Next version string `16.3.8` appears in a chunk (treat as Next 16.x) | raw/js |
| React | React 19 with **React Compiler** output (`react/compiler-runtime` `c(n)` memo caches, `Symbol.for("react.memo_cache_sentinel")`) | chunks |
| Styling | Tailwind CSS v4-style single compiled CSS (`--font-mono` etc. theme vars, arbitrary variants like `[@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:...`) | raw/css |
| Fonts | `next/font/google`: Familjen Grotesk (var weight 400-700) as `--font-*` sans, Instrument Serif as serif; html gets both `variable` classes | index.html |
| Animation | **GSAP 3.15.0 + ScrollTrigger** (pins, scrub, masks); **Lenis** smooth scroll; CSS transitions for hovers; Intl.Segmenter-based custom text splitter (no SplitText plugin found); `prefers-reduced-motion` handled in the contact overlay | chunks |
| 3D | three.js r186, `@react-three/fiber`, `@react-three/drei` (`useGLTF`, Environment, KTX2/Draco loaders), `@react-three/rapier` (physics, WASM), camera-controls (`setLookAt(..., true)` for stage camera moves), three `PointerLockControls`; Zustand-style store (`createStore` + `useSyncExternalStore`); virtual joystick (nipple) | chunks |
| Icons | `react-icons` (GenIcon; Feather-style paths for copy/check/arrow, Phosphor-style rotate icon, brand icons) | chunks |
| Images | static `/assets/images/*.webp` referenced with plain `<img>` and `<link rel=preload as=image>` (not `next/image`) | index.html |
| Audio | `/assets/audio/*.mp3`, HTMLAudio / WebAudio, ambient zones | tour chunk |
| Backend / forms | none | see forms-and-links.md |
| Hosting | served via Cloudflare in front (`nel: cf-nel`), Next on a Node/edge host with `s-maxage=31536000` full-route cache; Vercel not confirmed | headers |

## Recommended stack for Pyramid Architects
| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript strict | `reactCompiler: true` in `next.config.ts` (matches reference) |
| Package manager | pnpm | lockfile committed |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"; @theme {...}`) + CSS variables from `spec/02-design-system/tokens.css` | keep arbitrary-variant for landscape phones: define `@custom-variant ls (@media (orientation: landscape) and (max-height: 500px) and (max-width: 1023px));` and use `ls:` (name used by the design-system spec) instead of the long bracket string |
| Fonts | `next/font/google`: `Familjen_Grotesk` (`variable:'--font-sans'`, weights via variable axis, `display:'swap'`, subsets latin) and `Instrument_Serif` (`variable:'--font-serif'`, weight 400, italic optional); expose in `@theme inline { --font-sans: var(--font-sans); ... }` | open licence, ok to use. Client may later swap brand fonts |
| Animation | `gsap@^3.15` + `ScrollTrigger` (+ `@gsap/react` `useGSAP` for cleanup), `lenis@^1` | register plugins once in a client util; `ScrollTrigger.config({ ignoreMobileResize: true })`; kill triggers on unmount; `gsap.matchMedia()` for responsive pins and reduced motion |
| 3D | `three@~0.186`, `@react-three/fiber@^9`, `@react-three/drei@^10`, `@react-three/rapier@^2`, `camera-controls` (drei `CameraControls`), `zustand@^5`, `nipplejs` for touch | load via `next/dynamic(..., {ssr:false})`; transpile packages not needed |
| Asset pipeline | `gltf-transform` CLI to Draco-compress GLBs (`draco` + `webp` textures), `sharp` for images, `ffmpeg` for audio (mp3 ~96kbps) | scripts in `/scripts` |
| Images | Use `next/image` for in-flow images where possible (priority on hero); for GSAP-pinned full-bleed images a plain `<img>`/`Image fill` with `sizes="100vw"` both work; keep `alt` per content-slots | `images.formats: ['image/avif','image/webp']` |
| Icons | `react-icons` or inline SVGs (6 icons only: copy, check, arrow-up-right, rotate, prev, next + socials) | inline SVG preferred (smaller) |
| State | Zustand for tour store; React context for contact overlay + preloader | |
| Forms (optional) | `zod`, `resend`, Route Handler `/api/contact` | only if client wants a form |
| SEO | `metadata` API, `app/sitemap.ts`, `app/robots.ts`, `opengraph-image` or static OG JPG, JSON-LD `Organization`/`ArchitecturalService` (TODO-CLIENT address, phone) | |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights` (optional) | |
| Lint/format | ESLint (next config), Prettier + `prettier-plugin-tailwindcss`, Husky optional | |
| Tests | Playwright smoke (home loads, hash nav, contact overlay open/close/copy, /tour loads canvas) | build-order acceptance checks |
| Deployment | Vercel (see below) | |

## Versions to pin (suggested at time of writing)
next 16.x, react/react-dom 19.x, tailwindcss 4.x, gsap 3.15.x, lenis 1.x, three 0.186.x (pin exactly; R3F/drei are sensitive), @react-three/fiber 9.x, @react-three/drei 10.x, @react-three/rapier 2.x, zustand 5.x. Verify compatibility on install; if peer mismatch, drop to fiber 9 / drei 10 / three 0.17x.

## Vercel deployment
- Import repo, framework preset Next.js, Node 20+ or 22 LTS, pnpm.
- Static assets: Vercel serves `/public` from the CDN with immutable caching if filenames are hashed; for unhashed `/assets/*` set headers in `next.config.ts` -> `headers()` : `Cache-Control: public, max-age=31536000, immutable` for `/assets/models/*`, `/assets/audio/*`, `/assets/textures/*`, `/assets/images/*` (use versioned filenames when replacing) and `Content-Type: application/octet-stream` is fine for `.glb`.
- File size: Vercel static file limit is not an issue for GLBs under ~50MB; keep each GLB < 10MB (Draco) and total /tour payload < ~25MB; consider hosting large media on Vercel Blob / R2 if exceeding.
- Rewrites: none. Redirects: `www` -> apex (domain TODO-CLIENT), enforce HTTPS (default).
- Env vars: `NEXT_PUBLIC_SITE_URL` (metadataBase), optional `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.
- Preview deployments per PR; production on `main`. Domain: TODO-CLIENT (folder name suggests pyramidarchitect.in).
- Reference's static prerender (`s-maxage=1y`) matches Vercel static pages: both routes are static (no dynamic APIs) -> keep `export const dynamic = 'force-static'` implicit.
- Headers: add `Permissions-Policy: autoplay=(self)`; `Cross-Origin-Opener-Policy` not required. Rapier WASM is bundled inline; no special COEP.
