"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useValleyCover } from "@/components/valley/useValleyCover";
import { work } from "@/config/work";
import { ProjectOrbit } from "./ProjectOrbit";
import { Testimonial } from "./Testimonial";

const MotionLink = motion.create(Link);

export function WorkView() {
  useValleyCover();
  const scroller = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ container: scroller, target: hero, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <motion.main
      ref={scroller}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="fixed inset-0 z-2 overflow-x-hidden overflow-y-auto overscroll-contain bg-black text-cream"
    >
      {/* ------------------------------------------------ hero */}
      <section ref={hero} className="relative h-svh overflow-hidden">
        {/* the night garden fills the hero; text sits on its dark sky */}
        <motion.video
          src={work.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
          style={{ scale: videoScale }}
          className="absolute inset-0 h-full w-full object-cover object-[50%_70%]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[62%] bg-gradient-to-b from-black via-black/75 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_34%_22%_at_50%_54%,rgb(0_0_0/0.6),transparent_75%)]" />

        <SiteHeader current="work" />

        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-20 flex flex-col items-center px-16 pt-150 text-center text-shadow-[0_2px_24px_rgb(0_0_0/0.75)] phone:pt-150">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="liquid-glass mb-24 flex items-center gap-10 rounded-[calc(8*var(--u))] px-12 py-8 phone:rounded-[8px]"
          >
            <span className="rounded-[calc(6*var(--u))] bg-cream px-8 py-2 text-u-14 font-medium text-ink phone:rounded-[6px] phone:text-[13px]">
              {work.tag.badge}
            </span>
            <span className="text-u-14 font-medium text-cream/65 phone:text-[13px]">{work.tag.text}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 text-u-72 leading-[1.15] font-medium tracking-[-2px] phone:text-[44px] phone:leading-tight"
          >
            {work.title.line1}
            <br />
            {work.title.before}
            <span className="font-serif font-normal italic">{work.title.accent}</span>
            {work.title.after}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-32 text-u-18 leading-[1.4] text-cream phone:text-[16px]"
          >
            {work.subtitle[0]}
            <br />
            {work.subtitle[1]}
          </motion.p>

          <MotionLink
            href={work.cta.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-cream px-32 py-14 text-u-16 font-medium text-ink phone:text-[15px]"
          >
            {work.cta.label}
          </MotionLink>
        </motion.div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-160 bg-gradient-to-t from-black to-transparent" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{ opacity: textOpacity }}
          className="absolute inset-x-0 bottom-32 z-30 flex flex-col items-center gap-10 text-u-12 font-medium tracking-[0.16em] text-cream/70 uppercase phone:text-[11px]"
        >
          Scroll through the work
          <span aria-hidden className="h-36 w-px animate-pulse bg-cream/50 motion-reduce:animate-none" />
        </motion.p>
      </section>

      {/* ------------------------------------------------ projects */}
      <ProjectOrbit scroller={scroller} />

      {/* ------------------------------------------------ testimonial */}
      <Testimonial scroller={scroller} />
    </motion.main>
  );
}
