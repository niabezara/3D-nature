"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type ReactNode, type RefObject } from "react";
import { projects, type Project } from "@/config/work";
import { ProjectCover } from "./ProjectCover";

const N = projects.length;
const STEP = 360 / N;
/** Scroll length per project while the ring is pinned. */
const SVH_PER_PROJECT = 70;

/**
 * Projects stand on a 3D ring that pins to the screen and turns as you scroll.
 * The card in front is lit; behind it, a giant outlined title and a colour glow follow along.
 */
export function ProjectOrbit({
  scroller,
}: {
  scroller: RefObject<HTMLElement | null>;
}) {
  const track = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container: scroller,
    target: track,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.35,
  });
  const turn = useTransform(progress, [0, 1], [0, -STEP * (N - 1)]);
  const bar = useTransform(progress, [0, 1], ["0%", "100%"]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))));
    setActive((prev) => (prev === i ? prev : i));
  });
  const project = projects[active];

  return (
    <section
      ref={track}
      aria-label="Projects"
      style={{ height: `${N * SVH_PER_PROJECT + 100}svh` }}
      className="relative"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* colour of the project in front */}
        <motion.div
          aria-hidden
          animate={{ backgroundColor: project.color }}
          transition={{ duration: 0.9 }}
          className="pointer-events-none absolute top-1/2 left-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[110px]"
        />

        {/* giant outlined title behind the ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[14%] flex justify-center phone:top-[16%]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={project.title}
              initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -60, filter: "blur(12px)" }}
              transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              // long names shrink so the whole word fits across the screen
              style={{
                fontSize: `min(${Math.min(17, 150 / project.title.length).toFixed(1)}vw, calc(230 * var(--u)))`,
              }}
              className="font-display leading-none whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1px_rgb(245_239_226/0.22)]"
            >
              {project.title}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* the ring */}
        <div className="absolute inset-0 flex items-center justify-center pb-[11svh] [perspective:calc(1500*var(--u))] phone:pb-[16svh] phone:[perspective:1100px]">
          <motion.div
            style={{
              rotateY: turn,
              rotateX: -7,
              transformStyle: "preserve-3d",
            }}
            className="relative h-[calc(340*var(--u))] w-[calc(265*var(--u))] phone:h-[270px] phone:w-[210px]"
          >
            {projects.map((p, i) => (
              <Card key={p.title} project={p} index={i} turn={turn} />
            ))}
          </motion.div>
        </div>

        {/* details of the project in front */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-40 px-44 pb-40 phone:flex-col phone:items-start phone:gap-14 phone:px-20 phone:pb-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="max-w-440"
            >
              <p className="text-u-12 font-medium tracking-[0.16em] text-cream/55 uppercase phone:text-[11px]">
                {project.kind} · {project.year}
              </p>
              <p className="mt-10 text-u-17 leading-[1.5] text-cream/85 phone:text-[14px]">
                {project.blurb}
              </p>
              <ul className="mt-14 flex flex-wrap gap-8 phone:hidden">
                {project.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-cream/20 px-12 py-4 text-u-12 text-cream/70"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="flex shrink-0 flex-col items-end gap-12 phone:w-full phone:flex-row-reverse phone:items-center phone:justify-between">
            <p className="font-display text-u-44 leading-none tabular-nums phone:text-[28px]">
              {String(active + 1).padStart(2, "0")}
              <span className="text-cream/35">
                {" "}
                / {String(N).padStart(2, "0")}
              </span>
            </p>
            <div className="h-px w-200 bg-cream/15 phone:w-[55%]">
              <motion.div style={{ width: bar }} className="h-full bg-cream" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  project,
  index,
  turn,
}: {
  project: Project;
  index: number;
  turn: MotionValue<number>;
}) {
  // how much this card faces the viewer: 1 in front, 0 at the sides, negative behind
  const facing = useTransform(turn, (t) =>
    Math.cos(((index * STEP + t) * Math.PI) / 180),
  );
  const opacity = useTransform(
    facing,
    (f) => 0.12 + 0.88 * Math.max(0, f) ** 2,
  );
  const brightness = useTransform(
    facing,
    (f) => `brightness(${0.35 + 0.65 * Math.max(0, f)})`,
  );
  const front = useTransform(facing, (f) => (f > 0.92 ? "auto" : "none"));

  return (
    <motion.div
      style={{
        transform: `rotateY(${index * STEP}deg) translateZ(calc(var(--ring-r)))`,
        opacity,
        filter: brightness,
        pointerEvents: front,
      }}
      className="absolute inset-0 [--ring-r:calc(380*var(--u))] [backface-visibility:hidden] phone:[--ring-r:270px]"
    >
      <CardShell
        // href={project.href}
        className="group relative block h-full w-full overflow-hidden rounded-[calc(18*var(--u))] border border-cream/15 bg-[#0b0b09] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] phone:rounded-[14px]"
      >
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 820px) 210px, 320px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <ProjectCover
            style={project.cover}
            color={project.color}
            title={project.title}
            className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-18 pt-60 phone:p-14">
          <p className="text-u-11 tracking-[0.16em] text-cream/55 uppercase tabular-nums phone:text-[10px]">
            Nº {String(index + 1).padStart(2, "0")}
          </p>
          <p className="mt-4 flex items-center justify-between font-display text-u-34 leading-none phone:text-[26px]">
            {project.title}
            {/* {project.href && (
              <span
                aria-hidden
                className="text-u-20 transition-transform duration-300 group-hover:translate-x-4 group-hover:-translate-y-4 phone:text-[16px]"
              >
                ↗
              </span>
            )} */}
          </p>
        </div>
      </CardShell>
    </motion.div>
  );
}

/** A link when the project has somewhere to go, otherwise a plain card. */
function CardShell({
  href,
  ...props
}: {
  href?: string;
  className: string;
  children: ReactNode;
}) {
  return href ? <Link href={href} {...props} /> : <div {...props} />;
}
