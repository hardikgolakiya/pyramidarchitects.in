/**
 * Kbd: keyboard keycap.
 * Usage:
 *   <Kbd>W</Kbd>                       // "keycap": tour teaser / tour HUD legend (h-7 min-w-7, white/70 border, 11px)
 *   <Kbd variant="esc">Esc</Kbd>       // "esc": contact overlay hint (sand/25 border, 10px, sand/50 text, md+ only)
 * Extra classes merge via tailwind-merge.
 */
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  keycap: "inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-white/70 px-1.5 font-sans text-[11px] font-medium tracking-normal",
  esc: "hidden rounded-md border border-[#EDE6D6]/25 px-1.5 py-1 font-sans text-[10px] font-medium leading-none text-[#EDE6D6]/50 md:block",
} as const;

export default function Kbd({ children, variant = "keycap", className }: { children: ReactNode; variant?: keyof typeof variants; className?: string }) {
  return <kbd className={cn(variants[variant], className)}>{children}</kbd>;
}
