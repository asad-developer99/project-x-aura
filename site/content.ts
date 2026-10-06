// All text + data for Aura Sound (concept site, sample prices in ₹). Plan: site/DESIGN.md.
import type { Film } from "./components/film";

export const BRAND = "Aura Sound";
export const PRODUCT = "Aura One";
export const PRICE = "₹29,990";

export const NAV_LINKS = [
  { label: "Spin", href: "#spin" },
  { label: "Quiet", href: "#quiet" },
  { label: "Inside", href: "#inside" },
  { label: "Colour", href: "#colour" },
];

// ---------- record seconds per section (DESIGN.md §4, ~33 s with the loader) ----------
export const SECS = {
  hero: 5.8, // pinned spin 0° → 360° (incl. the 0 → 12° intro that plays by itself)
  quiet: 6, // 1 s through black + 5 s pinned
  inside: 4.5, // hard cut, then the explode scrub
  sound: 3,
  battery: 3.2,
  colour: 4, // record mode: the scroll turns the wheel
  reviews: 2.5,
  footer: 2,
};
/** Pinned scroll length per record second (hand scrolling feels like the reel). */
export const VH_PER_SEC = 55;

// ---------- films (frames by video time: site/frames.json → public/frames/aura-*) ----------
/** 360° turntable: spin-a 0–5 s + its mirror, seams blended (raw/spin-360.mp4, 9.83 s). */
/** The last 0.3 s holds key-front while the travelling headphones lift off it (the scroll never stops). */
export const SPIN_LIFT = 0.3;
export const SPIN: Film = {
  frames: "/frames/aura-spin",
  start: 0,
  poster: 9.833,
  segments: [
    { to: 9.833, secs: SECS.hero - SPIN_LIFT, label: "spin" },
    { to: 9.833, secs: SPIN_LIFT, label: "spin-lift" },
  ],
};
/** Hero progress where the film reaches key-front and the Traveller takes over. */
export const HANDOVER = (SECS.hero - SPIN_LIFT) / SECS.hero;
export const SPIN_END = 9.833;
/** Where the product sits in a spin frame (fractions of the 16:9 frame), measured on frame 0 = key-front. */
export const SPIN_BOX = { x0: 0.3635, x1: 0.6464, y0: 0.1009, y1: 0.769 };

/** Exploded ear cup: explode.mp4 1.2–8.0 s (video second 0 here = 1.2 s of the raw clip). */
export const EXPLODE: Film = { frames: "/frames/aura-explode", start: 0, poster: 6.8, segments: [{ to: 6.8, secs: SECS.inside, label: "explode" }] };

export const CALLOUTS = [
  { deg: 0, label: "Foam cushions", side: "l" as const, y: 0.5 },
  { deg: 90, label: "Twin rails", side: "r" as const, y: 0.26 },
  { deg: 180, label: "Fold-flat", side: "l" as const, y: 0.7 },
  { deg: 270, label: "8 mics", side: "r" as const, y: 0.52 },
];

// ---------- the room goes quiet ----------
export const NOISE_A = ["HORN", "CHATTER", "BRAKES", "ANNOUNCEMENT"];
export const NOISE_B = ["RAIN", "KEYS", "BABY", "ENGINE"];
/** The listener's headphones in the room video (fractions of the 16:9 frame), measured on the contact sheet. */
export const ROOM_HEAD = { cx: 0.515, cy: 0.3, h: 0.27 };

// ---------- inside the cup: layer tracks measured on the explode clip (raw seconds → frame fractions) ----------
// t = video second of THIS clip (raw − 1.2). Each label draws in at its measured second; its hairline follows the part.
export const LAYERS = [
  { name: "Cushion", t: 0.8, track: [[0.8, 0.45, 0.42], [2.0, 0.34, 0.45], [3.5, 0.25, 0.48], [5.3, 0.2, 0.48], [6.8, 0.22, 0.45]] },
  { name: "Magnesium frame", lx: 0.6, t: 2.0, track: [[2.0, 0.59, 0.6], [3.5, 0.55, 0.62], [5.3, 0.54, 0.62], [6.8, 0.55, 0.62]] },
  { name: "40 mm driver", t: 3.5, track: [[3.5, 0.46, 0.47], [5.3, 0.43, 0.49], [6.8, 0.45, 0.47]] },
  { name: "Mesh", lx: 0.3, t: 5.3, track: [[5.3, 0.36, 0.42], [6.8, 0.34, 0.4]] },
  { name: "Shell", t: 6.3, track: [[6.3, 0.76, 0.55], [6.8, 0.76, 0.55]] },
] as const;

// ---------- sound ----------
export const SOUND_NOTES = ["40 mm carbon-dome driver", "4 Hz – 40 kHz", "LDAC + Hi-Res Wireless", "Spatial audio, head tracking"];

// ---------- battery ----------
export const BATTERY_CELLS = [
  { k: "5 min", v: "= 4 h of play" },
  { k: "USB-C", v: "fast charge" },
  { k: "2", v: "devices at once" },
  { k: "268 g", v: "all day light" },
];

// ---------- colour ----------
export const COLOURS = [
  { id: "graphite", name: "Graphite", finish: "Matte graphite · titanium rings", img: "/images/aura/colours/graphite.png", tint: "rgba(150,152,170,0.20)", glow: "#8e909c" },
  { id: "moonstone", name: "Moonstone", finish: "Pale silver · brushed steel rings", img: "/images/aura/colours/moonstone.png", tint: "rgba(205,214,236,0.26)", glow: "#cdd6ec" },
  { id: "dune", name: "Dune", finish: "Warm sand · champagne-gold rings", img: "/images/aura/colours/dune.png", tint: "rgba(214,182,136,0.26)", glow: "#d6b688" },
] as const;
/** Product box inside the 1:1 colourway cut-outs (fractions), so they line up with the travelling key image. */
export const COLOUR_BOX = { x0: 0.2456, x1: 0.7671, y0: 0.1284, y1: 0.835 };

// ---------- travelling headphones (F1) ----------
export const TRAVEL = {
  front: "/images/aura/travel/key-front.png",
  back: "/images/aura/travel/key-back.png",
  frontBox: { x0: 0.363, x1: 0.6446, y0: 0.1003, y1: 0.7689 },
  backBox: { x0: 0.3561, x1: 0.6366, y0: 0.1009, y1: 0.7689 },
  aspect: 2752 / 1536,
};

// ---------- reviews ----------
export const RATING = "4.8";
export const RATINGS_COUNT = "12,406";
export const QUOTES = [
  { q: "The metro just stops. I hear my own breathing.", who: "Ira, Pune · daily metro" },
  { q: "Forty hours is real. I charge it on Sundays.", who: "Kabir, Bengaluru · studio" },
  { q: "Lightest pair I have kept on for a full flight.", who: "Meher, Delhi · frequent flyer" },
];

// ---------- footer ----------
export const RIBBON = "AURA SOUND · HEAR LESS · HEAR MORE · ";
export const FOOT_LINKS = [
  { h: "Shop", items: ["Aura One", "Ear cushions", "Hard case", "Gift cards"] },
  { h: "Help", items: ["Warranty", "Pair a device", "Returns", "Stores"] },
];
export const STUDIO = "Concept website by Triozen Tech. Aura Sound is a fictional brand; prices are samples.";
