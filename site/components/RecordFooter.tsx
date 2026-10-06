"use client";

// FO12 (restyled) + M33 · Footer. The text ribbon "AURA SOUND · HEAR LESS · HEAR MORE ·" turns round the travelling
// headphones like a record (one turn per 18 s, faster while you scroll); the headphones come to rest in its centre
// ([data-way=footer]). A broad lilac light band sweeps slowly behind (a coarse moving element, so the end of the reel
// never freezes, lesson 55). X40: the footer is revealed under the page (sticky at the bottom, under <main>).
import { useEffect, useRef } from "react";
import Magnet from "./Magnet";
import { recording } from "../live";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { COLOURS, FOOT_LINKS, PRICE, PRODUCT, RIBBON, STUDIO } from "../content";

export default function RecordFooter() {
  const ring = useRef<SVGGElement>(null);
  // lilac underlines draw in on hover; on camera they draw in once by themselves, one after another
  useEffect(() => {
    if (!recording()) return;
    const foot = document.getElementById("footer");
    if (!foot) return;
    // the footer is sticky (always "in view" under the page), so go by the scroll: the last ~third of a screen
    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > max - window.innerHeight * 0.35) {
        foot.classList.add("u-on");
        gsap.ticker.remove(tick);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let a = 0;
    const tick = (_t: number, dt: number) => {
      const v = Math.abs(window.__lenis?.velocity ?? 0);
      a += (dt / 1000) * (20 + Math.min(80, v * 6)); // deg per second: 20 at rest (one turn / 18 s)
      ring.current?.setAttribute("transform", `rotate(${a.toFixed(2)})`);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  const text = RIBBON.repeat(2);

  return (
    <footer id="footer" className="foot sticky bottom-0 z-0 h-[100svh] overflow-hidden">
      <div className="foot-band pointer-events-none absolute inset-y-0 w-[60vw]" aria-hidden />
      <div className="relative grid h-full grid-rows-[1fr_auto]">
        <div className="relative">
          <svg viewBox="-300 -300 600 600" className="foot-ring absolute left-1/2 top-[48%] h-[min(74svh,62vw)] w-[min(74svh,62vw)] -translate-x-1/2 -translate-y-1/2 overflow-visible" aria-hidden>
            <defs>
              <path id="ribbon-path" d="M0,-250 a250,250 0 1,1 0,500 a250,250 0 1,1 0,-500" />
            </defs>
            <circle r="292" className="foot-ring-line" />
            <circle r="206" className="foot-ring-line" />
            <g ref={ring}>
              <text className="foot-ribbon">
                <textPath href="#ribbon-path" textLength="1565" lengthAdjust="spacing">
                  {text}
                </textPath>
              </text>
            </g>
          </svg>
          <div data-way="footer" className="absolute left-1/2 top-[48%] aspect-[0.74] h-[30svh] -translate-x-1/2 -translate-y-1/2" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={COLOURS[2].img} alt="" className="static-only absolute left-1/2 top-1/2 h-[141%] w-auto max-w-none -translate-x-1/2 -translate-y-[48%]" />
          </div>
          <div className="absolute left-[clamp(20px,4.5vw,72px)] top-[14svh]">
            <p className="font-display text-[clamp(18px,1.6vw,24px)] tracking-[0.18em]">Aura Sound</p>
            <p className="label mt-3 max-w-[26ch] text-muted">Hear less. Hear more. Made to be kept for years.</p>
          </div>
          <div className="absolute right-[4.5vw] top-[14svh] text-right">
            <p className="label text-muted">
              {PRODUCT} · {PRICE}
            </p>
            <Magnet>
              <a href="#colour" className="btn btn-solid btn-lg mt-4">
                Pre-order
              </a>
            </Magnet>
          </div>
        </div>
        <div className="container-x grid grid-cols-[1fr_1fr_2fr] gap-8 border-t border-line py-7">
          {FOOT_LINKS.map((col) => (
            <div key={col.h}>
              <p className="label-lg text-accent">{col.h}</p>
              <ul className="mt-3 grid gap-1">
                {col.items.map((it, k) => (
                  <li key={it} style={{ ["--d" as string]: `${k * 0.12}s` }}>
                    <a href="#spin" className="u-draw label-lg text-muted hover:text-fg">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="label self-end text-right text-muted">{STUDIO}</p>
        </div>
      </div>
    </footer>
  );
}
