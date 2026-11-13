# Recommended project structure (Next.js App Router)

```
pyramidarchitect/
├─ app/
│  ├─ layout.tsx                 # fonts (next/font), <html class="... h-full antialiased">, body "min-h-full flex flex-col", global metadata, Providers
│  ├─ page.tsx                   # "/" composes home sections
│  ├─ tour/
│  │  ├─ page.tsx                # "/tour" (metadata + <TourExperience/> dynamic ssr:false)
│  ├─ globals.css                # @import "tailwindcss"; @theme; tokens; keyframes; .rotate-device-warning etc.
│  ├─ sitemap.ts                 # / and /tour
│  ├─ robots.ts
│  ├─ icon.png / favicon.ico / apple-icon.png    # TODO-CLIENT logo mark
│  ├─ opengraph-image.jpg        # 1200x630 TODO-CLIENT
│  └─ api/contact/route.ts       # OPTIONAL enquiry endpoint
├─ components/
│  ├─ providers/
│  │  ├─ Providers.tsx           # client: SmoothScroll + ContactProvider + PreloaderProvider
│  │  ├─ SmoothScroll.tsx        # Lenis + ScrollTrigger sync
│  │  └─ ContactProvider.tsx
│  ├─ layout/
│  │  ├─ SiteNav.tsx
│  │  ├─ SiteFooter.tsx
│  │  ├─ Preloader.tsx
│  │  ├─ ContactOverlay.tsx
│  │  ├─ ContactCard.tsx
│  │  └─ SocialPill.tsx
│  ├─ ui/
│  │  ├─ Reveal.tsx              # masked line/char/word reveal (+ splitText util)
│  │  ├─ RollLink.tsx            # data-hover-reveal text-roll
│  │  ├─ ArrowLink.tsx
│  │  ├─ PillButton.tsx
│  │  ├─ PulseHint.tsx
│  │  ├─ Kbd.tsx
│  │  └─ CloudLayer.tsx
│  ├─ sections/                  # one folder per home section: view + animation hook
│  │  ├─ hero/            Hero.tsx, useHeroAnimation.ts
│  │  ├─ about/           About.tsx, AboutCarousel.tsx, useAboutTimeline.ts
│  │  ├─ explorer/        ArchitectureExplorer.tsx, MarqueeTrack.tsx, StageRail.tsx, StageHUD.tsx, VillaModel.tsx, ExplorerScene.tsx, stages.ts (camera presets + groups), useExplorerTimeline.ts
│  │  ├─ residence-slides/ ResidenceSlides.tsx, TextPanel.tsx, useSlidesTimeline.ts
│  │  ├─ cloud-transition/ CloudTransition.tsx
│  │  ├─ apartment/       ApartmentStage.tsx, useApartmentTimeline.ts
│  │  └─ tour-teaser/     TourTeaser.tsx, ControlsLegend.tsx
│  └─ tour/
│     ├─ TourExperience.tsx      # client root, dynamic import target
│     ├─ TourCanvas.tsx
│     ├─ Apartment.tsx           # GLB + variants
│     ├─ ZoneSensor.tsx
│     ├─ PlayerController.tsx    # keyboard + pointer lock + joystick
│     ├─ Joystick.tsx
│     ├─ Crosshair.tsx
│     ├─ InteractHint.tsx
│     ├─ CustomizationPanel.tsx, StylePicker.tsx, Swatches.tsx
│     ├─ BackToSite.tsx
│     ├─ TourPreloader.tsx
│     ├─ RotateDeviceWarning.tsx
│     ├─ audio.ts                # AudioManager
│     └─ store.ts                # zustand store
├─ content/                      # ALL copy + data, typed; no copy inside components
│  ├─ site.ts                    # brand, tagline, email, socials, nav items, metadata
│  ├─ home.ts                    # hero, about, stages, slides, apartment rooms, teaser, footer
│  ├─ tour.ts                    # labels, palettes (walls/floor), furniture options, zones
│  └─ types.ts
├─ lib/
│  ├─ gsap.ts                    # register plugins, matchMedia helpers, reduced-motion util
│  ├─ splitText.ts
│  ├─ cn.ts                      # clsx + tailwind-merge
│  └─ env.ts
├─ hooks/                        # useReducedMotion, useMediaQuery, useLockScroll, useFocusTrap
├─ public/
│  ├─ assets/
│  │  ├─ images/                 # *.webp (see spec/04-assets-seo)  TODO-CLIENT
│  │  ├─ models/                 # villa.glb, apartment.glb, furniture/*.glb (Draco)
│  │  ├─ textures/               # sky/{px,nx,py,ny,pz,nz}.png, ground/, yard/
│  │  └─ audio/                  # tones, footstep, doors, lofi
│  ├─ draco/                     # decoder files (optional, else CDN)
│  └─ fonts/                     # only if self-hosting extra brand fonts
├─ scripts/                      # optimise-images.mjs, optimise-glb.sh
├─ tests/e2e/                    # playwright specs
├─ next.config.ts                # reactCompiler, images, headers (cache for /assets)
├─ postcss.config.mjs            # @tailwindcss/postcss
├─ tsconfig.json
├─ eslint.config.mjs
├─ package.json
└─ README.md
```

## Conventions
- **Content separation**: components take props typed from `content/*.ts`; `TODO-CLIENT` strings live only there (greppable: `// TODO-CLIENT`).
- **Server vs client**: `app/page.tsx` and `app/tour/page.tsx` are server components that import client sections. Anything with GSAP/three is `'use client'`. 3D (`VillaModel`, `TourExperience`) is loaded with `next/dynamic({ ssr:false })` inside a client wrapper.
- **Animation hooks**: each section owns one hook (`use<Section>Timeline`) built with `useGSAP({ scope: ref })`, wrapped in `gsap.matchMedia()` with three conditions: `(min-width:1024px)`, `(max-width:1023px)`, `(prefers-reduced-motion: reduce)`. Refs/classes (`.about-tile`, `.rs-line`, `.ap-piece`, `.footer-reveal`, ...) keep the reference class names so motion spec snippets can be dropped in.
- **IDs preserved**: `top, about, marquee-transition, residence-slides, residence-02, residence-02-tour, contact, site-menu`.
- **Stacking**: z-index ladder from design-system spec; sticky hero `z-0`, sections `z-20/30`, nav `z-50`, preloader `z-[200]`, tour preloader `z-[300]`, contact overlay `z-[999]`, rotate warning `z-[9999]`.
- **Path alias**: `@/*` -> project root.

## `next.config.ts` skeleton
```ts
import type { NextConfig } from 'next';
const immutable = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }];
const config: NextConfig = {
  reactCompiler: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return ['images', 'models', 'audio', 'textures'].map((d) => ({
      source: `/assets/${d}/:path*`, headers: immutable,
    }));
  },
};
export default config;
```

## `app/layout.tsx` skeleton
```tsx
import { Familjen_Grotesk, Instrument_Serif } from 'next/font/google';
const sans = Familjen_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap' });
// <html lang="en" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
//   <body className="min-h-full flex flex-col"><Providers><SiteNav/>{children}</Providers></body>
```
