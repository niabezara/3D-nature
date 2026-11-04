/** Deterministic star field (seeded, so server and client render the same sky). */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(20261104);
const STARS = Array.from({ length: 170 }, (_, i) => {
  const r = rand();
  return {
    x: rand() * 1000,
    y: Math.pow(rand(), 1.4) * 620, // denser toward the top of the sky
    size: r > 0.96 ? 1.6 : r > 0.8 ? 1.05 : 0.6,
    opacity: 0.25 + rand() * 0.6,
    twinkle: i % 9 === 0,
    delay: (rand() * 4).toFixed(2),
  };
});

export function Starfield({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.x.toFixed(1)}
          cy={s.y.toFixed(1)}
          r={s.size}
          fill="#f5efe2"
          opacity={s.opacity.toFixed(2)}
          className={s.twinkle ? "animate-pulse motion-reduce:animate-none" : undefined}
          style={s.twinkle ? { animationDelay: `${s.delay}s`, animationDuration: "3.2s" } : undefined}
        />
      ))}
    </svg>
  );
}
