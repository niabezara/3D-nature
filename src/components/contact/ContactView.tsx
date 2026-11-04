"use client";

import { useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SoundToggle } from "@/components/site/SoundToggle";
import { useValley } from "@/components/valley/ValleyProvider";
import { site } from "@/config/site";
import { ContactForm } from "./ContactForm";
import { LocalTime } from "./LocalTime";

/** Staggered entrance: each block rises in a beat after the one before. */
const rise = (step: number): CSSProperties => ({ animationDelay: `${180 + step * 90}ms` });
const riseClass = "animate-rise motion-reduce:animate-none";

export function ContactView() {
  const { soundOn, toggleSound, setCalm } = useValley();
  const [formKey, setFormKey] = useState(0);

  // while you write, the flowers drift up as particles; once sent they settle and regrow
  useEffect(() => {
    setCalm(true);
    return () => setCalm(false);
  }, [setCalm]);

  const handleSent = useCallback(() => setCalm(false), [setCalm]);
  const handleReset = useCallback(() => {
    setCalm(true);
    setFormKey((k) => k + 1);
  }, [setCalm]);

  return (
    <main className="fixed inset-0 z-2 overflow-y-auto overscroll-contain">
      <div className="relative min-h-full">
        <SiteHeader current="talk" />

        <div className="mx-auto grid min-h-full max-w-1440 grid-cols-[minmax(0,1fr)_calc(620*var(--u))] items-center gap-80 px-44 pt-104 pb-40 phone:grid-cols-1 phone:gap-48 phone:px-20 phone:pt-140 phone:pb-48">
          {/* intro */}
          <section className="text-shadow-[0_1px_14px_rgb(0_0_0/0.35)]">
            <p style={rise(0)} className={`${riseClass} flex items-center gap-12 text-u-12.5 font-medium tracking-[0.16em] uppercase phone:text-[11px]`}>
              <span className="relative grid size-8 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#9be37a]/60 motion-reduce:animate-none" />
                <span className="size-8 rounded-full bg-[#9be37a]" />
              </span>
              {site.availability}
            </p>

            <h1 style={rise(1)} className={`${riseClass} mt-22 font-display text-u-112 leading-[0.98] font-normal tracking-[-0.012em] phone:text-[clamp(60px,17vw,92px)]`}>
              Want one
              <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-cream)]">like this?</span>
            </h1>

            <p style={rise(2)} className={`${riseClass} mt-22 max-w-480 text-u-18 leading-[1.55] text-cream/85 phone:text-[16.5px]`}>
              I’m a front-end developer at Tegeta Motors, building fast, accessible web apps with React and
              Next.js, from Figma to production. Tell me what you’re making.
            </p>

            <ul style={rise(3)} className={`${riseClass} mt-22 flex max-w-520 flex-wrap gap-8`} aria-label="Stack">
              {site.stack.map((s) => (
                <li key={s} className="rounded-full border border-cream/20 px-12 py-5 text-u-12 text-cream/75 phone:text-[11.5px]">
                  {s}
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${site.email}`}
              style={rise(4)}
              className={`${riseClass} group mt-30 inline-flex items-center gap-12 text-u-32 font-medium tracking-[-0.01em] phone:text-[22px]`}
            >
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-4 transition-[background-size] duration-500 group-hover:bg-[length:0%_1px]">
                {site.email}
              </span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-4 group-hover:-translate-y-4">↗</span>
            </a>

            <dl style={rise(5)} className={`${riseClass} mt-32 grid max-w-560 grid-cols-3 gap-28 text-u-13 phone:mt-36 phone:grid-cols-2 phone:text-[13px]`}>
              <Meta label="Based in">{site.location}</Meta>
              <Meta label="Local time"><LocalTime /></Meta>
              <Meta label="Elsewhere">
                <span className="flex flex-col gap-2">
                  {site.socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="transition-opacity hover:opacity-60">
                      {s.label}
                    </a>
                  ))}
                </span>
              </Meta>
            </dl>
          </section>

          {/* form */}
          <section
            style={rise(2)}
            className={`${riseClass} rounded-[calc(28*var(--u))] border border-cream/15 bg-black/35 px-40 py-30 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] backdrop-blur-xl phone:rounded-[22px] phone:p-22`}
          >
            <ContactForm key={formKey} onSent={handleSent} onReset={handleReset} />
          </section>
        </div>

        <div className="fixed right-44 bottom-44 z-10 phone:hidden">
          <SoundToggle on={soundOn} onToggle={toggleSound} />
        </div>
      </div>
    </main>
  );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-u-11.5 font-medium tracking-[0.16em] text-cream/50 uppercase phone:text-[10.5px]">{label}</dt>
      <dd className="mt-8">{children}</dd>
    </div>
  );
}
