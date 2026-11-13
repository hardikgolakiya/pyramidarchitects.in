// Copy for the apartment stage (#residence-02) and the tour teaser (#residence-02-tour).
// spec/05-content-build/content-slots.md §9-10. Length budgets match the reference so the layout and
// timings stay identical. [P] = placeholder, TODO-CLIENT confirm. Images stay blank (Placeholder) until supplied.

export const apartment = {
  /** hero title over the full-bleed first image */
  intro: {
    eyebrow: "Project 02", // <= 14 chars
    headline: ["A different", "way to live."] as const, // [P] 2 lines, each <= 14 chars
  },
  /** 3 rooms; each = 5 masked pieces (eyebrow, 2 headline lines, body, tags) */
  rooms: [
    {
      image: {
        slot: "apartment-living",
        alt: "Open living area with warm timber, linen and soft daylight", // [P] <= 125 chars
        position: "50% 50%",
      },
      eyebrow: "The living area", // <= 20 chars
      headline: ["Everything", "within reach."] as const, // each <= 16 chars
      body: "Open plan, generous light and warm materials, arranged so every part of daily life sits comfortably within reach.", // [P] <= 140 chars
      tags: ["Living area", "Kitchen", "Dining", "Terrace"], // [P] TODO-CLIENT true programme
    },
    {
      image: {
        slot: "apartment-bedroom",
        alt: "Bedroom with deep tones and a window onto the trees", // [P]
        position: "50% 50%",
      },
      eyebrow: "The bedroom",
      headline: ["Slow mornings,", "softly lit."] as const,
      body: "Soft daylight, natural textures and a quiet outlook. A room planned around rest, with nothing asking for attention.", // [P]
      tags: ["Garden view", "Natural textiles"], // [P]
    },
    {
      image: {
        slot: "apartment-bedroom-2",
        alt: "Second bedroom with sheer curtains and filtered light", // [P]
        position: "45% 50%",
      },
      eyebrow: "The second room",
      headline: ["Room for", "one more."] as const,
      body: "A second bedroom drawn with the same care: filtered light, tactile finishes and a calm corner that opens to green.", // [P]
      tags: ["Filtered light", "Tactile finishes"], // [P]
    },
  ],
  tagSeparator: " · ",
  /** bottom-left counter label (lg and landscape phone only) */
  label: "Inside the project",
  countPrefix: "/ ",
} as const;

export const tourTeaser = {
  image: {
    slot: "apartment-tour",
    alt: "The residence at golden hour, the living room glowing behind tall glass doors", // [P] <= 125 chars
  },
  eyebrow: "Explore the Project", // <= 24 chars
  headline: "Step inside.", // [P]
  body: "Move beyond the drawing and experience the space from within. Explore its rooms, discover the details and find your own way through.", // [P] <= 170 chars
  controlsLabel: "Walkthrough controls",
  controls: [
    { keys: ["W", "A", "S", "D"], label: "Move" },
    { keys: ["E"], label: "Interact" },
    { keys: ["Q"], label: "Customize" },
  ],
  cta: { label: "Enter the Tour →", href: "/tour" }, // <= 26 chars
} as const;
