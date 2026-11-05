/**
 * Work page content. Projects come from real experience; the client quote is still a placeholder.
 */

/** Generated cover styles, used until a project has a real image. */
export type CoverStyle =
  | "bloom"
  | "orbit"
  | "dots"
  | "waves"
  | "glow"
  | "letter";

export interface Project {
  title: string;
  kind: string;
  year: string;
  stack: string[];
  blurb: string;
  /** Accent colour: tints the cover and the page glow while the project is in front. */
  color: string;
  cover: CoverStyle;
  /** Optional real cover, e.g. "/work/night-valley.jpg" in /public. Overrides `cover`. */
  image?: string;
  /** Live site. Without one the card is shown but not clickable. */
  href?: string;
}

export const projects: Project[] = [
  {
    title: "Tegeta Showroom",
    kind: "Multi-brand kiosk · Tegeta Motors",
    year: "2026",
    stack: ["Next.js", "Node.js", "PostgreSQL"],
    blurb:
      "A showroom kiosk application presenting 8 automotive brands, built independently end to end.",
    color: "#7aa8ff",
    cover: "orbit",
  },
  {
    title: "Mazda",
    kind: "Brand website · Tegeta Motors",
    year: "2026",
    stack: ["Next.js", "Prisma", "REST APIs"],
    blurb:
      "Features for the Mazda brand website, moving between frontend UI and backend API work in the same sprint.",
    color: "#e0605a",
    cover: "waves",
  },
  {
    title: "Unison",
    kind: "Insurance purchase flow",
    year: "2026",
    stack: ["Next.js", "NextAuth", "TypeScript"],
    blurb:
      "A multi-step flow from quote to plan selection to checkout, with dashboards for users, administrators and students.",
    color: "#9be37a",
    cover: "dots",
  },
  {
    title: "Black Sea University",
    kind: "University web portal · Devspark",
    year: "2025",
    stack: ["React", "Accessibility", "Figma-to-code"],
    blurb:
      "Responsive, accessible portal UI built from Figma specs on a shared component library.",
    color: "#5fb3c9",
    cover: "letter",
  },
  {
    title: "Ineos Grenadier",
    kind: "Automotive website · Tegeta Motors",
    year: "2026",
    stack: ["React", "Tailwind CSS", "Performance"],
    blurb:
      "A website for the Ineos Grenadier automotive brand, built with a focus on performance and accessibility.",
    color: "#e0b25a",
    cover: "glow",
  },
  {
    title: "YouTube League",
    kind: "Fantasy-sports platform · TetroByte",
    year: "2024",
    stack: ["React", "REST APIs", "Auth"],
    blurb:
      "A fantasy-sports platform with user authentication, credit-based player selection and live scoring.",
    color: "#ef7fa8",
    cover: "bloom",
  },
  {
    title: "New Group",
    kind: "Corporate website · TetroByte",
    year: "2024",
    stack: ["Next.js", "Responsive", "Landing pages"],
    blurb:
      "Corporate website for a development company, plus marketing campaign landing pages.",
    color: "#c9c2ff",
    cover: "letter",
  },
];

export const work = {
  tag: { badge: "New", text: `${projects.length} projects, one valley` },
  title: {
    line1: "Selected Work.",
    before: "Built for ",
    accent: "Production",
    after: ".",
  },
  subtitle: [
    "Web apps, kiosks and interfaces I’ve built",
    "for teams across Georgia and beyond.",
  ],
  cta: { label: "Let’s Work Together", href: "/lets-talk" },

  /** Night garden loop behind the hero. Consider self-hosting it in /public. */
  video:
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4",

  testimonial: {
    quote:
      "NiaBezz turned our Figma files into a product that feels fast, works for everyone and is a pleasure to maintain. Clear communication every sprint, and the details are on another level, down to the last hover state.",
    // author: "Brooklyn Simmons",
    // role: "Product Manager",
    // initials: "BS",
  },
} as const;
