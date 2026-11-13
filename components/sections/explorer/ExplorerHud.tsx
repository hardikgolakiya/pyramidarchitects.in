"use client";
import { useEffect, useRef, useSyncExternalStore, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import Placeholder from "@/components/ui/Placeholder";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { explorer } from "@/content/explorer";
import { VIEWER, VIEWS, VIEW_COUNT, clamp01, railFill } from "./stages";

const pad2 = (n: number) => String(n).padStart(2, "0");

const subscribeOrbit = (cb: () => void) => {
  const m = window.matchMedia(VIEWER.orbitQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
const getOrbit = () => window.matchMedia(VIEWER.orbitQuery).matches;

/**
 * Night-blue viewer layer (z-30): blank 3D slot, right part-selector rail, one-time hints and the bottom HUD.
 * Mirrors the reference component in chunk 265hf09g46rmm.js; the R3F canvas is replaced by a blank stage.
 */
export default function ExplorerHud({
  visible,
  animationActive,
  activeIndex,
  progressRef,
  reduced,
  onSelect,
  onScrub,
}: {
  visible: boolean;
  animationActive: boolean;
  /** 0 = full view, 1..6 = part groups */
  activeIndex: number;
  /** HUD progress 0..1 written by the scroll timeline */
  progressRef: RefObject<number>;
  reduced: boolean;
  onSelect: (index: number) => void;
  /** knob / bar drag: HUD progress 0..1; `done` on release */
  onScrub: (viewProgress: number, done: boolean) => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hintsPlayed = useRef({ rotate: false, click: false });
  const canOrbit = useSyncExternalStore(subscribeOrbit, getOrbit, () => false);
  const view = explorer.views[activeIndex];

  // progress bar, knob and rail fill follow the scroll every tick while the viewer is active
  useEffect(() => {
    const update = () => {
      const vp = clamp01(progressRef.current ?? 0);
      if (railFillRef.current) railFillRef.current.style.transform = `scaleY(${railFill(vp)})`;
      if (barFillRef.current) barFillRef.current.style.transform = `scaleX(${vp})`;
      if (knobRef.current) knobRef.current.style.left = `${vp * 100}%`;
    };
    update();
    if (!animationActive) return;
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [animationActive, progressRef]);

  // text swap on every view change (title, stat, counter)
  useEffect(() => {
    if (!visible || !hudRef.current) return;
    const els = hudRef.current.querySelectorAll("[data-hud-text]");
    const tw = gsap.fromTo(
      els,
      { yPercent: 60, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06 },
    );
    return () => {
      tw.kill();
    };
  }, [activeIndex, visible]);

  // hint flags reset when the HUD hides (leaving upwards)
  useEffect(() => {
    if (!visible) hintsPlayed.current = { rotate: false, click: false };
  }, [visible]);

  // one-time hints: rotate on view 1, rail click on view 2
  useEffect(() => {
    if (!visible || !layerRef.current) return;
    const kind = activeIndex === 1 ? "rotate" : activeIndex === 2 ? "click" : null;
    if (!kind || hintsPlayed.current[kind]) return;
    if (kind === "rotate" && reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5, onComplete: () => void (hintsPlayed.current[kind] = true) });
      if (kind === "click") {
        tl.fromTo(".rail-hint", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0)
          .to(".rail-hint-icon", { x: 6, duration: 0.35, repeat: 5, yoyo: true, ease: "power1.inOut" }, 0)
          .fromTo(".rail-hint-ring", { scale: 1, opacity: 0.6 }, { scale: 2, opacity: 0, duration: 0.7, repeat: 2, ease: "power1.out" }, 0)
          .to(".rail-hint", { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" }, 2.1);
      } else {
        tl.fromTo(".rotate-hint", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0)
          .to(".rotate-hint-icon", { rotation: 360, duration: 1.4, repeat: 2, ease: "power1.inOut" }, 0)
          .to(".rotate-hint", { opacity: 0, y: 10, duration: 0.5, ease: "power2.in" }, 4.2);
      }
    }, layerRef);
    return () => ctx.revert();
  }, [activeIndex, visible, reduced]);

  // knob / bar drag scrubs the page scroll
  const dragging = useRef(false);
  const scrubFrom = (e: ReactPointerEvent, done: boolean) => {
    const bar = barRef.current;
    if (!bar) return;
    const r = bar.getBoundingClientRect();
    onScrub(clamp01((e.clientX - r.left) / Math.max(1, r.width)), done);
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    scrubFrom(e, false);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) scrubFrom(e, false);
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    scrubFrom(e, true);
  };

  return (
    <div
      ref={layerRef}
      className={cn(
        "absolute inset-0 z-[30] overflow-hidden bg-blue-900 transition-opacity duration-700",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!visible}
      inert={!visible}
    >
      {/* blank 3D stage: future R3F <Canvas> mounts here (presets in stages.ts) */}
      <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
        <div
          data-viewer-slot
          data-view={String(VIEWS[activeIndex])}
          style={{ width: "100%", height: "100%", pointerEvents: visible && canOrbit ? "auto" : "none" }}
        >
          <Placeholder slot={explorer.slots.model.slot} tone="none" label={explorer.slots.model.label} />
        </div>
      </div>

      {/* part-selector rail */}
      <div className="pointer-events-none absolute right-4 top-[38%] z-10 -translate-y-1/2 scale-90 lg:right-10 lg:top-1/2 lg:scale-100">
        <div className="pointer-events-auto relative flex flex-col items-center gap-4">
          <div className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px -translate-x-1/2 bg-white/20" />
          <div
            ref={railFillRef}
            className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px origin-top -translate-x-1/2"
            style={{ transform: "scaleY(0)", backgroundColor: "#ffffff", boxShadow: "0 0 8px rgba(255,255,255,0.45)" }}
          />
          {explorer.views.map((v, i) => {
            const isActive = i === activeIndex;
            const done = i < activeIndex;
            return (
              <button
                key={v.label}
                type="button"
                title={v.label}
                aria-label={`${explorer.railAriaPrefix} ${v.label}`}
                aria-current={isActive}
                onClick={() => onSelect(i)}
                className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full cursor-pointer"
              >
                <span
                  className={cn(
                    "block rounded-full border transition-all duration-300",
                    isActive
                      ? "h-3.5 w-3.5 border-white ring-4 ring-white/20"
                      : done
                        ? "h-2 w-2 border-white/80"
                        : "h-2 w-2 border-white/40",
                  )}
                  style={{ backgroundColor: isActive ? "#ffffff" : done ? "rgba(255,255,255,0.8)" : "transparent" }}
                />
              </button>
            );
          })}
          <span
            aria-hidden="true"
            className="rail-hint pointer-events-none absolute -right-4 top-1/2 -mt-[18px] mr-4 flex h-9 w-9 items-center justify-center opacity-0"
          >
            <span className="rail-hint-ring absolute inset-0 rounded-full bg-white/60" />
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A2725] shadow-lg">
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rail-hint-icon text-xl"
                height="1em"
                width="1em"
                aria-hidden="true"
              >
                <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
                <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
                <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
                <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
                <path d="M5 3l-1 -1" />
                <path d="M4 7h-1" />
                <path d="M14 3l1 -1" />
                <path d="M15 6h1" />
              </svg>
            </span>
          </span>
        </div>
      </div>

      {/* drag-to-rotate hint (lg only) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 hidden justify-center lg:flex">
        <div aria-hidden="true" className="rotate-hint flex flex-col items-center gap-2 text-white opacity-0">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-hint-icon text-2xl"
              height="1em"
              width="1em"
              aria-hidden="true"
            >
              <path d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2" />
              <path d="m15.194 13.707 3.814 1.86-1.86 3.814" />
              <path d="M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4" />
            </svg>
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/80">{explorer.hints.rotate}</span>
        </div>
      </div>

      {/* bottom HUD */}
      <div
        ref={hudRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/25 to-transparent px-6 pb-6 pt-20 text-white lg:px-10 lg:pb-8 lg:pt-28"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 pr-10 lg:pr-0" role="status" aria-live="polite">
            <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70">
              <span className="h-px w-6 bg-white/60" />
              <span>{explorer.eyebrow}</span>
            </div>
            <div className="overflow-hidden pb-[0.15em]">
              <h3 data-hud-text className="font-sans text-3xl leading-none tracking-[-0.04em] md:text-4xl lg:text-6xl">
                {view.label}
              </h3>
            </div>
            <div className="mt-3 overflow-hidden">
              <p data-hud-text className="max-w-md text-xs uppercase tracking-[0.14em] text-white/75 md:text-sm">
                {view.stat}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="overflow-hidden pb-[0.1em]">
              <div data-hud-text className="font-sans text-4xl leading-none tracking-[-0.05em] tabular-nums md:text-5xl lg:text-8xl">
                {pad2(activeIndex + 1)}
              </div>
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
              {explorer.counterOf} {pad2(VIEW_COUNT)}
            </div>
          </div>
        </div>
        <div ref={barRef} className="relative mt-6 h-[2px] w-full bg-white/25">
          <div ref={barFillRef} className="absolute inset-0 origin-left" style={{ transform: "scaleX(0)", backgroundColor: "#ffffff" }} />
          {Array.from({ length: VIEW_COUNT - 1 }, (_, k) => (
            <span
              key={k}
              className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/50"
              style={{ left: `${((k + 1) / VIEW_COUNT) * 100}%` }}
            />
          ))}
          {/* invisible 24px hit strip so the 2px bar and 10px knob can be grabbed and dragged */}
          <div
            aria-hidden="true"
            className="pointer-events-auto absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 cursor-pointer touch-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
          <span
            ref={knobRef}
            className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer"
            style={{ left: "0%", backgroundColor: "#ffffff", boxShadow: "0 0 10px rgba(255,255,255,0.6)" }}
          />
        </div>
      </div>
    </div>
  );
}
