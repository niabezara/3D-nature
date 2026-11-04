import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Moon } from "@/components/journal/Moon";
import { Starfield } from "@/components/journal/Starfield";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ValleyCover } from "@/components/valley/useValleyCover";
import { getPost, posts, type Block } from "@/content/journal";
import { formatDate } from "@/lib/date";
import { illumination, moonPhase, phaseName } from "@/lib/moon";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

/** The frame (sky, header) doesn't depend on the URL, so it renders instantly; the note streams in. */
export default function JournalPostPage({ params }: Props) {
  return (
    <main className="fixed inset-0 z-2 overflow-x-hidden overflow-y-auto overscroll-contain bg-black text-cream">
      <ValleyCover />
      <Starfield className="pointer-events-none absolute inset-x-0 top-0 h-[90svh] w-full opacity-70" />

      <div className="relative">
        <SiteHeader current="journal" />
        <Suspense fallback={<ArticleFallback />}>
          <Article params={params} />
        </Suspense>
      </div>
    </main>
  );
}

function ArticleFallback() {
  return (
    <div className="flex flex-col items-center pt-130 phone:pt-140">
      <span className="size-200 animate-pulse rounded-full bg-cream/5 phone:size-150" />
    </div>
  );
}

async function Article({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const phase = moonPhase(post.date);
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const index = sorted.findIndex((p) => p.slug === post.slug);
  const newer = sorted[index - 1];
  const older = sorted[index + 1];

  return (
    <article className="mx-auto max-w-720 px-24 pt-130 pb-80 phone:px-20 phone:pt-140">
      <header className="flex flex-col items-center text-center">
        <Moon
          date={post.date}
          className="size-200 animate-rise drop-shadow-[0_0_40px_rgb(245_239_226/0.25)] motion-reduce:animate-none phone:size-150"
        />
        <p className="mt-24 text-u-12 font-medium tracking-[0.16em] text-cream/55 uppercase phone:text-[11px]">
          {phaseName(phase)} · {Math.round(illumination(phase) * 100)}% lit · {formatDate(post.date)}
        </p>
        <h1 className="mt-20 font-serif text-u-64 leading-[1.05] italic phone:text-[40px]">{post.title}</h1>
        <p className="mt-16 text-u-13 tracking-[0.16em] text-cream/55 uppercase phone:text-[11px]">
          {post.tag} · {post.minutes} min read
        </p>
      </header>

      <div className="mt-56 flex flex-col gap-24 text-u-18 leading-[1.75] text-cream/85 phone:mt-40 phone:text-[16.5px]">
        {post.body.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>

      <nav
        aria-label="More notes"
        className="mt-80 grid grid-cols-2 gap-24 border-t border-cream/15 pt-32 phone:grid-cols-1"
      >
        {newer ? <Neighbour post={newer} label="Newer" /> : <span />}
        {older ? <Neighbour post={older} label="Older" align="right" /> : <span />}
      </nav>
      <div className="mt-48 text-center">
        <Link
          href="/journal"
          className="text-u-13 tracking-[0.16em] text-cream/60 uppercase transition-colors hover:text-cream phone:text-[12px]"
        >
          ← All phases
        </Link>
      </div>
    </article>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-24 font-display text-u-36 leading-tight font-normal tracking-wide text-cream uppercase phone:text-[26px]">
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote className="my-16 border-l border-cream/40 pl-24 font-serif text-u-30 leading-[1.3] text-cream italic phone:text-[24px]">
          {block.text}
        </blockquote>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-[calc(12*var(--u))] border border-cream/12 bg-cream/[0.04] p-20 text-u-14 leading-[1.6] text-cream/90 phone:rounded-[10px] phone:text-[13px]">
          <code className="font-mono">{block.text}</code>
        </pre>
      );
    default:
      return <p>{block.text}</p>;
  }
}

function Neighbour({
  post,
  label,
  align = "left",
}: {
  post: { slug: string; title: string; date: string };
  label: string;
  align?: "left" | "right";
}) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className={`group flex items-center gap-16 ${align === "right" ? "flex-row-reverse text-right phone:flex-row phone:text-left" : ""}`}
    >
      <Moon date={post.date} className="size-44 shrink-0 opacity-70 transition-opacity group-hover:opacity-100" />
      <span>
        <span className="block text-u-11 tracking-[0.16em] text-cream/45 uppercase">{label}</span>
        <span className="mt-4 block font-serif text-u-20 leading-tight italic transition-colors group-hover:text-cream phone:text-[18px]">
          {post.title}
        </span>
      </span>
    </Link>
  );
}
