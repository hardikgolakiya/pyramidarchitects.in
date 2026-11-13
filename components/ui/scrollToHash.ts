"use client";
/**
 * Hash-link helper used by the shell (nav items, footer links).
 * Usage: <a href="/#about" onClick={onHashClick}>…</a>
 * When the link targets an id on the current page it scrolls there with Lenis (so pinned
 * ScrollTrigger offsets stay correct) instead of the native jump; otherwise the browser/Next handles it.
 */
import type { MouseEvent } from "react";

type LenisLike = { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; immediate?: boolean; force?: boolean }) => void };

export function scrollToHash(href: string): boolean {
  if (typeof window === "undefined") return false;
  const url = new URL(href, window.location.href);
  if (url.pathname !== window.location.pathname || !url.hash) return false;
  const id = decodeURIComponent(url.hash.slice(1));
  const target = id === "top" ? document.getElementById("top") ?? document.body : document.getElementById(id);
  if (!target) return false;
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) lenis.scrollTo(id === "top" ? 0 : target, { force: true });
  else target.scrollIntoView({ behavior: "smooth" });
  return true;
}

export function onHashClick(e: MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const href = e.currentTarget.getAttribute("href");
  if (!href || !href.includes("#")) return;
  if (scrollToHash(href)) e.preventDefault();
}
