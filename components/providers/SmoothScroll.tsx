"use client";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/** Lenis driven by the GSAP ticker, synced to ScrollTrigger (spec/03-motion/overview.md). */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const reset = () => {
      const l = (window as unknown as { __lenis?: Lenis }).__lenis;
      l?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
    };
    reset();
    ScrollTrigger.clearScrollMemory();
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          reset();
          ScrollTrigger.refresh();
        }),
      ),
    );
    const id = setTimeout(reset, 100);
    return () => clearTimeout(id);
  }, [pathname]);

  return <div className="contents">{children}</div>;
}
