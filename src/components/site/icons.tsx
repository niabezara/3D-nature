import type { SVGProps } from "react";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} strokeWidth={1.6} {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function SpeakerIcon({ playing, ...props }: SVGProps<SVGSVGElement> & { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...stroke} strokeWidth={1.5} {...props}>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5Z" />
      <path
        d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"
        className={`transition-opacity duration-300 ${playing ? "opacity-100" : "opacity-0"}`}
      />
      <path d="m16 10 4 4m0-4-4 4" className={playing ? "opacity-0" : "opacity-100"} />
    </svg>
  );
}
