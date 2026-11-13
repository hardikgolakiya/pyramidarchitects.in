"use client";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

/** Reference HUD pill surface (`t5`) and type (`t4`). */
export const hudPill = "rounded-full border border-[#2A2725]/15 bg-[#EDE6D6]/90 text-[#2A2725] shadow-lg backdrop-blur-md";
export const hudText = "text-[11px] uppercase tracking-[0.18em] md:text-xs";

/** Reference keycap (`t6`). */
export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-[#2A2725]/30 px-1 font-sans text-[10px] font-semibold leading-none",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

const noop = () => () => {};
const isTouchDevice = () => "ontouchstart" in window || navigator.maxTouchPoints > 0;

/** Same test as the reference (`"ontouchstart" in window || navigator.maxTouchPoints > 0`); false on the server. */
export function useIsTouch() {
  return useSyncExternalStore(noop, isTouchDevice, () => false);
}
