import { SpeakerIcon } from "./icons";

interface SoundToggleProps {
  on: boolean;
  onToggle: () => void;
}

export function SoundToggle({ on, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="Ambient sound"
      onClick={onToggle}
      className="grid size-28 cursor-pointer place-items-center"
    >
      <SpeakerIcon playing={on} className="size-full" />
    </button>
  );
}
