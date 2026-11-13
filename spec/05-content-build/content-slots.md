# Content slots (Pyramid Architects)

Every text, image and link slot, with role, length budget and neutral placeholder copy. The reference site's own copy is intentionally not reproduced; only structure is described. Length budgets are derived from the reference layout (line counts / `max-w` / `ch`), so replacement copy should stay within them or the layout (masks, 2-3 line reveals, pinned stages) will break.

Conventions: `[P]` = placeholder provided, may ship as-is; `TODO-CLIENT` = must be supplied or approved by the client (Pyramid Architects) before launch. "Lines" = forced line breaks inside the masked reveal; each line is a separate animated element.

Global tokens: `{BRAND}` = "Pyramid Architects" (wordmark; TODO-CLIENT: confirm exact casing/lockup, e.g. "PYRAMID / ARCHITECTS"), `{TAGLINE}` = placeholder "Architecture, considered." (TODO-CLIENT).

## 1. Site-wide / SEO (layout metadata)
| Slot | Role | Constraint | Placeholder |
|---|---|---|---|
| `meta.title` (home) | `<title>` | <= 60 chars | `{BRAND} - Contemporary Architecture & Interiors` |
| `meta.description` | description | 120-160 | "Pyramid Architects is an architecture practice shaping residences through form, light and material. Explore selected work in an immersive 3D experience." [P, TODO-CLIENT approve] |
| `og.title` | share title | <= 70 | `{BRAND} - {TAGLINE}` |
| `og.description` | share text | <= 110 | "Residences shaped by architecture, light and material." [P] |
| `og.image` | share image | exactly 1200x630 | TODO-CLIENT (reference points at a localhost URL, a bug; use absolute `metadataBase` URL) |
| `og.siteName`, `og.locale` | | | `{BRAND}`, `en_US` (TODO-CLIENT locale, e.g. en_IN) |
| `canonical` | | absolute URL | `https://TODO-CLIENT-DOMAIN/` and `/tour` (reference wrongly canonicalises /tour to `/`; fix) |
| `tour.title` | `/tour` title | <= 60 | `{BRAND} - 3D Residence Tour` (reference title is the generic "3d Tour") |
| `tour.description` | | 120-160 | "Walk through a residence in 3D. Move, explore rooms and customise finishes." [P] |
| favicon / apple-icon | | .ico 256 + png | TODO-CLIENT (logo mark) |

## 2. Navigation (`SiteNav`)
| Slot | Role | Length | Placeholder | Target |
|---|---|---|---|---|
| wordmark | brand link | <= 18 chars at `text-xl` | `{BRAND}` (TODO-CLIENT logo/lockup; text fallback "PYRAMID / ARCHITECTS") | `/` |
| toggle label | menu button | 4 chars | MENU | - |
| item 1 | anchor | 1 word, uppercase | PROJECTS | `/#marquee-transition` |
| item 2 | anchor | 1 word | "RESIDENCE" or "STUDIO" (TODO-CLIENT: decide IA; the reference labels it "Stays" which does not suit an architecture firm) | `/#residence-02` |
| item 3 | route | 1 word | TOUR | `/tour` |
| item 4 | action | 1 word | CONTACT | opens ContactOverlay |

Max 4-5 items; each label <= 12 chars (right-aligned stack, `text-base font-bold uppercase`).

## 3. Preloader
| Slot | Placeholder |
|---|---|
| wordmark | `{BRAND}` |
| counter | 00-100 (computed) |
| tour preloader eyebrow | "3D Residence Tour" [P] |
| tour status 1 / 2 / error | "Preparing your tour experience" / "Entering the residence" / "Some files could not load" + button "Try again" [P, generic, may keep] |
| tour micro label | "ARCHITECTURE · INTERIORS · DETAILS" [P] |

## 4. Hero
| Slot | Role | Constraint | Placeholder |
|---|---|---|---|
| `hero.image` | full-bleed bg | landscape + must survive a 9:16 crop (`object-cover`), min 2400px wide, dark enough for white text (overlay is `bg-black/35`) | TODO-CLIENT hero photo/render |
| `hero.image.alt` | | <= 125 chars | "Exterior of a contemporary residence at dusk" [P] |
| `hero.title` | h1, 2 lines | each line <= ~14 chars at 5.64rem | "Architecture," / "Considered." [P] |
| `hero.cta1` | primary link | <= 20 chars, uppercase | "Explore Projects" -> `#marquee-transition` |
| `hero.cta2` | secondary | <= 24 chars | "Experience the Space" -> `#residence-02-tour` |
| `hero.meta[0..3]` | 4 uppercase micro labels (featured tag, type, year, "Explore") | each <= 20 chars | "Featured Project" / "Private Residence" / "2026" / "Explore" [P, TODO-CLIENT real project data] |
| `hero.bottomLine` | centred statement, 2 lines | each <= 34 chars | "Every building is more than its form." / "It is how light moves through it." [P] |

## 5. About
| Slot | Constraint | Placeholder |
|---|---|---|
| eyebrow | 1 word | About |
| caption (lg only, above gallery) | <= 24 chars, 1-2 lines serif | "A quieter way to build" [P] |
| headline | single sentence, 14-20 words (reference ~17; each word animates; keep <= 120 chars or it overflows the 100svh stage at `lg:text-[5.2vw]`) | "We design buildings where architecture, light and material come together to shape a quieter way of living." [P, TODO-CLIENT brand voice] |
| supporting | <= 200 chars, `max-w-[350px]` | "Pyramid Architects is a design practice focused on considered spaces, natural light, honest materials and the experience of living within them." [P] |
| gallery tiles x6 (lg) | decorative, alt "" ; aspect varies per tile (see layout spec) | TODO-CLIENT 6 project images |
| carousel slides x7 | alt <= 100 chars; reference uses generic "interior N"; replace with real descriptions | TODO-CLIENT 7 images; alt placeholder "Pyramid Architects project image {n}" |
| cloud x2 | decorative, transparent WebP, beige tint matching bg | shared asset, TODO-CLIENT or stock |
| prev/next aria-labels | | "Previous image", "Next image" |

## 6. Architecture explorer (marquee + 3D model)
| Slot | Constraint | Placeholder |
|---|---|---|
| marquee text | repeated 24x, short; <= 16 chars (at clamp 8rem) | `{BRAND}` or "PYRAMID / ARCHITECTS" |
| prompt | <= 18 chars | "Scroll to enter" |
| stage eyebrow | 1 word | "Structure" |
| stage titles x7 | <= 18 chars (`lg:text-6xl`) | "Full View", "Walls", "Floor", "Roof", "Pillars", "Stairs", "Windows & Doors" [P: generic building parts] |
| stage descriptors x7 | <= 40 chars, uppercase | "Complete building overview"; others TODO-CLIENT (real specs). Neutral pattern: "Primary structural system", "Finished floor surface", "Roof assembly", "Load-bearing columns", "Main staircase", "Glazing and frames" |
| counter | `01` ... `07`, "of 07" | computed |
| drag hint | | "Drag to rotate" |
| rail dot titles/aria | = stage titles (`Show {title}`) | |
| 3D model | villa GLB, Draco, mesh groups named per stage (walls/outerwalls, floor, toproof/outerroof, pillers, stairs..., windowframe...) | TODO-CLIENT model (or commission); placeholder: any Draco GLB with the same 6 named groups |

## 7. Residence slides (2 slides)
| Slot | Constraint | Placeholder |
|---|---|---|
| headline x2 | exactly 3 lines each, each <= 16 chars | S1: "A study in" / "form, light" / "and proportion."; S2: "Rooms that" / "hold the" / "evening light." [P] |
| copy x2 | <= 120 chars, `max-w-[22rem]` | "Deep windows and honest materials let the day end slowly, with warm light settling into each room." [P] |
| counter | "01"/"02" | computed |
| panel bg/fg | pair per slide | S1 `#2A2725` / `#FFFFFF`; S2 per design tokens |
| images x2 | portrait-ish (mobile bottom half; desktop tall half-width), `object-cover` | TODO-CLIENT; alts "Exterior of the residence", "Interior lit at night" [P] |

## 8. Cloud transition
| Slot | Constraint | Placeholder |
|---|---|---|
| eyebrow | <= 14 chars | "Project 02" [P] |
| heading | 2 lines, max 15ch wide, serif | "Not every space" / "needs to be grand." [P] |
| clouds x2 white | decorative | shared asset |
| aria-label | | "Transition between projects" |

## 9. Second project stage (apartment)
| Slot | Constraint | Placeholder |
|---|---|---|
| intro eyebrow | <= 14 chars | "Project 02" |
| intro headline | 2 lines <= 14 chars each | "A different" / "way to live." [P] |
| per room x3: eyebrow | <= 20 chars | "The living area", "The bedroom", "The second room" [P] |
| per room: headline | 2 lines, each <= 16 chars | "Everything" / "within reach."; "Slow mornings," / "softly lit."; "Room for" / "one more." [P] |
| per room: body | <= 140 chars, `max-w-[24rem]` | "A considered space for everyday living, with warm materials and quiet detail." [P] |
| per room: tags | 2-4 items joined by " · ", <= 50 chars, uppercase | "Living area · Kitchen · Bathroom" etc. [P, TODO-CLIENT true programme] |
| images x3 | landscape ~3:2, min 2000px; object-position per image configurable | TODO-CLIENT; alt <= 125 chars describing room |
| label | | "Inside the project" + counter `01 / 03` |

## 10. Tour teaser
| Slot | Constraint | Placeholder |
|---|---|---|
| image | 16:10 landscape, large (box up to 62vw x 72vh then scale-expands) | TODO-CLIENT render/photo; alt <= 125 chars |
| eyebrow | <= 24 chars | "Explore the Project" |
| h2 | 1-2 short words/line | "Step inside." [P] |
| body | <= 170 chars, `max-w-md` | "Move beyond the drawing and experience the space from within. Explore its rooms, discover the details and find your own way through." [P] |
| controls legend | 3 items: keys `W A S D` Move, `E` Interact, `Q` Customize | keep (functional) |
| CTA | <= 26 chars | "Enter the Tour ->" -> `/tour` |

## 11. Footer
| Slot | Constraint | Placeholder |
|---|---|---|
| top wordmark | link `/` | `{BRAND}` |
| top-right tagline | md+ only, <= 28 chars | `{TAGLINE}` |
| headline | serif, `max-w-[12ch]`, <= 2 lines at 7rem | `{TAGLINE}` |
| subline | <= 70 chars | "Residences shaped by architecture, light and material." [P] |
| Explore column | label + 2-4 links (<= 18 chars) | "Explore": Project 01 -> `#residence-slides`; Project 02 -> `#residence-02` |
| Follow column | label + up to 5 links (Website, LinkedIn, X, Instagram, Contact) | TODO-CLIENT all URLs. The reference points at an individual developer's personal profiles: do not carry over |
| copyright | | "© Pyramid Architects {year}" [P, year dynamic] |
| availability line | <= 50 chars | "Now accepting new commissions" [P] |
| availability pill | <= 16 chars, green pulse dot | "Open to enquiries" [P]; opens ContactOverlay |
| back to top | | "Back to top" -> `#top` |

## 12. Contact overlay
| Slot | Constraint | Placeholder |
|---|---|---|
| wordmark | | `{BRAND}` |
| status pill | <= 24 chars | "Open to new projects" [P] |
| h2 line 1 / line 2 | 2 masked lines, each <= 28 chars (second at 50% opacity) | "Every project begins" / "with a conversation." [P] |
| intro | <= 110 chars | "Planning a residence, a renovation or a new idea? Tell us about it and we will get back to you." [P] |
| email | functional | TODO-CLIENT (e.g. hello@pyramidarchitect.in; domain taken from the project folder name, confirm) |
| copy button | 2 states | "Copy" / "Copied" |
| close button / aria | | "Close" / "Close contact" |
| esc hint | | "Esc" |
| card 1 | label <= 14, note <= 28, title <= 28, subject <= 60 | "New project" · "Residential, commercial, interiors" · "Start a project" · subject "New project enquiry" [P] |
| card 2 | | "Careers" · "Roles and internships" · "Join the practice" · subject "Career enquiry" [P] |
| social pills | label + icon + URL | TODO-CLIENT (Website, LinkedIn, Instagram, optional Behance/Houzz/X) |
| overlay tagline | `hidden sm:block` | `{TAGLINE}` |

## 13. /tour page
| Slot | Placeholder |
|---|---|
| rotate warning eyebrow | "Landscape mode" |
| rotate warning heading (2 lines) | "Turn your device," / "sideways." |
| rotate warning body | "This 3D interior experience is built for landscape mode." |
| back link | "Back to site" |
| zone names (internal) | living-room, balcony, bedroom-1, bedroom-2, kitchen |
| interact hint text | "Press E to interact" / "Press Q to customize" (exact strings not in static HTML; verify in the live app) |
| customization panel | title "Customization"; tabs "Walls" "Floor"; sections "Bed Style", "Small Bed Style", "Cupboard Style", "TV Unit Style", "Sofa Style"; footer "Walk away to close" |
| wall swatches (5) | Clean White `#F5F5F0`, Warm Cream `#F2EBD9`, Soft Beige `#D8CFC4`, Olive Green `#7D8C5A`, Dusty Blue `#6B8CAE` (functional config; keep or restyle) |
| floor swatches (5) | Light Timber `#DFCDB5`, Natural Birch `#EADBC8`, Terracotta `#C8A896`, Muted Oak `#B8A890`, Deep Slate `#3A4F60` |
| 3D assets | TODO-CLIENT: apartment GLB (named meshes), furniture GLBs, audio (ambient tones per zone, footstep, door open/close, lo-fi bed), sky cubemap, ground textures; CC0 stand-ins acceptable |

## 14. Image requirement summary
Hero 1; About tiles 6 + slides 7 (the reference reuses the same images, so ~7 unique); Residence slides 2 (one is reused from About); Apartment 3; Tour teaser 1; clouds 4 (2 beige, 2 white); OG 1. Total unique client images about 14-16. Formats WebP (+ AVIF optional); see `spec/04-assets-seo`.
