"use client";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Global init for [data-reveal-01] (masked char reveal) and [data-hover-reveal] (two-layer text roll).
 * Spec: spec/03-motion/text-reveal-and-hover-reveal.md. Starts after fonts load and the boot loader completes
 * (document.body.dataset.bootLoaderComplete === "true" or the "bootloader:complete" window event).
 * Elements with data-reveal-local are skipped; their section calls textReveal01(scope) itself.
 */
export function textReveal01(root: ParentNode, includeLocal = false) {
  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-01]")).filter(
    (el) => includeLocal || !el.hasAttribute("data-reveal-local"),
  );
  els.forEach((el) => {
    SplitText.create(el, {
      type: "chars, words, lines",
      mask: "chars",
      autoSplit: true,
      linesClass: "line",
      wordsClass: "word",
      charsClass: "char",
      onSplit(self) {
        const d = parseFloat(el.dataset.duration ?? "");
        const s = parseFloat(el.dataset.stagger ?? "");
        const vars: gsap.TweenVars = {
          yPercent: 110,
          duration: isNaN(d) ? 1 : d,
          stagger: isNaN(s) ? 0.02 : s,
          immediateRender: true,
          ease: el.dataset.ease || "expo.out",
        };
        if (el.hasAttribute("data-scroll")) {
          vars.scrollTrigger = { trigger: el.closest("section") || el, start: "clamp(top 50%)", once: true };
        }
        gsap.set(el, { visibility: "visible" });
        return gsap.from(self.chars, vars);
      },
    });
  });
}

export function hoverReveal(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("[data-hover-reveal]").forEach((el) => {
    if (el.dataset.hoverRevealInitialized || !el.textContent?.trim()) return;
    el.dataset.hoverRevealInitialized = "true";
    const text = el.textContent;
    el.setAttribute("aria-label", text.trim());
    el.textContent = "";
    const track = document.createElement("span");
    track.className = "hover-reveal-track";
    track.setAttribute("aria-hidden", "true");
    const mk = () => {
      const line = document.createElement("span");
      line.className = "hover-reveal-line";
      line.textContent = text;
      track.appendChild(line);
      return line;
    };
    const a = mk();
    const b = mk();
    el.appendChild(track);
    const split = (line: HTMLElement) => SplitText.create(line, { type: "chars", charsClass: "hover-reveal-char", aria: "none" }).chars;
    const A = split(a);
    const B = split(b);
    gsap.set(B, { yPercent: 110 });
    el.addEventListener("mouseenter", () => {
      gsap.to(A, { yPercent: -110, duration: 0.4, stagger: 0.02, ease: "power3.out", overwrite: "auto" });
      gsap.to(B, { yPercent: 0, duration: 0.4, stagger: 0.02, ease: "power3.out", overwrite: "auto" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(A, { yPercent: 0, duration: 0.35, stagger: 0.015, ease: "power3.out", overwrite: "auto" });
      gsap.to(B, { yPercent: 110, duration: 0.35, stagger: 0.015, ease: "power3.out", overwrite: "auto" });
    });
  });
}

export default function TextEffects() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const run = () => {
        textReveal01(document);
        hoverReveal(document);
        ScrollTrigger.refresh();
      };
      const start = () => (document.fonts?.ready ? document.fonts.ready.then(run) : run());
      if (document.body.dataset.bootLoaderComplete === "true") start();
      else window.addEventListener("bootloader:complete", start, { once: true });
      return () => window.removeEventListener("bootloader:complete", start);
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return <div ref={ref} className="hidden" aria-hidden />;
}
