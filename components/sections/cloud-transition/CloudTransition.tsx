"use client";
import { useRef, type CSSProperties } from "react";
import Placeholder from "@/components/ui/Placeholder";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { textReveal01 } from "@/components/providers/TextEffects";
import { cloudTransition as copy } from "@/content/residences";

/**
 * .ap-transition: white cloud bridge between the residence slides and #residence-02
 * (spec/03-motion/ap-transition.md, spec/01-layout/sections.md §5). Overlaps the previous pin by -50vh,
 * scrubbed (.8) clouds -> white wash -> centred statement; the heading gets a local masked char reveal.
 * Cloud art is client supplied later: the two layers are transparent Placeholder slots with the art's aspect.
 */
const WASH_MASK =
  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 15%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.9) 42%, #000 50%)";

export default function CloudTransition() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const section = sectionRef.current;
      if (!section) return;
      const clouds = gsap.utils.toArray<HTMLElement>(".ap-transition-cloud", section);
      const wash = section.querySelector<HTMLElement>(".ap-transition-wash");
      const copyEl = section.querySelector<HTMLElement>(".ap-transition-copy");
      if (clouds.length < 2 || !wash || !copyEl) return;

      const mm = gsap.matchMedia();
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: MQ.reduced }, (ctx) => {
        const { reduce } = ctx.conditions as { reduce: boolean };
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top bottom", end: "top 10%", scrub: 0.8, invalidateOnRefresh: true },
        });
        if (reduce) {
          // opacity only, no travel
          tl.fromTo(clouds[1], { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0)
            .fromTo(clouds[0], { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.5 }, 0)
            .fromTo(wash, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.5)
            .fromTo(copyEl, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.25 }, 0.85);
        } else {
          tl.fromTo(clouds[1], { yPercent: 10, opacity: 0 }, { yPercent: -30, opacity: 1, ease: "none", duration: 0.3 }, 0)
            .fromTo(clouds[0], { yPercent: 20, opacity: 0 }, { yPercent: -20, opacity: 1, ease: "none", duration: 0.5 }, 0)
            .fromTo(wash, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.3 }, 0.5)
            .fromTo(copyEl, { y: 36, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", duration: 0.55 }, 0.85);
        }
        tl.to({}, { duration: 0.01 }, 1.55);
      });

      // local heading reveal (data-reveal-local keeps it out of the global init); waits for the boot loader + fonts
      let cancelled = false;
      const reveal = contextSafe!(() => {
        if (cancelled || window.matchMedia(MQ.reduced).matches) return;
        textReveal01(section, true);
      });
      const start = () => (document.fonts?.ready ? document.fonts.ready.then(reveal) : reveal());
      if (document.body.dataset.bootLoaderComplete === "true") start();
      else window.addEventListener("bootloader:complete", start, { once: true });

      return () => {
        cancelled = true;
        window.removeEventListener("bootloader:complete", start);
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="ap-transition relative z-30 -mt-[50vh] h-[var(--h-m)] w-full overflow-x-clip bg-white text-[#2A2725] lg:h-[var(--h-d)]"
      style={{ "--h-d": "160vh", "--h-m": "80vh" } as CSSProperties}
      aria-label={copy.ariaLabel}
    >
      <div
        aria-hidden="true"
        className="ap-transition-wash pointer-events-none absolute inset-x-0 bottom-0 top-[-40vh] z-[35] bg-white opacity-0"
        style={{ WebkitMaskImage: WASH_MASK, maskImage: WASH_MASK }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-[-42vh] z-30 h-[112vh] w-full md:top-[-52vh]">
        {/* cloud-1-cropped (1440x550) and cloud-2-full (1440x900): h-auto w-full boxes, transparent until art arrives */}
        <div className="ap-transition-cloud absolute left-0 top-[25%] aspect-[1440/550] w-full max-w-none opacity-0 lg:top-0">
          <Placeholder slot={copy.cloudSlots[0]} tone="none" />
        </div>
        <div className="ap-transition-cloud absolute left-0 top-[20%] aspect-[1440/900] w-full max-w-none opacity-0 lg:top-[8%]">
          <Placeholder slot={copy.cloudSlots[1]} tone="none" />
        </div>
      </div>
      <div className="sticky top-0 z-40 flex h-[100svh] w-full items-center justify-center px-6 lg:h-screen">
        <div className="ap-transition-copy flex flex-col items-center text-center opacity-0">
          <p className="mb-4 text-[10px] uppercase tracking-[0.24em] lg:mb-5 lg:text-xs">{copy.eyebrow}</p>
          <h2
            data-reveal-01="true"
            data-reveal-local="true"
            data-scroll="true"
            data-duration="1"
            data-stagger="0.02"
            className="ap-transition-heading max-w-[15ch] font-serif text-[clamp(2.25rem,9vw,8rem)] leading-[94%]"
          >
            {copy.heading[0]}
            <br />
            {copy.heading[1]}
          </h2>
        </div>
      </div>
    </section>
  );
}
