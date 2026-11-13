"use client";
import { useEffect, useRef } from "react";
import { isCustomizable, tourLook, tourStore } from "./store";
import { useIsTouch } from "./hud";

const PITCH_LIMIT = Math.PI / 2.2;

/**
 * Canvas wrapper (reference: `position:relative;width:100%;height:100%;overflow:hidden;pointer-events:auto` > div 100% > canvas).
 * Desktop: click requests pointer lock (or opens the panel when a customizable hint is showing).
 * Touch: drag on the right half (not on a button / joystick) updates `tourLook` yaw/pitch (factor .005, pitch clamp PI/2.2).
 */
export default function TourStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const look = useRef<{ id: number | null; x: number; y: number }>({ id: null, x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    const onChange = () => tourStore.setLocked(!!el && document.pointerLockElement === el);
    document.addEventListener("pointerlockchange", onChange);
    onChange();
    return () => {
      document.removeEventListener("pointerlockchange", onChange);
      if (el && document.pointerLockElement === el) document.exitPointerLock();
    };
  }, []);

  const onClick = () => {
    if (touch) return;
    const s = tourStore.getState();
    if (s.isHintVisible && s.activeInteraction && isCustomizable(s.activeInteraction)) {
      tourStore.openPanel(s.activeInteraction);
      if (document.pointerLockElement) document.exitPointerLock();
      return;
    }
    if (s.isPanelOpen || document.pointerLockElement || !ref.current) return;
    try {
      const req = ref.current.requestPointerLock() as unknown;
      if (req instanceof Promise) req.catch(() => {});
    } catch {
      /* pointer lock unavailable (iframe / permissions) */
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch" || look.current.id !== null || e.clientX <= window.innerWidth / 2) return;
    const el = e.target as Element | null;
    if (el?.closest("button, a, .nipple")) return;
    look.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerId !== look.current.id) return;
    const dx = e.clientX - look.current.x;
    const dy = e.clientY - look.current.y;
    look.current.x = e.clientX;
    look.current.y = e.clientY;
    tourLook.yaw -= 0.005 * dx;
    tourLook.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, tourLook.pitch - 0.005 * dy));
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    if (e.pointerId === look.current.id) look.current.id = null;
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "auto" }}
      className="h-full w-full touch-none"
    >
      <div style={{ width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
}
