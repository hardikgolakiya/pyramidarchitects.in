// /tour copy, palettes and asset manifest. Components read from here; no literal copy inside components.
// Reference values: spec/05-content-build/tour-page.md, spec/01-layout/tour-page.md, spec/raw/js/3jmgvrsil9p03.js.
import { site } from "./site";

export const tourBrand = site.brandSplit.join(" / ");

export const tourMeta = {
  title: `3D Residence Tour | ${site.name}`,
  description:
    "Walk through a residence in 3D with Pyramid Architects. Move room to room, explore the spaces and customise wall, floor and furniture finishes as you go.",
  ogTitle: `3D Residence Tour | ${site.name}`,
  ogDescription: "Walk through a residence in 3D and customise its finishes.",
  // visually hidden, server rendered (the reference /tour has no h1 and no indexable text)
  h1: "3D Residence Tour",
  intro:
    "An interactive first-person walkthrough of a residence by Pyramid Architects. Use W, A, S and D to move, the mouse to look around, E to interact and Q to customise finishes. On touch devices, rotate to landscape and use the on-screen joystick.",
} as const;

export const tourPreloader = {
  eyebrow: "3D Residence Tour",
  status: {
    loading: "Preparing your tour experience",
    ready: "Entering the residence",
    error: "Some files could not load",
  },
  retry: "Try again",
  microLabel: "ARCHITECTURE · INTERIORS · DETAILS",
} as const;

export const tourRotate = {
  eyebrow: "Landscape mode",
  heading: ["Turn your device,", "sideways."],
  body: "This 3D interior experience is built for landscape mode.",
} as const;

export const tourHud = {
  backToSite: "Back to site",
  backArrow: "←",
  clickToLook: "Click to look around",
  unlock: { before: "Press", key: "Esc", after: "to unlock cursor" },
  customize: { before: "Click or press", key: "Q", after: "to customize" },
  customizeTouch: "Customize",
  door: {
    key: "E",
    before: "Press",
    open: "to open",
    close: "to close",
    touchOpen: "Tap on gate to open",
    touchClose: "Tap on gate to close",
  },
  mute: { on: "Sound on", off: "Sound off" },
  zoneLabel: "You are in",
  joystickLabel: "Move",
  stageLabel: "3D residence walkthrough",
} as const;

/** Keyboard legend (same three items as the home teaser legend, plus Esc). */
export const tourLegend = {
  label: "Walkthrough controls",
  items: [
    { keys: ["W", "A", "S", "D"], label: "Move" },
    { keys: ["E"], label: "Interact" },
    { keys: ["Q"], label: "Customize" },
    { keys: ["Esc"], label: "Release" },
  ],
} as const;

export type Swatch = { name: string; hex: string };

export const tourPanel = {
  title: "Customization",
  tabs: [
    { key: "walls", label: "Walls" },
    { key: "floor", label: "Floor" },
  ],
  walkAway: "Walk away to close",
  wallPalette: [
    { name: "Clean White", hex: "#F5F5F0" },
    { name: "Warm Cream", hex: "#F2EBD9" },
    { name: "Soft Beige", hex: "#D8CFC4" },
    { name: "Olive Green", hex: "#7D8C5A" },
    { name: "Dusty Blue", hex: "#6B8CAE" },
  ] satisfies Swatch[],
  floorPalette: [
    { name: "Light Timber", hex: "#DFCDB5" },
    { name: "Natural Birch", hex: "#EADBC8" },
    { name: "Terracotta", hex: "#C8A896" },
    { name: "Muted Oak", hex: "#B8A890" },
    { name: "Deep Slate", hex: "#3A4F60" },
  ] satisfies Swatch[],
  defaults: { wallColor: "#F5F5F0", floorColor: "#DFCDB5" },
} as const;

/**
 * Furniture style groups. `match` is tested against the looked-at object name (lower case),
 * exactly like the reference: bed (not smallbed), smallbed, cupboard, tv, sofa. Commode is
 * customizable (opens the panel) but has a single variant, so it has no group.
 */
export const furnitureGroups = [
  { key: "bed", label: "Bed Style", options: [{ id: "bed1", label: "Style 1" }, { id: "bed2", label: "Style 2" }, { id: "bed3", label: "Style 3" }] },
  { key: "smallbed", label: "Small Bed Style", options: [{ id: "smallbed1", label: "Style 1" }, { id: "smallbed2", label: "Style 2" }] },
  { key: "cupboard", label: "Cupboard Style", options: [{ id: "cupboard1", label: "Style 1" }, { id: "cupboard2", label: "Style 2" }] },
  { key: "tv", label: "TV Unit Style", options: [{ id: "tv1", label: "Style 1" }, { id: "tv2", label: "Style 2" }, { id: "tv3", label: "Style 3" }] },
  { key: "sofa", label: "Sofa Style", options: [{ id: "sofa1", label: "Style 1" }, { id: "sofa2", label: "Style 2" }] },
] as const;

export type FurnitureKey = (typeof furnitureGroups)[number]["key"];

/** Zone sensors (scene names from the reference) and their HUD labels. */
export const tourZones = {
  "living-room": "Living room",
  balcony: "Balcony",
  "bedroom-1": "Bedroom 1",
  "bedroom-2": "Bedroom 2",
  "kitchen&uility": "Kitchen & utility",
} as const;

export type TourZone = keyof typeof tourZones;

/**
 * Asset manifest. BLANK until the client sends assets (spec/BUILD.md asset rule).
 * The preloader progress is driven by these lists; with every list empty it completes immediately.
 * Expected later (names only): models apartment, bed1-3, smallbed1-2, cupboard1-2, tv1-3, sofa1-2,
 * commode1, countertop, fridge, mirror-512 (.glb); textures sky/{px,nx,py,ny,pz,nz}.png,
 * ground/ground_05_*_1k.jpg, yard/ground_tiles_21_*_1k.jpg; audio balcony/bedroom/kitchen/livingRoom-tone,
 * footstep, opening-door, close-door, lofi (.mp3). Paths are under /assets/{models,textures,audio}/.
 */
export const tourAssets: { models: string[]; textures: string[]; audio: string[] } = {
  models: [],
  textures: [],
  audio: [],
};
