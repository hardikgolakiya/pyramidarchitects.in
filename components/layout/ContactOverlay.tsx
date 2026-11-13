"use client";
// Full-screen contact overlay (spec/03-motion/footer-contact.md, chunk 1v84rdd id 10396). Portal on document.body.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { useContact } from "@/components/providers/ContactProvider";
import Kbd from "@/components/ui/Kbd";
import { shell } from "@/content/shell";

const c = shell.contact;

const svg = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" } as const;

function ArrowUpRight({ size, className }: { size?: number; className?: string }) {
  const s = size ?? "1em";
  return (
    <svg {...svg} width={s} height={s} aria-hidden="true" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg {...svg} width="1em" height="1em" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg {...svg} width="1em" height="1em" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function SocialIcon({ icon }: { icon: "instagram" | "phone" }) {
  if (icon === "phone") {
    return (
      <svg {...svg} width={14} height={14} aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  return (
    <svg {...svg} width={14} height={14} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function ContactOverlay() {
  const { open, trigger, closeContact } = useContact();
  const [shown, setShown] = useState(open);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeFn = useRef(closeContact);

  // Mount on open; unmount happens after the close timeline.
  if (open && !shown) setShown(true);

  useEffect(() => {
    closeFn.current = closeContact;
  }, [closeContact]);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Open: curtain rises from the bottom, lines draw, headline masks and fades stagger in.
  useLayoutEffect(() => {
    if (!shown || !open || !panelRef.current) return;
    const panel = panelRef.current;
    const q = gsap.utils.selector(panel);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(panel, { clipPath: "inset(100% 0 0 0)", opacity: 1 });
    gsap.set(q(".cx-content"), { opacity: 1 });
    gsap.set(q(".cx-mask"), { yPercent: 110 });
    gsap.set(q(".cx-fade"), { opacity: 0, y: 14 });
    gsap.set(q(".cx-line"), { scaleX: 0 });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => gsap.set(panel, { clearProps: "clipPath" }) });
    if (reduced) {
      tl.set(q(".cx-mask"), { yPercent: 0 })
        .set(q(".cx-fade"), { opacity: 1, y: 0 })
        .set(q(".cx-line"), { scaleX: 1 })
        .to(panel, { clipPath: "inset(0% 0 0 0)", duration: 0.25, ease: "none" });
    } else {
      tl.to(panel, { clipPath: "inset(0% 0 0 0)", duration: 0.95, ease: "expo.inOut" }, 0)
        .to(q(".cx-line"), { scaleX: 1, duration: 0.9, stagger: 0.08, ease: "power3.inOut" }, 0.55)
        .to(q(".cx-mask"), { yPercent: 0, duration: 0.9, stagger: 0.07, ease: "expo.out" }, 0.6)
        .to(q(".cx-fade"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, 0.8);
    }
    return () => {
      tl.kill();
    };
  }, [shown, open]);

  // Close: content fades, curtain exits upward, then unmount.
  useEffect(() => {
    if (open || !shown || !panelRef.current) return;
    const panel = panelRef.current;
    const q = gsap.utils.selector(panel);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(panel, { clipPath: "inset(0% 0 0 0)" });
    const tl = gsap.timeline({ onComplete: () => setShown(false) });
    if (reduced) tl.to(panel, { opacity: 0, duration: 0.2, ease: "none" });
    else
      tl.to(q(".cx-content"), { opacity: 0, duration: 0.3, ease: "power2.in" }).to(
        panel,
        { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "expo.inOut" },
        0.1,
      );
    return () => {
      tl.kill();
    };
  }, [open, shown]);

  // Scroll lock with scrollbar compensation while mounted.
  useEffect(() => {
    if (!shown) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = { html: html.style.overflow, body: body.style.overflow, pr: body.style.paddingRight };
    const sbw = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;
    return () => {
      html.style.overflow = prev.html;
      body.style.overflow = prev.body;
      body.style.paddingRight = prev.pr;
    };
  }, [shown]);

  // Focus: close button on open, Tab trap, Esc closes, focus returns to the opener.
  useEffect(() => {
    if (!shown || !open) return;
    const opener = trigger ?? (document.activeElement as HTMLElement | null);
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeFn.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [shown, open, trigger]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(c.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = c.email;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {}
      ta.remove();
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  if (!shown || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      className={`fixed inset-0 z-[999] h-[100svh] overflow-hidden bg-[#2A2725] text-[#EDE6D6] [@media(orientation:landscape)_and_(max-height:500px)]:overflow-y-auto [@media(orientation:landscape)_and_(max-height:500px)]:overscroll-contain`}
      style={{ clipPath: "inset(100% 0 0 0)" }}
      role="dialog"
      aria-modal="true"
      aria-label={c.dialogLabel}
      data-lenis-prevent=""
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#EDE6D6]/[0.06] blur-3xl" />
      <div
        className={`cx-content relative mx-auto flex h-full w-full max-w-[1280px] flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 md:px-10 md:pb-6 [@media(orientation:landscape)_and_(max-height:500px)]:h-auto [@media(orientation:landscape)_and_(max-height:500px)]:min-h-full [@media(orientation:landscape)_and_(max-height:500px)]:pt-2 [@media(orientation:landscape)_and_(max-height:500px)]:pb-[max(0.5rem,env(safe-area-inset-bottom))] [@media(orientation:landscape)_and_(max-height:500px)]:pl-[max(1.25rem,env(safe-area-inset-left))] [@media(orientation:landscape)_and_(max-height:500px)]:pr-[max(1.25rem,env(safe-area-inset-right))]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="cx-fade text-lg font-medium leading-none">{c.brand}</span>
          <div className="cx-fade flex items-center gap-3">
            <Kbd variant="esc">{c.esc}</Kbd>
            <button
              ref={closeRef}
              type="button"
              onClick={() => closeFn.current()}
              aria-label={c.closeAria}
              className="group flex items-center gap-2 rounded-full border border-[#EDE6D6]/25 py-2 pl-4 pr-3 text-sm font-semibold leading-none transition-colors duration-300 hover:bg-[#EDE6D6] hover:text-[#2A2725] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EDE6D6]"
            >
              {c.close}
              <span aria-hidden="true" className="relative block h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-90">
                <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Main */}
        <main
          className={`grid min-h-0 flex-1 content-center gap-6 py-4 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-14 [@media(orientation:landscape)_and_(max-height:500px)]:grid-cols-[1.25fr_1fr] [@media(orientation:landscape)_and_(max-height:500px)]:items-center [@media(orientation:landscape)_and_(max-height:500px)]:gap-6 [@media(orientation:landscape)_and_(max-height:500px)]:py-2`}
        >
          <div>
            <div className="cx-fade inline-flex items-center gap-2 rounded-full border border-[#EDE6D6]/20 bg-[#EDE6D6]/[0.04] px-3 py-1.5 text-xs text-[#EDE6D6]/80">
              <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9ED8A8]" />
              {c.status}
            </div>
            <h2
              className={`mt-4 font-serif text-[clamp(2rem,min(5.4vw,8.5vh),4.5rem)] leading-[1] tracking-[-0.03em] [@media(orientation:landscape)_and_(max-height:500px)]:mt-2 [@media(orientation:landscape)_and_(max-height:500px)]:text-[clamp(1.5rem,9vh,2.25rem)]`}
            >
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="cx-mask block">{c.headline[0]}</span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] text-[#EDE6D6]/50">
                <span className="cx-mask block">{c.headline[1]}</span>
              </span>
            </h2>
            <p className={`cx-fade mt-4 max-w-md text-sm leading-relaxed text-[#EDE6D6]/65 md:text-[15px] [@media(orientation:landscape)_and_(max-height:500px)]:hidden`}>{c.intro}</p>
            <div
              className={`cx-fade mt-5 flex max-w-full items-center justify-between gap-2 rounded-full border border-[#EDE6D6]/25 bg-[#EDE6D6]/[0.04] p-1.5 pl-5 sm:inline-flex sm:gap-6 [@media(orientation:landscape)_and_(max-height:500px)]:mt-3`}
            >
              <a
                href={`mailto:${c.email}`}
                className="group flex min-w-0 items-center gap-2 text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EDE6D6] md:text-lg"
              >
                <span className="truncate">{c.email}</span>
                <ArrowUpRight className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-live="polite"
                aria-label={copied ? c.copied : c.copyAria}
                className="flex shrink-0 items-center gap-2 rounded-full bg-[#EDE6D6] px-4 py-2.5 text-xs font-semibold text-[#2A2725] transition-opacity duration-300 hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EDE6D6]"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? c.copied : c.copy}
              </button>
            </div>
          </div>

          <div className={`flex flex-col gap-3 [@media(orientation:landscape)_and_(max-height:500px)]:gap-2`}>
            {c.cards.map((card) => (
              <a
                key={card.key}
                href={`mailto:${c.email}?subject=${encodeURIComponent(card.subject)}`}
                className={`cx-fade group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[#EDE6D6]/20 bg-[#EDE6D6]/[0.04] px-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EDE6D6] md:rounded-3xl md:px-6 md:py-5 [@media(orientation:landscape)_and_(max-height:500px)]:px-4 [@media(orientation:landscape)_and_(max-height:500px)]:py-2.5`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-[#EDE6D6] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <span className="relative z-10 flex flex-col gap-1 transition-colors duration-500 group-hover:text-[#2A2725] group-focus-visible:text-[#2A2725]">
                  <span className="text-xs opacity-60">
                    {card.label} · {card.note}
                  </span>
                  <span className="font-serif text-[clamp(1.35rem,min(2.6vw,4vh),2rem)] leading-tight tracking-[-0.02em]">{card.title}</span>
                </span>
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-current/30 transition-colors duration-500 group-hover:text-[#2A2725] group-focus-visible:text-[#2A2725]">
                  <ArrowUpRight size={18} className="transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </a>
            ))}
          </div>
        </main>

        {/* Footer row */}
        <div>
          <div className="cx-line h-px origin-left bg-[#EDE6D6]/20" />
          <div className={`flex items-center justify-between gap-4 pt-4 [@media(orientation:landscape)_and_(max-height:500px)]:pt-2`}>
            <ul className="cx-fade flex items-center gap-2">
              {c.socials.map((s) => {
                const blank = s.href.startsWith("http");
                return (
                  <li key={s.key}>
                    <a
                      href={s.href}
                      target={blank ? "_blank" : undefined}
                      rel={blank ? "noopener noreferrer" : undefined}
                      aria-label={s.label}
                      className="flex items-center gap-2 rounded-full border border-[#EDE6D6]/20 p-2.5 text-xs text-[#EDE6D6]/75 transition-colors duration-300 hover:bg-[#EDE6D6] hover:text-[#2A2725] focus-visible:bg-[#EDE6D6] focus-visible:text-[#2A2725] focus-visible:outline-none sm:px-4 sm:py-2"
                    >
                      <SocialIcon icon={s.icon} />
                      <span className="hidden sm:inline">{s.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <span className="cx-fade hidden text-right text-xs text-[#EDE6D6]/45 sm:block">{c.address}</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
