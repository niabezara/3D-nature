"use client";

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AmbientSound } from "@/lib/audio/AmbientSound";
import type { Valley } from "@/lib/valley/Valley";
import { Loader } from "./Loader";

/** Reveal page content even if WebGL is slow or unavailable. */
const INTRO_FALLBACK_MS = 9000;

interface ValleyContextValue {
  /** The camera has finished its opening descent. */
  introDone: boolean;
  soundOn: boolean;
  toggleSound: () => void;
  /** Hovering a call to action: flowers lift, sound muffles. */
  setHover: (on: boolean) => void;
  /** A page that sits over the valley: flowers float, view softens. */
  setCalm: (on: boolean) => void;
  /** A page fully covers the valley: stop drawing it. */
  setPaused: (on: boolean) => void;
}

const ValleyContext = createContext<ValleyContextValue | null>(null);

export function useValley() {
  const ctx = use(ValleyContext);
  if (!ctx) throw new Error("useValley must be used inside <ValleyProvider>");
  return ctx;
}

/**
 * Owns the 3D valley and ambient sound for the whole app, so they survive
 * client-side navigation between pages instead of reloading each time.
 */
export function ValleyProvider({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const valley = useRef<Valley | null>(null);
  const audio = useRef<AmbientSound | null>(null);
  // remembered so they apply once the valley finishes loading
  const hover = useRef(false);
  const calm = useRef(false);
  const paused = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let cancelled = false;
    const ambient = new AmbientSound();
    audio.current = ambient;

    // three.js only loads in the browser, after the page shell is on screen
    import("@/lib/valley/Valley")
      .then(({ Valley }) => {
        if (cancelled) return;
        const v = new Valley(el, {
          onLoaded: () => setLoaded(true),
          onIntroDone: () => setIntroDone(true),
        });
        v.setCalm(calm.current);
        v.setPaused(paused.current);
        if (hover.current) v.startHoverTransition();
        valley.current = v;
      })
      .catch((err) => {
        console.error("Valley failed to start", err);
        setLoaded(true);
        setIntroDone(true);
      });

    const fallback = setTimeout(() => setIntroDone(true), INTRO_FALLBACK_MS);

    return () => {
      cancelled = true;
      clearTimeout(fallback);
      valley.current?.dispose();
      valley.current = null;
      ambient.dispose();
      audio.current = null;
    };
  }, []);

  const toggleSound = useCallback(() => {
    if (!audio.current) return;
    setSoundOn(!audio.current.toggleMute());
  }, []);

  const setHover = useCallback((on: boolean) => {
    hover.current = on;
    if (on) valley.current?.startHoverTransition();
    else valley.current?.stopHoverTransition();
    audio.current?.muffle(on || calm.current);
  }, []);

  const setCalm = useCallback((on: boolean) => {
    calm.current = on;
    valley.current?.setCalm(on);
    audio.current?.muffle(on || hover.current);
  }, []);

  const setPaused = useCallback((on: boolean) => {
    paused.current = on;
    valley.current?.setPaused(on);
  }, []);

  const value = useMemo(
    () => ({ introDone, soundOn, toggleSound, setHover, setCalm, setPaused }),
    [introDone, soundOn, toggleSound, setHover, setCalm, setPaused],
  );

  return (
    <ValleyContext value={value}>
      {/* touch-none: swipes on the valley steer the camera instead of scrolling the page */}
      <div ref={container} aria-hidden className="fixed inset-0 touch-none" />
      {children}
      <Loader hidden={loaded} />
    </ValleyContext>
  );
}
