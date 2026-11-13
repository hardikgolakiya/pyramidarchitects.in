"use client";
import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import Placeholder from "@/components/ui/Placeholder";
import { apartment } from "@/content/apartment-tour";

/**
 * #residence-02: clip-path intro scrub, then a pinned 3-room carousel driven by a scroll state machine.
 * Spec: spec/03-motion/residence-02.md, spec/03-motion/frames/residence-02.md, spec/01-layout/sections.md.
 */

type Slot = { left: number; top: number; width: number; height: number; borderRadius: number; opacity: number };
type SlotSet = Record<"hero" | "main" | "prev" | "next" | "out" | "wait", Slot>;

const thumb = { borderRadius: 18 };
const SLOTS: { desktop: SlotSet; mobile: SlotSet } = {
  desktop: {
    hero: { left: 0, top: 0, width: 100, height: 100, borderRadius: 0, opacity: 1 },
    main: { left: 27, top: 3.4, width: 45, height: 93.2, borderRadius: 28, opacity: 1 },
    prev: { left: 16.6, top: 3.4, width: 8.6, height: 18, ...thumb, opacity: 1 },
    next: { left: 74, top: 78.6, width: 8.6, height: 18, ...thumb, opacity: 1 },
    out: { left: 16.6, top: 3.4, width: 8.6, height: 18, ...thumb, opacity: 0 },
    wait: { left: 74, top: 78.6, width: 8.6, height: 18, ...thumb, opacity: 0 },
  },
  mobile: {
    hero: { left: 0, top: 0, width: 100, height: 100, borderRadius: 0, opacity: 1 },
    main: { left: 4, top: 3, width: 92, height: 50, borderRadius: 28, opacity: 1 },
    prev: { left: 4, top: 84, width: 22, height: 12, ...thumb, opacity: 1 },
    next: { left: 74, top: 84, width: 22, height: 12, ...thumb, opacity: 1 },
    out: { left: 4, top: 84, width: 22, height: 12, ...thumb, opacity: 0 },
    wait: { left: 74, top: 84, width: 22, height: 12, ...thumb, opacity: 0 },
  },
};

const ROOMS = apartment.rooms;
const D = ROOMS.length; // 3
const F = 130 + 110 * D + 40; // 500 (% of viewport height pinned)
const pad = (n: number) => String(n).padStart(2, "0");
const active = (step: number) => (step === 0 ? 0 : step - 1);
const css = (s: Slot) => ({
  left: `${s.left}%`,
  top: `${s.top}%`,
  width: `${s.width}%`,
  height: `${s.height}%`,
  borderRadius: s.borderRadius,
  opacity: s.opacity,
});
const label = (s: number) => (s < 0 ? "hidden" : `s${s}`);

function Mask({ children }: { children: ReactNode }) {
  return <span className="-mb-[0.18em] -mt-[0.05em] block overflow-hidden pb-[0.18em] pt-[0.05em]">{children}</span>;
}

export default function ApartmentStage() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const stage = root.querySelector<HTMLElement>(".ap-stage");
      const images = gsap.utils.toArray<HTMLElement>(".ap-img", root);
      const inners = gsap.utils.toArray<HTMLElement>(".ap-img-inner", root);
      const heroPieces = gsap.utils.toArray<HTMLElement>(".ap-hero-piece", root);
      const texts = gsap.utils.toArray<HTMLElement>(".ap-text", root).map((t) => gsap.utils.toArray<HTMLElement>(".ap-piece", t));
      const labelEl = root.querySelector<HTMLElement>(".ap-label");
      const countCol = root.querySelector<HTMLElement>(".ap-count-col");
      if (!stage || images.length !== D) return;
      let state = -1;

      const mm = gsap.matchMedia();
      mm.add(
        {
          // desktop slot set also applies to landscape phones (reference condition)
          desktop: `${MQ.desktop}, ${MQ.landscapePhone}`,
          mobile: MQ.mobile,
          reduced: MQ.reduced,
        },
        (ctx) => {
          const { desktop, reduced } = ctx.conditions as { desktop: boolean; reduced: boolean };
          const S = desktop ? SLOTS.desktop : SLOTS.mobile;
          const slotFor = (img: number, step: number): Slot => {
            if (step === 0) return img === 0 ? S.hero : S.wait;
            const k = img - (step - 1);
            return k <= -2 ? S.out : k === -1 ? S.prev : k === 0 ? S.main : k === 1 ? S.next : S.wait;
          };

          images.forEach((img, i) => gsap.set(img, { ...css(slotFor(i, 0)), zIndex: D - i }));
          gsap.set(inners, { scale: (i: number) => (i === 0 ? 1 : 1.2) });
          gsap.set(heroPieces, { yPercent: 110, opacity: 0 });
          texts.forEach((p) => gsap.set(p, { yPercent: 110, opacity: 0 }));
          gsap.set(labelEl, { opacity: 0 });

          // A. intro scrub: window opens from white into a full-bleed image
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: stage, start: "top top", end: "+=100%", scrub: 0.8, invalidateOnRefresh: true },
            })
            .fromTo(
              images[0],
              { clipPath: desktop ? "inset(24% 32% 24% 32% round 28px)" : "inset(30% 8% 30% 8% round 28px)" },
              { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 },
              0,
            )
            .fromTo(inners[0], { scale: 1.3 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
            .fromTo(stage, { backgroundColor: "#FFFFFF" }, { backgroundColor: "#EDE6D6", duration: 0.4 }, 0.6);

          // B. paused state timeline with labels hidden, s0..s3
          const w = gsap.timeline({ paused: true });
          w.addLabel("hidden", 0);
          w.fromTo(
            heroPieces,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: "power3.out", immediateRender: false },
            0,
          );
          w.addLabel("s0", 1);
          for (let e = 1; e <= D; e++) {
            const t = 1 + (e - 1) * 1.2;
            const first = e === 1;
            images.forEach((img, i) => {
              const from = slotFor(i, e - 1);
              const to = slotFor(i, e);
              if (from !== to) {
                const waitToNext = from === S.wait && to === S.next;
                // the wait->next hop starts at t+.6 and is cut by the s1 label (thumb rests at .9 opacity, as reference)
                w.to(img, { ...css(to), duration: first && i === 0 ? 1.1 : 0.9, ease: "power3.inOut" }, waitToNext && first ? t + 0.6 : t);
              }
              const sFrom = i === active(e - 1) ? 1 : 1.2;
              const sTo = i === active(e) ? 1 : 1.2;
              if (sFrom !== sTo) w.to(inners[i], { scale: sTo, duration: 0.9, ease: "power3.inOut" }, t);
            });
            if (active(e) !== active(e - 1)) {
              w.set(images[active(e)], { zIndex: 3 }, t);
              w.set(images[active(e - 1)], { zIndex: 2 }, t);
            }
            if (first) {
              w.fromTo(
                heroPieces,
                { yPercent: 0, opacity: 1 },
                { yPercent: -110, opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.in", immediateRender: false },
                t,
              );
            } else {
              w.fromTo(
                texts[e - 2],
                { yPercent: 0, opacity: 1 },
                { yPercent: -110, opacity: 0, duration: 0.2, stagger: 0.03, ease: "power2.in", immediateRender: false },
                t,
              );
            }
            w.to(texts[e - 1], { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power3.out" }, t + (first ? 0.55 : 0.35));
            if (first) w.to(labelEl, { opacity: 1, duration: 0.6 }, t + 0.6);
            else w.to(countCol, { yPercent: -(100 / D) * (e - 1), duration: 0.6, ease: "power3.inOut" }, t);
            w.set({}, {}, t + 1.2);
            w.addLabel(`s${e}`, t + 1.2);
          }
          w.seek(label(state));

          let tween: gsap.core.Tween | undefined;
          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: `+=${F}%`,
            pin: true,
            anticipatePin: 1,
            onUpdate(self) {
              const i = self.progress * F;
              const a = (i - 100 - 30) / 110;
              const s = a >= 0.6 ? Math.min(D, Math.floor(a - 0.6) + 1) : i >= 90 ? 0 : -1;
              if (s === state) return;
              state = s;
              tween?.kill();
              if (reduced) {
                tween = undefined;
                w.seek(label(s));
              } else {
                tween = w.tweenTo(label(s), { ease: "none" });
              }
            },
          });

          return () => tween?.kill();
        },
      );
      return () => mm.revert();
    },
    { scope: ref, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <section ref={ref} id="residence-02" className="relative z-30 w-full bg-[#EDE6D6] text-[#2A2725]">
      <div className="ap-stage relative h-screen w-full overflow-hidden bg-white text-[#2A2725]">
        <div className="absolute inset-0">
          {ROOMS.map((room) => (
            <div key={room.image.slot} className="ap-img absolute overflow-hidden">
              {/* blank until the client supplies the photo; object-position kept in content for later */}
              <Placeholder
                slot={room.image.slot}
                tone="dark"
                label={room.image.alt}
                className="ap-img-inner will-change-transform"
              />
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 p-6 text-white md:p-8 lg:gap-5 lg:p-12 ls:gap-2 ls:p-6">
            <Mask>
              <p className="ap-hero-piece text-[10px] uppercase tracking-[0.2em]">{apartment.intro.eyebrow}</p>
            </Mask>
            <h2 className="font-sans text-[clamp(2.75rem,12vw,5.5rem)] leading-[0.92] tracking-[-0.05em] lg:text-[7vw] ls:text-[7vw]">
              {apartment.intro.headline.map((line) => (
                <Mask key={line}>
                  <span className="ap-hero-piece block">{line}</span>
                </Mask>
              ))}
            </h2>
          </div>

          <div className="absolute bottom-[16%] left-[6%] right-[6%] top-[56%] lg:bottom-[24%] lg:left-[74%] lg:right-[3%] lg:top-[18%] ls:bottom-[14%] ls:left-[73%] ls:right-[3%] ls:top-[12%]">
            {ROOMS.map((room) => (
              <div key={room.eyebrow} className="ap-text absolute inset-0 flex flex-col justify-center gap-3 lg:gap-5 ls:gap-2">
                <Mask>
                  <p className="ap-piece text-[10px] uppercase tracking-[0.2em]">{room.eyebrow}</p>
                </Mask>
                <h2 className="font-sans text-[clamp(1.75rem,6.5vw,2.75rem)] leading-[0.98] tracking-[-0.04em] lg:text-[2.8vw] ls:text-[2.8vw]">
                  {room.headline.map((line) => (
                    <Mask key={line}>
                      <span className="ap-piece block">{line}</span>
                    </Mask>
                  ))}
                </h2>
                <Mask>
                  <p className="ap-piece max-w-[24rem] text-xs leading-[1.5] tracking-[-0.01em] md:text-sm ls:text-[11px] ls:leading-[1.4]">
                    {room.body}
                  </p>
                </Mask>
                <Mask>
                  <p className="ap-piece text-[10px] uppercase leading-[1.6] tracking-[0.16em] opacity-70 ls:text-[9px]">
                    {room.tags.join(apartment.tagSeparator)}
                  </p>
                </Mask>
              </div>
            ))}
          </div>

          <div className="ap-label absolute bottom-[3.4%] left-[2.6%] z-20 hidden items-center gap-4 text-[11px] uppercase tracking-[0.18em] lg:flex ls:flex">
            <span>{apartment.label}</span>
            <span className="flex items-center gap-1 tabular-nums">
              <span className="block h-[1.4em] overflow-hidden leading-[1.4em]">
                <span className="ap-count-col flex flex-col">
                  {ROOMS.map((room, i) => (
                    <span key={room.eyebrow} className="block h-[1.4em] leading-[1.4em]">
                      {pad(i + 1)}
                    </span>
                  ))}
                </span>
              </span>
              <span className="opacity-50">
                {apartment.countPrefix}
                {pad(D)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
