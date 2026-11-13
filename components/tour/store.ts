"use client";
/**
 * Tour state (replaces the reference's zustand stores; no new deps).
 *
 * SEAM for the R3F/Rapier scene (drops in where <TourScene/> renders the blank stage):
 *  - read:  wallColor, floorColor, selected{Bed,SmallBed,Cupboard,Tv,Sofa}, mobileJoystick, muted, isPanelOpen
 *           and the non-reactive `tourLook` (touch look yaw/pitch, already clamped like the reference).
 *  - write: setLookTarget(name, distance) every frame from the camera raycast (handles hint + "walk away to close"),
 *           setZone(zone) from the zone sensors, reportAsset()/reportAssetError() from the loading manager
 *           (or call startLoading with the drei/three totals), setSceneReady(true) after the first frame.
 *  - events: window "tour:interact" CustomEvent<{ target: string }> when E is pressed (or the gate is tapped)
 *           while a door hint is shown; the scene toggles the door and plays the door audio.
 * In development the store is exposed as `window.__tourStore` for QA without the scene.
 */
import { useSyncExternalStore } from "react";
import { tourPanel, type TourZone } from "@/content/tour";

export type PanelTab = "walls" | "floor";

export type TourState = {
  // interaction (reference store `ec`)
  isHintVisible: boolean;
  isPanelOpen: boolean;
  activeInteraction: string | null;
  activeTab: PanelTab;
  wallColor: string;
  floorColor: string;
  mobileJoystick: { x: number; y: number };
  // furniture variants (reference store `eZ`)
  selectedBed: string;
  selectedSmallBed: string;
  selectedCupboard: string;
  selectedTv: string;
  selectedSofa: string;
  // additions
  zone: TourZone | null;
  muted: boolean;
  isLocked: boolean;
  // loading
  load: { total: number; loaded: number; errors: string[]; started: boolean };
  sceneReady: boolean;
};

const initialState: TourState = {
  isHintVisible: false,
  isPanelOpen: false,
  activeInteraction: null,
  activeTab: "walls",
  wallColor: tourPanel.defaults.wallColor,
  floorColor: tourPanel.defaults.floorColor,
  mobileJoystick: { x: 0, y: 0 },
  selectedBed: "bed1",
  selectedSmallBed: "smallbed1",
  selectedCupboard: "cupboard1",
  selectedTv: "tv1",
  selectedSofa: "sofa1",
  zone: null,
  muted: false,
  isLocked: false,
  load: { total: 0, loaded: 0, errors: [], started: false },
  sceneReady: false,
};

let state: TourState = initialState;
const listeners = new Set<() => void>();

function set(partial: Partial<TourState> | ((s: TourState) => Partial<TourState>)) {
  const next = typeof partial === "function" ? partial(state) : partial;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

const CUSTOMIZABLE = ["walls", "floor", "bed", "cupboard", "tv", "commode", "sofa"];
/** Reference `eX`: any object whose name contains one of these opens the panel. */
export const isCustomizable = (name: string) => CUSTOMIZABLE.some((k) => name.includes(k));
export const isDoor = (name: string | null) => !!name && name.startsWith("door");

export const tourActions = {
  showHint: (target: string) => set({ isHintVisible: true, activeInteraction: target }),
  hideHint: () => set({ isHintVisible: false, activeInteraction: null }),
  /** `target` is the looked-at object name (reference passes activeInteraction). Opens on Floor only for floor-only targets. */
  openPanel: (target: string = "walls") =>
    set({
      isPanelOpen: true,
      isHintVisible: false,
      activeTab: target.includes("floor") && !target.includes("walls") ? "floor" : "walls",
    }),
  closePanel: () => set({ isPanelOpen: false }),
  setActiveTab: (activeTab: PanelTab) => set({ activeTab }),
  setWallColor: (wallColor: string) => set({ wallColor }),
  setFloorColor: (floorColor: string) => set({ floorColor }),
  setMobileJoystick: (mobileJoystick: { x: number; y: number }) => set({ mobileJoystick }),
  setFurniture: (key: "bed" | "smallbed" | "cupboard" | "tv" | "sofa", id: string) =>
    set(
      key === "bed"
        ? { selectedBed: id }
        : key === "smallbed"
          ? { selectedSmallBed: id }
          : key === "cupboard"
            ? { selectedCupboard: id }
            : key === "tv"
              ? { selectedTv: id }
              : { selectedSofa: id },
    ),
  setZone: (zone: TourZone | null) => set({ zone }),
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
  setLocked: (isLocked: boolean) => set({ isLocked }),

  /**
   * Called by the scene each frame with the nearest raycast hit (or null). Mirrors the reference:
   * within 3 units of a customizable object -> show its hint (or close the panel if the target changed);
   * otherwise hide a non-door hint and close the panel ("Walk away to close").
   */
  setLookTarget: (name: string | null, distance = Infinity) => {
    const s = state;
    const target = (name ?? "").toLowerCase();
    if (target && distance < 3 && isCustomizable(target)) {
      if (s.isPanelOpen) {
        if (s.activeInteraction !== target) set({ isPanelOpen: false, isHintVisible: false, activeInteraction: null });
      } else if (!(s.isHintVisible && s.activeInteraction === target)) {
        set({ isHintVisible: true, activeInteraction: target });
      }
      return;
    }
    const patch: Partial<TourState> = {};
    if (s.activeInteraction && !isDoor(s.activeInteraction)) Object.assign(patch, { isHintVisible: false, activeInteraction: null });
    if (s.isPanelOpen) patch.isPanelOpen = false;
    if (Object.keys(patch).length) set(patch);
  },
  /** Stub of the walk-away rule used until the scene exists: any movement closes an open panel. */
  walkAway: () => {
    if (state.isPanelOpen) set({ isPanelOpen: false, isHintVisible: false, activeInteraction: null });
  },
  /** E key / gate tap: forwards the active door target to the scene. */
  interact: () => {
    const target = state.activeInteraction;
    if (!state.isHintVisible || !isDoor(target) || typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("tour:interact", { detail: { target } }));
  },

  startLoading: (total: number) => set({ load: { total, loaded: 0, errors: [], started: true } }),
  reportAsset: () => set((s) => ({ load: { ...s.load, loaded: Math.min(s.load.total, s.load.loaded + 1) } })),
  reportAssetError: (url: string) =>
    set((s) => ({ load: { ...s.load, loaded: Math.min(s.load.total, s.load.loaded + 1), errors: [...s.load.errors, url] } })),
  setSceneReady: (sceneReady: boolean) => set({ sceneReady }),
  reset: () => set(initialState),
};

export const tourStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  ...tourActions,
};

/** Selector hook. Return primitives or stable references (store slices) to avoid re-render loops. */
export function useTour<T>(selector: (s: TourState) => T): T {
  return useSyncExternalStore(
    tourStore.subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

/** Loading progress 0..100 (100 when there is nothing to load). */
export const selectProgress = (s: TourState) =>
  !s.load.started ? 0 : s.load.total === 0 ? 100 : (s.load.loaded / s.load.total) * 100;
export const selectAssetsDone = (s: TourState) => s.load.started && s.load.loaded >= s.load.total;

/** Touch look (right-half drag). Non-reactive: the scene reads it every frame. */
export const tourLook = { yaw: 0, pitch: 0 };

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __tourStore: typeof tourStore }).__tourStore = tourStore;
}
