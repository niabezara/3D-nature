"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useValleyCover } from "@/components/valley/useValleyCover";
import { posts } from "@/content/journal";
import { formatDate } from "@/lib/date";
import { illumination, moonPhase, phaseName } from "@/lib/moon";
import { Moon } from "./Moon";
import { Starfield } from "./Starfield";

// newest first, like reading back through the nights
const ENTRIES = [...posts].sort((a, b) => b.date.localeCompare(a.date));
const N = ENTRIES.length;

/** Layout of the sky, in design units. Slot 0 is tonight, then one slot per post. */
const SKY = { pad: 140, gap: 230, height: 270 };
const WIDTH = SKY.pad * 2 + SKY.gap * N;
const u = (n: number) => `calc(${n} * var(--u))`;


/** Moons rise and set across the sky: an arc through the slots. */
function arcY(slot: number) {
  return SKY.height * 0.66 - Math.sin((Math.PI * (slot + 0.5)) / (N + 1)) * SKY.height * 0.36;
}
const slotX = (slot: number) => SKY.pad + slot * SKY.gap;
const moonSize = (minutes: number) => 44 + minutes * 5.5;

// tonight's date, read only in the browser
const subscribeNoop = () => () => {};
const getToday = () => new Date().toISOString().slice(0, 10);

export function JournalView() {
  useValleyCover();
  const [active, setActive] = useState(0);
  const post = ENTRIES[active];
  const phase = moonPhase(post.date);
  const today = useSyncExternalStore(subscribeNoop, getToday, () => null);
  const sky = useRef<HTMLDivElement>(null);
  useHorizontalScroll(sky);

  const arc = Array.from({ length: 64 }, (_, i) => {
    const slot = (i / 63) * N;
    return `${i ? "L" : "M"}${slotX(slot).toFixed(1)} ${arcY(slot).toFixed(1)}`;
  }).join(" ");

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
      className="fixed inset-0 z-2 overflow-x-hidden overflow-y-auto overscroll-contain bg-black text-cream"
    >
      <Starfield className="pointer-events-none absolute inset-0 h-full w-full" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgb(245_239_226/0.07),transparent_70%)]" />

      <div className="relative flex min-h-full flex-col">
        <SiteHeader current="journal" />

        {/* intro */}
        <header className="flex items-end justify-between gap-40 px-44 pt-100 phone:flex-col phone:items-start phone:gap-16 phone:px-20 phone:pt-130">
          <div>
            <p className="text-u-12 font-medium tracking-[0.16em] text-cream/55 uppercase phone:text-[11px]">Notes from the valley</p>
            <h1 className="mt-8 font-display text-u-84 leading-[0.9] font-normal tracking-[0.2em] uppercase phone:text-[56px]">Journal</h1>
          </div>
          <p className="max-w-360 pb-8 font-serif text-u-20 leading-[1.35] text-cream/70 italic phone:text-[17px]">
            Every note is drawn as the moon on the night it was written. Bigger moon, longer read.
          </p>
        </header>

        {/* the sky */}
        <div
          ref={sky}
          className="relative mt-16 cursor-grab overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative" style={{ width: u(WIDTH), height: u(SKY.height + 50) }}>
            <svg
              aria-hidden
              viewBox={`0 0 ${WIDTH} ${SKY.height}`}
              className="absolute top-0 left-0"
              style={{ width: u(WIDTH), height: u(SKY.height) }}
            >
              <path d={arc} fill="none" stroke="#f5efe2" strokeOpacity="0.18" strokeDasharray="2 6" />
            </svg>

            {/* tonight */}
            <div className="absolute flex flex-col items-center" style={{ left: u(slotX(0)), top: u(arcY(0)), translate: "-50% -50%" }}>
              <div style={{ width: u(64), height: u(64) }}>{today && <Moon date={today} className="h-full w-full opacity-60" />}</div>
              <span className="absolute top-full mt-14 text-u-11 tracking-[0.16em] whitespace-nowrap text-cream/45 uppercase">Tonight</span>
            </div>

            {ENTRIES.map((p, i) => {
              const slot = i + 1;
              const size = moonSize(p.minutes);
              const on = i === active;
              return (
                <Link
                  key={p.slug}
                  href={`/journal/${p.slug}`}
                  draggable={false}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-label={`${p.title}, ${formatDate(p.date)}, ${p.minutes} minute read`}
                  className="group absolute flex flex-col items-center outline-none"
                  style={{ left: u(slotX(slot)), top: u(arcY(slot)), translate: "-50% -50%" }}
                >
                  <motion.div
                    animate={{ scale: on ? 1.14 : 1, opacity: on ? 1 : 0.72 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className={`rounded-full transition-[filter] duration-500 group-focus-visible:outline-2 group-focus-visible:outline-offset-8 group-focus-visible:outline-cream ${
                      on ? "drop-shadow-[0_0_28px_rgb(245_239_226/0.45)]" : ""
                    }`}
                    style={{ width: u(size), height: u(size) }}
                  >
                    <Moon date={p.date} className="h-full w-full" />
                  </motion.div>
                  <span
                    className={`absolute top-full mt-16 text-u-11 tracking-[0.16em] whitespace-nowrap uppercase tabular-nums transition-colors duration-300 phone:text-[10px] ${
                      on ? "text-cream" : "text-cream/45"
                    }`}
                  >
                    {formatDate(p.date)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* the note under the selected moon */}
        <section className="mt-auto flex items-end justify-between gap-40 px-44 pb-36 phone:flex-col phone:items-start phone:gap-20 phone:px-20 phone:pb-28">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.35 }}
              className="max-w-640"
            >
              <p className="text-u-12 font-medium tracking-[0.16em] text-cream/55 uppercase phone:text-[11px]">
                {post.tag} · {post.minutes} min · {phaseName(phase)}, {Math.round(illumination(phase) * 100)}% lit
              </p>
              <h2 className="mt-10 font-serif text-u-44 leading-[1.05] italic phone:text-[34px]">{post.title}</h2>
              <p className="mt-10 max-w-540 text-u-17 leading-[1.55] text-cream/80 phone:text-[15px]">{post.excerpt}</p>
              <Link
                href={`/journal/${post.slug}`}
                className="group mt-16 inline-flex items-center gap-10 text-u-15 font-medium phone:text-[14px]"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-2 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px]">
                  Read the note
                </span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-4">→</span>
              </Link>
            </motion.div>
          </AnimatePresence>

          <p className="shrink-0 text-right text-u-12 tracking-[0.16em] text-cream/45 uppercase phone:text-left phone:text-[11px]">
            {N} notes · scroll or drag the sky
          </p>
        </section>
      </div>
    </motion.main>
  );
}

/** Vertical wheel scrolls the sky sideways; mouse drag pans it; a drag never counts as a click. */
function useHorizontalScroll(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const drag = { down: false, x: 0, left: 0, moved: false };
    const ac = new AbortController();
    const opts = { signal: ac.signal };

    el.addEventListener(
      "wheel",
      (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        const max = el.scrollWidth - el.clientWidth;
        const next = Math.min(max, Math.max(0, el.scrollLeft + e.deltaY));
        if (next === el.scrollLeft) return; // at an end: let the page scroll
        e.preventDefault();
        el.scrollLeft = next;
      },
      { passive: false, signal: ac.signal },
    );
    el.addEventListener(
      "pointerdown",
      (e) => {
        if (e.pointerType !== "mouse") return;
        Object.assign(drag, { down: true, x: e.clientX, left: el.scrollLeft, moved: false });
      },
      opts,
    );
    el.addEventListener(
      "pointermove",
      (e) => {
        if (!drag.down) return;
        const dx = e.clientX - drag.x;
        if (Math.abs(dx) > 5) drag.moved = true;
        el.scrollLeft = drag.left - dx;
      },
      opts,
    );
    const stop = () => (drag.down = false);
    el.addEventListener("pointerup", stop, opts);
    el.addEventListener("pointerleave", stop, opts);
    // swallow the click that ends a drag, before it reaches the moon's link
    el.addEventListener(
      "click",
      (e) => {
        if (!drag.moved) return;
        e.preventDefault();
        e.stopPropagation();
        drag.moved = false;
      },
      { capture: true, signal: ac.signal },
    );
    return () => ac.abort();
  }, [ref]);
}
