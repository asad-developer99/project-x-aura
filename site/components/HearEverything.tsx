"use client";

// FT17 (restyled) + M263 · Sound. The wide visual is the words HEAR EVERYTHING set huge in Syncopate; ash and lilac
// sine lines drift sideways INSIDE the letters (an SVG clip-path made of the text). Their amplitude follows the scroll
// speed and settles back to a calm ripple. Four mono footnotes slide in line by line as support.
// Arrives through the S9 letterbox (Letterbox.tsx): the bars open on the word.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SECS, SOUND_NOTES } from "../content";
import { pageTop, span } from "../live";

const LINES = 15;

export default function HearEverything() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const paths = Array.from(el.querySelectorAll<SVGPathElement>(".sine"));
    const notes = Array.from(el.querySelectorAll<HTMLElement>(".sound-note"));
    const still = prefersReducedMotion();
    let energy = 0.2;
    let visible = false;
    const io = new IntersectionObserver((e) => (visible = e.some((x) => x.isIntersecting)), { rootMargin: "20% 0px" });
    io.observe(el);
    const tick = (t: number) => {
      if (!visible && !still) return;
      const v = Math.abs(window.__lenis?.velocity ?? 0);
      energy += (Math.min(1, 0.2 + v / 40) - energy) * 0.06; // follows the scroll speed, settles back
      paths.forEach((p, i) => {
        const y0 = 40 + (i / (LINES - 1)) * 440;
        const amp = (6 + 26 * energy) * (0.6 + 0.4 * Math.sin(i * 1.3));
        const k = 0.006 + (i % 3) * 0.0015;
        const ph = (still ? 0 : t) * (0.9 + (i % 4) * 0.35) * (i % 2 ? 1 : -1) + i;
        let d = "";
        for (let x = -20; x <= 1620; x += 40) {
          const y = y0 + Math.sin(x * k + ph) * amp;
          d += `${x === -20 ? "M" : "L"}${x} ${y.toFixed(1)}`;
        }
        p.setAttribute("d", d);
      });
      // footnotes slide in line by line as the section rises
      const top = pageTop(el) - window.scrollY;
      const vh = window.innerHeight;
      notes.forEach((n, i) => {
        const k = still ? 1 : span(vh - top, vh * (0.55 + i * 0.07), vh * (0.8 + i * 0.07));
        n.style.opacity = k.toFixed(3);
        n.style.transform = `translate3d(${((1 - k) * -28).toFixed(1)}px,0,0)`;
      });
    };
    gsap.ticker.add(tick);
    tick(0);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, []);

  return (
    <section ref={root} id="sound" className="relative flex h-[120svh] flex-col justify-start pt-[24svh]">
      <div aria-hidden className="rec-stop pointer-events-none absolute left-0 top-[20svh] h-px w-px" data-record-time={SECS.sound} data-record-label="sound" />
      <div className="container-x">
        <p className="label-lg text-accent">Tuned in a quiet room</p>
        <svg viewBox="0 0 1600 520" className="sound-word mt-6 w-full overflow-visible" role="img" aria-label="Hear everything">
          <defs>
            <clipPath id="hear-clip">
              <text x="0" y="200" className="sound-text" textLength="760" lengthAdjust="spacingAndGlyphs">
                HEAR
              </text>
              <text x="0" y="470" className="sound-text" textLength="1600" lengthAdjust="spacingAndGlyphs">
                EVERYTHING
              </text>
            </clipPath>
          </defs>
          {/* the letters themselves, faint, so the word reads even where the lines thin out */}
          <text x="0" y="200" className="sound-text sound-ghost" textLength="760" lengthAdjust="spacingAndGlyphs">
            HEAR
          </text>
          <text x="0" y="470" className="sound-text sound-ghost" textLength="1600" lengthAdjust="spacingAndGlyphs">
            EVERYTHING
          </text>
          <g clipPath="url(#hear-clip)">
            {Array.from({ length: LINES }, (_, i) => (
              <path key={i} className={`sine ${i % 3 === 1 ? "sine-lilac" : "sine-ash"}`} d="M0 0" />
            ))}
          </g>
        </svg>
        <ol className="mt-[6svh] grid grid-cols-4 gap-6 border-t border-line pt-5">
          {SOUND_NOTES.map((n, i) => (
            <li key={n} className="sound-note label-lg flex gap-3">
              <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-fg">{n}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
