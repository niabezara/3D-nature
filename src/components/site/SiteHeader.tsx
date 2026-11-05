import Link from "next/link";
import { site } from "@/config/site";

type Page = "work" | "about" | "talk";

const links: { label: string; href: string; page?: Page }[] = [
  { label: "Work", href: "/work", page: "work" },
  { label: "About", href: "/about", page: "about" },
];

interface SiteHeaderProps {
  current?: Page;
  /** "night" = cream on the dark valley, "paper" = ink on the light About page. */
  tone?: "night" | "paper";
}

export function SiteHeader({ current, tone = "night" }: SiteHeaderProps) {
  const onTalk = current === "talk";
  const paper = tone === "paper";
  const pill = paper
    ? "border-ink bg-ink text-paper"
    : onTalk
      ? "border-cream bg-transparent text-cream"
      : "border-cream bg-cream text-ink";

  return (
    <header
      className={`absolute inset-x-0 top-0 z-40 flex flex-wrap items-center justify-between px-44 pt-24 phone:px-18 phone:pt-18 ${
        paper ? "text-ink" : "text-cream"
      }`}
    >
      <Link href="/" className="text-u-26 font-medium tracking-[-0.02em]">
        {site.name}
      </Link>
      {/* on phones the page links drop to a second row under the logo and button */}
      <nav
        aria-label="Main"
        className="flex items-center gap-44 text-u-14.5 font-medium tracking-[0.16em] uppercase phone:contents"
      >
        <div className="flex items-center gap-44 phone:order-last phone:mt-14 phone:w-full phone:gap-22">
          {links.map(({ label, href, page }) => (
            <Link
              key={label}
              href={href}
              aria-current={page && page === current ? "page" : undefined}
              className={`relative transition-opacity duration-200 hover:opacity-60 aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:-bottom-6 aria-[current=page]:after:h-px aria-[current=page]:after:bg-current phone:text-[11.5px]`}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link
          href="/lets-talk"
          aria-current={onTalk ? "page" : undefined}
          className={`inline-flex h-46 items-center rounded-full border px-26 transition duration-250 hover:-translate-y-px phone:h-40 phone:px-18 phone:text-[12px] ${pill}`}
        >
          Let’s talk
        </Link>
      </nav>
    </header>
  );
}
