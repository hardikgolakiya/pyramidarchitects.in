# Client-supplied assets needed (placeholders)

Brand: Pyramid Architects. Keep the same slot names so components stay unchanged. Until supplied, use neutral placeholders (solid `#EDE6D6` / grey gradient blocks with the target aspect ratio, or free stock) and set alt text to the slot description. Export WebP (quality ~80) plus AVIF if possible; keep each file under the suggested budget.

## Photography (raster)
| Slot (original file) | Needed content | Orientation | Master size | Min size | Format | Budget | Notes |
|---|---|---|---|---|---|---|---|
| Hero (`hero3.webp`) | Full-bleed exterior/signature project, dramatic light; image is darkened with `bg-black/35` overlay and white serif H1 over it | landscape 16:9 | 2560x1440 | 1672x941 | WebP | <=200 KB at 1672 | Centre-weighted subject; crop to cover from `100svh` so keep important content in the middle 60% (portrait phones show a centre slice) |
| Marquee texture (`hero5.webp`) | Strong high-contrast image that shows through large text in the marquee canvas; can be same project as hero | 16:9 | 2560x1440 | 1672x941 | WebP | <=200 KB | Used as WebGL texture: power-of-two not required, avoid alpha |
| Collage tiles + about slider (6 images: `patio-front`, `living-room`, `kitchen`, `exterior-garden`, `top`, `nightSide`) | 6 interior/exterior detail shots | wide (2.2:1 or 16:9); tiles are cropped by cover to roughly 1.2:1 (400x412), 1.4:1, 1.3:1, 1.2:1, 1.35:1, 1:1 | 1672x941 | 1522x688 | WebP | <=230 KB each | Subject centred; slider shows 662x342 (1.94:1) desktop and 330x325 (about 1:1) mobile |
| Slider slide 7 (`landscape-house-clean.webp`) | wide landscape of a project | 2.2:1 | 1672x756 | 1522x688 | WebP | <=180 KB | Slider only |
| Residence 01 slider (`side.webp`, plus `nightSide` reused) | project 1 hero shots; shown in a tall frame (682x836 desktop, full-bleed portrait on mobile) | source 4:3 or 16:9, cropped to ~0.8:1 portrait | 1920x1440 | 1448x1086 | WebP | <=150 KB | Supply at least 2 images; any added slide is a new `rs-img` item |
| Residence 02 trio (`apartment-living`, `apartment-bedroom`, `apartment-bedroom-2`) | 3 interior images of project 2 (living, bedrooms) | 16:9, cropped to portrait thumbs ~0.77:1 and a big 1.6:1 frame | 1920x1080 | 1672x941 | WebP | <=320 KB | Per-image `object-position` (50% 50%, 50% 50%, 45% 50%) tunable; need descriptive alt for each |
| Tour teaser (`apartment-tour.webp`) | warm, inviting interior with glass doors/golden hour | 16:9 | 1920x1080 | 1672x941 | WebP | <=220 KB | Cropped to about 1.38:1 (1071x778) desktop, 0.6:1 (414x682) mobile |
| Cloud overlays x4 (`cloud-1-cropped(-beige)`, `cloud-2-full(-beige)`) | transparent cloud/mist PNG-style art used for scroll transitions | cloud-1: 1440x550 (2.62:1), cloud-2: 1440x900 (1.6:1) | 2880x1100 / 2880x1800 | 1440x550 / 1440x900 | WebP with alpha (lossless/near-lossless) | <=150 KB / <=320 KB | Two colourways: tinted to match `#EDE6D6` (beige) and the second section colour; can be generated, not client-supplied (reusable) |
| Open Graph / social card | brand-led image with name | 1200x630 | 1200x630 | 1200x630 | JPG or PNG | <=300 KB | `/images/og.jpg`; the reference 404s here |

## Brand marks
| Asset | Spec |
|---|---|
| Wordmark/logo | Reference uses live text "STILL / FORM" (nav `text-xl font-medium`, white with `mix-blend-difference`, also in footer). Request a **single-colour SVG** (ideally `currentColor`-friendly, height ~20-24 px in nav, ~48 px+ in footer) plus a stacked/square mark. Fallback: text wordmark "PYRAMID ARCHITECTS" |
| Favicon master | square SVG + 512x512 PNG, transparent or brand background; derive `favicon.ico` (16/32/48, original ICO has 16-256), `icon.svg`, `apple-icon.png` 180x180, maskable 512 |
| Theme colour | confirm brand colour for `theme-color` (reference had none) |
| Social profile links | replace the original developer's four links (site, LinkedIn, X, Instagram) with client URLs |

## 3D / media (only if the client wants the immersive features)
| Asset | Spec |
|---|---|
| Hero 3D model (`vill_draco.glb`) | Draco-compressed GLB of the signature building, target <=1.3 MB, y-up, metres, origin at base; decoder from gstatic or self-hosted `/draco/` |
| Tour shell (`apartment.glb`) | GLB of the walkable interior, <=1.1 MB, baked lighting, named nodes for rooms; furniture GLBs (bed, sofa, tv, cupboard, commode, countertop, fridge, mirror, 1-3 variants) each <=350 KB |
| Textures | skybox 6 faces PNG (`px,nx,py,ny,pz,nz`, ~1024 px square); ground PBR set 1k (baseColor, normal_gl, AO, height, metallic, roughness) for two surfaces |
| Audio (optional) | ambience loops per room (balcony, bedroom, kitchen, living), door open/close SFX, footstep SFX, background loop; MP3, 64-128 kbps, <=120 KB per SFX/ambience, music <=1 MB; licence-cleared |
If no 3D assets exist, fall back to a static gallery for `/tour` and drop the three/Rapier chunks (saves ~1.1 MB JS on `/`, ~1.3 MB on `/tour`).

## Copy-adjacent assets
- Alt text for every photo (one sentence each, provided or approved by the client).
- Meta title/description/OG copy (see `favicon-meta.md`).
- Real contact details/address for JSON-LD and the footer.
- Domain name for `metadataBase`, sitemap, robots.
