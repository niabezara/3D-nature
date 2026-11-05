/**
 * About page content.
 */
export const about = {
  specimen: "Specimen Nº 01 — The developer",
  latin: "Frontendia nocturna",
  authority: "Bezz., 2026",
  headline: ["Front-end developer,", "based in Tbilisi."],
  bio: [
    "I’m a front-end developer at Tegeta Motors in Tbilisi. I build web apps and interfaces with React and Next.js, and I’m comfortable crossing into Node.js, Prisma and PostgreSQL when a feature needs it.",
    "I care about the parts people feel but rarely notice. The way a page loads, how a button answers, whether it still works on an old phone and with a screen reader.",
  ],
  /** The museum-style label next to the specimen. */
  label: [
    { k: "Habitat", v: "Tbilisi, Georgia" },
    { k: "Blooms", v: "Mostly after dark" },
    { k: "Feeds on", v: "Coffee, Figma files, good type" },
    { k: "Currently", v: "Front-end developer, Tegeta Motors" },
  ],

  /** The eight pressed flowers. `group` is the shelf they were collected from. */
  skills: [
    {
      name: "React & Next.js",
      latin: "Componentia reactiva",
      group: "Frontend",
      petals: 8,
      color: "#6b7fb0",
    },
    {
      name: "TypeScript",
      latin: "Typus severus",
      group: "Languages",
      petals: 7,
      color: "#4f6f8f",
    },
    {
      name: "React Native",
      latin: "Applicatio mobilis",
      group: "Frontend",
      petals: 6,
      color: "#a8553a",
    },
    {
      name: "Tailwind & shadcn/ui",
      latin: "Stilus utilis",
      group: "UI & styling",
      petals: 6,
      color: "#5f7a52",
    },
    {
      name: "Zustand & TanStack Query",
      latin: "Status ordinatus",
      group: "State & data",
      petals: 10,
      color: "#c97a6e",
    },
    {
      name: "Node.js & Prisma",
      latin: "Radix servitoris",
      group: "Backend",
      petals: 5,
      color: "#c9973f",
    },
    {
      name: "PostgreSQL & MongoDB",
      latin: "Memoria profunda",
      group: "Databases",
      petals: 12,
      color: "#b88a3a",
    },
    {
      name: "Accessibility",
      latin: "Porta aperta",
      group: "Practice",
      petals: 5,
      color: "#8a5a83",
    },
  ],

  /** The full skill set, shown as an index under the pressed flowers. */
  index: [
    {
      k: "Languages",
      v: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SQL", "Python"],
    },
    {
      k: "Frontend",
      v: [
        "React",
        "Next.js",
        "React Native",
        "Responsive design",
        "Web accessibility (a11y)",
        "Figma-to-code",
      ],
    },
    {
      k: "State & data",
      v: [
        "Zustand",
        "Redux Toolkit",
        "React Query (TanStack Query)",
        "React Router",
        "Zod",
        "REST APIs",
      ],
    },
    {
      k: "Backend & databases",
      v: [
        "Node.js",
        "Express",
        "Prisma ORM",
        "PostgreSQL",
        "MongoDB",
        "NextAuth",
      ],
    },
    {
      k: "UI & styling",
      v: [
        "Tailwind CSS",
        "Styled Components",
        "shadcn/ui",
        "Headless UI",
        "Ant Design",
        "Framer Motion",
      ],
    },
    {
      k: "Tools & practices",
      v: [
        "Git",
        "GitHub",
        "CI/CD",
        "Code review",
        "Agile/Scrum",
        "Vercel",
        "Postman",
        "npm",
        "Yarn",
        "ESLint",
        "Prettier",
      ],
    },
  ],

  /** Experience, newest first. Each entry is one ring. */
  rings: [
    {
      year: "2026",
      role: "Front-end developer",
      place: "Tegeta Motors, Tbilisi",
      period: "Jan 2026 – present",
      note: "Built a multi-brand showroom kiosk presenting 8 automotive brands (Next.js, Node.js, PostgreSQL) and ship features for the Mazda brand website across UI and API work. I maintain Prisma-based integrations with internal services, help DevOps cut manual deployment steps, and review pull requests while refactoring legacy code.",
    },
    // {
    //   year: "2026",
    //   role: "Front-end developer (part-time)",
    //   place: "Unison",
    //   period: "Jun 2026 – present",
    //   note: "Building a multi-step insurance purchase flow in Next.js, from quote to plan selection to checkout, with NextAuth authentication and three role-specific dashboards for users, administrators and students.",
    // },
    {
      year: "2024",
      role: "Software engineer",
      place: "Devspark Studio",
      period: "Dec 2024 – Aug 2025",
      note: "Built responsive, accessible UI from Figma for 5 client projects, including hospitality platform Belux and Black Sea University’s web portal. Turned repeated patterns into a shared component library and worked on render- and bundle-level performance.",
    },
    {
      year: "2023",
      role: "Frontend developer",
      place: "TetroByte",
      period: "Dec 2023 – Dec 2024",
      note: "Shipped React and Next.js interfaces for 9 projects on REST APIs, including YouTube League, a fantasy-sports platform with authentication, credit-based player selection and live scoring, plus New Group’s corporate site and campaign landing pages.",
    },
    // the early years, before the first full-time role
    {
      year: "2020",
      role: "First line of HTML",
      place: "Tbilisi",
      period: "2020",
      note: "View source on a site I loved, then tried to rebuild it.",
    },
  ],

  notes: [
    { text: "Accessible is the default, not a feature.", caption: "On craft" },
    { text: "Fast is a feature, not a phase.", caption: "On performance" },
    { text: "The details are the design.", caption: "On interfaces" },
  ],
} as const;
