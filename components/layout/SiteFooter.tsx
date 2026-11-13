"use client";
// footer#contact with the one-shot frame wipe / rule draw / masked item reveal
// (spec/03-motion/footer-contact.md, frames/footer.md, chunk 265hf09 id 95930).
import Link from "next/link";
import { useRef } from "react";
import type { MouseEvent } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { useContact } from "@/components/providers/ContactProvider";
import RollLink from "@/components/ui/RollLink";
import { shell } from "@/content/shell";
import { site } from "@/content/site";

const f = shell.footer;
const LINK =
  "footer-reveal block py-1 transition-opacity hover:opacity-60 lg:py-0 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:py-0.5";
const LOGO_MASK = `url(${site.logo.wordmark}) left center / contain no-repeat`;

export default function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const { openContact } = useContact();
  const year = new Date().getFullYear();
  const onContact = (e: MouseEvent<HTMLElement>) => openContact(e.currentTarget);

  useGSAP(
    () => {
      const footer = ref.current;
      if (!footer) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduced: MQ.reduced }, (ctx) => {
        const { desktop, reduced } = ctx.conditions as { desktop: boolean; reduced: boolean };
        if (reduced) {
          gsap.set(".footer-frame", { clipPath: "inset(0 0% 0 0)" });
          gsap.set(".footer-rule", { scaleX: 1, transformOrigin: "left center" });
          gsap.set(".footer-reveal", { yPercent: 0, opacity: 1 });
          return;
        }
        gsap
          .timeline({ scrollTrigger: { trigger: footer, start: desktop ? "top 82%" : "top 92%", once: true } })
          .fromTo(".footer-frame", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power3.inOut" })
          .fromTo(".footer-rule", { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.7, ease: "power3.out" }, "-=0.65")
          .fromTo(
            ".footer-reveal",
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "expo.out" },
            "-=0.35",
          );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <footer
      ref={ref}
      id="contact"
      className="relative z-30 flex min-h-[100svh] w-full flex-col bg-[#EDE6D6] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 text-[#2A2725] md:px-10 md:py-6 lg:block lg:h-screen lg:py-16 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:px-4 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:pb-3 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:pt-3"
    >
      <div className="footer-frame flex flex-1 flex-col justify-between rounded-[20px] border border-[#2A2725]/20 px-5 py-6 md:rounded-[30px] md:px-10 md:py-10 lg:block [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:rounded-[20px] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:px-5 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:py-3">
        {/* Top bar: logo | tagline */}
        <div className="flex items-start justify-between gap-8 text-xs uppercase tracking-[0.12em] md:text-sm [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-xs">
          <div className="overflow-hidden">
            <Link href={f.homeHref} aria-label={f.logoAlt} className="footer-reveal block font-semibold tracking-[0.08em]">
              <span
                aria-hidden="true"
                className="block aspect-[753/217] h-[1.25em] bg-current"
                style={{ mask: LOGO_MASK, WebkitMask: LOGO_MASK }}
              />
            </Link>
          </div>
          <div className="hidden overflow-hidden md:block">
            <span className="footer-reveal block text-right">{f.tagline}</span>
          </div>
        </div>

        <div className="footer-rule my-8 h-px origin-left scale-x-0 bg-[#2A2725]/20 md:my-16 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:my-3" />

        {/* Headline | link columns */}
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-16 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:grid-cols-[1fr_auto] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:gap-8">
          <div>
            <div className="overflow-hidden">
              <h2 className="footer-reveal max-w-[12ch] font-serif text-[clamp(3rem,13vw,7rem)] leading-[0.88] tracking-[-0.03em] lg:text-[clamp(2.75rem,8vw,7rem)] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-[2.5rem]">
                {f.headline}
              </h2>
            </div>
            <div className="overflow-hidden">
              <p className="footer-reveal mt-6 max-w-xl text-lg leading-[1.2] md:text-xl [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:mt-2 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-sm">
                {f.subline}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm md:gap-12 lg:min-w-[360px] lg:gap-20 lg:text-base [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:min-w-[260px] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:gap-10 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-xs">
            <div className="flex flex-col gap-4 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:gap-1">
              <div className="overflow-hidden">
                <p className="footer-reveal text-xs uppercase tracking-[0.12em] text-[#2A2725]/65 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-[10px]">
                  {f.explore.label}
                </p>
              </div>
              {f.explore.links.map((l) => (
                <div key={l.label} className="overflow-hidden">
                  <RollLink href={l.href} className={LINK}>
                    {l.label}
                  </RollLink>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:gap-1">
              <div className="overflow-hidden">
                <p className="footer-reveal text-xs uppercase tracking-[0.12em] text-[#2A2725]/65 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-[10px]">
                  {f.follow.label}
                </p>
              </div>
              {f.follow.links.map((l) => (
                <div key={l.label} className="overflow-hidden">
                  <RollLink href={l.href} className={LINK}>
                    {l.label}
                  </RollLink>
                </div>
              ))}
              <div className="overflow-hidden">
                <RollLink onClick={onContact} className={`${LINK} text-left`}>
                  {f.follow.contact}
                </RollLink>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-rule my-8 h-px origin-left scale-x-0 bg-[#2A2725]/20 md:my-16 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:my-3" />

        {/* Bottom bar: copyright + availability | pill | back to top */}
        <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.12em] lg:flex-row lg:items-center lg:justify-between lg:text-sm [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:flex-row [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:items-center [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:justify-between [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:gap-3 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-[11px]">
          <div className="flex flex-col gap-1.5">
            <div className="overflow-hidden">
              <p className="footer-reveal">{f.copyright(year)}</p>
            </div>
            <div className="overflow-hidden">
              <p className="footer-reveal text-[10px] tracking-[0.12em] text-[#2A2725]/55 md:text-[11px] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-[9px]">
                {f.availability}
              </p>
            </div>
          </div>
          <div className="-m-2 overflow-hidden p-2">
            <button
              type="button"
              onClick={onContact}
              className="footer-reveal flex items-center gap-2.5 py-1 text-[11px] tracking-[0.12em] text-[#2A2725]/70 transition-opacity hover:opacity-60 lg:py-0"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span aria-hidden="true" className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3FA85B]/70" />
                <span aria-hidden="true" className="relative inline-flex h-2 w-2 rounded-full bg-[#3FA85B]" />
              </span>
              <RollLink as="span">{f.availabilityPill}</RollLink>
            </button>
          </div>
          <div className="overflow-hidden">
            <RollLink href={f.backToTopHref} className="footer-reveal block py-1 transition-opacity hover:opacity-60 lg:py-0">
              {f.backToTop}
            </RollLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
