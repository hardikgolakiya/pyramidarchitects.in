/**
 * PulseHint: decorative 36px white circle with a click-hand icon and a ring behind it
 * (reference `.tour-hint` on the tour CTA and `.rail-hint` beside the explorer rail).
 * The motion is GSAP-driven by the owning section, so the hint renders static classes:
 *   `${name}` (wrapper), `${name}-ring` (ring, bg-white/60), `${name}-icon` (svg).
 * Usage:
 *   <PulseHint name="tour-hint" className="absolute right-4 top-4" />
 *   <PulseHint name="rail-hint" className="absolute -right-4 top-1/2 -mt-[18px] mr-4 opacity-0" />
 *   then e.g. gsap.fromTo(".tour-hint-ring", { scale: 1, opacity: .6 }, { scale: 2, opacity: 0, duration: .7, repeat: 2 })
 * Pass `ping` to get a CSS-only looping ring (animate-ping) when no GSAP drives it.
 */
import { cn } from "@/lib/cn";

export default function PulseHint({ name = "pulse-hint", className, ping = false }: { name?: string; className?: string; ping?: boolean }) {
  return (
    <span aria-hidden="true" className={cn(name, "pointer-events-none flex h-9 w-9 items-center justify-center", className)}>
      <span className={cn(`${name}-ring`, "absolute inset-0 rounded-full bg-white/60", ping && "animate-ping")} />
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#2A2725] shadow-lg">
        <svg
          className={cn(`${name}-icon`, "text-xl")}
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
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
      </span>
    </span>
  );
}
