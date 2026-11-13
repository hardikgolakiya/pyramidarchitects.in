"use client";
import { useRef, useState } from "react";
import { tourHud } from "@/content/tour";
import { tourStore } from "./store";

const MAX = 45; // px travel of the knob (reference)

/**
 * Touch-only move joystick, bottom-left (reference `t2`, rebuilt on pointer events instead of touch events / nipplejs).
 * Writes the normalised vector to `mobileJoystick` (-1..1; y < 0 = forward).
 */
export default function TouchJoystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const move = (clientX: number, clientY: number) => {
    const base = baseRef.current;
    if (!base) return;
    const r = base.getBoundingClientRect();
    let x = clientX - (r.left + r.width / 2);
    let y = clientY - (r.top + r.height / 2);
    const d = Math.hypot(x, y);
    if (d > MAX) {
      x = (x / d) * MAX;
      y = (y / d) * MAX;
    }
    setKnob({ x, y });
    tourStore.setMobileJoystick({ x: x / MAX, y: y / MAX });
  };

  const end = (e: React.PointerEvent) => {
    if (e.pointerId !== pointerId.current) return;
    e.stopPropagation();
    pointerId.current = null;
    setKnob({ x: 0, y: 0 });
    tourStore.setMobileJoystick({ x: 0, y: 0 });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex select-none items-end justify-start p-6">
      <div
        ref={baseRef}
        role="application"
        aria-label={tourHud.joystickLabel}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (pointerId.current !== null) return;
          pointerId.current = e.pointerId;
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.pointerId !== pointerId.current) return;
          e.stopPropagation();
          move(e.clientX, e.clientY);
        }}
        onPointerUp={end}
        onPointerCancel={end}
        className="pointer-events-auto relative flex h-32 w-32 touch-none items-center justify-center rounded-full border-2 border-white/40 bg-black/40 shadow-2xl backdrop-blur-md"
      >
        <div
          className="nipple absolute h-14 w-14 rounded-full border border-white bg-white/80 shadow-lg backdrop-blur-sm transition-transform duration-75"
          style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
        />
      </div>
    </div>
  );
}
