"use client";

// F1 · Waypoint travel (PNG cut-outs). One pair of headphones travels down the page with the scroll and lands in each
// section: Hero (lifts off the last spin frame, key-front, on exactly the same box) → Quiet (shrinks onto the listener's
// head, turning a half turn to key-back, and fades into the video) → hidden through Inside the cup and Sound → 40 hours
// (a small icon riding the tip of the battery liquid) → Colour (lands on the wheel marker and becomes the colourways)
// → Reviews (waits in the empty right-hand lane) → Footer (rests in the centre of the text ring).
// Every waypoint is LIVE (read each frame from the section that owns it), so moving anchors (the battery tip, a pinned
// stage, the sticky footer) are followed exactly. Between waypoints it flies on a soft arc (a quadratic path, re-aimed
// every frame because both ends move), eased in-out, no overshoot. An idle float keeps it moving on every waypoint, so
// it never stands still in ?record=1. It never covers text: each anchor sits away from its section's text and every
// path crosses only empty stage (DESIGN.md → Motion map → Travelling headphones).
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { COLOUR_BOX, COLOURS, HANDOVER, TRAVEL } from "../content";
import { easeInOut, lerp, live, pageTop, recording, span, staticMode, type Box } from "../live";

type Look = { front: number; back: number; colour: number };
type Key = { y: number; box: () => Box | null; look: Look; o: number; idle: number; arc?: number };

const FRONT: Look = { front: 1, back: 0, colour: 0 };
const BACK: Look = { front: 0, back: 1, colour: 0 };
const COLOUR: Look = { front: 0, back: 0, colour: 1 };

/** Viewport box of an element, as a product box (centre + height). */
const boxOf = (sel: string) => () => {
  const el = document.querySelector<HTMLElement>(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, h: r.height };
};

const H0 = 600; // css height every image is laid out at; the product size comes from a scale transform

export default function Traveller() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (staticMode()) return; // ?static=1: the sections show their own still product images
    const el = root.current!;
    const imgs = {
      front: el.querySelector<HTMLImageElement>(".tv-front")!,
      back: el.querySelector<HTMLImageElement>(".tv-back")!,
      colours: Array.from(el.querySelectorAll<HTMLImageElement>(".tv-colour")),
    };
    const glow = el.querySelector<HTMLElement>(".tv-glow")!;
    const rec = recording();

    let keys: Key[] = [];
    const measure = () => {
      const vh = window.innerHeight;
      const q = (id: string) => document.getElementById(id);
      const hero = q("spin");
      const quiet = q("quiet");
      const bat = q("battery");
      const col = q("colour");
      const rev = q("reviews");
      if (!hero || !quiet || !bat || !col || !rev) return;
      const heroPin = hero.offsetHeight - vh;
      const quietTop = pageTop(quiet);
      const quietPin = quiet.offsetHeight - vh;
      const batTop = pageTop(bat);
      const batPin = Number(bat.dataset.fillPx ?? bat.offsetHeight - vh); // the fill only (the handover screen follows)
      const colTop = pageTop(col);
      const wheelPx = Number(col.dataset.wheelPx ?? 0);
      const revTop = pageTop(rev);
      const maxY = document.documentElement.scrollHeight - vh;
      const heroBox = () => live.hero?.() ?? null;
      const head = () => live.head?.() ?? null;
      const tip = boxOf("[data-way=battery]");
      const colour = boxOf("[data-way=colour]");
      const lane = boxOf("[data-way=lane]");
      // the lane's place on screen once Reviews has arrived (same x and size, held at mid-screen while it rises)
      const laneWait = () => {
        const b = lane();
        return b ? { cx: b.cx, cy: window.innerHeight / 2, h: b.h } : null;
      };
      const foot = boxOf("[data-way=footer]");
      keys = [
        { y: pageTop(hero) + heroPin * HANDOVER, box: heroBox, look: FRONT, o: 1, idle: 0 },
        // lands on the listener's head exactly as the train video appears, then dissolves into it in ~0.4 s
        // (the video fades in over the same scroll), so two pairs are never seen at once
        { y: quietTop, box: head, look: BACK, o: 1, idle: 0, arc: -0.22 },
        { y: quietTop + quietPin * 0.08, box: head, look: BACK, o: 0, idle: 0 },
        { y: batTop - vh * 0.3, box: tip, look: FRONT, o: 0, idle: 0.3 },
        { y: batTop, box: tip, look: FRONT, o: 1, idle: 0.3 },
        { y: batTop + batPin, box: tip, look: FRONT, o: 1, idle: 0.3 },
        { y: colTop, box: colour, look: COLOUR, o: 1, idle: 0.55, arc: 0.12 },
        { y: colTop + (rec ? wheelPx : 1), box: colour, look: COLOUR, o: 1, idle: 0.55 },
        // into the empty right-hand lane BEFORE the quote rises on screen (never over the review text)
        { y: revTop - vh * 0.5, box: laneWait, look: COLOUR, o: 1, idle: 0.9, arc: 0.1 },
        { y: revTop, box: lane, look: COLOUR, o: 1, idle: 0.9 },
        { y: maxY, box: foot, look: COLOUR, o: 1, idle: 1, arc: -0.18 },
      ];
    };
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    document.fonts?.ready.then(measure);
    const late = window.setTimeout(measure, 800);

    // lay one image out so that its product box (fractions of the image) lands on the target box
    const put = (img: HTMLImageElement, fb: { x0: number; x1: number; y0: number; y1: number }, aspect: number, b: Box, sx: number, rot: number, a: number) => {
      if (a <= 0.002) {
        img.style.opacity = "0";
        return;
      }
      const k = b.h / (fb.y1 - fb.y0) / H0; // scale of the H0-tall image
      const W = H0 * aspect;
      const ox = ((fb.x0 + fb.x1) / 2) * W; // product centre inside the image (unscaled px)
      const oy = ((fb.y0 + fb.y1) / 2) * H0;
      img.style.transformOrigin = `${ox}px ${oy}px`;
      img.style.transform = `translate3d(${(b.cx - ox).toFixed(2)}px, ${(b.cy - oy).toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${(k * sx).toFixed(4)}, ${k.toFixed(4)})`;
      img.style.opacity = a.toFixed(3);
    };

    const tick = (time: number) => {
      if (keys.length < 2) return;
      const y = window.scrollY;
      if (y < keys[0].y - 0.5) {
        el.style.visibility = "hidden";
        return;
      }
      // the leg we are on
      let i = 0;
      while (i < keys.length - 2 && y > keys[i + 1].y) i++;
      const A = keys[i];
      const B = keys[i + 1];
      const s = span(y, A.y, B.y);
      const e = easeInOut(s);
      const o = lerp(A.o, B.o, s);
      if (o <= 0.002) {
        el.style.visibility = "hidden";
        return;
      }
      const a = A.box();
      const b = B.box() ?? a;
      if (!a || !b) return;
      el.style.visibility = "visible";
      // position on a soft arc between the two (live) boxes; size eased in log space (no sudden shrink)
      const mx = lerp(a.cx, b.cx, e);
      const my = lerp(a.cy, b.cy, e);
      const dx = b.cx - a.cx;
      const dy = b.cy - a.cy;
      const bend = (B.arc ?? 0) * 4 * e * (1 - e);
      const box: Box = {
        cx: mx - dy * bend,
        cy: my + dx * bend,
        h: Math.exp(lerp(Math.log(Math.max(1, a.h)), Math.log(Math.max(1, b.h)), e)),
      };
      // idle float (never frozen): bob, sway and a slow breath, scaled to the product size
      const t = time;
      const idle = lerp(A.idle, B.idle, e);
      box.cy += Math.sin(t * 1.35) * 0.022 * box.h * idle;
      box.cx += Math.sin(t * 0.7 + 1.3) * 0.012 * box.h * idle;
      const rot = Math.sin(t * 0.8) * 2.2 * idle;
      const breath = 1 + Math.sin(t * 1.1) * 0.014 * idle;
      box.h *= breath;

      // looks: front / back (a half turn: crossfade + a narrow squeeze at mid-turn) / colourways (the wheel)
      const look = (k: keyof Look) => lerp(A.look[k], B.look[k], A.look[k] !== B.look[k] ? span(s, 0.3, 0.75) : 1);
      const turning = A.look.front !== B.look.front && A.look.back !== B.look.back;
      const sx = turning ? 1 - 0.38 * Math.sin(Math.PI * span(s, 0.2, 0.85)) : 1;
      put(imgs.front, TRAVEL.frontBox, TRAVEL.aspect, box, sx, rot, look("front") * o);
      put(imgs.back, TRAVEL.backBox, TRAVEL.aspect, box, sx, rot, look("back") * o);
      const cw = look("colour") * o;
      imgs.colours.forEach((img, ci) => {
        const w = Math.max(0, 1 - Math.abs(live.wheel - ci));
        put(img, COLOUR_BOX, 1, box, 1, rot, cw * w);
      });
      // a soft lilac rim glow + floor shadow follow it
      glow.style.opacity = (o * 0.55).toFixed(3);
      glow.style.transform = `translate3d(${(box.cx - 150).toFixed(1)}px, ${(box.cy + box.h * 0.42 - 30).toFixed(1)}px, 0) scale(${(box.h / 320).toFixed(3)}, ${(box.h / 900).toFixed(3)})`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      window.clearTimeout(late);
    };
  }, []);

  return (
    <div ref={root} className="traveller pointer-events-none fixed inset-0 z-30 overflow-hidden" style={{ visibility: "hidden" }} aria-hidden>
      <div className="tv-glow absolute left-0 top-0 h-[60px] w-[300px] origin-[150px_30px] rounded-[50%] opacity-0" />
      {/* eslint-disable @next/next/no-img-element */}
      <img className="tv-img tv-front" src={TRAVEL.front} alt="" style={{ height: H0, width: H0 * TRAVEL.aspect }} />
      <img className="tv-img tv-back" src={TRAVEL.back} alt="" style={{ height: H0, width: H0 * TRAVEL.aspect }} />
      {COLOURS.map((c) => (
        <img key={c.id} className="tv-img tv-colour" src={c.img} alt="" style={{ height: H0, width: H0 }} />
      ))}
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}
