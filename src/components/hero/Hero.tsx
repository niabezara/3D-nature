"use client";

import { useEffect } from "react";
import { ArrowIcon } from "@/components/site/icons";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SoundToggle } from "@/components/site/SoundToggle";
import { useValley } from "@/components/valley/ValleyProvider";

export function Hero() {
  const { introDone, soundOn, toggleSound, setHover } = useValley();
  const startHover = () => setHover(true);
  const stopHover = () => setHover(false);

  // leaving the page mid-hover must not leave the flowers floating
  useEffect(() => () => setHover(false), [setHover]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-2 text-shadow-[0_1px_14px_rgb(0_0_0/0.35)] transition-opacity duration-1600 ease-in-out [&_a]:pointer-events-auto [&_button]:pointer-events-auto ${
        introDone ? "opacity-100" : "opacity-0"
      }`}
    >
      <SiteHeader />

      <section className="absolute inset-x-0 top-[46%] flex -translate-y-1/2 flex-col items-center text-center phone:inset-x-20">
        <h1 className="font-display text-u-158 leading-[0.92] font-normal tracking-[-0.012em] whitespace-nowrap phone:text-[clamp(64px,19vw,96px)] phone:whitespace-normal">
          Grown, not built.
        </h1>
        <p className="mt-48 text-u-20 leading-[1.3] phone:text-[17px]">
          Rooted in nature.
          <br />
          Built for what’s next.
        </p>
        <a
          href="#"
          aria-label="See our work"
          onPointerEnter={startHover}
          onPointerLeave={stopHover}
          onFocus={startHover}
          onBlur={stopHover}
          className="mt-34 grid size-58 place-items-center rounded-full border-[1.5px] border-cream transition-colors duration-300 hover:bg-cream hover:text-ink"
        >
          <ArrowIcon className="size-22" />
        </a>
      </section>

      <div className="absolute right-44 bottom-44 flex items-center gap-18 text-u-12.5 font-medium tracking-[0.16em] uppercase phone:inset-x-20 phone:bottom-30 phone:justify-center phone:text-[11px]">
        <span>Scroll to wander</span>
        <i className="h-26 w-px bg-cream/45" />
        <SoundToggle on={soundOn} onToggle={toggleSound} />
      </div>
    </div>
  );
}
