"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { tourBrand, tourRotate } from "@/content/tour";

/**
 * Portrait lock screen (chunk 14sbrd6gjzroj.js). Visibility is pure CSS: `.rotate-device-warning`
 * is display:none and becomes flex at (orientation:portrait) and (max-width:1024px) (app/globals.css).
 */
export default function RotateDeviceWarning() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".lock-line", { yPercent: 110, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.1 });
      gsap.from(".lock-badge", { opacity: 0, scale: 0.8, duration: 0.7, ease: "back.out(1.8)" });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".lock-icon", { rotation: 90, duration: 0.9, ease: "power2.inOut", repeat: -1, yoyo: true, repeatDelay: 0.8 });
        gsap.fromTo(".lock-ring", { scale: 1, opacity: 0.5 }, { scale: 1.8, opacity: 0, duration: 1.8, ease: "power1.out", repeat: -1 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="rotate-device-warning fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#0f0f0f] text-white"
      role="alert"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="relative px-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-lg tracking-tight">{tourBrand}</div>
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="lock-badge relative mb-10 flex h-24 w-24 items-center justify-center">
          <span className="lock-ring absolute inset-0 rounded-full bg-white/40" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm">
            <svg
              viewBox="0 0 256 256"
              fill="currentColor"
              className="lock-icon text-4xl"
              width="1em"
              height="1em"
              aria-hidden="true"
            >
              <path d="M205.66,221.66l-24,24a8,8,0,0,1-11.32-11.32L180.69,224H80a24,24,0,0,1-24-24V104a8,8,0,0,1,16,0v96a8,8,0,0,0,8,8H180.69l-10.35-10.34a8,8,0,0,1,11.32-11.32l24,24A8,8,0,0,1,205.66,221.66ZM80,72a8,8,0,0,0,5.66-13.66L75.31,48H176a8,8,0,0,1,8,8v96a8,8,0,0,0,16,0V56a24,24,0,0,0-24-24H75.31L85.66,21.66A8,8,0,1,0,74.34,10.34l-24,24a8,8,0,0,0,0,11.32l24,24A8,8,0,0,0,80,72Z" />
            </svg>
          </span>
        </div>
        <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/70">
          <span className="h-px w-6 bg-white/60" />
          <span>{tourRotate.eyebrow}</span>
          <span className="h-px w-6 bg-white/60" />
        </div>
        <h2 className="font-serif text-[clamp(2.25rem,10vw,3.5rem)] leading-[96%]">
          {tourRotate.heading.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <span className="lock-line block">{line}</span>
            </span>
          ))}
        </h2>
        <p className="mt-6 max-w-xs text-xs uppercase leading-[1.7] tracking-[0.14em] text-white/75">
          <span className="block overflow-hidden">
            <span className="lock-line block">{tourRotate.body}</span>
          </span>
        </p>
      </div>
      <div className="relative h-[max(1.5rem,env(safe-area-inset-bottom))]" />
    </div>
  );
}
