"use client";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { tourHud } from "@/content/tour";
import { hudPill, hudText, useIsTouch } from "./hud";

/** Bottom-left exit pill. Hidden on touch devices, as in the reference (the nav stays available). */
export default function BackToSite() {
  const touch = useIsTouch();
  return (
    <Link
      href="/"
      prefetch={false}
      className={cn(
        "group pointer-events-auto absolute flex items-center gap-2.5 px-4 py-2.5 font-sans transition-colors duration-300 hover:bg-[#2A2725] hover:text-[#EDE6D6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EDE6D6]",
        hudPill,
        hudText,
        touch ? "hidden" : "bottom-6 left-6 md:bottom-8 md:left-10",
      )}
    >
      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
        {tourHud.backArrow}
      </span>
      <span>{tourHud.backToSite}</span>
    </Link>
  );
}
