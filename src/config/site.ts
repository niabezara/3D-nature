/**
 * Your public details, in one place. Replace the placeholders.
 * (Where enquiries are *delivered* is set in .env.local, see .env.example.)
 */
export const site = {
  name: "NiaBezz",
  role: "Front-end developer at Tegeta Motors",
  /** Shown on the page as a mailto link. */
  email: "hello@niabezz.dev",
  location: "Tbilisi, Georgia",
  timeZone: "Asia/Tbilisi",
  /** Status pill on the contact page. */
  availability: "Open to freelance projects",
  socials: [
    { label: "GitHub", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
  ],
  stack: ["React", "Next.js", "TypeScript", "React Native", "Node.js", "Prisma", "PostgreSQL", "Tailwind"],
} as const;
