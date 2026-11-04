"use client";

import { useState } from "react";

interface Ring {
  year: string;
  role: string;
  place: string;
  period: string;
  note: string;
}

/** Wobbly circle path, so the rings read as wood rather than geometry. */
function ringPath(r: number, seed: number) {
  const pts = 72;
  let d = "";
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const wobble = 1 + Math.sin(a * 3 + seed) * 0.025 + Math.sin(a * 7 + seed * 2) * 0.012;
    const x = 200 + Math.cos(a) * r * wobble;
    const y = 200 + Math.sin(a) * r * wobble * 0.96;
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

/** Experience as tree rings: the newest year is the outer ring. Hover an entry to light its ring. */
export function GrowthRings({ rings }: { rings: readonly Ring[] }) {
  const [active, setActive] = useState(0);
  const n = rings.length;

  return (
    <div className="grid grid-cols-[calc(400*var(--u))_minmax(0,1fr)] items-start gap-80 phone:grid-cols-1 phone:gap-40">
      <div className="sticky top-60 phone:static phone:mx-auto phone:w-[78%]">
        <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label="Growth rings">
          {/* heartwood */}
          <circle cx="200" cy="200" r="18" fill="#c9a66b" opacity="0.35" />
          {rings.map((ring, i) => {
            // index 0 is newest → outermost ring
            const r = 40 + ((n - 1 - i) / Math.max(n - 1, 1)) * 150;
            const on = i === active;
            return (
              <g key={`${ring.year}-${ring.place}`}>
                <path
                  d={ringPath(r, i * 1.7)}
                  fill="none"
                  stroke={on ? "var(--color-moss)" : "var(--color-ink)"}
                  strokeOpacity={on ? 1 : 0.28}
                  strokeWidth={on ? 2.4 : 1.1}
                  className="transition-all duration-500"
                />
                <text
                  x={200 + r * 0.72}
                  y={200 - r * 0.7}
                  className={`font-sans text-[11px] tracking-[0.12em] transition-opacity duration-500 ${on ? "opacity-100" : "opacity-40"}`}
                  fill={on ? "var(--color-moss)" : "var(--color-ink)"}
                >
                  {ring.year}
                </text>
              </g>
            );
          })}
          {/* faint growth lines between rings */}
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={ringPath(30 + i * 12.5, i * 3.1)} fill="none" stroke="var(--color-ink)" strokeOpacity="0.06" strokeWidth="0.6" />
          ))}
        </svg>
      </div>

      <ol className="flex flex-col">
        {rings.map((ring, i) => (
          <li key={`${ring.year}-${ring.place}`}>
            <button
              type="button"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className="grid w-full cursor-pointer grid-cols-[calc(150*var(--u))_minmax(0,1fr)] items-baseline gap-24 border-t border-ink/15 py-24 text-left transition-colors duration-300 phone:grid-cols-[72px_minmax(0,1fr)] phone:gap-14 phone:py-18"
            >
              <span
                className={`font-display text-u-56 leading-none transition-colors duration-300 phone:text-[38px] ${
                  i === active ? "text-moss" : "text-ink/35"
                }`}
              >
                {ring.year}
              </span>
              <span>
                <span className="block text-u-20 font-medium phone:text-[17px]">{ring.role}</span>
                <span className="mt-4 block font-serif text-u-17 text-ink/60 italic phone:text-[15px]">{ring.place} · {ring.period}</span>
                <span
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                    i === active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <span className="overflow-hidden">
                    <span className="block pt-10 text-u-16 leading-[1.55] text-ink/75 phone:text-[15px]">{ring.note}</span>
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
