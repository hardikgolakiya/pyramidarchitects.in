// All site-wide copy and data. Components read from here; no literal copy inside components.
export const site = {
  name: "Pyramid Architects",
  wordmark: "PYRAMID", // logo is /brand/logo-wordmark.svg; text used where the reference shows live type
  brandSplit: ["PYRAMID", "ARCHITECTS"] as const, // replaces the reference "STILL / FORM" two-part brand
  tagline: "Space, considered.", // TODO-CLIENT confirm tagline
  location: "Surat, Gujarat",
  email: "pyramidarchitects113@gmail.com",
  emailSubject: "Project enquiry",
  phone: { display: "+91 97141 11000", href: "tel:+919714111000" },
  instagram: { handle: "@pyramidarchitectsindia", href: "https://www.instagram.com/pyramidarchitectsindia/" },
  address: ["Aura, beside Bankers Hospital,", "B/h Shardayatan School, Piplod,", "Surat 395007"],
  founders: [
    { name: "Hardik Golakiya", role: "Co-founder, principal", photo: "/team/hardik-golakiya-600.webp" },
    { name: "Tejas Dabhi", role: "Co-founder, principal", photo: "/team/tejas-dabhi-600.webp" },
  ],
  nav: [
    { label: "About", href: "/#about" },
    { label: "Explore", href: "/#marquee-transition" },
    { label: "Residences", href: "/#residence-slides" },
    { label: "Tour", href: "/#residence-02-tour" },
  ],
  logo: {
    wordmark: "/brand/logo-wordmark-currentcolor.svg",
    wordmarkWhite: "/brand/logo-wordmark-white.svg",
    mark: "/brand/logo-mark-currentcolor.svg",
    markWhite: "/brand/logo-mark-white.svg",
  },
} as const;
