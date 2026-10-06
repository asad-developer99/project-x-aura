import type { SiteMeta, Theme } from "@/lib/site";

// Settings for THIS site: Aura Sound, a (concept) maker of premium wireless over-ear headphones.
// "Spin a product with your scroll wheel." Direction + Motion map: site/DESIGN.md.

export const meta: SiteMeta = {
  name: "Aura Sound",
  title: "Aura Sound — Aura One wireless headphones",
  description:
    "Aura One: wireless over-ear headphones with adaptive noise cancelling, a 40 mm carbon-dome driver and 40 hours of battery. A concept website.",
  loaderText: "Aura",
  loader: false, // site/components/DotRingLoader.tsx (I33) replaces the engine loader
  cursor: true,
  record: { duration: 31 }, // only used without the section timeline (this page uses data-record-time stops)
};

export const theme: Theme = {
  bg: "#0F1011", // graphite stage: every film is graded onto it
  surface: "#18191B",
  text: "#EDECE8",
  muted: "#9C9DA3",
  accent: "#C9B8FF", // lilac halo: only on things you can touch, the rim light and live numbers
  accentText: "#0F1011",
  line: "#26272A",
  fontDisplay: "'Syncopate', 'Arial Black', system-ui, sans-serif",
  fontBody: "'Space Mono', ui-monospace, monospace",
  radius: 0,
  uppercaseHeadings: true,
  heroText: "#EDECE8",
};
