"use client";

// I33 · Dot ring wave (loader). 144 ash dots on a slowly turning ring; a lilac bulge runs round it while the hero's
// spin frames load (the % is the real load). At 100% the dots drift outward and fade, and the ring is left exactly where
// the hero's degree dial sits (same centre + radius: .dial-geo in site.css), so the loader hands over to the dial.
// The ring turns by CSS from the first paint (before any JavaScript), so the first second is never still.
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { loading } from "@/lib/loading";

const N = 144;
const R = 100; // viewBox units: the svg is sized to the dial's diameter (+ room for the bulge)

export default function DotRingLoader() {
  const root = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    if (prefersReducedMotion()) {
      setGone(true);
      loading.markFinished();
      return;
    }
    const dots = Array.from(el.querySelectorAll<SVGCircleElement>(".ld-dot"));
    const s = { amp: 0.25, phase: -0.6, spread: 0, a: 1, shown: 0 };
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      s.phase += 0.045; // the bulge runs round the ring
      const ph = ((s.phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      for (let i = 0; i < N; i++) {
        const th = (i / N) * Math.PI * 2;
        let d = Math.abs(th - ph);
        d = Math.min(d, Math.PI * 2 - d);
        const bump = Math.exp(-(d * d) / (2 * 0.24 * 0.24));
        const rr = R * (1 + s.amp * bump * 0.16 + s.spread * (0.45 + 0.55 * (((i * 37) % 11) / 11)));
        const c = dots[i];
        c.setAttribute("cx", (Math.cos(th) * rr).toFixed(2));
        c.setAttribute("cy", (Math.sin(th) * rr).toFixed(2));
        c.setAttribute("r", (0.9 + bump * s.amp * 1.5).toFixed(2));
        c.style.fill = bump > 0.35 ? "var(--accent)" : "";
      }
      if (pct.current) pct.current.textContent = String(Math.round(s.shown * 100)).padStart(3, "0");
    };
    raf = requestAnimationFrame(draw);
    gsap.to(s, { amp: 1, duration: 0.8, ease: "sine.inOut" });

    let exiting = false;
    const minTime = Date.now() + 1050; // ~2 s in all: show the brand for a moment, then hand over
    const exit = () => {
      if (exiting) return;
      exiting = true;
      clearTimeout(hard);
      const wait = Math.max(0, minTime - Date.now()) / 1000;
      gsap
        .timeline({ delay: wait })
        .to(s, { shown: 1, duration: 0.15, ease: "power1.out" })
        .add(() => loading.markFinished()) // the hero starts turning (intro 0° → 12°) while the dots drift out
        .to(s, { spread: 1, amp: 0, duration: 0.7, ease: "power2.in" })
        .to(el.querySelector(".ld-dots"), { opacity: 0, duration: 0.55, ease: "power1.in" }, "<0.1")
        .to(el.querySelector(".ld-mark"), { opacity: 0, y: -10, duration: 0.45, ease: "power2.in" }, "<")
        .to(el.querySelector(".ld-cover"), { opacity: 0, duration: 0.55, ease: "power1.inOut" }, "<0.05")
        .add(() => setGone(true));
    };
    const hard = setTimeout(exit, 9000);
    const unsub = loading.subscribe((p, done) => {
      if (exiting) return;
      gsap.to(s, { shown: Math.max(s.shown, p * 0.98), duration: 0.4, ease: "power2.out", overwrite: "auto" });
      if (done) exit();
    });
    return () => {
      unsub();
      clearTimeout(hard);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} data-loader aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div className="ld-cover absolute inset-0 bg-bg" />
      <svg className="ld-dots dial-geo absolute overflow-visible" viewBox={`${-R * 1.6} ${-R * 1.6} ${R * 3.2} ${R * 3.2}`}>
        {/* first paint, before any JavaScript: a lilac arc already runs round the ring (CSS only) */}
        <circle r={R} className="ld-arc" pathLength={100} />
        <g className="ld-spin">
          {Array.from({ length: N }, (_, i) => {
            const th = (i / N) * Math.PI * 2;
            return <circle key={i} className="ld-dot" cx={(Math.cos(th) * R).toFixed(2)} cy={(Math.sin(th) * R).toFixed(2)} r="0.9" />;
          })}
        </g>
      </svg>
      <div className="ld-mark dial-centre absolute flex flex-col items-center gap-3 text-center">
        <span className="font-display text-[clamp(18px,1.6vw,24px)] tracking-[0.3em]">Aura</span>
        <span className="label text-muted">
          <span ref={pct} className="tabular-nums text-accent">000</span> · tuning in
        </span>
      </div>
    </div>
  );
}
