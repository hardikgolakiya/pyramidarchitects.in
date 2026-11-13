"use client";
// Fixed blend-difference nav with the MENU dropdown (spec/03-motion/nav-menu.md, chunk 2xipugk id 25199).
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent, PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useContact } from "@/components/providers/ContactProvider";
import RollLink from "@/components/ui/RollLink";
import { shell } from "@/content/shell";

const itemCls = "menu-item block text-base font-bold uppercase leading-[1.15] tracking-tight";

export default function SiteNav() {
  const { openContact } = useContact();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pointerType = useRef("mouse");

  // Entrance: 20px drop under the loader.
  useGSAP(
    () => {
      gsap.fromTo(navRef.current, { y: -20, opacity: 1 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });
    },
    { scope: navRef },
  );

  // Dropdown timeline, built once (paused).
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const items = panel.querySelectorAll(".menu-item");
      gsap.set(panel, { height: 0 });
      gsap.set(items, { yPercent: 110 });
      tlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .to(panel, { height: "auto", duration: 0.5 }, 0)
        .to(items, { yPercent: 0, duration: 0.6, stagger: 0.05 }, 0.05);
    },
    { scope: colRef },
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.timeScale(1).play();
    else tl.timeScale(1.8).reverse();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onDown = (e: Event) => {
      if (colRef.current && !colRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(leaveTimer.current);
    setOpen(true);
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => setOpen(false), 150);
  };
  const onFocusOut = (e: FocusEvent) => {
    if (!colRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
  };
  const onToggle = (e: MouseEvent) => {
    // Hover users are not toggled shut by a real mouse click; keyboard (detail 0) and touch toggle.
    if (pointerType.current !== "mouse" || e.detail === 0) setOpen((o) => !o);
  };
  const close = () => setOpen(false);

  const itemProps = (i: number) => ({
    className: itemCls,
    style: { opacity: hovered === null || hovered === i ? 1 : 0.4, transition: "opacity 300ms" },
    onMouseEnter: () => setHovered(i),
    onFocus: () => setHovered(i),
    onBlur: () => setHovered(null),
  });

  return (
    <nav ref={navRef} className="fixed left-0 top-0 z-50 w-full px-6 py-4 text-white mix-blend-difference md:px-10">
      <div className="flex items-start justify-between">
        <Link href={shell.nav.homeHref} aria-label={shell.nav.homeAria} className="text-xl font-medium leading-none">
          {shell.brand}
        </Link>
        <div ref={colRef} className="flex flex-col items-end" onPointerEnter={onEnter} onPointerLeave={onLeave} onBlur={onFocusOut}>
          <button
            ref={btnRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onPointerDown={(e) => (pointerType.current = e.pointerType)}
            onClick={onToggle}
            className="flex items-center gap-2 text-base font-bold leading-none tracking-tight"
          >
            {shell.nav.menuLabel}
            <span
              aria-hidden="true"
              className="grid grid-cols-2"
              style={{
                gap: open ? 5 : 2,
                transform: open ? "rotate(45deg)" : "none",
                transition: "gap 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <i className="block h-[3px] w-[3px] rounded-full bg-current" />
              <i className="block h-[3px] w-[3px] rounded-full bg-current" />
              <i className="block h-[3px] w-[3px] rounded-full bg-current" />
              <i className="block h-[3px] w-[3px] rounded-full bg-current" />
            </span>
          </button>
          <div id="site-menu" ref={panelRef} className="overflow-hidden" style={{ height: 0 }} inert={!open}>
            <ul className="flex flex-col items-end pt-3 text-right" onMouseLeave={() => setHovered(null)}>
              {shell.nav.items.map((item, i) => (
                <li key={item.label} className="overflow-hidden pb-[0.1em]">
                  {"action" in item ? (
                    <RollLink
                      {...itemProps(i)}
                      onClick={() => {
                        close();
                        openContact(btnRef.current);
                      }}
                    >
                      {item.label}
                    </RollLink>
                  ) : (
                    <RollLink {...itemProps(i)} href={item.href} onClick={close}>
                      {item.label}
                    </RollLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
