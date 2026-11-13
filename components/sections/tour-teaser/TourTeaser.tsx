"use client";
import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import Placeholder from "@/components/ui/Placeholder";
import { tourTeaser } from "@/content/apartment-tour";

/**
 * #residence-02-tour: pinned one viewport; a real-time timeline plays once when the pin starts
 * (box expands to full-bleed, pieces rise, CTA fades in, pulse hint). Click on box/CTA enters /tour.
 * Spec: spec/03-motion/tour-teaser.md, spec/03-motion/page-transitions.md, spec/03-motion/frames/tour-teaser.md.
 */

type FsDocument = Document & { webkitFullscreenElement?: Element | null };
type FsElement = HTMLElement & {
  webkitRequestFullscreen?: (opts?: FullscreenOptions) => Promise<void> | void;
};
type NetInfo = { saveData?: boolean; effectiveType?: string };

function Mask({ children }: { children: ReactNode }) {
  return <span className="-mb-[0.18em] -mt-[0.05em] block overflow-hidden pb-[0.18em] pt-[0.05em]">{children}</span>;
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-white/70 px-1.5 font-sans text-[11px] font-medium tracking-normal">
      {children}
    </kbd>
  );
}

/** Hand-click icon (outline, 24 grid), inline so no icon package is needed. */
function HandClickIcon({ className }: { className?: string }) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth={2}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      height="1em"
      width="1em"
      aria-hidden="true"
    >
      <path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5" />
      <path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5" />
      <path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5" />
      <path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" />
      <path d="M5 3l-1 -1" />
      <path d="M4 7h-1" />
      <path d="M14 3l1 -1" />
      <path d="M15 6h1" />
    </svg>
  );
}

/** Prefetch /tour once the boot loader is done, when idle, unless the connection asks to save data. */
function usePrefetchTour(path: string) {
  const router = useRouter();
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
    if (conn?.saveData || ["slow-2g", "2g"].includes(conn?.effectiveType ?? "")) return;
    let cancelled = false;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      if (!cancelled) router.prefetch(path);
    };
    const schedule = () => {
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(run, { timeout: 4000 });
      else timer = setTimeout(run, 2000);
    };
    if (document.body.dataset.bootLoaderComplete === "true") schedule();
    else window.addEventListener("bootloader:complete", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("bootloader:complete", schedule);
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      clearTimeout(timer);
    };
  }, [router, path]);
}

export default function TourTeaser() {
  const ref = useRef<HTMLElement>(null);
  const busy = useRef(false);
  const router = useRouter();
  const href = tourTeaser.cta.href;
  usePrefetchTour(href);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const stage = root.querySelector<HTMLElement>(".tour-stage");
      const box = root.querySelector<HTMLElement>(".tour-box");
      const inner = root.querySelector<HTMLElement>(".tour-inner");
      const pieces = gsap.utils.toArray<HTMLElement>(".tour-piece", root);
      const fade = root.querySelector<HTMLElement>(".tour-fade");
      const hint = root.querySelector<HTMLElement>(".tour-hint");
      const hintRing = root.querySelector<HTMLElement>(".tour-hint-ring");
      const hintIcon = root.querySelector<SVGElement>(".tour-hint-icon");
      if (!stage || !box) return;

      gsap.set(pieces, { yPercent: 110 });
      gsap.set(fade, { opacity: 0, y: 16 });
      gsap.set(hint, { opacity: 0, scale: 0.6 });

      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduced: MQ.reduced }, (ctx) => {
        const { desktop, reduced } = ctx.conditions as { desktop: boolean; reduced: boolean };
        const g = desktop ? { left: 19, top: 14, width: 62, height: 72 } : { left: 4, top: 12, width: 92, height: 70 };
        gsap.set(box, { left: `${g.left}%`, top: `${g.top}%`, width: `${g.width}%`, height: `${g.height}%`, borderRadius: 28 });

        // not scrubbed: plays once in real time when the pin starts (default toggleActions, never reverses)
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            pin: true,
            anticipatePin: 1,
            // reduced motion: jump to the end state (full-bleed, copy in, hint already gone)
            onEnter: reduced ? () => tl.progress(1) : undefined,
          },
        });
        tl.to(box, { left: "0%", top: "0%", width: "100%", height: "100%", borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1 }, 0)
          .to(pieces, { yPercent: 0, ease: "power3.out", duration: 0.9, stagger: 0.08 }, 1)
          .to(fade, { opacity: 1, y: 0, ease: "power3.out", duration: 0.7 }, 1.45)
          .to(hint, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 2.15)
          .to(hintIcon, { y: -5, duration: 0.35, repeat: 5, yoyo: true, ease: "power1.inOut" }, 2.15)
          .fromTo(hintRing, { scale: 1, opacity: 0.6 }, { scale: 2, opacity: 0, duration: 0.7, repeat: 2, ease: "power1.out" }, 2.15)
          .to(hint, { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" }, 4.25)
          .to({}, { duration: 0.35 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const handleEnter = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      if (busy.current) return;
      busy.current = true;
      // the walkthrough is landscape-first: on touch-size screens go fullscreen before navigating
      if (!window.matchMedia(MQ.desktop).matches) {
        const el = document.documentElement as FsElement;
        const doc = document as FsDocument;
        const rf = el.requestFullscreen ?? el.webkitRequestFullscreen;
        if (rf && !doc.fullscreenElement && !doc.webkitFullscreenElement) {
          try {
            const p = rf.call(el, { navigationUI: "hide" });
            if (p && typeof p.catch === "function") p.catch(() => {});
          } catch {}
        }
      }
      router.push(href);
    },
    [router, href],
  );

  return (
    <section ref={ref} id="residence-02-tour" className="relative z-30 w-full bg-[#EDE6D6] text-white">
      <div className="tour-stage relative h-screen w-full overflow-hidden bg-[#EDE6D6]">
        <div
          className="tour-box absolute left-[4%] top-[12%] h-[70%] w-[92%] overflow-hidden rounded-[28px] lg:left-[19%] lg:top-[14%] lg:h-[72%] lg:w-[62%]"
          onClick={handleEnter}
        >
          <Placeholder
            slot={tourTeaser.image.slot}
            tone="dark"
            label={tourTeaser.image.alt}
            className="tour-inner will-change-transform"
          />
          <div className="absolute inset-0 top-8 flex flex-col justify-between p-6 md:p-10">
            <div className="flex items-start justify-between gap-6">
              <Mask>
                <p className="tour-piece text-xs uppercase tracking-[0.2em]">{tourTeaser.eyebrow}</p>
              </Mask>
              <div className="hidden lg:block">
                <Mask>
                  <ul
                    className="tour-piece flex items-center gap-6 text-[10px] uppercase tracking-[0.18em]"
                    aria-label={tourTeaser.controlsLabel}
                  >
                    {tourTeaser.controls.map((c) => (
                      <li key={c.label} className="flex items-center gap-2.5">
                        <span className="flex items-center gap-1">
                          {c.keys.map((k) => (
                            <Kbd key={k}>{k}</Kbd>
                          ))}
                        </span>
                        <span>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                </Mask>
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <h2 className="font-sans text-[clamp(2.75rem,12vw,5.5rem)] leading-[0.9] tracking-[-0.05em] lg:text-[7.5vw]">
                <Mask>
                  <span className="tour-piece block">{tourTeaser.headline}</span>
                </Mask>
              </h2>
              <div className="flex max-w-md flex-col items-start gap-5">
                <Mask>
                  <p data-reveal-01="true" className="tour-piece text-xs leading-[1.5] tracking-[-0.01em] md:text-sm">
                    {tourTeaser.body}
                  </p>
                </Mask>
                <div className="relative">
                  <Link
                    href={href}
                    prefetch={false}
                    onClick={handleEnter}
                    data-hover-reveal="true"
                    className="tour-fade inline-block rounded-full border border-white/70 px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white hover:text-[#2A2725] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {tourTeaser.cta.label}
                  </Link>
                  <span
                    aria-hidden="true"
                    className="tour-hint pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center"
                  >
                    <span className="tour-hint-ring absolute inset-0 rounded-full bg-white/60" />
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A2725] shadow-lg">
                      <HandClickIcon className="tour-hint-icon text-xl" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
