"use client";
import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Hero load intro (spec/03-motion/hero.md). Same tweens as the reference; the timeline is built paused
 * (so the "from" states hold under the boot loader) and plays on "bootloader:complete".
 * Scroll exit of .hero-image-wrap / .hero-content is owned by the About lead-in timeline.
 */
export function useHeroIntro(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap
          .timeline({ paused: true, defaults: { ease: "power3.out" } })
          .from(".hero-image", { scale: 1.08, duration: 2, ease: "power2.out" })
          .from(".hero-actions", { y: 20, opacity: 0, duration: 0.8 }, "-=0.2")
          .from(".hero-meta-inner", { y: 15, opacity: 0, duration: 0.7 }, "-=0.4")
          .from(".hero-bottom-inner", { y: 15, opacity: 0, duration: 0.7 }, "-=0.4");

        const play = () => tl.play();
        if (document.body.dataset.bootLoaderComplete === "true") play();
        else window.addEventListener("bootloader:complete", play, { once: true });
        return () => window.removeEventListener("bootloader:complete", play);
      });
      return () => mm.revert();
    },
    { scope },
  );
}
