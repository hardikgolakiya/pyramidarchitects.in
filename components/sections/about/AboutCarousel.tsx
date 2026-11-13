"use client";
import { useRef } from "react";
import Placeholder from "@/components/ui/Placeholder";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { about } from "@/content/home-hero-about";

// Blank slots are all the same fill; a small brightness step per slide keeps the slide motion visible
// until the client images arrive. Remove when real images replace the placeholders.
const SHADES = ["", "brightness-95", "brightness-90", "brightness-[.85]", "brightness-90", "brightness-95", "brightness-[.97]"];

const arrowCls =
  "flex h-10 w-10 items-center justify-center rounded-full bg-[#EDE6D6] text-[#2A2725] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A2725] ls:h-8 ls:w-8";

function Chevron({ dir }: { dir: -1 | 1 }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir < 0 ? "M13 8H3M7.5 3.5 3 8l4.5 4.5" : "M3 8h10M8.5 3.5 13 8l-4.5 4.5"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The morphing `.about-box` (position/size/radius/opacity driven by useAboutScroll) with the 7-slide carousel
 * (spec/03-motion/about-cloud-parallax.md §C): expo.out 1 s, outgoing drifts -30%, input locked while animating,
 * autoplay every 2 s while the stage is >= 20% visible, restarted on arrow click, never under reduced motion.
 */
export default function AboutCarousel() {
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const box = boxRef.current;
      const stage = box?.closest(".about-stage");
      if (!box || !stage || !contextSafe) return;
      const slides = box.querySelectorAll(".about-slide");
      const [prevBtn, nextBtn] = box.querySelectorAll<HTMLButtonElement>(".about-arrows button");
      gsap.set(slides, { xPercent: 100 });
      gsap.set(slides[0], { xPercent: 0 });

      let cur = 0;
      let locked = false;
      let visible = false;
      let timer: ReturnType<typeof setInterval> | null = null;

      const go = contextSafe((dir: 1 | -1) => {
        if (locked) return;
        const n = slides.length;
        const next = (cur + dir + n) % n;
        locked = true;
        gsap.set(slides[next], { xPercent: 100 * dir, zIndex: 2 });
        gsap.set(slides[cur], { zIndex: 1 });
        gsap.to(slides[cur], { xPercent: -30 * dir, duration: 1, ease: "expo.out" });
        gsap.to(slides[next], {
          xPercent: 0,
          duration: 1,
          ease: "expo.out",
          onComplete: () => {
            locked = false;
          },
        });
        cur = next;
      });
      const stop = () => {
        if (timer) clearInterval(timer);
        timer = null;
      };
      const start = () => {
        stop();
        if (!visible || window.matchMedia(MQ.reduced).matches) return;
        timer = setInterval(() => go(1), 2000);
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        },
        { threshold: 0.2 },
      );
      io.observe(stage);

      const onPrev = () => {
        go(-1);
        start();
      };
      const onNext = () => {
        go(1);
        start();
      };
      prevBtn?.addEventListener("click", onPrev);
      nextBtn?.addEventListener("click", onNext);

      return () => {
        io.disconnect();
        stop();
        prevBtn?.removeEventListener("click", onPrev);
        nextBtn?.removeEventListener("click", onNext);
      };
    },
    { scope: boxRef },
  );

  return (
    <div ref={boxRef} className="about-box absolute left-0 top-0 z-50 overflow-hidden rounded-xl opacity-0">
      {about.slides.map((s, i) => (
        <div key={s.slot} className="about-slide absolute inset-0 h-full w-full">
          <Placeholder slot={s.slot} label={s.alt} className={SHADES[i % SHADES.length]} />
        </div>
      ))}
      <div className="about-arrows absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-3 ls:bottom-2">
        <button type="button" aria-label={about.prevLabel} className={arrowCls}>
          <Chevron dir={-1} />
        </button>
        <button type="button" aria-label={about.nextLabel} className={arrowCls}>
          <Chevron dir={1} />
        </button>
      </div>
    </div>
  );
}
