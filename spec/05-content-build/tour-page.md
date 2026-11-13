# `/tour` page

## Purpose
A full-screen, first-person 3D walkthrough of an apartment, reached from the home page teaser ("Enter ... ->") and the nav "Tour" item. It is a showcase experience, not a content page: no forms, no embeds, no text content beyond HUD/UI labels. Statically prerendered (`x-nextjs-prerender: 1`, HTTP 200, `s-maxage=31536000`), but the experience is entirely client-side (R3F canvas hydrates after load).

Metadata in the reference is weak (title "3d Tour", description "Explore a 3D tour of a modern apartment.", canonical wrongly `/`). Rebuild with a dedicated title, description and canonical `/tour` (see content-slots.md).

## DOM / z-order (from `raw/tour.html`)
1. `SiteNav` (fixed, z-50, mix-blend-difference) - same component as home.
2. `RotateDeviceWarning` (`fixed inset-0 z-[9999] bg-blue-900`, `role=alert`) - visible only for portrait touch devices.
3. Root `div.w-screen.h-screen.flex`:
   - `TourPreloader` (`fixed inset-0 z-[300]` charcoal `#2A2725`, cream text).
   - HUD layer `absolute inset-0 z-50 pointer-events-none`: `Crosshair` (centred 6px white dot) + `BackToSite` pill (`pointer-events-auto`, bottom-left) + (when active) `InteractHint` + `CustomizationPanel`.
   - Canvas wrapper `position:relative;width:100%;height:100%;overflow:hidden;pointer-events:auto` -> `<canvas style="display:block">`.
4. Hidden aria-hidden helper div at end of body (`hidden`, Next announcer).

## Sections / states
| State | What the user sees | Exit condition |
|---|---|---|
| Loading | TourPreloader: wordmark, "Private Residence Tour" label, percentage `00..100` (tabular), 3px progress bar (scaleX), status text, micro-label `ARCHITECTURE · INTERIORS · DETAILS` (>= sm) | all GLB/audio/texture assets loaded (drei `useProgress`) |
| Load error | status text "Some files could not load" + "Try again" (reload) | click |
| Ready (desktop) | click canvas to engage pointer lock (look with mouse); WASD move; E interact; Q customize; Esc releases lock | |
| Ready (touch, landscape) | left-half virtual joystick (nipple) moves, right-half drag looks; HUD buttons for interact/customize | rotate to landscape (else warning overlay) |
| Near interactable | crosshair scales to 2.5x, opacity 100; hint shown (`isHintVisible`, `activeInteraction`) | move away |
| Customizing | `CustomizationPanel` open (`isPanelOpen`); tabs depend on what the user is looking at: wall -> colours only; floor -> colours only; wall+floor -> Walls/Floor segmented tabs; furniture -> style picker (bed/small bed/cupboard/TV unit/sofa) | "Walk away to close" (panel closes when the player leaves proximity) or Q again |
| Exit | "Back to site" link -> `/` | |

## Controls (also shown in home teaser legend)
| Input | Action |
|---|---|
| W A S D | move (Rapier capsule/kinematic controller, collides with trimesh of the apartment; footstep audio while moving) |
| Mouse | look (PointerLockControls) |
| E | interact (open/close doors - door sounds; trigger hint-bound actions) |
| Q | open/close customization for the object/surface in view |
| Esc | release pointer lock / close panel |
| Touch | virtual joystick + look drag; keyboard hints hidden |

## Scene composition (recoverable facts)
- Physics: `@react-three/rapier` `<Physics>`; static `RigidBody type="fixed" colliders="trimesh"` for the apartment shell; a fixed 20x0.05x20 cuboid ground collider plus a 9x0.1x9.5 floor slab (`#fcfcfc`, roughness .9) at `[1, 2.8, 1.3]`.
- Lighting: one `directionalLight` at `[50,50,25]`, intensity 2, `castShadow`, shadow map 2048, shadow camera +-20; sky via cube environment (`/assets/textures/sky/{px,nx,py,ny,pz,nz}.png`, `background`).
- Zone sensors (named boxes with position/args): `living-room` `[0.3,0,-1.6]` `[3,1,2]`; `balcony` `[4.4,0,-1.6]` `[.5,1,1.5]`; `bedroom-1` `[2.9,0,1.5]` `[2,1,1]`; `bedroom-2` `[2.9,0,4.2]` `[2,1,1]`; `kitchen&uility` `[-1.8,0,2]` `[.5,1,1.5]`. Entering a zone crossfades its ambient tone (`*-tone.mp3`).
- Assets (names only; supply your own): `apartment.glb`; furniture `bed1-3, smallbed1-2, cupboard1-2, tv1-3, sofa1-2, commode1, countertop, fridge, mirror-512` (.glb); textures `ground/ground_05_*_1k.jpg` (AO, baseColor, height, metallic, normal_gl, roughness) and `yard/ground_tiles_21_*_1k.jpg`; audio `balcony-tone, bedroom-tone, kitchen-tone, livingRoom-tone, footstep, opening-door, close-door, lofi` (.mp3).
- State store (Zustand-style): see component-inventory.md 3.
- Colour defaults: walls `#F5F5F0`, floor `#DFCDB5`. Customizable materials: walls, floor; swappable furniture variants.
- Camera: first-person; FOV choice and eye height TODO-measure (`spec/01-layout` / `spec/03-motion` may cover; not in static HTML).

## Customization panel (UI)
- Card `rounded-2xl border-gray-200 bg-white p-5 pt-3 min-w-xs shadow-[0_-8px_40px_-10px_rgba(0,0,0,.15)]`, centred column.
- Title "Customization" `text-lg font-bold tracking-tight text-gray-900`.
- Segmented control (Walls | Floor): container `rounded-xl border bg-gray-100 p-1`, active button `bg-white shadow-sm ring-1 ring-black/5`.
- Swatch row `flex gap-4`: 48px circles with `border-black/10 shadow-inner`; selected: ring `inset-[-4px] border-2 border-amber-400` + glow `0 0 0 3px rgba(251,191,36,.25)`, label amber-700; others scale 1.1 on hover. Label `text-[10px] font-medium max-w-[4.5rem] truncate`.
- Style group (`StylePicker`): heading `text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400` with 12px amber rule; row of `flex-1 rounded-xl` option buttons (bed1/bed2/bed3 etc.; thumbnail or label, exact visual TODO verify live).
- Footer: pulsing amber dot + "Walk away to close" (`text-[10px] uppercase tracking-[0.14em] text-gray-300`).

## CTAs / links
- Exits: `BackToSite` `<a href="/">` and the nav (brand `/`, Tour `/tour`, Residence/Stays hash anchors which are bare hashes on /tour and so resolve to nothing; recommended `/#...`). The nav also shows a Contact item; whether the overlay is mounted on /tour was not verified (static HTML cannot show it). Recommended: mount ContactProvider/Overlay in the root layout so it works on both routes.
- No forms, no iframes/embeds, no analytics scripts detected.

## Performance / build notes specific to /tour
- Heavy: load R3F, drei, rapier (WASM) and GLBs only on this route (dynamic `import()` with `ssr:false`, `next/dynamic`). Home also loads three + drei for the explorer model; share the chunk via the same dynamic boundary.
- Draco decoder + KTX2 loader paths are present in drei chunk; host decoders under `/public/draco/` and `/public/basis/` or use drei CDN defaults.
- Gate audio behind first user gesture (autoplay policy). Provide a mute toggle (recommended addition; not seen in reference).
- Orientation: use CSS `@media (orientation: portrait) and (pointer: coarse)` to show the warning without JS flicker.
- Acceptance: LCP is the preloader (instant); first interactive frame <= ~5s on broadband; 60fps on mid laptop; no console errors; `Try again` path works with a blocked GLB.
