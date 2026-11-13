"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { tourBrand, tourPreloader } from "@/content/tour";
import { selectProgress, useTour } from "./store";

const reload = () => window.location.reload();

/**
 * /tour loader (spec/03-motion/page-transitions.md "Arriving on /tour").
 * Counter tweens to min(maxSeen, 99) (.5s power2.out); on scene ready -> 100 (.3s) then overlay fades (.7s power2.inOut) and unmounts.
 */
export default function TourPreloader() {
  const progress = useTour(selectProgress);
  const ready = useTour((s) => s.sceneReady);
  const failed = useTour((s) => s.load.errors.length > 0);

  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tweenState = useRef({ value: 0 });
  const maxSeen = useRef(0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (ready) return;
    const st = tweenState.current;
    const update = () => {
      if (barRef.current) gsap.set(barRef.current, { scaleX: st.value / 100 });
      setCount(Math.round(st.value));
    };
    maxSeen.current = Math.max(maxSeen.current, progress);
    gsap.to(st, { value: Math.min(maxSeen.current, 99), duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: update });
  }, [progress, ready]);

  useEffect(() => {
    if (!ready || !overlayRef.current) return;
    const st = tweenState.current;
    const update = () => {
      if (barRef.current) gsap.set(barRef.current, { scaleX: st.value / 100 });
      setCount(Math.round(st.value));
    };
    const tl = gsap.timeline({ onComplete: () => setDone(true) });
    tl.to(st, { value: 100, duration: 0.3, ease: "power2.out", overwrite: true, onUpdate: update }).to(overlayRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.inOut",
    });
    return () => {
      tl.kill();
    };
  }, [ready]);

  useEffect(() => {
    const st = tweenState.current;
    return () => {
      gsap.killTweensOf(st);
    };
  }, []);

  if (done) return null;

  const status = failed ? tourPreloader.status.error : ready ? tourPreloader.status.ready : tourPreloader.status.loading;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex flex-col justify-center bg-[#2A2725] text-[#EDE6D6]"
      role="status"
      aria-live="polite"
    >
      <div className="w-full">
        <div className="flex items-end justify-between gap-4 px-5 md:px-8">
          <span className="shrink-0 font-sans text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-none tracking-[-0.055em]">
            {tourBrand}
          </span>
          <span className="ml-auto text-right font-sans text-[clamp(0.75rem,1.5vw,1rem)] font-normal uppercase leading-tight tracking-[0.12em] text-[#EDE6D6]/70">
            {tourPreloader.eyebrow}
          </span>
          <span className="shrink-0 font-sans text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-7 h-[3px] w-full overflow-hidden bg-[#EDE6D6]/10">
          <div
            ref={barRef}
            className="h-full origin-left bg-[#EDE6D6] will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 px-5 md:px-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#EDE6D6]/60">{status}</p>
          <span className="hidden text-[9px] uppercase tracking-[0.18em] text-[#EDE6D6]/40 sm:block">
            {tourPreloader.microLabel}
          </span>
        </div>
        {failed && (
          <button
            type="button"
            onClick={reload}
            className="pointer-events-auto mx-5 mt-4 rounded-full border border-[#EDE6D6]/60 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-[#EDE6D6] hover:text-[#2A2725] md:mx-8"
          >
            {tourPreloader.retry}
          </button>
        )}
      </div>
    </div>
  );
}

/** Error boundary fallback (reference class `on`): same frame, no counter, error status + Try again. */
export function TourLoadError() {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col justify-center bg-[#2A2725] text-[#EDE6D6]" role="alert">
      <div className="w-full">
        <div className="flex items-end justify-between gap-4 px-5 md:px-8">
          <span className="shrink-0 font-sans text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-none tracking-[-0.055em]">
            {tourBrand}
          </span>
          <span className="ml-auto text-right font-sans text-[clamp(0.75rem,1.5vw,1rem)] font-normal uppercase leading-tight tracking-[0.12em] text-[#EDE6D6]/70">
            {tourPreloader.eyebrow}
          </span>
        </div>
        <div className="mt-7 h-[3px] w-full bg-[#EDE6D6]/10" />
        <p className="mt-6 px-5 text-[10px] uppercase tracking-[0.2em] text-[#EDE6D6]/60 md:px-8">{tourPreloader.status.error}</p>
        <button
          type="button"
          onClick={reload}
          className="mx-5 mt-4 rounded-full border border-[#EDE6D6]/60 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-[#EDE6D6] hover:text-[#2A2725] md:mx-8"
        >
          {tourPreloader.retry}
        </button>
      </div>
    </div>
  );
}
