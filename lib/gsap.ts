"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}
registerGsap();

/** Media queries used by every pinned section (see spec/03-motion/overview.md). */
export const MQ = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
  reduced: "(prefers-reduced-motion: reduce)",
  landscapePhone: "(orientation: landscape) and (max-height: 500px) and (max-width: 1023px)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
