"use client";

import Link from "next/link";
import { useActionState, useEffect, type ReactNode } from "react";
import { sendMessage, type ContactState } from "@/app/lets-talk/actions";
import { ArrowIcon } from "@/components/site/icons";
import { Chip } from "./Chip";

const PROJECT_TYPES = ["Landing page", "Web app", "Mobile app", "Dashboard", "Next.js build", "Animation & motion", "Something else"];
const BUDGETS = ["< $2k", "$2–5k", "$5–10k", "$10k +"];
const TIMELINES = ["ASAP", "This month", "1–3 months", "Flexible"];
const initial: ContactState = { status: "idle" };

interface ContactFormProps {
  /** Called once the message has been accepted. */
  onSent: () => void;
  /** Start over with an empty form. */
  onReset: () => void;
}

export function ContactForm({ onSent, onReset }: ContactFormProps) {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const errors = state.status === "error" ? state.errors : {};
  const formError = state.status === "error" ? state.formError : undefined;
  const values = state.status === "error" ? state.values : undefined;

  useEffect(() => {
    if (state.status === "sent") onSent();
  }, [state.status, onSent]);

  if (state.status === "sent") {
    return (
      <div className="animate-rise py-24 motion-reduce:animate-none" role="status">
        <p className="text-u-12.5 font-medium tracking-[0.16em] text-cream/60 uppercase">Message received</p>
        <h2 className="mt-14 font-display text-u-120 leading-[0.9] font-normal phone:text-[72px]">Planted.</h2>
        <p className="mt-24 max-w-440 text-u-18 leading-[1.5] text-cream/85 phone:text-[16px]">
          Thanks{state.name ? `, ${state.name}` : ""}. Your message is in my inbox and I’ll reply within 48 hours.
          Meanwhile, the valley is growing back.
        </p>
        <div className="mt-40 flex flex-wrap gap-14">
          <Link
            href="/"
            className="inline-flex h-52 items-center rounded-full bg-cream px-26 text-u-14.5 font-medium text-ink transition hover:-translate-y-px phone:h-46 phone:text-[13px]"
          >
            Back to the valley
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-52 cursor-pointer items-center rounded-full border border-cream/40 px-26 text-u-14.5 font-medium transition hover:border-cream phone:h-46 phone:text-[13px]"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="flex flex-col gap-22 phone:gap-26">
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <div className="grid grid-cols-2 gap-24 phone:grid-cols-1 phone:gap-26">
        <Field n="01" label="Your name" error={errors.name}>
          <input name="name" autoComplete="name" defaultValue={values?.name} placeholder="Ada Lovelace" className={inputClass} aria-invalid={!!errors.name} />
        </Field>
        <Field n="02" label="Email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" defaultValue={values?.email} placeholder="ada@company.com" className={inputClass} aria-invalid={!!errors.email} />
        </Field>
        <Field n="03" label="Company" hint="optional">
          <input name="company" autoComplete="organization" defaultValue={values?.company} placeholder="Brand or studio" className={inputClass} />
        </Field>
        <Field n="04" label="Link" hint="optional" error={errors.link}>
          <input name="link" inputMode="url" defaultValue={values?.link} placeholder="Figma, current site, a reference" className={inputClass} aria-invalid={!!errors.link} />
        </Field>
      </div>

      <fieldset>
        <Label as="legend" n="05" label="What do you need?" />
        <div className="mt-12 flex flex-wrap gap-8">
          {PROJECT_TYPES.map((v) => (
            <Chip key={v} type="checkbox" name="projectTypes" value={v} defaultChecked={values?.projectTypes.includes(v)} />
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-24 phone:grid-cols-1 phone:gap-26">
        <fieldset>
          <Label as="legend" n="06" label="Budget" />
          <div className="mt-12 flex flex-wrap gap-8">
            {BUDGETS.map((v) => (
              <Chip key={v} type="radio" name="budget" value={v} defaultChecked={values?.budget === v} />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <Label as="legend" n="07" label="Timeline" />
          <div className="mt-12 flex flex-wrap gap-8">
            {TIMELINES.map((v) => (
              <Chip key={v} type="radio" name="timeline" value={v} defaultChecked={values?.timeline === v} />
            ))}
          </div>
        </fieldset>
      </div>

      <Field n="08" label="Tell me about it" error={errors.message}>
        <textarea
          name="message"
          rows={2}
          maxLength={5000}
          defaultValue={values?.message}
          placeholder="What are you building, who is it for, how should it feel?"
          className={`${inputClass} resize-none leading-[1.5]`}
          aria-invalid={!!errors.message}
        />
      </Field>

      {formError && (
        <p role="alert" className="rounded-[calc(12*var(--u))] border border-[#ffb3a1]/40 bg-[#ffb3a1]/10 px-16 py-12 text-u-14 text-[#ffd2c6] phone:rounded-[12px] phone:text-[13.5px]">
          {formError}
        </p>
      )}

      <div className="flex items-center justify-between gap-24 phone:flex-col-reverse phone:items-stretch">
        <p className="text-u-13 leading-[1.5] text-cream/55 phone:text-[12px]">
          I reply within 48 hours.
          <br />
          Your details stay between us.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-58 shrink-0 cursor-pointer items-center gap-16 rounded-full bg-cream pr-6 pl-28 text-u-15 font-medium text-ink transition hover:-translate-y-px disabled:cursor-wait disabled:opacity-80 phone:h-54 phone:justify-between phone:text-[15px]"
        >
          {pending ? "Planting…" : "Send it into the valley"}
          <span className="grid size-46 place-items-center rounded-full bg-ink text-cream transition-transform duration-300 group-hover:translate-x-4 group-disabled:animate-pulse phone:size-42">
            <ArrowIcon className="size-18" />
          </span>
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "mt-8 w-full border-b border-cream/25 bg-transparent pb-9 text-u-18 text-cream outline-none transition-colors duration-200 placeholder:text-cream/30 focus:border-cream aria-invalid:border-[#ffb3a1] phone:text-[17px]";

function Label({ as: Tag = "span", n, label, hint }: { as?: "span" | "legend"; n: string; label: string; hint?: string }) {
  return (
    <Tag className="flex items-baseline gap-10 text-u-12 font-medium tracking-[0.16em] text-cream/60 uppercase phone:text-[11px]">
      <span className="text-cream/35 tabular-nums">{n}</span>
      {label}
      {hint && <span className="tracking-normal text-cream/35 normal-case">({hint})</span>}
    </Tag>
  );
}

function Field({ n, label, hint, error, children }: { n: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <Label n={n} label={label} hint={hint} />
      {children}
      {error && <span className="mt-6 block text-u-13 text-[#ffb3a1] phone:text-[12px]">{error}</span>}
    </label>
  );
}
