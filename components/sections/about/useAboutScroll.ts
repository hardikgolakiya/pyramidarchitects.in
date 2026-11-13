"use client";
import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

type Rect = { x: number; y: number; w: number; h: number };

/**
 * About scroll choreography (spec/03-motion/about-cloud-parallax.md, frames/hero-about-lead.md, frames/about-pin.md).
 * A. lead-in (scroll 0 -> about top - 10vh, scrub .8): hero wrap scale 1.12, hero content y -80, clouds, wash, tiles, box fade.
 * B. pinned stage (desktop +=320% scrub .8 / mobile +=160% scrub .6): box slot -> 94% inset -> inline slot, words, rule, copy.
 */
export function useAboutScroll(sectionRef: RefObject<HTMLElement | null>, stageRef: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;
      const box = section.querySelector<HTMLElement>(".about-box");
      if (!box) return;

      const clouds = section.querySelectorAll<HTMLElement>(".about-cloud");
      const bg = section.querySelector(".about-bg");
      const tiles = section.querySelectorAll(".about-tile");
      const tilesL = section.querySelectorAll(".about-tile-l");
      const tilesR = section.querySelectorAll(".about-tile-r");
      const gallery = section.querySelector(".about-gallery");
      const arrows = section.querySelector(".about-arrows");
      const textLayer = section.querySelector(".about-text-layer");
      const words = section.querySelectorAll(".about-word");
      const rule = section.querySelector(".about-rule");
      const copy = section.querySelector(".about-supporting-copy");
      const slotCenter = section.querySelector<HTMLElement>(".about-slot-center")!;
      const slotInline = section.querySelector<HTMLElement>(".about-slot-inline")!;
      // hero lives in a sibling section; the reference queries it globally
      const heroWrap = document.querySelector(".hero-image-wrap");
      const heroContent = document.querySelector(".hero-content");

      // A. lead-in
      const lead = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 0,
          end: () => section.getBoundingClientRect().top + window.scrollY - 0.1 * window.innerHeight,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      if (heroWrap) lead.to(heroWrap, { scale: 1.12, ease: "none" }, 0);
      if (heroContent) lead.to(heroContent, { y: -80, opacity: 0, ease: "power2.in", duration: 0.25 }, 0);
      lead
        .fromTo(clouds[1], { yPercent: 10, opacity: 0 }, { yPercent: -30, opacity: 1, ease: "none", duration: 0.3 }, 0)
        .fromTo(clouds[0], { yPercent: 20, opacity: 0 }, { yPercent: -20, opacity: 1, ease: "none", duration: 0.5 }, 0)
        .fromTo(bg, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.5)
        .fromTo(
          tiles,
          { opacity: 0, y: 56, scale: 0.86 },
          { opacity: 1, y: 0, scale: 1, ease: "expo.out", duration: 0.55, stagger: 0.07 },
          0.85,
        )
        .fromTo(box, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.85)
        .to({}, { duration: 0.01 }, 1.55);

      // B. pinned stage
      const rect = (el: HTMLElement): Rect => {
        const s = stage.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
      };
      const slotVars = (el: HTMLElement) => ({
        left: () => rect(el).x,
        top: () => rect(el).y,
        width: () => rect(el).w,
        height: () => rect(el).h,
      });
      const inset = () => ({
        left: () => 0.03 * stage.clientWidth,
        top: () => 0.03 * stage.clientHeight,
        width: () => 0.94 * stage.clientWidth,
        height: () => 0.94 * stage.clientHeight,
        borderRadius: 24,
      });

      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=320%",
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(box, { ...slotVars(slotCenter), borderRadius: 12 }, { ...inset(), ease: "power2.inOut", duration: 1 }, 0)
          .to(tilesL, { x: "-48vw", scale: 0.9, ease: "power2.in", duration: 0.2, stagger: 0.03 }, 0)
          .to(tilesR, { x: "48vw", scale: 0.9, ease: "power2.in", duration: 0.2, stagger: 0.03 }, 0)
          .to(gallery, { autoAlpha: 0, duration: 0.25 }, 0)
          .to(arrows, { autoAlpha: 0, duration: 0.2 }, 1.5)
          .fromTo(
            box,
            { ...inset() },
            { ...slotVars(slotInline), borderRadius: 8, ease: "power3.inOut", duration: 1.2, immediateRender: false },
            1.5,
          )
          .fromTo(textLayer, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 1.7)
          .fromTo(words, { yPercent: 110 }, { yPercent: 0, ease: "power3.out", duration: 0.5, stagger: 0.03 }, 1.9)
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.5 }, 2.4)
          .fromTo(copy, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.4 }, 2.8);
      });
      mm.add(MQ.mobile, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(gallery, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(arrows, { autoAlpha: 0, duration: 0.2 }, 0)
          .fromTo(
            box,
            { ...slotVars(slotCenter), borderRadius: 12 },
            { ...slotVars(slotInline), borderRadius: 4, ease: "power3.inOut", duration: 1.1 },
            0,
          )
          .fromTo(textLayer, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, 0.5)
          .fromTo(words, { yPercent: 110 }, { yPercent: 0, ease: "power3.out", duration: 0.5, stagger: 0.025 }, 0.7)
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.4 }, 1.3)
          .fromTo(copy, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.4 }, 1.55);
      });

      // text metrics change the inline slot size
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { scope: sectionRef },
  );
}
