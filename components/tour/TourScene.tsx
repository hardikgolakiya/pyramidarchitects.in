"use client";
import { useEffect } from "react";
import Placeholder from "@/components/ui/Placeholder";
import { tourHud } from "@/content/tour";
import { selectAssetsDone, tourStore, useTour } from "./store";

/**
 * BLANK SCENE (client 3D assets pending). Replace this component with the R3F <Canvas> + <Physics> scene
 * (camera position [0,-1,15], fov 70, dpr [1,1.5], gravity [0,-9.81,0]; see spec/05-content-build/tour-page.md).
 * Contract the replacement must keep (see components/tour/store.ts header):
 *  - call tourStore.setSceneReady(true) two rAFs after the first rendered frame (reference `oo`);
 *  - drive the hint/panel via tourStore.setLookTarget(name, distance) each frame (this also replaces the
 *    placeholder walk-away stub below), zones via setZone, read colours/variants/joystick/tourLook/muted;
 *  - request pointer lock is handled by TourStage (click on the stage), so use PointerLockControls without its own selector.
 */
export default function TourScene() {
  const assetsDone = useTour(selectAssetsDone);
  const failed = useTour((s) => s.load.errors.length > 0);

  // Ready once every manifest asset is in (immediately while the manifest is empty).
  useEffect(() => {
    if (!assetsDone || failed) return;
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => tourStore.setSceneReady(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [assetsDone, failed]);

  // Walk-away stub: without proximity raycasts, any movement input closes an open panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d"].includes(e.key.toLowerCase())) tourStore.walkAway();
    };
    let wasMoving = false;
    const unsub = tourStore.subscribe(() => {
      const { x, y } = tourStore.getState().mobileJoystick;
      const moving = x !== 0 || y !== 0;
      if (moving && !wasMoving) tourStore.walkAway();
      wasMoving = moving;
    });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unsub();
    };
  }, []);

  return <Placeholder slot="tour-scene" tone="dark" label={tourHud.stageLabel} className="block" />;
}
