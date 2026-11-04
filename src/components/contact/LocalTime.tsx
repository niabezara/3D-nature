"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/config/site";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
});

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 15_000);
  return () => clearInterval(id);
}

/** Studio local time, rendered only in the browser to avoid a hydration mismatch. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, () => format.format(new Date()), () => "––:––");
  return (
    <time suppressHydrationWarning className="tabular-nums">
      {time} <span className="opacity-50">GMT+4</span>
    </time>
  );
}
