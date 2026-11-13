"use client";
import { useRef } from "react";
import Placeholder from "@/components/ui/Placeholder";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { residenceSlides, residenceSlidesCounterLabel } from "@/content/residences";

/**
 * #residence-slides: pinned two-panel slider (spec/03-motion/residence-slides.md, spec/01-layout/sections.md §4).
 * Text cards stack per slide; one .rs-swiper image panel hops between columns (lg + landscape phone)
 * while its items wipe vertically. Pin +=220%, state change at progress .1636 (324 px @ 900 vh), time-based tweenTo.
 */
const DESKTOP_Q = `${MQ.desktop}, ${MQ.landscapePhone}`;
const pad = (n: number) => String(n).padStart(2, "0");

export default function ResidenceSlides() {
  const sectionRef = useRef<HTMLElement>(null);
  const slides = residenceSlides;
  const n = slides.length;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const stage = section.querySelector<HTMLElement>(".rs-stage");
      const swiper = section.querySelector<HTMLElement>(".rs-swiper");
      if (!stage || !swiper) return;
      const slideEls = gsap.utils.toArray<HTMLElement>(".rs-slide", section);
      const texts = slideEls.map((s) => s.querySelector<HTMLElement>(".rs-text")!);
      const lines = slideEls.map((s) => gsap.utils.toArray<HTMLElement>(".rs-line", s));
      const counters = slideEls.map((s) => s.querySelector<HTMLElement>(".rs-counter")!);
      const copies = slideEls.map((s) => s.querySelector<HTMLElement>(".rs-copy")!);
      const items = gsap.utils.toArray<HTMLElement>(".rs-swiper-item", section);
      const imgs = gsap.utils.toArray<HTMLElement>(".rs-img", section);

      const mm = gsap.matchMedia();
      mm.add(
        { isDesktop: DESKTOP_Q, isMobile: MQ.mobile, reduce: MQ.reduced },
        (ctx) => {
          const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean };

          // 1. intro (once, stage top at 75% of viewport)
          if (reduce) {
            gsap.set([texts[0], swiper], { yPercent: 0 });
            gsap.set(imgs[0], { scale: 1 });
            gsap.set(lines[0], { yPercent: 0, opacity: 1 });
            gsap.set([counters[0], copies[0]], { y: 0, opacity: 1 });
          } else {
            gsap
              .timeline({ defaults: { ease: "power3.out" }, scrollTrigger: { trigger: stage, start: "top 75%", once: true } })
              .fromTo(texts[0], { yPercent: 105 }, { yPercent: 0, duration: 1.1 }, 0)
              .fromTo(swiper, { yPercent: 105 }, { yPercent: 0, duration: 1.1 }, 0.12)
              .fromTo(imgs[0], { scale: 1.25 }, { scale: 1, duration: 1.6 }, 0.12)
              .fromTo(lines[0], { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, 0.5)
              .fromTo([counters[0], copies[0]], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, 0.9);
          }

          // 2. state machine (paused timeline with labels s0..s{n-1})
          gsap.set(items.slice(1), { yPercent: -100 });
          gsap.set(imgs.slice(1), { scale: 1.35, yPercent: 15 });
          gsap.set(texts.slice(1), { yPercent: 105 });
          gsap.set(lines.slice(1).flat(), { yPercent: 110, opacity: 0 });
          gsap.set([...counters.slice(1), ...copies.slice(1)], { y: 16, opacity: 0 });

          const firstSide = slides[0].textColumn === 1 ? "right" : "left";
          const f = firstSide === "right" ? -1 : 1;
          const tl = gsap.timeline({ paused: true });
          tl.addLabel("s0", 0);
          for (let t = 1; t < n; t++) {
            const r = (t - 1) * 1.1;
            const flip = isDesktop && slides[t].textColumn !== slides[0].textColumn;
            tl.to(swiper, { xPercent: flip ? 100 * f : 0, x: flip ? 12 * f : 0, duration: 0.9, ease: "power3.inOut" }, r)
              .to(items[t - 1], { yPercent: 100, duration: 0.8, ease: "power3.inOut" }, r + 0.05)
              .to(items[t], { yPercent: 0, duration: 0.8, ease: "power3.inOut" }, r + 0.05)
              .to(imgs[t], { scale: 1, yPercent: 0, duration: 0.9, ease: "power2.out" }, r + 0.05)
              .to(imgs[t - 1], { scale: 1.35, yPercent: -15, duration: 0.8, ease: "power2.in" }, r + 0.05)
              .to(texts[t], { yPercent: 0, duration: 0.9, ease: "power3.inOut" }, r)
              .to(lines[t], { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }, r + 0.5)
              .to([counters[t], copies[t]], { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power3.out" }, r + 0.65)
              .addLabel("s" + t, r + 1.1);
          }

          const span = (n - 1) * 120 + 100; // 220 for 2 slides
          let current = 0;
          let tween: gsap.core.Tween | null = null;
          const apply = (self: ScrollTrigger) => {
            const t = (self.progress * span) / 120;
            const idx = t < 0.3 ? 0 : Math.min(n - 1, Math.floor(t - 0.3) + 1);
            if (idx === current) return;
            current = idx;
            tween?.kill();
            tween = tl.tweenTo("s" + idx, reduce ? { duration: 0.01 } : { ease: "none" });
          };
          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: `+=${span}%`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: apply,
            onRefresh: apply,
          });

          return () => {
            tween?.kill();
            tl.kill();
          };
        },
      );
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="residence-slides" className="relative z-20 w-full bg-[#EDE6D6] text-[#2A2725]">
      <div className="rs-stage relative h-screen w-full overflow-hidden p-3 md:p-5 lg:p-8 ls:p-3">
        <div className="relative h-full w-full">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="rs-slide pointer-events-none absolute inset-0 grid grid-rows-2 gap-3 lg:grid-cols-2 lg:grid-rows-1 ls:grid-cols-2 ls:grid-rows-1"
              style={{ zIndex: i + 1 }}
            >
              <div
                className={cn(
                  "rs-text pointer-events-auto relative flex flex-col justify-between overflow-hidden rounded-[28px] p-5 md:rounded-[36px] md:p-8 lg:p-10 ls:rounded-[20px] ls:p-4",
                  slide.textColumn === 1 ? "lg:col-start-1 ls:col-start-1" : "lg:col-start-2 ls:col-start-2",
                )}
                style={{ backgroundColor: slide.bg, color: slide.fg }}
              >
                <h2 className="font-sans text-[clamp(2rem,8vw,3.75rem)] leading-[0.95] tracking-[-0.04em] lg:text-[4.4vw] ls:text-[3.4vw]">
                  {slide.headline.map((line) => (
                    <span key={line} className="-mb-[0.15em] -mt-[0.05em] block overflow-hidden pb-[0.15em] pt-[0.05em]">
                      <span className="rs-line block">{line}</span>
                    </span>
                  ))}
                </h2>
                <div className="flex items-end justify-between gap-6 ls:gap-3">
                  <div
                    role="group"
                    className="rs-counter flex shrink-0 -space-x-px text-sm ls:text-xs"
                    aria-label={residenceSlidesCounterLabel(i + 1, n)}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-current md:h-14 md:w-14 ls:h-9 ls:w-9">
                      {pad(i + 1)}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-current opacity-40 md:h-14 md:w-14 ls:h-9 ls:w-9">
                      {pad(n)}
                    </span>
                  </div>
                  <p className="rs-copy max-w-[22rem] text-xs leading-[1.4] tracking-[-0.01em] md:text-base ls:max-w-[14rem] ls:text-[10px]">
                    {slide.copy}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="rs-swiper absolute inset-x-0 bottom-0 isolate z-50 h-[calc(50%-6px)] overflow-hidden rounded-[28px] md:rounded-[36px] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[calc(50%-6px)] ls:inset-y-0 ls:left-auto ls:right-0 ls:h-auto ls:w-[calc(50%-6px)] ls:rounded-[20px]">
            {slides.map((slide, i) => (
              <div key={slide.id} className="rs-swiper-item absolute inset-0 overflow-hidden" style={{ zIndex: i + 1 }}>
                <Placeholder
                  slot={slide.image.slot}
                  tone={slide.image.tone}
                  label={slide.image.alt}
                  className="rs-img will-change-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
