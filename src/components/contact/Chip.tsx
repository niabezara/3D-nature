interface ChipProps {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  defaultChecked?: boolean;
}

/** A real checkbox/radio styled as a pill, so it submits with the form and works with the keyboard. */
export function Chip({ type, name, value, defaultChecked }: ChipProps) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="inline-flex h-32 items-center rounded-full border border-cream/25 px-15 text-u-13 transition duration-200 select-none peer-checked:border-cream peer-checked:bg-cream peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cream hover:border-cream/70 phone:h-36 phone:text-[13px]">
        {value}
      </span>
    </label>
  );
}
