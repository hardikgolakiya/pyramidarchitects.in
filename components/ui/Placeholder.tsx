import { cn } from "@/lib/cn";

/**
 * Blank asset slot. Client assets (images, video, 3D) are supplied later, phase by phase.
 * `slot` names the asset (see spec/04-assets-seo/placeholder-assets.md) so it can be swapped by search.
 * Renders an empty block that fills its parent; give the parent the size/aspect from the layout spec.
 */
export default function Placeholder({
  slot,
  tone = "light",
  className,
  label,
}: {
  slot: string;
  tone?: "light" | "dark" | "none";
  className?: string;
  /** accessible description of what will go here (becomes the alt text later) */
  label?: string;
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-placeholder={slot}
      className={cn(
        "h-full w-full",
        tone === "light" && "bg-placeholder",
        tone === "dark" && "bg-placeholder-dark",
        className,
      )}
    />
  );
}
