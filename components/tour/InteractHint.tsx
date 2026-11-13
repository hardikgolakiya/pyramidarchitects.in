"use client";
import { cn } from "@/lib/cn";
import { tourHud } from "@/content/tour";
import { Kbd, hudPill, hudText, useIsTouch } from "./hud";
import { isCustomizable, isDoor, tourStore, useTour } from "./store";

/** Door hint (E): "Press E to open|close" on desktop, "Tap on gate to open|close" on touch (tap triggers it). */
export function InteractHint() {
  const touch = useIsTouch();
  const hint = useTour((s) => s.isHintVisible && !s.isPanelOpen);
  const target = useTour((s) => s.activeInteraction);
  if (!hint || !isDoor(target)) return null;
  const closing = !!target?.includes("close");
  const pill = cn("flex items-center gap-2 px-4 py-2.5 font-sans", hudPill, hudText);

  if (touch) {
    return (
      <div className="pointer-events-auto absolute left-1/2 top-1/2 mt-10 -translate-x-1/2 select-none">
        <button type="button" onClick={tourStore.interact} className={cn(pill, "touch-none active:scale-95 transition-transform")}>
          {closing ? tourHud.door.touchClose : tourHud.door.touchOpen}
        </button>
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 mt-10 -translate-x-1/2 select-none">
      <div className={pill}>
        {tourHud.door.before} <Kbd>{tourHud.door.key}</Kbd> {closing ? tourHud.door.close : tourHud.door.open}
      </div>
    </div>
  );
}

/** Customize hint (Q): centred pill on desktop, "Customize" button bottom-right on touch. */
export function CustomizeHint() {
  const touch = useIsTouch();
  const hint = useTour((s) => s.isHintVisible && !s.isPanelOpen);
  const target = useTour((s) => s.activeInteraction);
  if (!hint || !target || !isCustomizable(target)) return null;

  if (touch) {
    return (
      <div className="pointer-events-auto absolute bottom-10 right-6">
        <button
          type="button"
          onClick={() => {
            tourStore.openPanel(target);
            if (document.pointerLockElement) document.exitPointerLock();
          }}
          className={cn("touch-none px-5 py-3 font-sans transition-transform active:scale-95", hudPill, hudText)}
        >
          {tourHud.customizeTouch}
        </button>
      </div>
    );
  }
  return (
    <div className="pointer-events-auto absolute left-1/2 top-1/2 mt-10 -translate-x-1/2">
      <div className={cn("flex items-center gap-2 px-4 py-2.5 font-sans", hudPill, hudText)}>
        {tourHud.customize.before} <Kbd>{tourHud.customize.key}</Kbd> {tourHud.customize.after}
      </div>
    </div>
  );
}
