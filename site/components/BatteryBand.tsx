"use client";

// BN11 (restyled) + M455 · 40 hours. Pinned. The full-width band is a battery cell: a long tube fills with a lilac
// liquid as you scroll; its surface (the right-hand edge) ripples and leans with the scroll speed, then settles.
// A huge "40 H" counts up continuously at the tip, and the travelling headphones ride the tip as a small icon (the
// anchor [data-way=battery] follows the liquid edge). Four big stats unfold underneath as support.
// X22 arrival: a feathered gradient mask rises with the scroll.
// Handover to Colour (X2): the stage stays pinned one more screen while the battery fades out IN PLACE (nothing scrolls
// under the nav); the colour stage fades in on the same spot and the headphones glide from the tip to the marker.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { BATTERY_CELLS, SECS, VH_PER_SEC } from "../content";
import { clamp01, lerp, pageTop, smooth, span } from "../live";

const ARRIVE = 1.0;
const PIN_SECS = SECS.battery - ARRIVE;
const PIN_VH = Math.round(PIN_SECS * VH_PER_SEC); // the fill
export const HANDOVER_VH = 100; // the in-place handover to Colour (Colour is pulled up over this screen)

export default function BatteryBand() {
  const outer = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = outer.current!;
    const stage = sec.querySelector<HTMLElement>(".pin-stage")!;
    const body = sec.querySelector<HTMLElement>(".bat-body")!;
    const tube = sec.querySelector<HTMLElement>(".bat-tube")!;
    const liquid = sec.querySelector<SVGPathElement>(".bat-liquid")!;
    const shine = sec.querySelector<SVGPathElement>(".bat-surface")!;
    const tip = sec.querySelector<HTMLElement>("[data-way=battery]")!;
    const count = sec.querySelector<HTMLElement>(".bat-count")!;
    const num = sec.querySelector<HTMLElement>(".bat-num")!;
    const cells = Array.from(sec.querySelectorAll<HTMLElement>(".bat-cell"));
    const still = prefersReducedMotion();
    let lean = 0;
    const setFillPx = () => (sec.dataset.fillPx = String(Math.round((PIN_VH / 100) * window.innerHeight)));
    setFillPx();
    window.addEventListener("resize", setFillPx);
    const tick = (t: number) => {
      const vh = window.innerHeight;
      const top = pageTop(sec);
      const fillPx = (PIN_VH / 100) * vh;
      const handPx = (HANDOVER_VH / 100) * vh;
      const y = window.scrollY;
      if (!still && (y < top - vh * 1.2 || y > top + fillPx + handPx + vh)) return; // ?static=1: always the final state
      const p = still ? 1 : clamp01((y - top) / fillPx);
      // X22: feathered mask rising with the arrival
      const m = still ? 1.4 : span(y, top - vh, top - vh * 0.05) * 1.4;
      stage.style.setProperty("--m", `${(m * 100).toFixed(1)}%`);
      // handover: the whole battery fades out in place (lifting a little) while Colour fades in over it
      const out = still ? 0 : smooth(span(y, top + fillPx, top + fillPx + handPx * 0.42)); // fully gone before Colour starts (0.5)
      body.style.opacity = (1 - out).toFixed(3);
      body.style.transform = out > 0 ? `translate3d(0, ${(-out * 70).toFixed(1)}px, 0)` : "";

      const W = tube.clientWidth;
      const H = tube.clientHeight;
      const fill = lerp(0.035, 1, p);
      const v = window.__lenis?.velocity ?? 0;
      lean += (Math.max(-1, Math.min(1, v / 30)) - lean) * 0.08; // leans with the scroll speed, settles back
      const x0 = fill * W;
      let d = `M0 0 L${x0.toFixed(1)} 0`;
      let s = "";
      for (let i = 0; i <= 24; i++) {
        const yy = (i / 24) * H;
        const wave = Math.sin(i * 0.7 + t * 4.2) * (4 + 10 * Math.abs(lean)) + Math.sin(i * 1.9 - t * 2.6) * 3;
        const xx = Math.min(W, x0 + wave + lean * 26 * (yy / H - 0.5) * -2);
        d += ` L${xx.toFixed(1)} ${yy.toFixed(1)}`;
        s += `${i ? "L" : "M"}${xx.toFixed(1)} ${yy.toFixed(1)}`;
      }
      d += ` L0 ${H} Z`;
      liquid.setAttribute("d", d);
      shine.setAttribute("d", s);
      // the tip: icon anchor + the live count (kept inside the tube's ends)
      const tx = Math.min(W - 40, Math.max(40, x0));
      tip.style.left = `${tx.toFixed(1)}px`;
      const half = count.offsetWidth / 2;
      count.style.left = `${Math.min(W - half, Math.max(half, tx)).toFixed(1)}px`;
      const hrs = 40 * fill;
      num.textContent = hrs >= 39.95 ? "40" : hrs.toFixed(1);
      cells.forEach((c, i) => {
        const k = still ? 1 : smooth(span(p, 0.05 + i * 0.12, 0.35 + i * 0.12));
        c.style.clipPath = `inset(0 ${((1 - k) * 100).toFixed(1)}% 0 0)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", setFillPx);
    };
  }, []);

  return (
    <section ref={outer} id="battery" className="pin-outer relative" style={{ height: `calc(100svh + ${PIN_VH + HANDOVER_VH}vh)` }}>
      <div aria-hidden className="rec-stop pointer-events-none absolute left-0 top-0 h-px w-px" data-record-time={ARRIVE} data-record-label="battery" />
      <div aria-hidden className="rec-stop pointer-events-none absolute left-0 h-px w-px" style={{ top: `${PIN_VH}vh` }} data-record-time={PIN_SECS} data-record-label="battery-end" />
      <div className="pin-stage bat-stage flex flex-col justify-center">
        <div className="bat-body container-x">
          <h2 className="font-display text-[3vw] leading-[1.05]">
            Forty hours.
            <br />
            <span className="text-muted">One charge.</span>
          </h2>
          {/* the battery cell */}
          <div className="relative mt-[19svh]">
            <div className="bat-count font-display pointer-events-none absolute bottom-[calc(100%+10px)] -translate-x-1/2 whitespace-nowrap text-[7.5vw] leading-none text-accent">
              <span className="bat-num tabular-nums">1.4</span> H
            </div>
            <div className="bat-tube relative h-[14svh] rounded-[999px] border border-[#3a3b40]">
              <svg className="absolute inset-0 h-full w-full overflow-hidden rounded-[999px]" aria-hidden>
                <defs>
                  <linearGradient id="bat-g" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#3b3550" />
                    <stop offset="1" stopColor="#c9b8ff" />
                  </linearGradient>
                </defs>
                <path className="bat-liquid" fill="url(#bat-g)" d="M0 0" />
                <path className="bat-surface" d="M0 0" />
              </svg>
              <div data-way="battery" className="pointer-events-none absolute top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2" aria-hidden />
              <span className="bat-nub absolute -right-[12px] top-1/2 h-[34%] w-[8px] -translate-y-1/2 rounded-r-[4px] bg-[#3a3b40]" aria-hidden />
            </div>
          </div>
          {/* four big stats on the left; the right side stays free for the travelling headphones */}
          <div className="mt-[7svh] grid w-[78%] grid-cols-4 border-l border-line">
            {BATTERY_CELLS.map((c) => (
              <div key={c.k} className="bat-cell border-r border-t border-line px-5 py-5">
                <p className="font-display text-[2.6vw] leading-none">{c.k}</p>
                <p className="label-lg mt-3 text-muted">{c.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
