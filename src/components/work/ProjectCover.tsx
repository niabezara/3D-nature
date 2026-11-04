import { useId } from "react";
import type { CoverStyle } from "@/config/work";

interface ProjectCoverProps {
  style: CoverStyle;
  color: string;
  title: string;
  className?: string;
}

/** Generated artwork for a project card, in the project's accent colour. */
export function ProjectCover({ style, color, title, className = "" }: ProjectCoverProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 300 380" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <defs>
        <radialGradient id={id} cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="60%" stopColor={color} stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="380" fill="#0b0b09" />
      <rect width="300" height="380" fill={`url(#${id})`} />
      <Art style={style} color={color} title={title} />
    </svg>
  );
}

function Art({ style, color, title }: { style: CoverStyle; color: string; title: string }) {
  switch (style) {
    case "bloom":
      return (
        <g transform="translate(150 150)">
          {[0, 1, 2].map((ring) => {
            const count = 8 + ring * 4;
            return Array.from({ length: count }, (_, i) => (
              <ellipse
                key={`${ring}-${i}`}
                cx="0"
                cy={-(24 + ring * 30)}
                rx={9 - ring * 2}
                ry={22 - ring * 3}
                transform={`rotate(${(i * 360) / count + ring * 11})`}
                fill={color}
                fillOpacity={0.55 - ring * 0.15}
              />
            ));
          })}
          <circle r="14" fill="#f5efe2" />
        </g>
      );
    case "orbit":
      return (
        <g transform="translate(150 160)" fill="none" stroke={color}>
          {[30, 55, 80, 105, 130].map((r, i) => (
            <ellipse key={r} rx={r} ry={r * 0.42} transform={`rotate(${-18 + i * 9})`} strokeOpacity={0.75 - i * 0.12} strokeWidth="1.2" />
          ))}
          <circle r="18" fill={color} stroke="none" />
          <circle cx="104" cy="-22" r="5" fill="#f5efe2" stroke="none" />
          <circle cx="-62" cy="30" r="3.5" fill="#f5efe2" stroke="none" />
        </g>
      );
    case "waves":
      return (
        <g fill="none" stroke={color} strokeLinecap="round">
          {Array.from({ length: 14 }, (_, i) => {
            const y = 70 + i * 16;
            const a = 10 + Math.sin(i * 0.7) * 8;
            return (
              <path
                key={i}
                d={`M-10 ${y} C 60 ${y - a}, 90 ${y + a}, 150 ${y} S 240 ${y - a}, 310 ${y}`}
                strokeOpacity={0.15 + (i % 4) * 0.18}
                strokeWidth={i === 7 ? 2.4 : 1.1}
              />
            );
          })}
        </g>
      );
    case "glow":
      return (
        <g>
          <circle cx="110" cy="130" r="80" fill={color} fillOpacity="0.45" style={{ filter: "blur(18px)" }} />
          <circle cx="190" cy="190" r="70" fill="#f5efe2" fillOpacity="0.18" style={{ filter: "blur(22px)" }} />
          <circle cx="150" cy="160" r="26" fill="#f5efe2" fillOpacity="0.9" />
          <circle cx="150" cy="160" r="40" fill="none" stroke="#f5efe2" strokeOpacity="0.4" />
        </g>
      );
    case "dots":
      return (
        <g>
          {Array.from({ length: 12 }, (_, row) =>
            Array.from({ length: 10 }, (_, col) => {
              const d = Math.hypot(col - 4.5, row - 4.5);
              const r = Math.max(0.6, 5 - d * 0.75);
              return <circle key={`${row}-${col}`} cx={24 + col * 28} cy={30 + row * 26} r={r} fill={color} fillOpacity={0.35 + r * 0.12} />;
            }),
          )}
        </g>
      );
    case "letter":
      return (
        <g>
          <text
            x="150"
            y="250"
            textAnchor="middle"
            fontFamily="var(--font-antonio), sans-serif"
            fontSize="270"
            fill="none"
            stroke={color}
            strokeWidth="1.6"
          >
            {title.charAt(0)}
          </text>
          <text x="150" y="250" textAnchor="middle" fontFamily="var(--font-antonio), sans-serif" fontSize="270" fill={color} fillOpacity="0.14">
            {title.charAt(0)}
          </text>
        </g>
      );
  }
}
