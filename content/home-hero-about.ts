// Copy for the home Hero + About sections (spec/05-content-build/content-slots.md §4-5).
// Length budgets match the reference so the layout and timings stay identical. [P] = placeholder, TODO-CLIENT confirm.

export const hero = {
  /** blank slot until the client sends the hero photo/render (spec/04-assets-seo/placeholder-assets.md) */
  image: { slot: "hero", alt: "Exterior of a contemporary residence at dusk" }, // [P] <= 125 chars
  /** h1, 2 lines, each <= ~14 chars at 5.64rem */
  title: ["Architecture,", "Considered."] as const, // [P]
  ctas: [
    { label: "Explore Projects", href: "#marquee-transition" }, // <= 20 chars
    { label: "Experience the Space", href: "#residence-02-tour" }, // <= 24 chars
  ] as const,
  arrow: "→",
  /** 4 uppercase micro labels, each <= 20 chars */
  meta: ["Featured Project", "Private Residence", "2026", "Explore"] as const, // [P] TODO-CLIENT real project data
  /** centred statement, 2 lines, each <= 34 chars */
  bottomLine: ["Every building is more than its form.", "It is how light moves through it."] as const, // [P]
} as const;

export const about = {
  eyebrow: "About",
  /** serif caption above the gallery, <= 24 chars */
  caption: "A quieter way to build", // [P]
  /** single sentence, 17 words (same as the reference; each word animates; <= 120 chars) */
  headline:
    "We design buildings where architecture, light and material come together to shape a quieter way of living.", // [P] TODO-CLIENT brand voice
  /** <= 200 chars, max-w-[350px] */
  supporting:
    "Pyramid Architects is an architecture and design studio in Surat, shaping considered spaces with natural light, warm materials and a thoughtful edge between inside and outside.",
  /** 6 decorative collage tiles (lg only); positions/rotations from spec/01-layout/sections.md */
  tiles: [
    { slot: "about-tile-1", pos: "left-[-1%] top-[14%] h-[43%] w-[26%]", side: "l", rotate: -4 },
    { slot: "about-tile-2", pos: "left-[2%] top-[61%] h-[22%] w-[20%]", side: "l", rotate: 3 },
    { slot: "about-tile-3", pos: "left-[25%] top-[70%] h-[26%] w-[22%]", side: "l", rotate: -2 },
    { slot: "about-tile-4", pos: "left-[51%] top-[1%] h-[21%] w-[16%]", side: "r", rotate: -6 },
    { slot: "about-tile-5", pos: "left-[73%] top-[15%] h-[29%] w-[27%]", side: "r", rotate: 8 },
    { slot: "about-tile-6", pos: "left-[74%] top-[54%] h-[39%] w-[25%]", side: "r", rotate: -4 },
  ] as const,
  /** 7 carousel slides inside the morphing box; alt <= 100 chars, TODO-CLIENT real descriptions */
  slides: Array.from({ length: 7 }, (_, i) => ({
    slot: `about-slide-${i + 1}`,
    alt: `Pyramid Architects project image ${i + 1}`,
  })),
  prevLabel: "Previous image",
  nextLabel: "Next image",
} as const;
