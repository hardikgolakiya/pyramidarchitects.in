"use client";
import { useRef, type CSSProperties } from "react";
import Placeholder from "@/components/ui/Placeholder";
import { cn } from "@/lib/cn";
import { about } from "@/content/home-hero-about";
import AboutCarousel from "./AboutCarousel";
import { useAboutScroll } from "./useAboutScroll";

const MASK = "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 15%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.9) 42%, #000 50%)";

// Decorative clouds (alt "" in the reference, generated art per spec/04-assets-seo/placeholder-assets.md):
// drawn as soft CSS cloud shapes in the section beige, at the reference aspect ratios (1440x550 and 1440x900),
// so the parallax reads over the hero until the transparent WebP clouds are supplied.
const SAND = "237,230,214";
const puff = (x: number, y: number, w: number, h: number, a = 1) =>
  `radial-gradient(${w}% ${h}% at ${x}% ${y}%, rgba(${SAND},${a}) 0%, rgba(${SAND},${a * 0.85}) 35%, rgba(${SAND},0) 70%)`;
const CLOUD_1: CSSProperties = {
  backgroundImage: [
    puff(8, 70, 22, 45), puff(24, 62, 20, 50), puff(40, 70, 22, 42), puff(55, 58, 24, 52),
    puff(72, 68, 22, 46), puff(90, 62, 22, 50), `linear-gradient(to bottom, rgba(${SAND},0) 55%, rgba(${SAND},1) 85%)`,
  ].join(","),
};
const CLOUD_2: CSSProperties = {
  backgroundImage: [
    puff(12, 48, 26, 30, 0.9), puff(32, 40, 24, 34, 0.9), puff(50, 50, 28, 30, 0.9), puff(68, 42, 24, 34, 0.9),
    puff(88, 50, 26, 30, 0.9), puff(50, 72, 70, 30), `linear-gradient(to bottom, rgba(${SAND},0) 50%, rgba(${SAND},1) 80%)`,
  ].join(","),
};

const words = about.headline.split(" ");

/** About (#about): cloud lead-in, tile gallery, image box morph into the sentence (spec/01-layout/sections.md §2). */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useAboutScroll(sectionRef, stageRef);

  return (
    <section ref={sectionRef} id="about" className="relative z-20 overflow-x-clip bg-[#EDE6D6] text-[#2A2725]">
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-[-42vh] z-30 h-[112vh] w-full md:top-[-52vh]">
        <div
          data-placeholder="cloud-1-beige"
          className="about-cloud absolute left-[-0%] top-[25%] aspect-[1440/550] h-auto w-[100%] max-w-none opacity-0 lg:top-0"
          style={CLOUD_1}
        />
        <div
          data-placeholder="cloud-2-beige"
          className="about-cloud absolute left-[-0%] top-[20%] aspect-[1440/900] h-auto w-[100%] max-w-none opacity-0 lg:top-[8%]"
          style={CLOUD_2}
        />
      </div>
      <div
        aria-hidden="true"
        className="about-bg pointer-events-none absolute inset-x-0 bottom-0 top-[-40vh] z-[35] bg-[#EDE6D6] opacity-0"
        style={{ WebkitMaskImage: MASK, maskImage: MASK }}
      />

      <div ref={stageRef} className="about-stage relative z-40 h-[100svh] w-full overflow-hidden lg:h-screen">
        <div
          aria-hidden="true"
          className="about-slot-center pointer-events-none invisible absolute left-[6%] top-[24%] h-[40%] w-[88%] md:left-[10%] md:top-[26%] md:h-[38%] md:w-[80%] lg:left-[26%] lg:top-[24%] lg:h-[38%] lg:w-[46%] ls:left-[15%] ls:top-[25%] ls:h-[60%] ls:w-[70%]"
        />

        <div className="about-gallery absolute inset-0">
          <p
            data-reveal-01="chars"
            data-scroll=""
            className="about-tile absolute inset-x-0 top-[12%] px-6 text-center font-serif text-3xl leading-tight opacity-0 lg:inset-x-auto lg:left-[26%] lg:top-[0%] lg:w-[20%] lg:px-0 lg:text-[3.5vw] ls:top-[13%] ls:text-2xl"
          >
            {about.caption}
          </p>
          {about.tiles.map((t) => (
            <div
              key={t.slot}
              className={cn(
                "about-tile absolute hidden overflow-hidden rounded-xl opacity-0 lg:block",
                t.side === "l" ? "about-tile-l" : "about-tile-r",
                t.pos,
              )}
              style={{ rotate: `${t.rotate}deg` }}
            >
              <Placeholder slot={t.slot} />
            </div>
          ))}
        </div>

        <div className="about-text-layer absolute inset-0 flex items-center px-6 opacity-0 lg:px-10">
          <div className="grid w-full grid-cols-12 gap-4 lg:gap-6">
            <div className="col-span-12 lg:col-span-2 ls:col-span-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#2A2725]">{about.eyebrow}</div>
            </div>
            <div className="col-span-12 lg:col-span-10 ls:col-span-10">
              <p
                className="font-sans text-[clamp(1.75rem,7vw,2.5rem)] leading-[1.05] tracking-[-0.045em] lg:text-[5.2vw] lg:leading-[80%] ls:text-[1.75rem]"
              >
                <span
                  aria-hidden="true"
                  className="about-slot-inline mb-[0.14em] mr-[0.18em] inline-block h-[0.82em] w-[1.7em] align-bottom"
                />
                {words.map((w, i) => (
                  <span
                    key={i}
                    className="-mb-[0.1em] -mt-[1em] mr-[0.25em] inline-block overflow-hidden pb-[0.2em] pt-[0.1em] align-bottom"
                  >
                    <span className="about-word inline-block">{w}</span>
                  </span>
                ))}
              </p>
              <div className="about-rule mt-4 h-px w-full bg-[#2A2725] lg:mt-6 ls:mt-3" />
              <p className="about-supporting-copy mt-4 max-w-[350px] text-sm leading-[1.35] tracking-[-0.01em] opacity-0 lg:mt-6 lg:text-lg ls:mt-2 ls:max-w-[420px] ls:text-xs">
                {about.supporting}
              </p>
            </div>
          </div>
        </div>

        <AboutCarousel />
      </div>
    </section>
  );
}
