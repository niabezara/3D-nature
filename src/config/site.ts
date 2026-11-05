/**
 * Your public details, in one place. Replace the placeholders.
 * (Where enquiries are *delivered* is set in .env.local, see .env.example.)
 */
export const site = {
  name: "NiaBezz",
  fullName: "Nia Bezarashvili",
  role: "Front-end developer at Tegeta Motors",
  /** Shown on the page as a mailto link. */
  email: "niabezarashvili@yahoo.com",
  location: "Tbilisi, Georgia",
  timeZone: "Asia/Tbilisi",
  /** Status pill on the contact page. */
  availability: "Open to new roles & freelance",
  socials: [
    { label: "GitHub", href: "https://github.com/niabezara" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/nia-bezarashvili-b25002109/",
    },
    { label: "Instagram", href: "https://instagram.com/niabezz" },
  ],
  stack: [
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "Node.js",
    "Prisma",
    "PostgreSQL",
    "Tailwind",
  ],
} as const;
