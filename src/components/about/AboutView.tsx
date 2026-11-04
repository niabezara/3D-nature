import Link from "next/link";
import type { CSSProperties } from "react";
import { LocalTime } from "@/components/contact/LocalTime";
import { ArrowIcon } from "@/components/site/icons";
import { SiteHeader } from "@/components/site/SiteHeader";
import { about } from "@/config/about";
import { site } from "@/config/site";
import { GrowthRings } from "./GrowthRings";
import { PressedFlower } from "./PressedFlower";

const rise = (step: number): CSSProperties => ({ animationDelay: `${150 + step * 90}ms` });
const riseClass = "animate-rise motion-reduce:animate-none";

/** Fine paper grain, generated once as an SVG data URI. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .2 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AboutView() {
  return (
    <main className="fixed inset-0 z-2 overflow-y-auto overscroll-contain text-ink">
      {/* paper grain over everything, including the window */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-30 opacity-25 mix-blend-multiply" style={{ backgroundImage: GRAIN }} />

      {/* ------------------------------------------------ specimen sheet */}
      <section className="relative grid min-h-svh grid-cols-[minmax(0,1fr)_calc(470*var(--u))] items-center gap-72 px-44 pt-110 pb-64 phone:grid-cols-1 phone:gap-44 phone:px-20 phone:pt-130 phone:pb-56">
        <SiteHeader current="about" tone="paper" />

        <div className="relative z-1">
          <p style={rise(0)} className={`${riseClass} text-u-12 font-medium tracking-[0.16em] text-ink/60 uppercase phone:text-[11px]`}>
            {about.specimen}
          </p>
          <h1 style={rise(1)} className={`${riseClass} mt-22 font-display text-u-92 leading-[1] font-normal tracking-[-0.01em] phone:text-[clamp(52px,14vw,76px)]`}>
            {about.headline[0]}
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.4px_var(--color-ink)]">{about.headline[1]}</span>
          </h1>
          <p style={rise(2)} className={`${riseClass} mt-16 font-serif text-u-24 text-ink/70 italic phone:text-[20px]`}>
            {about.latin} <span className="text-ink/45 not-italic">({about.authority})</span>
          </p>

          <div style={rise(3)} className={`${riseClass} mt-28 flex max-w-500 flex-col gap-14 text-u-17 leading-[1.6] text-ink/85 phone:text-[16px]`}>
            {about.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          {/* museum label */}
          <dl
            style={rise(4)}
            className={`${riseClass} mt-32 grid max-w-500 grid-cols-2 border border-ink/25 text-u-13 phone:text-[13px]`}
          >
            {about.label.map(({ k, v }, i) => (
              <div key={k} className={`px-16 py-12 ${i % 2 ? "border-l border-ink/25" : ""} ${i > 1 ? "border-t border-ink/25" : ""}`}>
                <dt className="text-u-10.5 font-medium tracking-[0.16em] text-ink/50 uppercase phone:text-[10px]">{k}</dt>
                <dd className="mt-4">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* the specimen window: a real hole in the paper, the live valley shows through */}
        <figure style={rise(2)} className={`${riseClass} relative`}>
          <div
            className="relative z-0 aspect-[4/5] w-full rounded-t-full rounded-b-[calc(14*var(--u))] shadow-[0_0_0_400vmax_var(--color-paper)] outline-1 outline-offset-[calc(10*var(--u))] outline-ink/30 phone:rounded-b-[12px]"
          />
          <figcaption className="relative z-1 mt-24 flex items-center justify-between gap-16 font-serif text-u-17 text-ink/70 italic phone:text-[15px]">
            <span>fig. 1 — habitat, live</span>
            <span className="flex items-center gap-8 font-sans text-u-12.5 not-italic phone:text-[12px]">
              <span className="size-7 animate-pulse rounded-full bg-moss motion-reduce:animate-none" />
              {site.location.split(",")[0]} · <LocalTime />
            </span>
          </figcaption>
        </figure>
      </section>

      {/* ------------------------------------------------ pressed skills */}
      <section className="relative z-1 bg-paper px-44 py-90 phone:px-20 phone:py-64">
        <SectionHead n="02" title="Pressed skills" note={`collected ${about.rings[about.rings.length - 1].year} – present`} />
        <ul className="mt-48 grid grid-cols-4 gap-28 phone:mt-32 phone:grid-cols-2 phone:gap-14">
          {about.skills.map((s, i) => (
            <li
              key={s.name}
              className="group relative flex flex-col bg-[#f8f3e8] px-22 pt-30 pb-20 shadow-[0_1px_0_rgb(0_0_0/0.04),0_14px_30px_-18px_rgb(60_45_20/0.45)] transition duration-500 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-6 hover:-rotate-1 phone:px-14 phone:pt-24 phone:pb-14"
              style={{ rotate: `${((i * 37) % 5) - 2}deg` }}
            >
              {/* tape */}
              <span aria-hidden className="absolute -top-10 left-1/2 h-22 w-84 -translate-x-1/2 -rotate-3 bg-[#e3d6b8]/80 shadow-[0_1px_2px_rgb(0_0_0/0.08)] phone:w-60" />
              <PressedFlower petals={s.petals} color={s.color} turn={i * 23} className="mx-auto h-170 w-auto phone:h-120" />
              <div className="mt-14 flex items-baseline justify-between text-u-11 tracking-[0.14em] text-ink/45 uppercase tabular-nums phone:text-[10px]">
                <span>Nº {String(i + 1).padStart(2, "0")}</span>
                <span>{s.group}</span>
              </div>
              <p className="mt-8 text-u-18 leading-tight font-medium phone:text-[15px]">{s.name}</p>
              <p className="mt-2 font-serif text-u-16 text-ink/60 italic phone:text-[13.5px]">{s.latin}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ full index */}
      <section className="relative z-1 bg-paper px-44 pb-40 phone:px-20 phone:pb-24">
        <dl className="border-t border-ink/25">
          {about.index.map(({ k, v }) => (
            <div key={k} className="grid grid-cols-[calc(260*var(--u))_minmax(0,1fr)] gap-24 border-b border-ink/15 py-16 phone:grid-cols-1 phone:gap-6 phone:py-14">
              <dt className="text-u-12 font-medium tracking-[0.16em] text-ink/50 uppercase phone:text-[11px]">{k}</dt>
              <dd className="text-u-17 leading-[1.5] phone:text-[15px]">
                {v.map((item, i) => (
                  <span key={item}>
                    {item}
                    {i < v.length - 1 && <span className="px-8 text-ink/30">·</span>}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------ growth rings */}
      <section className="relative z-1 bg-paper px-44 py-90 phone:px-20 phone:py-64">
        <SectionHead n="03" title="Growth rings" note="hover a year" />
        <div className="mt-48 phone:mt-32">
          <GrowthRings rings={about.rings} />
        </div>
      </section>

      {/* ------------------------------------------------ field notes */}
      <section className="relative z-1 bg-paper px-44 pt-60 pb-110 phone:px-20 phone:pb-72">
        <SectionHead n="04" title="Field notes" />
        <ul className="mt-44 grid grid-cols-3 gap-40 phone:grid-cols-1 phone:gap-28">
          {about.notes.map((note, i) => (
            <li key={note.text} className="border-t border-ink/25 pt-20">
              <p className="text-u-11 tracking-[0.16em] text-ink/45 uppercase phone:text-[10.5px]">
                {String(i + 1).padStart(2, "0")} — {note.caption}
              </p>
              <p className="mt-14 font-serif text-u-34 leading-[1.15] italic phone:text-[28px]">“{note.text}”</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ nightfall */}
      <section className="relative z-1 rounded-t-[calc(44*var(--u))] bg-ink px-44 pt-110 pb-44 text-cream phone:rounded-t-[28px] phone:px-20 phone:pt-80 phone:pb-28">
        <p className="text-center text-u-12 font-medium tracking-[0.16em] text-cream/55 uppercase phone:text-[11px]">Nightfall</p>
        <h2 className="mt-20 text-center font-display text-u-130 leading-[0.95] font-normal phone:text-[clamp(56px,16vw,88px)]">
          Night falls.
          <br />
          <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-cream)]">Let’s talk.</span>
        </h2>
        <div className="mt-44 flex justify-center">
          <Link
            href="/lets-talk"
            className="group inline-flex h-58 items-center gap-16 rounded-full bg-cream pr-6 pl-28 text-u-15 font-medium text-ink transition hover:-translate-y-px phone:h-54 phone:text-[15px]"
          >
            Start a conversation
            <span className="grid size-46 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 group-hover:translate-x-4 phone:size-42">
              <ArrowIcon className="size-18" />
            </span>
          </Link>
        </div>

        <footer className="mt-110 flex items-center justify-between border-t border-cream/15 pt-24 text-u-12.5 text-cream/55 phone:mt-72 phone:flex-col phone:gap-10 phone:text-[12px]">
          <span>© {about.rings[0].year} {site.name} · {site.location}</span>
          <Link href="/" className="transition-colors hover:text-cream">
            Back to the valley ↗
          </Link>
        </footer>
      </section>
    </main>
  );
}

function SectionHead({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="flex items-end justify-between gap-24 border-b border-ink/25 pb-16">
      <h2 className="flex items-baseline gap-18 font-display text-u-64 leading-none font-normal phone:text-[44px]">
        <span className="font-sans text-u-13 tracking-[0.16em] text-ink/45 phone:text-[12px]">§ {n}</span>
        {title}
      </h2>
      {note && <p className="font-serif text-u-17 text-ink/55 italic phone:hidden">{note}</p>}
    </div>
  );
}
