# Client inputs checklist (Pyramid Architects)

Everything below must come from the client (or be explicitly approved as a placeholder). Tick off before the content swap-in step (build-order #27). Items tagged **BLOCKER** stop launch; others can ship with placeholders.

## Identity
- [ ] **BLOCKER** Final trading name and styling (Pyramid Architects / PYRAMID / ARCHITECTS / other), legal name for footer.
- [ ] **BLOCKER** Logo: wordmark and mark, SVG, light and dark versions, minimum sizes; favicon source (>= 512px square) and apple-touch icon.
- [ ] Brand colours (if different from the reference's cream `#EDE6D6` / charcoal `#2A2725` palette) and any brand fonts or licences (otherwise Familjen Grotesk + Instrument Serif).
- [ ] Tagline / hero statement (reference-style two-line headline) and brand voice notes.
- [ ] **BLOCKER** Domain (folder name suggests pyramidarchitect.in), DNS access, preferred www/apex, email provider.

## People and practice
- [ ] Founders / principals: names, titles, short bios (60-100 words), portraits (the reference has no team section; confirm whether one is wanted, and if so a new section is needed).
- [ ] Practice description for About (headline sentence <= 120 chars + 1-2 sentence supporting copy <= 200 chars).
- [ ] Services list, awards, press, registrations (COA number etc.), year established.
- [ ] Office address, map link, phone, working hours (for footer/JSON-LD).

## Contact and social
- [ ] **BLOCKER** Enquiry email address (and optional second inbox for careers) and subjects for the two mailto cards.
- [ ] Contact card labels (new project / careers or other categories).
- [ ] Social links: website, LinkedIn, Instagram, X, Behance/Houzz, YouTube (the reference's links are an individual's, never reuse).
- [ ] Decision: keep mailto-only or add an enquiry form (fields, destination inbox, spam protection, privacy policy URL).
- [ ] Availability message wording ("accepting commissions" etc.) and whether to show the green pulse status.

## Projects and imagery
- [ ] **BLOCKER** Hero image (exterior/interior, min 2400px wide, works in portrait crop).
- [ ] About: 7 project images (6 tiles + carousel; same set allowed), approved alt text.
- [ ] Featured project 1: 2 images for the slides + 2 headline/copy blocks + hero meta (type, year, status).
- [ ] Featured project 2 ("second residence"): 3 room images + room names, headlines, one-line descriptions, tag lists, programme (bedrooms, areas).
- [ ] Tour teaser image (landscape render/photo of the toured project).
- [ ] Image credits (photographer/renderer) and usage rights for all of the above; permission to publish client projects.
- [ ] Cloud overlay images (2 beige, 2 white transparent): supply, or approve generation/stock.
- [ ] OG/social image 1200x630.

## 3D assets (largest dependency; decide early)
- [ ] Decide scope: reuse the 3D explorer + walkthrough concept for a real Pyramid project, or substitute simpler content (e.g., turntable images). The reference model and furniture are the original author's assets and must not be reused.
- [ ] Explorer building model: GLB with named groups (walls, floor, roof, pillars, stairs, windows/doors), < 8MB after Draco, source file ownership/licence.
- [ ] Per-stage descriptor text (7 lines, <= 40 chars) with real specifications.
- [ ] Walkthrough apartment/house model: GLB with collision-friendly geometry, named rooms/zones, floorplan for sensor placement.
- [ ] Furniture variants (beds, sofa, TV unit, cupboards, etc.) or reduced list; material/finish palettes (walls, floor) with names and hex values.
- [ ] Audio: ambient tones per room, footsteps, door open/close, background music, all licensed.
- [ ] Sky/environment textures, ground textures (CC0 acceptable).
- [ ] Interaction copy: hint strings for E / Q prompts.

## Legal and analytics
- [ ] Privacy policy and cookie policy pages (and consent banner needs by region); terms if any.
- [ ] Analytics choice and IDs (GA4 / Plausible / none), Google Search Console and Bing verification.
- [ ] Copyright line wording and year handling.
- [ ] Accessibility statement (optional).

## Approvals / decisions
- [ ] Nav labels and information architecture (reference: Residence / Stays / Tour / Contact; "Stays" suits hospitality, not architecture).
- [ ] Section list: keep all 7 home sections or drop/replace (e.g., add Projects grid, Team, Journal).
- [ ] Languages/locales (en only vs en-IN, Hindi, etc.).
- [ ] Browser/device support targets and performance budget for the 3D routes.
- [ ] Hosting account (Vercel team), billing, who owns the repo.
