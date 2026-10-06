"use client";

// HR12 (restyled) + M179 · Scroll-wheel turntable. The headphones turn 0° → 360° with the scroll (frames by VIDEO time,
// raw/spin-360.mp4). A degree dial runs round them like a turntable ring (its ticks + the 000° readout turn with the
// angle), four callouts lock on at 0° / 90° / 180° / 270° (leader line draws, text decodes, then dims). The rim light is
// a fixed beam, so the highlight sweeps across the product. At 360° the frame is key-front: the travelling headphones
// (Traveller.tsx, F1) take over on exactly the same box and the stage fades through black (X12) into the room.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import FilmPin from "./FilmPin";
import Magnet from "./Magnet";
import type { Place, Rect } from "./film";
import { CALLOUTS, HANDOVER, PRICE, PRODUCT, SPIN, SPIN_BOX, SPIN_END } from "../content";
import { live, span } from "../live";

const TICKS = 72; // every 5°, long every 30°

export default function SpinHero() {
  const stage = useRef<HTMLDivElement>(null);
  const rect = useRef<Rect | null>(null);
  const state = useRef({ angle: 0, p: 0, shown: [-1, -1, -1, -1] });

  // the product box in viewport px, from where the film drew its picture
  useEffect(() => {
    live.hero = () => {
      const r = rect.current;
      const cv = stage.current?.parentElement?.querySelector("canvas"); // the film canvas is the overlay's sibling
      if (!r || !cv) return null;
      const c = cv.getBoundingClientRect();
      return {
        cx: c.left + r.x + ((SPIN_BOX.x0 + SPIN_BOX.x1) / 2) * r.w,
        cy: c.top + r.y + ((SPIN_BOX.y0 + SPIN_BOX.y1) / 2) * r.h,
        h: (SPIN_BOX.y1 - SPIN_BOX.y0) * r.h,
      };
    };
    return () => {
      live.hero = null;
    };
  }, []);

  // dial follows the product box; idle shimmer so the stage is never still
  useEffect(() => {
    const el = stage.current!;
    const dial = el.querySelector<HTMLElement>(".hero-dial")!;
    const still = prefersReducedMotion();
    const tick = () => {
      const b = live.hero?.();
      if (!b) return;
      const r = b.h * 0.6;
      dial.style.width = dial.style.height = `${(r * 2).toFixed(1)}px`;
      dial.style.left = `${(b.cx - r).toFixed(1)}px`;
      dial.style.top = `${(b.cy - r - (el.getBoundingClientRect().top || 0)).toFixed(1)}px`;
    };
    gsap.ticker.add(tick);
    if (!still) gsap.fromTo(dial, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power1.out", delay: 0.2 });
    return () => gsap.ticker.remove(tick);
  }, []);

  const onTime = (t: number, p: number) => {
    const el = stage.current;
    if (!el) return;
    const s = state.current;
    const angle = (t / SPIN_END) * 360;
    s.angle = angle;
    s.p = p;
    const still = prefersReducedMotion();
    el.style.setProperty("--angle", `${(-angle).toFixed(2)}deg`);
    const read = el.querySelector(".hero-deg");
    if (read) read.textContent = String(Math.min(360, Math.round(angle))).padStart(3, "0");

    // X12: the last part of the turn fades the stage to black (the product itself is handed to the Traveller)
    const out = still ? 0 : span(p, 0.86, HANDOVER);
    // callouts: each one locks on as its angle passes, stays bright for 80°, then dims
    CALLOUTS.forEach((c, i) => {
      const box = el.querySelector<HTMLElement>(`.callout-${i}`);
      if (!box) return;
      const local = still ? 1 : span(angle, c.deg - 2, c.deg + 22);
      const after = still ? 0 : span(angle, c.deg + 80, c.deg + 110);
      box.style.setProperty("--draw", local.toFixed(3));
      box.style.opacity = (local <= 0 ? 0 : (1 - after * 0.62) * (1 - out)).toFixed(3);
      if (local > 0 && s.shown[i] < 0 && !still) {
        s.shown[i] = 1;
        gsap.to(box.querySelector(".callout-text"), { duration: 0.3, scrambleText: { text: c.label, chars: "upperCase", speed: 1, revealDelay: 0 }, ease: "none" }); // ~0.3 s: clean words almost at once
      }
      if (local <= 0 && s.shown[i] > 0) s.shown[i] = -1; // scrolled back: decode again next time
    });
    el.parentElement?.style.setProperty("--out", out.toFixed(3));
    const cv = el.parentElement?.querySelector<HTMLCanvasElement>("canvas");
    if (cv) cv.style.opacity = still || p < HANDOVER ? "1" : "0";
  };

  const place = (): Place => ({ h: 0.86, x: 0.495, y: 0.471, fade: { l: 0.14, r: 0.14, t: 0.08, b: 0.22 }, onLayout: (r) => (rect.current = r) });

  return (
    <FilmPin
      id="spin"
      film={SPIN}
      arrive={0.001}
      eager
      blockLoader
      place={place}
      onTime={onTime}
      intro={{ to: (90 / 360) * SPIN_END, secs: 9 }}
      before={<div className="hero-beam" aria-hidden />}
    >
      <div ref={stage} className="hero-ui absolute inset-0" data-cursor="Spin">
        {/* degree dial: ticks + readout turn with the product */}
        <div className="hero-dial pointer-events-none absolute" aria-hidden>
          <svg viewBox="-110 -110 220 220" className="hero-ticks absolute inset-0 h-full w-full overflow-visible">
            <circle r="100" className="dial-ring" />
            {Array.from({ length: TICKS }, (_, i) => {
              const a = (i / TICKS) * Math.PI * 2;
              const long = i % 6 === 0;
              const r0 = long ? 94 : 97;
              return (
                <line
                  key={i}
                  x1={(Math.cos(a) * r0).toFixed(2)}
                  y1={(Math.sin(a) * r0).toFixed(2)}
                  x2={(Math.cos(a) * 100).toFixed(2)}
                  y2={(Math.sin(a) * 100).toFixed(2)}
                  className={long ? "tick tick-long" : "tick"}
                />
              );
            })}
          </svg>
          <svg viewBox="-110 -110 220 220" className="absolute inset-0 h-full w-full overflow-visible">
            <path d="M0 -106 L-3 -112 L3 -112 Z" className="dial-marker" />
          </svg>
          <div className="hero-read font-display absolute left-1/2 top-full -translate-x-1/2 translate-y-[14px] text-[22px]">
            <span className="hero-deg tabular-nums text-accent">000</span>°
          </div>
        </div>

        {/* headline: big, left, wide caps */}
        <div className="hero-copy absolute left-[4.5vw] top-[13svh]">
          <h1 className="font-display text-[6.2vw] leading-[1.04]">
            Spin
            <br />
            it.
          </h1>
        </div>

        {/* four callouts that lock on at 0 / 90 / 180 / 270° */}
        {CALLOUTS.map((c, i) => (
          <div
            key={c.deg}
            className={`callout callout-${i} callout-${c.side} absolute`}
            style={{ top: `${c.y * 100}svh` }}
          >
            <span className="callout-deg font-display block text-accent">{String(c.deg).padStart(3, "0")}°</span>
            <span className="callout-text callout-hero mt-1 block whitespace-nowrap text-fg">{c.label}</span>
            <svg className="callout-lead absolute bottom-[24px] h-px overflow-visible" aria-hidden>
              <line x1="0" y1="0" x2="100%" y2="0" />
              <circle cx="100%" cy="0" r="5" className="callout-dot" />
            </svg>
          </div>
        ))}

        {/* product line, bottom left */}
        <div className="hero-buy absolute bottom-[6svh] left-[4.5vw] flex items-center gap-6">
          <p className="callout-big">
            {PRODUCT} <span className="text-muted">·</span> {PRICE}
          </p>
          <Magnet>
            <a href="#colour" className="btn btn-solid btn-lg">
              Pre-order
            </a>
          </Magnet>
        </div>
      </div>
    </FilmPin>
  );
}
