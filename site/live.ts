"use client";

// Live values shared between sections and the travelling headphones (F1). Written every frame by the sections that
// own them, read every frame by Traveller.tsx. Boxes are VIEWPORT px of the product (not the image frame).

export type Box = { cx: number; cy: number; h: number };

export const live = {
  /** the product in the spin film (key-front framing), from the film's drawn rect (SpinHero) */
  hero: null as (() => Box | null) | null,
  /** the listener's headphones in the room video (QuietRoom) */
  head: null as (() => Box | null) | null,
  /** colour wheel position 0..2 (graphite → moonstone → dune), set by ColourWheel */
  wheel: 0,
  /** true once the visitor (or record mode) added the pair to the bag */
  bagged: false,
};

/** true in ?record=1 (read once on the client). */
export const recording = () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("record");
/** true in ?static=1 (layout review). */
export const staticMode = () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("static");

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** progress of v between a and b, clamped */
export const span = (v: number, a: number, b: number) => clamp01((v - a) / Math.max(1e-6, b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Absolute page top of an element (not affected by sticky positioning of its own stage). */
export const pageTop = (el: HTMLElement) => {
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) {
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return y;
};
