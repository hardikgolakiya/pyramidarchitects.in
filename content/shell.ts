// Copy for the global shell: nav, boot loader, contact overlay, footer.
// Contact details and brand come from content/site.ts. [P] = placeholder copy (spec/05-content-build/content-slots.md).
import { site } from "./site";

const brand = `${site.brandSplit[0]} / ${site.brandSplit[1]}`;

export type NavItem = { label: string; href: string } | { label: string; action: "contact" };

export const shell = {
  brand,

  nav: {
    homeHref: "/",
    homeAria: `${site.name}, home`,
    menuLabel: "MENU",
    // Same IA as the reference (Residence / Stays / Tour / Contact), relabelled per content-slots.md.
    // Hash links use the absolute "/#id" form so they also work from /tour.
    items: [
      { label: "Projects", href: "/#marquee-transition" },
      { label: "Residence", href: "/#residence-02" }, // TODO-CLIENT: "Residence" or "Studio"
      { label: "Tour", href: "/tour" },
      { label: "Contact", action: "contact" },
    ] as NavItem[],
  },

  loader: {
    brand,
    progressLabel: "Loading",
  },

  contact: {
    dialogLabel: "Contact",
    brand,
    esc: "Esc",
    close: "Close",
    closeAria: "Close contact",
    status: "Open to new projects", // [P]
    headline: ["Every project begins", "with a conversation."] as const, // [P]
    intro: "Planning a residence, a renovation or a new idea? Tell us about it and we will get back to you.", // [P]
    email: site.email,
    copy: "Copy",
    copied: "Copied",
    copyAria: "Copy email address",
    cards: [
      { key: "project", label: "New project", note: "Residential, commercial, interiors", title: "Start a project", subject: "New project enquiry" },
      { key: "careers", label: "Careers", note: "Roles and internships", title: "Join the practice", subject: "Career enquiry" },
    ], // [P]
    socials: [
      { key: "instagram", label: "Instagram", href: site.instagram.href, icon: "instagram" },
      { key: "phone", label: site.phone.display, href: site.phone.href, icon: "phone" },
    ] as { key: string; label: string; href: string; icon: "instagram" | "phone" }[],
    // Shown where the reference shows its tagline (hidden below sm).
    address: site.address.join(" "),
  },

  footer: {
    homeHref: "/",
    logoAlt: site.name,
    tagline: site.tagline,
    headline: site.tagline,
    subline: "Residences shaped by architecture, light and material.", // [P]
    explore: {
      label: "Explore",
      links: [
        { label: "Project 01", href: "/#residence-slides" },
        { label: "Project 02", href: "/#residence-02" },
      ],
    },
    follow: {
      label: "Follow",
      links: [
        { label: "Instagram", href: site.instagram.href },
        { label: "Call", href: site.phone.href },
        { label: "Email", href: `mailto:${site.email}` },
      ],
      contact: "Contact",
    },
    copyright: (year: number) => `© ${site.name} ${year}`,
    availability: "Now accepting new commissions", // [P]
    availabilityPill: "Open to enquiries", // [P]
    backToTop: "Back to top",
    backToTopHref: "#top",
  },
} as const;
