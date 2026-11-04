export interface ValleyQuality {
  leaves: number;
  flowers: number;
  dust: number;
  fireflies: number;
  pixelRatio: number;
  fov: number;
  /** Taps in the depth-of-field blur. */
  blurTaps: number;
}

export function getQuality(): ValleyQuality {
  const mobile =
    window.matchMedia("(max-width: 820px)").matches ||
    window.matchMedia("(pointer: coarse)").matches;

  return mobile
    ? { leaves: 110000, flowers: 85000, dust: 200, fireflies: 110, pixelRatio: Math.min(devicePixelRatio, 1.25), fov: 66, blurTaps: 12 }
    : { leaves: 280000, flowers: 220000, dust: 400, fireflies: 240, pixelRatio: Math.min(devicePixelRatio, 1.5), fov: 54, blurTaps: 24 };
}

/**
 * The garden is a tile of points that wraps around the camera, so it is endless.
 * x is across the valley, z is along it (the camera travels toward -z).
 */
export const TILE = { x: 46, z: 50, ahead: 42 };

/** Flower species: petal colour, centre colour, petal count, relative size. */
export const SPECIES: { petal: string; center: string; petals: number; size: number }[] = [
  { petal: "#e0528a", center: "#f1cf5a", petals: 5, size: 1.0 },  // pink
  { petal: "#efc33c", center: "#b8742a", petals: 5, size: 0.9 },  // yellow
  { petal: "#e5682a", center: "#6a2c10", petals: 6, size: 1.05 }, // orange
  { petal: "#efab92", center: "#e07a50", petals: 10, size: 1.3 }, // peach
  { petal: "#7b5fcf", center: "#f0dc8a", petals: 5, size: 0.9 },  // purple
  { petal: "#5f74d8", center: "#f2efe0", petals: 5, size: 0.85 }, // blue
  { petal: "#c4489a", center: "#f3d36a", petals: 6, size: 1.0 },  // magenta
  { petal: "#e9e2d2", center: "#e9c13d", petals: 8, size: 1.0 },  // white
];

export const LEAF_GREENS = ["#14240f", "#1f3a17", "#2b4a1e", "#3b5a25", "#526a2c"];

/** World units added per wheel pixel. */
export const WHEEL_SPEED = 0.004;
/** Swipe pixels are worth more than wheel pixels, so a short swipe still travels. */
export const TOUCH_MULTIPLIER = 5;
/** World units per second the camera drifts forward when idle. */
export const IDLE_DRIFT = 0.45;
export const IDLE_DRIFT_REDUCED = 0.15;
export const INTRO_SECONDS = 4.2;
export const CAMERA_HEIGHT = 2.7;
export const LOOK_AHEAD = 8.5;
export const DUST_BOX = 14;
/** Fireflies live in a box that travels just ahead of the camera. */
export const FIREFLY_BOX = { x: 20, y: 1.5, z: 24, ahead: 21 };

/** Mirrors pathX() in the shaders: the meandering centre line of the valley. */
export const pathX = (z: number) => 6 * Math.sin(z * 0.035) + 3 * Math.sin(z * 0.011 + 1.3);
