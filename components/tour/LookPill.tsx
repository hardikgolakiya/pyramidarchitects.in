"use client";
import { cn } from "@/lib/cn";
import { tourHud } from "@/content/tour";
import { Kbd, hudPill, hudText, useIsTouch } from "./hud";
import { useTour } from "./store";

/** Top-centre pill (desktop only, hidden while the panel is open): "Click to look around" / "Press Esc to unlock cursor". */
export default function LookPill() {
  const touch = useIsTouch();
  const locked = useTour((s) => s.isLocked);
  const panelOpen = useTour((s) => s.isPanelOpen);
  if (touch || panelOpen) return null;
  return (
    <div className="absolute left-1/2 top-6 -translate-x-1/2">
      <div className={cn("flex items-center gap-2 px-4 py-2.5 font-sans", hudPill, hudText)}>
        {locked ? (
          <>
            {tourHud.unlock.before} <Kbd>{tourHud.unlock.key}</Kbd> {tourHud.unlock.after}
          </>
        ) : (
          tourHud.clickToLook
        )}
      </div>
    </div>
  );
}
