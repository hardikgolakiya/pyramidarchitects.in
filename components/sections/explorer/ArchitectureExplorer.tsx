"use client";
import { useCallback, useRef, useState } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { explorer } from "@/content/explorer";
import InkDissolveCard from "./InkDissolveCard";
import ExplorerHud from "./ExplorerHud";
import {
  P_GROW,
  P_INK,
  PROMPT_DURATION,
  SCRUB,
  SECTION_VH,
  TRACK_DURATION,
  TRACK_START,
  inkFromProgress,
  progressForView,
  progressFromViewProgress,
  viewIndexFromProgress,
  viewProgressFromProgress,
} from "./stages";

const WORDS = Array.from({ length: 8 }, () => explorer.marqueeWord);
const ROWS = [0, 1, 2];

/**
 * #marquee-transition: brand marquee + image window -> full-screen growth -> ink dissolve -> 7-view 3D explorer.
 * Spec: spec/03-motion/marquee-transition.md, frames/marquee.md. 1020vh runway, stage pinned for 920vh.
 */
export default function ArchitectureExplorer() {
  const sectionRef = useRef<HTMLElement>(null);
  const inkProgress = useRef(0);
  const viewProgress = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);
  /** rail click target: holds the selected view while the page scrolls there (no flicker through views) */
  const pendingView = useRef<{ index: number; until: number } | null>(null);
  const [hudVisible, setHudVisible] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [view, setView] = useState(0);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = section?.querySelector<HTMLElement>(".marquee-stage");
      const card = section?.querySelector<HTMLElement>(".marquee-canvas");
      const track = section?.querySelector<HTMLElement>(".marquee-track");
      const prompt = section?.querySelector<HTMLElement>(".marquee-prompt");
      if (!section || !stage || !card || !track || !prompt) return;

      const mm = gsap.matchMedia();
      // phone landscape: card starts at 72vh x 45vh (also set via ls: classes for first paint)
      mm.add(MQ.landscapePhone, () => {
        gsap.set(card, { width: "72vh", height: "45vh" });
      });
      // free-running marquee loop, independent of scroll (frozen at 0 for reduced motion)
      mm.add({ reduce: MQ.reduced, ok: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        if (ctx.conditions?.reduce) gsap.set(track, { xPercent: 0 });
        else gsap.to(track, { xPercent: -33.333, duration: 20, ease: "none", repeat: -1 });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          pin: stage,
          scrub: SCRUB,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const p = tl.progress();
          inkProgress.current = inkFromProgress(p);
          viewProgress.current = viewProgressFromProgress(p);
          setHudVisible(p >= P_GROW);
          setAnimationActive(p >= P_GROW && p < 1);
          const idx = viewIndexFromProgress(p);
          const pending = pendingView.current;
          if (pending && (idx === pending.index || performance.now() > pending.until)) pendingView.current = null;
          if (!pendingView.current) setView(idx);
        },
      });
      tl.to({}, { duration: 1 }, 0)
        .to(card, { width: "100vw", height: "100vh", borderRadius: 0, ease: "power2.inOut", duration: P_GROW }, 0)
        .to(prompt, { opacity: 0, duration: PROMPT_DURATION }, 0)
        .to(track, { opacity: 0, yPercent: -25, duration: TRACK_DURATION }, TRACK_START);
      stRef.current = tl.scrollTrigger ?? null;

      return () => {
        stRef.current = null;
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  /** move the page so the pinned timeline lands on progress p (scrub .8 then eases the visuals there) */
  const scrollToProgress = useCallback((p: number, immediate: boolean) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * Math.min(1, Math.max(0, p));
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(y, { immediate, force: true, ...(immediate ? {} : { duration: 1.2 }) });
    else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
  }, []);

  // rail dot: preview the view at once (as the reference) and scroll to that view's segment
  const onSelect = useCallback(
    (index: number) => {
      setView(index);
      pendingView.current = { index, until: performance.now() + 2000 };
      scrollToProgress(progressForView(index), false);
    },
    [scrollToProgress],
  );

  // HUD knob / bar drag: scrub the scroll position directly
  const onScrub = useCallback(
    (vp: number) => {
      pendingView.current = null;
      scrollToProgress(Math.max(P_INK + 1e-4, progressFromViewProgress(vp)), true);
    },
    [scrollToProgress],
  );

  return (
    <section
      id="marquee-transition"
      ref={sectionRef}
      className="relative bg-[#EDE6D6] text-[#2A2725]"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div className="marquee-stage relative h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center overflow-hidden">
          <div className="marquee-track flex whitespace-nowrap font-sans text-[clamp(2.5rem,10vw,8rem)] font-medium leading-none tracking-[-0.07em] lg:text-[clamp(3.5rem,7.5vw,8rem)]">
            {ROWS.map((r) => (
              <div key={r} className="flex shrink-0" aria-hidden={r > 0 || undefined}>
                {WORDS.map((w, i) => (
                  <span key={i} className="mx-[0.2em]">
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <InkDissolveCard
          progressRef={inkProgress}
          src={explorer.slots.texture.src}
          slot={explorer.slots.texture.slot}
          reduced={reduced}
        />
        <div className="marquee-prompt absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-black/55">
          {explorer.prompt}
        </div>
        <ExplorerHud
          visible={hudVisible}
          animationActive={animationActive}
          activeIndex={view}
          progressRef={viewProgress}
          reduced={reduced}
          onSelect={onSelect}
          onScrub={onScrub}
        />
      </div>
    </section>
  );
}
