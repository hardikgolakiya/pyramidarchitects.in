"use client";
import { useRef } from "react";
import Placeholder from "@/components/ui/Placeholder";
import { hero } from "@/content/home-hero-about";
import { useHeroIntro } from "./useHeroIntro";

const metaCls =
  "text-[11px] uppercase tracking-[0.18em] text-white md:text-sm lg:text-lg ls:text-[10px]";
const ctaCls =
  "group pointer-events-auto flex cursor-pointer items-center gap-3 py-1.5 text-sm uppercase md:text-base lg:py-0 lg:text-lg ls:text-xs";

/** Hero (spec/01-layout/sections.md §1, spec/03-motion/hero.md). CSS sticky; About scrolls over it (z-20). */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  useHeroIntro(ref);

  return (
    <section
      ref={ref}
      id="top"
      className="sticky top-0 z-0 h-[100svh] min-h-[100svh] w-full select-none overflow-hidden bg-black text-white lg:h-screen lg:min-h-screen"
    >
      <div className="hero-image-wrap pointer-events-none absolute inset-0">
        {/* blank asset slot: object-cover full-bleed photo goes here */}
        <Placeholder slot={hero.image.slot} tone="dark" label={hero.image.alt} className="hero-image" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="hero-content pointer-events-auto absolute inset-0 z-10">
        <div className="absolute left-6 top-[16%] md:left-10 lg:left-10 lg:top-[7%] ls:top-[18%]">
          <h1
            data-reveal-01=""
            className="hero-title-line font-serif text-[clamp(2.75rem,12vw,4.5rem)] leading-[94%] text-white md:text-[5rem] lg:text-[5.64rem] ls:text-[2.25rem]"
          >
            {hero.title[0]}
            <br />
            {hero.title[1]}
          </h1>
          <div className="hero-actions mt-4 flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:gap-5 ls:mt-2 ls:flex-row ls:gap-5">
            {hero.ctas.map((cta) => (
              <a key={cta.href} href={cta.href} className={ctaCls}>
                <span data-hover-reveal="" className="border-b border-white">
                  {cta.label}
                </span>
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  {hero.arrow}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="hero-meta pointer-events-none absolute bottom-[13%] left-0 right-0 px-6 md:px-10 lg:inset-0 lg:flex lg:items-center lg:px-10 ls:bottom-14">
          <div className="hero-meta-inner grid w-full grid-cols-2 gap-x-6 gap-y-1 md:flex md:items-end md:justify-between md:gap-0 lg:flex lg:items-end lg:justify-between ls:flex ls:items-end ls:justify-between ls:gap-0">
            {hero.meta.map((m) => (
              <p key={m} data-reveal-01="chars" className={metaCls}>
                {m}
              </p>
            ))}
          </div>
        </div>

        <div className="hero-bottom absolute bottom-6 w-full px-6 text-center md:bottom-7 ls:bottom-3">
          <div className="hero-bottom-inner">
            <p data-reveal-01="chars" className="text-sm leading-[120%] text-white md:text-base lg:text-lg ls:text-xs">
              {hero.bottomLine[0]} <br />
              {hero.bottomLine[1]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
