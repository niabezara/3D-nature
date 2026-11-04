interface PressedFlowerProps {
  petals: number;
  color: string;
  /** Rotates the head so no two flowers look the same. */
  turn?: number;
  className?: string;
}

const CENTER = { x: 60, y: 58 };

/** A flat, dried flower drawn in SVG. Blooms (turns and opens) when its card is hovered. */
export function PressedFlower({ petals, color, turn = 0, className }: PressedFlowerProps) {
  const step = 360 / petals;
  const length = petals > 8 ? 19 : 22;
  const width = petals > 8 ? 6 : 9;

  return (
    <svg viewBox="0 0 120 170" aria-hidden className={className}>
      {/* stem and leaves */}
      <path d="M60 165 C 58 135, 64 100, 60 66" fill="none" stroke="#5f6b45" strokeWidth="2" strokeLinecap="round" />
      <path d="M60 128 C 44 126, 32 116, 28 100 C 44 102, 56 112, 60 128 Z" fill="#6f7d4c" opacity="0.85" />
      <path d="M61 108 C 74 104, 86 92, 90 78 C 76 82, 64 92, 61 108 Z" fill="#7f8b55" opacity="0.8" />
      <path d="M60 128 C 48 120, 38 112, 28 100" fill="none" stroke="#4e5a36" strokeWidth="0.8" opacity="0.6" />

      {/* head */}
      <g
        className="transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.12] group-hover:rotate-[24deg]"
        style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px`, transformBox: "view-box" }}
      >
        {Array.from({ length: petals }, (_, i) => (
          <ellipse
            key={i}
            cx={CENTER.x}
            cy={CENTER.y - length * 0.85}
            rx={width}
            ry={length}
            transform={`rotate(${turn + i * step} ${CENTER.x} ${CENTER.y})`}
            fill={color}
            fillOpacity={0.78 + (i % 3) * 0.06}
            stroke={color}
            strokeOpacity={0.9}
            strokeWidth={0.8}
            style={{ mixBlendMode: "multiply" }}
          />
        ))}
        <circle cx={CENTER.x} cy={CENTER.y} r={7.5} fill="#c8963c" />
        <circle cx={CENTER.x} cy={CENTER.y} r={7.5} fill="none" stroke="#8a5f22" strokeWidth="0.8" strokeDasharray="1.5 2" />
      </g>
    </svg>
  );
}
