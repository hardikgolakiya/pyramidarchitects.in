// Timeline constants and 3D viewer presets for #marquee-transition (spec/03-motion/marquee-transition.md).
// The 3D model is not supplied yet: the camera presets and part groups below are placeholders copied from the
// reference structure so a three.js / R3F viewer can drop into the blank stage later. Re-author them for the client GLB.

export type ViewKey = "full" | 0 | 1 | 2 | 3 | 4 | 5;
type Vec3 = readonly [number, number, number];

/** 7 views: full + 6 model groups. Index in this array = HUD/rail index. */
export const VIEWS: readonly ViewKey[] = ["full", 0, 1, 2, 3, 4, 5];
export const VIEW_COUNT = VIEWS.length; // 7

/** vh of pinned scroll: 220 (grow + ink) + 100 per view */
export const TOTAL = 220 + 100 * VIEW_COUNT; // 920
export const P_GROW = 100 / TOTAL; // 0.1087 card growth ends, HUD on
export const P_INK = 220 / TOTAL; // 0.2391 ink dissolve ends, views begin
export const SECTION_VH = TOTAL + 100; // 1020vh runway

export const PROMPT_DURATION = 30 / TOTAL; // prompt gone at 30vh (+270px @900)
export const TRACK_START = 20 / TOTAL; // track fades/lifts from 20vh ...
export const TRACK_DURATION = 60 / TOTAL; // ... to 80vh (+720px @900)
export const SCRUB = 0.8;
export const INK_MAX = 1.5; // shader uProgress at P_INK

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** shader uProgress (0..1.5) for timeline progress p */
export const inkFromProgress = (p: number) => INK_MAX * clamp01((p - P_GROW) / (P_INK - P_GROW));
/** HUD progress (0..1) for timeline progress p */
export const viewProgressFromProgress = (p: number) => clamp01((p - P_INK) / (1 - P_INK));
/** active view index (0..6) for timeline progress p */
export const viewIndexFromProgress = (p: number) =>
  p < P_INK ? 0 : Math.min(VIEW_COUNT - 1, Math.floor(viewProgressFromProgress(p) * VIEW_COUNT));
/** timeline progress for a HUD progress value (knob drag) */
export const progressFromViewProgress = (vp: number) => P_INK + clamp01(vp) * (1 - P_INK);
/** timeline progress that lands just inside view `index` (rail click) */
export const progressForView = (index: number) => progressFromViewProgress((index + 0.05) / VIEW_COUNT);
/** rail fill scaleY for a HUD progress value */
export const railFill = (vp: number) => clamp01((vp * VIEW_COUNT - 0.5) / (VIEW_COUNT - 1));

/** Viewer setup the reference uses (R3F Canvas + camera-controls). */
export const VIEWER = {
  camera: { position: [8, 6, 8] as Vec3, fov: 50, fovNarrow: 75, narrowBelow: 768 },
  dpr: [1, 1.5] as const,
  light: { position: [5, 10, 5] as Vec3, intensity: 1.2 },
  model: { src: null as string | null, rotation: [-Math.PI, 0, 0] as Vec3, scale: 0.022 },
  /** camera-controls: left mouse rotate only, library default damping */
  controls: { smoothTime: 0.25, draggingSmoothTime: 0.125 },
  /** pointer orbit only on md+ and not on landscape phones (phones keep scrolling) */
  orbitQuery: "(min-width: 768px) and (not ((orientation: landscape) and (max-height: 500px)))",
  highlight: { lerpRate: 4, ghostOpacity: 0.025, edgeColor: "#354F79", edgeGhostOpacity: 0.09, edgeAngle: 20 },
} as const;

/** Camera position / target offsets from the model bounding-box centre, per view. PLACEHOLDERS (reference model). */
export const CAMERA_PRESETS: Record<string, { pos: Vec3; targetOffset: Vec3 }> = {
  full: { pos: [2.3, 2.3, 16.9], targetOffset: [1.2, 0, -5.4] },
  0: { pos: [-5.3, 15.4, 16.2], targetOffset: [1.4, -0.2, -1.6] },
  1: { pos: [18, 7.6, 9.4], targetOffset: [5.8, -3, -3] },
  2: { pos: [4.2, 14.5, 14.5], targetOffset: [4.3, 3.4, 3.4] },
  3: { pos: [-1, 16.2, 11.9], targetOffset: [5.8, -12.6, -10.4] },
  4: { pos: [11.1, 4.2, -15.6], targetOffset: [-1.6, -8.9, 7.3] },
  5: { pos: [-11.3, 3.3, -19], targetOffset: [-0.099, -5.3, -6.7] },
};

/** Mesh names per part group (index = ViewKey number). PLACEHOLDERS: rename to the client model's node names. */
export const PART_GROUPS: readonly (readonly string[])[] = [
  ["walls", "outerwalls"],
  ["floor"],
  ["toproof", "outerroof"],
  ["pillars"],
  ["stairs", "stairframe"],
  ["windowframe", "doorframe", "glass"],
];

export const cameraPresetFor = (view: ViewKey) => CAMERA_PRESETS[String(view)] ?? CAMERA_PRESETS.full;
