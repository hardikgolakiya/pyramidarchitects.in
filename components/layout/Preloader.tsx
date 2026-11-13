"use client";
// Home boot loader (spec/03-motion/loader-boot.md, chunk 2xipugk id 64250).
// Weighted progress: fonts 1 + boot assets (BOOT_ASSETS, empty until the client sends media) + eager <img>s present at mount.
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { shell } from "@/content/shell";

type BootAsset = { type: "image" | "binary"; src: string; weight: number };
// Reference list: hero5.webp 1, cloud-1-cropped-beige.webp 1, cloud-2-full-beige.webp 1, villa GLB 4.
// Add the client's files here when they arrive (models stay absent until three.js is added).
const BOOT_ASSETS: BootAsset[] = [];
const SAFETY_MS = 10000; // never trap the page if an asset hangs

type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

function finishBoot() {
  document.body.dataset.bootLoaderComplete = "true";
  window.dispatchEvent(new Event("bootloader:complete"));
}

function loadImage(src: string, onProgress: (v: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      onProgress(1);
      resolve();
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function loadBinary(src: string, onProgress: (v: number) => void) {
  const res = await fetch(src, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Unable to load ${src}`);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body || !total) {
    await res.arrayBuffer();
    onProgress(1);
    return;
  }
  const reader = res.body.getReader();
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    got += value.length;
    onProgress(Math.min(got / total, 0.99));
  }
  onProgress(1);
}

export default function Preloader() {
  const pathname = usePathname();
  const [skipRoute] = useState(() => pathname?.startsWith("/tour") ?? false);
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const state = useRef({ value: 0 });
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);

  // /tour has its own loader: signal boot complete immediately.
  useEffect(() => {
    if (skipRoute) finishBoot();
  }, [pathname, skipRoute]);

  // Phase 1: weighted progress + scroll lock.
  useEffect(() => {
    if (skipRoute) return;
    const root = rootRef.current;
    const st = state.current;
    const render = () => {
      const v = state.current.value;
      if (fillRef.current) gsap.set(fillRef.current, { scaleX: v / 100 });
      setCount(Math.round(v));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (root) root.style.display = "none";
      finishBoot();
      return;
    }

    let cancelled = false;
    const body = document.body.style;
    const html = document.documentElement.style;
    const prev = { body: body.overflow, html: html.overflow };
    body.overflow = "hidden";
    html.overflow = "hidden";
    // Lenis is created by the parent provider after this effect runs; stop it on the next frame.
    const raf = requestAnimationFrame(() => {
      if (!cancelled) lenis()?.stop();
    });
    state.current.value = 0;
    render();

    const pageImages = Array.from(document.images)
      .filter((img) => !img.complete && img.loading !== "lazy" && img.currentSrc !== "")
      .map<BootAsset>((img) => ({ type: "image", src: img.currentSrc || img.src, weight: 1 }));
    const assets = [...BOOT_ASSETS, ...pageImages];
    const weights = [1, ...assets.map((a) => a.weight)];
    const total = weights.reduce((a, b) => a + b, 0);
    const seen = weights.map(() => 0);
    const report = (i: number, v: number) => {
      if (cancelled) return;
      seen[i] = Math.max(seen[i], v);
      const p = (seen.reduce((acc, s, k) => acc + s * weights[k], 0) / total) * 100;
      gsap.to(state.current, { value: p, duration: 0.5, ease: "power2.out", overwrite: true, onUpdate: render });
    };

    const all = Promise.all([
      (document.fonts?.ready ?? Promise.resolve()).catch(() => {}).finally(() => report(0, 1)),
      ...assets.map((a, i) =>
        (a.type === "image" ? loadImage(a.src, (v) => report(i + 1, v)) : loadBinary(a.src, (v) => report(i + 1, v)))
          .catch((err) => console.warn(`Failed to preload asset: ${a.src}`, err))
          .finally(() => report(i + 1, 1)),
      ),
    ]);
    const safety = new Promise<void>((r) => setTimeout(r, SAFETY_MS));
    Promise.race([all, safety]).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      gsap.killTweensOf(st);
      body.overflow = prev.body;
      html.overflow = prev.html;
    };
  }, [skipRoute]);

  // Phase 2: count to 100, wipe upward, release.
  useEffect(() => {
    if (!ready || !rootRef.current) return;
    const el = rootRef.current;
    const render = () => {
      const v = state.current.value;
      if (fillRef.current) gsap.set(fillRef.current, { scaleX: v / 100 });
      setCount(Math.round(v));
    };
    const tl = gsap.timeline({
      onComplete: () => {
        el.style.display = "none";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        lenis()?.start();
        finishBoot();
      },
    });
    tl.to(state.current, { value: 100, duration: 0.3, ease: "power2.out", overwrite: true, onUpdate: render }).to(el, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.15,
      ease: "expo.inOut",
    });
    return () => {
      tl.kill();
    };
  }, [ready]);

  if (skipRoute) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col justify-center overflow-hidden bg-[#2A2725] text-[#EDE6D6]"
      aria-hidden={ready}
    >
      <div className="w-full">
        <div className="flex items-end justify-between px-2">
          <span className="font-sans text-[clamp(1.5rem,2.5vw,2.75rem)] font-medium leading-none tracking-[-0.055em]">{shell.loader.brand}</span>
          <span className="shrink-0 font-sans text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </div>
        <div
          className="mt-7 h-[3px] w-full overflow-hidden bg-[#EDE6D6]/10"
          role="progressbar"
          aria-label={shell.loader.progressLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={count}
        >
          <div ref={fillRef} className="h-full origin-left scale-x-0 bg-[#EDE6D6] will-change-transform" />
        </div>
      </div>
    </div>
  );
}
