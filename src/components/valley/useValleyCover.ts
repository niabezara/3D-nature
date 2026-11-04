"use client";

import { useEffect } from "react";
import { useValley } from "./ValleyProvider";

/** How long the valley keeps dissolving behind a page before it stops drawing. */
const FADE_MS = 1200;

/**
 * For pages that fully cover the valley: the flowers dissolve while the page fades in,
 * then the scene pauses to save GPU. Everything resumes when the page unmounts.
 */
export function useValleyCover() {
  const { setCalm, setPaused } = useValley();
  useEffect(() => {
    setCalm(true);
    const t = setTimeout(() => setPaused(true), FADE_MS);
    return () => {
      clearTimeout(t);
      setPaused(false);
      setCalm(false);
    };
  }, [setCalm, setPaused]);
}

/** Drop-in for server-rendered pages. */
export function ValleyCover() {
  useValleyCover();
  return null;
}
