"use client";
import { tourAssets } from "@/content/tour";
import { tourStore } from "./store";

/**
 * Preloads every file in the tour asset manifest (content/tour.ts) and reports progress to the store.
 * With an empty manifest (current state: client assets pending) it completes immediately.
 * When the R3F scene lands, replace this with the three.js DefaultLoadingManager / drei useProgress totals.
 */
export function loadTourAssets(): () => void {
  const urls = [...tourAssets.models, ...tourAssets.textures, ...tourAssets.audio];
  const controller = new AbortController();
  tourStore.startLoading(urls.length);
  urls.forEach((url) => {
    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.arrayBuffer();
      })
      .then(() => tourStore.reportAsset())
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        console.warn("Tour asset failed to load:", url, err);
        tourStore.reportAssetError(url);
      });
  });
  return () => controller.abort();
}
