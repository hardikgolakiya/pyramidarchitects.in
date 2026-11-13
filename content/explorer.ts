// Copy for the architecture explorer (#marquee-transition). Length budgets: spec/05-content-build/content-slots.md §6.
import { site } from "./site";

export type ExplorerView = { label: string; stat: string };

export const explorer = {
  /** repeated 3 x 8 times in the marquee track */
  marqueeWord: `${site.brandSplit[0]} / ${site.brandSplit[1]}`,
  prompt: "Scroll to enter",
  eyebrow: "Structure",
  /** 7 views: index 0 = full building, 1..6 = model part groups (same order as stages.ts VIEWS). TODO-CLIENT real specs. */
  views: [
    { label: "Full View", stat: "Complete building overview" },
    { label: "Walls", stat: "Primary structural system" },
    { label: "Floor", stat: "Finished floor surface" },
    { label: "Roof", stat: "Roof assembly" },
    { label: "Pillars", stat: "Load-bearing columns" },
    { label: "Stairs", stat: "Main staircase" },
    { label: "Windows & Doors", stat: "Glazing and frames" },
  ] satisfies ExplorerView[],
  counterOf: "of",
  railAriaPrefix: "Show",
  hints: { rotate: "Drag to rotate" },
  slots: {
    /** image shown in the growing window and dissolved by the ink shader (reference: hero5.webp). null = blank card. */
    texture: { slot: "explorer-texture", src: null as string | null },
    model: { slot: "explorer-model", label: "Interactive 3D model of the featured building" },
  },
} as const;
