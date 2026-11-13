"use client";
import { cn } from "@/lib/cn";
import { useTour } from "./store";

/** 6px centre dot; grows to 2.5x / opacity 100 while an interaction hint is visible. */
export default function Crosshair() {
  const active = useTour((s) => s.isHintVisible);
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
      <div
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-white mix-blend-difference transition-transform duration-300 ease-out",
          active ? "scale-[2.5] opacity-100" : "scale-100 opacity-60",
        )}
        style={{ boxShadow: "0 0 4px rgba(0,0,0,0.3)" }}
      />
    </div>
  );
}
