# Pyramid Architects – design spec (reference: stillform.homes)

Start with `05-content-build/build-order.md`, then read the folders in order.

| Folder | Contents |
|---|---|
| `01-layout/` | routes, 8 home-page blocks, DOM/class trees, pin distances, breakpoints (md 768, lg 1024, `ls` landscape-phone) |
| `02-design-system/` | fonts (Familjen Grotesk, Instrument Serif), type scale, colours, radii, z-index, `tokens.css`, `tokens.json` |
| `03-motion/` | GSAP/ScrollTrigger/Lenis timings, `#marquee-transition` (incl. shader), hero, loader, hovers, reduced motion |
| `04-assets-seo/` | image/font inventory, meta/SEO, performance, `placeholder-assets.md` (client assets needed) |
| `05-content-build/` | components, content slots (placeholder copy), `/tour` page, stack, project tree, build order, client checklist |
| `SHARED.md` | agent coordination board |
| `raw/` | downloaded reference HTML/CSS/JS (reference only, not for shipping) |

## Known gaps and decisions
- Mid-scroll animation frames and some `/tour` details (hint strings, camera height, whether Contact overlay mounts on `/tour`) were not verified live.
- Swiper: assets-seo lists it, motion found no Swiper (slides are GSAP-animated divs). Treat as not needed.
- Reference bugs not to copy: og:image on localhost, `/tour` canonical to `/`, `/tour` title "3d Tour", bare `#hash` nav links on `/tour`.
- Reference 3D villa model, textures, audio, photos and the original developer's email/socials must not be reused; client supplies replacements (see `05-content-build/client-inputs-checklist.md`).
- Big decision for the client: keep the 3D viewer and `/tour` walkthrough (needs 3D models) or replace with image/video sections.
