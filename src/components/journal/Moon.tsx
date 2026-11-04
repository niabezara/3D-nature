import { useId } from "react";
import { litPath, moonPhase } from "@/lib/moon";

const CRATERS = [
  { x: 38, y: 34, r: 7 },
  { x: 62, y: 28, r: 4 },
  { x: 58, y: 56, r: 9 },
  { x: 32, y: 62, r: 5 },
  { x: 70, y: 70, r: 4.5 },
  { x: 46, y: 76, r: 3.5 },
  { x: 74, y: 44, r: 3 },
];

interface MoonProps {
  date: Date | string;
  className?: string;
}

/** The moon as it looked on `date`: lit part in cream with craters, dark side faintly visible. */
export function Moon({ date, className }: MoonProps) {
  const id = useId();
  const phase = moonPhase(date);
  const lit = litPath(phase, 50, 50, 46);

  return (
    <svg viewBox="0 0 100 100" aria-hidden className={className}>
      <defs>
        <radialGradient id={`${id}-lit`} cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fbf6ea" />
          <stop offset="70%" stopColor="#e8dfc8" />
          <stop offset="100%" stopColor="#c9bfa6" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d={lit} />
        </clipPath>
      </defs>

      {/* dark side, lit faintly by the earth */}
      <circle cx="50" cy="50" r="46" fill="#14140f" stroke="#f5efe2" strokeOpacity="0.14" strokeWidth="0.8" />
      <path d={lit} fill={`url(#${id}-lit)`} />
      <g clipPath={`url(#${id}-clip)`} fill="#8a8170">
        {CRATERS.map((c) => (
          <circle key={`${c.x}-${c.y}`} cx={c.x} cy={c.y} r={c.r} fillOpacity="0.22" />
        ))}
      </g>
    </svg>
  );
}
