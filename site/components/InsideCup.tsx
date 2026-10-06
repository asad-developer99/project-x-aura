"use client";

// FT04 (restyled) + M443 · Inside the cup. Pinned frame scrub of the exploded ear cup (three-quarter view: the layers
// fly out to the LEFT along the cup's axis, the shell + band stay on the right). At each measured layer second its
// hairline draws in from a spec label (C10 style) up to the part, and the previous one dims. The labels sit in one row
// under the layers; the headline sits top left above them.
// X5 hard cut from the room: this section is pulled up one screen and its stage stays hidden until its top reaches the
// top of the screen, so it appears in one frame, right on "QUIET." (lesson 50). No record stop at its top (lesson 51).
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import FilmPin from "./FilmPin";
import type { Place, Rect } from "./film";
import { EXPLODE, LAYERS } from "../content";
import { span } from "../live";

/** Where a layer is at video second t (its measured track, linear between the keys). */
const vhNow = () => window.innerHeight;

function at(track: readonly (readonly number[])[], t: number) {
  if (t <= track[0][0]) return { x: track[0][1], y: track[0][2] };
  for (let i = 1; i < track.length; i++) {
    const [t1, x1, y1] = track[i];
    const [t0, x0, y0] = track[i - 1];
    if (t <= t1) {
      const k = (t - t0) / Math.max(1e-6, t1 - t0);
      return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k };
    }
  }
  const l = track[track.length - 1];
  return { x: l[1], y: l[2] };
}

export default function InsideCup() {
  const ui = useRef<HTMLDivElement>(null);
  const rect = useRef<Rect | null>(null);
  const time = useRef(0);

  // the stage appears in one frame when the section's top reaches the top (X5), and the hairlines follow their parts
  useEffect(() => {
    const el = ui.current!;
    const stage = el.parentElement!;
    const outer = stage.parentElement!;
    const still = prefersReducedMotion();
    const lines = Array.from(el.querySelectorAll<SVGLineElement>(".lead"));
    const labels = Array.from(el.querySelectorAll<HTMLElement>(".layer-label"));
    const tick = () => {
      const top = outer.getBoundingClientRect().top;
      const shown = still || top <= vhNow() * 0.15; // a few frames early, so the first draw is ready at the cut
      stage.style.visibility = still || top <= 0.5 ? "visible" : "hidden";
      // until then the film canvas is out of the render tree (no hidden decoding/uploading during the room's switch-off)
      const cvx = stage.querySelector<HTMLCanvasElement>("canvas");
      if (cvx) cvx.style.display = shown ? "" : "none";
      // after the cut the film eases back from a slight push-in (a coarse move while the cup is still assembled)
      const cvs = stage.querySelector<HTMLCanvasElement>("canvas");
      if (cvs) cvs.style.transform = still ? "" : `scale(${(1 + 0.07 * (1 - Math.min(1, time.current / 2.2)) ** 2).toFixed(4)})`;
      const r = rect.current;
      const cv = stage.querySelector("canvas");
      if (!r || !cv) return;
      const c = cv.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      const t = still ? EXPLODE.poster : time.current;
      LAYERS.forEach((L, i) => {
        const lab = labels[i];
        const ln = lines[i];
        if (!lab || !ln) return;
        const end = L.track[L.track.length - 1];
        // the label sits under the part's final place; its hairline runs up to where the part is now
        const lx = c.left - sr.left + r.x + ("lx" in L ? L.lx : end[1]) * r.w; // a label may sit a little off its part, to keep labels apart
        lab.style.left = `${lx.toFixed(1)}px`;
        const pos = at(L.track, t);
        const px = c.left - sr.left + r.x + pos.x * r.w;
        const py = c.top - sr.top + r.y + pos.y * r.h;
        const lr = lab.getBoundingClientRect();
        ln.setAttribute("x1", lx.toFixed(1));
        ln.setAttribute("y1", (lr.top - sr.top - 6).toFixed(1));
        ln.setAttribute("x2", px.toFixed(1));
        ln.setAttribute("y2", py.toFixed(1));
        const on = still ? 1 : span(t, L.t - 0.15, L.t + 0.35);
        const next = LAYERS[i + 1];
        const dim = still || !next ? 0 : span(t, next.t - 0.1, next.t + 0.4);
        // the newest part's label is lilac and full; earlier ones dim to ash (?static=1: all readable, the last lilac)
        const active = dim < 0.5;
        lab.style.color = active ? "var(--accent)" : "var(--text)";
        ln.style.strokeDashoffset = String(1 - on);
        ln.style.opacity = (on > 0 ? 1 - dim * 0.6 : 0).toFixed(3);
        lab.style.opacity = (on > 0 ? Math.min(1, on * 1.6) * (1 - dim * (still ? 0.3 : 0.62)) : 0).toFixed(3);
        lab.style.transform = `translateX(-50%) translateY(${((1 - Math.min(1, on * 1.6)) * 10).toFixed(1)}px)`;
        const dot = el.querySelector<SVGCircleElement>(`.lead-dot-${i}`);
        if (dot) {
          dot.setAttribute("cx", px.toFixed(1));
          dot.setAttribute("cy", py.toFixed(1));
          dot.style.opacity = ln.style.opacity;
        }
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const place = (): Place => ({ h: 0.74, x: 0.56, y: 0.43, fade: { l: 0.1, r: 0.12, t: 0.1, b: 0.14 }, onLayout: (r) => (rect.current = r) });

  return (
    <FilmPin
      id="inside"
      film={EXPLODE}
      arrive={null}
      className="relative z-[2] inside-cut"
      style={{ marginTop: "-100svh" }}
      place={place}
      loadWhen="#quiet"
      onTime={(t) => (time.current = t)}
    >
      <div ref={ui} className="absolute inset-0">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          {LAYERS.map((L, i) => (
            <g key={L.name}>
              <line className="lead" pathLength={1} />
              <circle className={`lead-dot lead-dot-${i}`} r="3" />
            </g>
          ))}
        </svg>
        <div className="absolute left-[4.5vw] top-[9svh]">
          <p className="label text-accent">Five layers, one cup</p>
          <h2 className="font-display mt-3 text-[clamp(24px,2.4vw,38px)] leading-[1.06]">
            Inside
            <br />
            the cup.
          </h2>
        </div>
        {LAYERS.map((L, i) => (
          <div key={L.name} className={`layer-label absolute whitespace-nowrap text-center ${i % 2 ? "bottom-[14svh]" : "bottom-[4svh]"}`}>
            <p className="label-hero">{L.name}</p>
          </div>
        ))}
      </div>
    </FilmPin>
  );
}
