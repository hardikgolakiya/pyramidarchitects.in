"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { tourLegend } from "@/content/tour";
import { Kbd, hudPill, hudText, useIsTouch } from "./hud";
import { useTour } from "./store";

/**
 * Desktop controls legend (bottom centre, md+). Not on the reference /tour (it lives in the home teaser);
 * added here so the controls are discoverable in the scene. Keycaps light up while held.
 */
export default function KeyboardLegend() {
  const touch = useIsTouch();
  const panelOpen = useTour((s) => s.isPanelOpen);
  const [held, setHeld] = useState<ReadonlySet<string>>(() => new Set());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toUpperCase() : e.key === "Escape" ? "Esc" : e.key;
      setHeld((prev) => (prev.has(k) ? prev : new Set(prev).add(k)));
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toUpperCase() : e.key === "Escape" ? "Esc" : e.key;
      setHeld((prev) => {
        if (!prev.has(k)) return prev;
        const next = new Set(prev);
        next.delete(k);
        return next;
      });
    };
    const clear = () => setHeld(new Set());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  if (touch || panelOpen) return null;

  return (
    <ul
      aria-label={tourLegend.label}
      className={cn(
        "absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-5 px-4 py-2.5 font-sans md:bottom-8 lg:flex",
        hudPill,
        hudText,
      )}
    >
      {tourLegend.items.map((item) => (
        <li key={item.label} className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            {item.keys.map((k) => (
              <Kbd key={k} className={cn("transition-colors duration-150", held.has(k) && "bg-[#2A2725] text-[#EDE6D6]")}>
                {k}
              </Kbd>
            ))}
          </span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
