"use client";
import { cn } from "@/lib/cn";
import { tourHud, tourZones } from "@/content/tour";
import { hudPill, hudText, useIsTouch } from "./hud";
import { tourStore, useTour } from "./store";

/**
 * Additions not in the reference: current-zone label + mute toggle (spec/05-content-build/tour-page.md recommends a mute
 * toggle). Desktop: bottom-right, mirroring Back to site. Touch: top-centre (bottom-right is the Customize button there).
 */
export default function HudStatus() {
  const touch = useIsTouch();
  const zone = useTour((s) => s.zone);
  const muted = useTour((s) => s.muted);
  const panelOpen = useTour((s) => s.isPanelOpen);
  const zoneName = zone ? tourZones[zone] : null;

  return (
    <div
      className={cn(
        "absolute flex items-center gap-2 transition-opacity duration-300",
        touch ? "left-1/2 top-6 -translate-x-1/2" : "bottom-6 right-6 md:bottom-8 md:right-10",
        panelOpen && touch && "opacity-0",
      )}
    >
      <div
        aria-live="polite"
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 font-sans transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          hudPill,
          hudText,
          zoneName ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0",
        )}
      >
        <span className="sr-only">{tourHud.zoneLabel} </span>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#2A2725]/60" />
        <span>{zoneName ?? ""}</span>
      </div>
      <button
        type="button"
        onClick={tourStore.toggleMuted}
        aria-pressed={muted}
        aria-label={muted ? tourHud.mute.off : tourHud.mute.on}
        title={muted ? tourHud.mute.off : tourHud.mute.on}
        className={cn(
          "pointer-events-auto flex h-[38px] w-[38px] items-center justify-center transition-colors duration-300 hover:bg-[#2A2725] hover:text-[#EDE6D6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EDE6D6] md:h-10 md:w-10",
          hudPill,
        )}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
          {muted ? (
            <path d="M16 9.5l5 5M21 9.5l-5 5" />
          ) : (
            <>
              <path d="M15.5 9a4 4 0 0 1 0 6" />
              <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
