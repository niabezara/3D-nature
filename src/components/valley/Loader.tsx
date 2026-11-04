export function Loader({ hidden }: { hidden: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-3 grid place-items-center bg-black transition-opacity duration-1000 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="size-9 min-h-[6px] min-w-[6px] animate-pulse-dot rounded-full bg-cream motion-reduce:animate-none" />
    </div>
  );
}
