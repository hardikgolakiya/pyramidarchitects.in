// Copy for #residence-slides and the .ap-transition cloud bridge.
// Length budgets: spec/05-content-build/content-slots.md sections 7 and 8.
// Headline: exactly 3 lines, each <= 16 chars. Copy: <= 120 chars. Images stay blank (Placeholder) until the client sends them.

export type ResidenceSlide = {
  id: string;
  /** text card colours (inline style, as the reference) */
  bg: string;
  fg: string;
  /** column of the text card from lg (and landscape phone); the image panel takes the other column */
  textColumn: 1 | 2;
  headline: [string, string, string];
  copy: string;
  image: { slot: string; alt: string; tone: "light" | "dark" };
};

export const residenceSlides: ResidenceSlide[] = [
  {
    id: "residential",
    bg: "#2A2725",
    fg: "#FFFFFF",
    textColumn: 1,
    headline: ["A home built", "around light", "and material."],
    copy: "A Surat residence shaped by natural light, warm materials and a thoughtful edge between inside and outside.",
    image: { slot: "residence-slide-1", alt: "Exterior of a Pyramid Architects residence", tone: "light" },
  },
  {
    id: "hospitality",
    bg: "#ffffff",
    fg: "#2A2725",
    textColumn: 2,
    headline: ["Tables set", "in warm light,", "made to linger."],
    copy: "Restaurant and commercial interiors across Gujarat and Pune, built from natural materials and softly lit.",
    image: { slot: "residence-slide-2", alt: "Restaurant interior lit for the evening", tone: "dark" },
  },
];

export const residenceSlidesCounterLabel = (index: number, total: number) => `Slide ${index} of ${total}`;

export const cloudTransition = {
  ariaLabel: "Transition between projects",
  eyebrow: "Project 02",
  heading: ["Small spaces,", "carefully made."] as const,
  // decorative white cloud art (1440x550 and 1440x900, transparent); blank slots until supplied
  cloudSlots: ["ap-transition-cloud-1", "ap-transition-cloud-2"],
} as const;
