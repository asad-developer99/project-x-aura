"use client";

// PS11 (restyled) + M545 · Choose your colour. A drum of three big names (GRAPHITE · MOONSTONE · DUNE) turns past a
// lilac marker; the product at the marker (the travelling headphones, landed here from the battery) crossfades to that
// colourway and a soft tint behind it shifts with it. The card shows only the name, ₹29,990 and Add to bag.
// NOTHING CHANGES BY ITSELF: in ?record=1 the section pins and the scroll turns the wheel continuously (linear,
// finishing exactly at the end of the pin); in normal mode the wheel only moves when the visitor clicks a name or an arrow.
// X2 arrival: this section is pulled up over the battery's handover screen and its stage fades in IN PLACE (it is held
// at the top of the screen while the battery fades out underneath), so nothing slides. X1: Reviews slides up over it.
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { COLOURS, PRICE, PRODUCT, SECS, VH_PER_SEC } from "../content";
import { clamp01, live, pageTop, recording, smooth, span } from "../live";

const ARRIVE = 1.4; // record seconds of the in-place handover from the battery (the traveller glides across)
const WHEEL_SECS = SECS.colour - ARRIVE;
const WHEEL_VH = Math.round(WHEEL_SECS * VH_PER_SEC);
const STEP = 38; // degrees between names on the drum

export default function ColourWheel({ onAdd }: { onAdd: (img: string, from: DOMRect) => void }) {
  const outer = useRef<HTMLElement>(null);
  const [rec, setRec] = useState(false);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const w = useRef({ v: 0 });

  useEffect(() => setRec(recording()), []);

  useEffect(() => {
    const sec = outer.current!;
    const stage = sec.querySelector<HTMLElement>(".pin-stage")!;
    const names = Array.from(sec.querySelectorAll<HTMLElement>(".wheel-name"));
    const tints = Array.from(sec.querySelectorAll<HTMLElement>(".col-tint"));
    const statics = Array.from(sec.querySelectorAll<HTMLElement>(".col-static"));
    const still = prefersReducedMotion();
    let added = false;
    let near = -1;
    const tick = () => {
      const vh = window.innerHeight;
      const top = pageTop(sec);
      const y = window.scrollY;
      if (!still && (y < top - vh * 1.5 || y > top + sec.offsetHeight)) return; // ?static=1: always drawn
      // X2: until its top reaches the top of the screen, the stage is held there and fades in over the battery
      const before = still ? 0 : Math.max(0, top - y);
      stage.style.transform = before > 0 ? `translate3d(0, ${(-before).toFixed(1)}px, 0)` : "";
      stage.style.opacity = still ? "1" : smooth(span(1 - before / vh, 0.5, 0.92)).toFixed(3); // after the battery has gone (BatteryBand fades out over 0 → 0.42)
      if (rec && !still) w.current.v = 2 * clamp01((y - top) / ((WHEEL_VH / 100) * vh));
      const v = w.current.v;
      live.wheel = v;
      // the drum: names on a cylinder, the one at the marker faces you, the others curve away up / down
      const R = (names[0]?.parentElement?.clientHeight ?? 200) * 0.46;
      names.forEach((n, i) => {
        const a = ((i - v) * STEP * Math.PI) / 180;
        const vis = Math.abs(a) < Math.PI / 2;
        n.style.transform = `translateY(calc(-50% + ${(Math.sin(a) * R).toFixed(1)}px)) rotateX(${((-a * 180) / Math.PI).toFixed(2)}deg)`;
        n.style.opacity = vis ? (Math.cos(a) ** 2 * 0.85 + (Math.abs(i - v) < 0.5 ? 0.15 : 0)).toFixed(3) : "0";
      });
      tints.forEach((t, i) => (t.style.opacity = Math.max(0, 1 - Math.abs(v - i)).toFixed(3)));
      statics.forEach((t, i) => (t.style.opacity = Math.max(0, 1 - Math.abs(v - i)).toFixed(3)));
      // X1: Reviews slides over the last screen of this section; the stage dims under it
      const end = top + sec.offsetHeight - vh;
      const dim = still ? 0 : span(y, end - vh, end);
      stage.style.filter = dim > 0.001 ? `brightness(${(1 - dim * 0.55).toFixed(3)})` : "";
      // record: the pair goes into the bag once, as the wheel lands on Dune (F8), early enough to be seen whole
      if (rec && !still && !added && v >= 1.86) {
        added = true;
        const anchor = sec.querySelector<HTMLElement>("[data-way=colour]")!;
        onAdd(COLOURS[2].img, anchor.getBoundingClientRect());
      }
      const n = Math.round(v);
      if (n !== near) {
        near = n;
        setShown(n);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [rec, onAdd]);

  useEffect(() => {
    if (rec) return;
    gsap.to(w.current, { v: idx, duration: 0.7, ease: "power3.out", overwrite: true });
  }, [idx, rec]);

  const c = COLOURS[shown];
  const add = () => {
    const anchor = outer.current!.querySelector<HTMLElement>("[data-way=colour]")!;
    onAdd(COLOURS[shown].img, anchor.getBoundingClientRect());
  };

  // record: pinned for the wheel + one screen for the Reviews overlap; normal: one screen + the overlap screen
  const height = rec ? `calc(200svh + ${WHEEL_VH}vh)` : "200svh";

  return (
    <section ref={outer} id="colour" className="pin-outer relative z-[2] -mt-[100svh]" style={{ height }}>
      <WheelPx vh={WHEEL_VH} />
      <div aria-hidden className="rec-stop pointer-events-none absolute left-0 h-px w-px" style={{ top: `${WHEEL_VH}vh` }} data-record-time={SECS.colour} data-record-label="colour" />
      <div className="pin-stage col-stage">
        {COLOURS.map((k) => (
          <div key={k.id} className="col-tint pointer-events-none absolute inset-0 opacity-0" style={{ background: `radial-gradient(48% 62% at 70% 52%, ${k.tint}, transparent 72%)` }} aria-hidden />
        ))}
        <div className="container-x relative grid h-full grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)] items-center">
          <div className="relative z-[2] flex h-full flex-col justify-center gap-[6svh]">
            <p className="label-lg text-accent">Choose your colour</p>
            {/* the drum of names; the marker sits on its left edge */}
            <div className="wheel relative h-[30svh]" style={{ perspective: "800px" }}>
              <span className="wheel-marker absolute left-0 top-1/2 h-[2px] w-[28px] -translate-y-1/2 bg-accent" aria-hidden />
              {COLOURS.map((k, i) => (
                <button key={k.id} type="button" onClick={() => setIdx(i)} data-cursor="Pick" className="wheel-name font-display absolute left-[48px] top-1/2 text-left text-[4.4vw] leading-none">
                  {k.name}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="button" className="wheel-arrow" aria-label="Previous colour" onClick={() => setIdx((i) => Math.max(0, i - 1))}>
                ‹
              </button>
              <button type="button" className="wheel-arrow" aria-label="Next colour" onClick={() => setIdx((i) => Math.min(2, i + 1))}>
                ›
              </button>
            </div>
            {/* the card: name + price + Add to bag, nothing else */}
            <div className="spec-card flex items-center gap-8 border-t border-line pt-6">
              <div>
                <p className="label-lg text-muted">
                  {PRODUCT} · <span className="text-fg">{c.name}</span>
                </p>
                <p className="font-display mt-3 text-[48px] leading-none">{PRICE}</p>
              </div>
              <button type="button" className="btn btn-solid btn-xl" onClick={add}>
                Add to bag
              </button>
            </div>
          </div>
          {/* the marker's product: the travelling headphones land on this box (stills for ?static=1) */}
          <div className="relative h-full">
            <div data-way="colour" className="absolute left-1/2 top-1/2 aspect-[0.74] h-[62svh] -translate-x-1/2 -translate-y-1/2" aria-hidden>
              {COLOURS.map((k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={k.id} src={k.img} alt="" className="col-static static-only absolute left-1/2 top-1/2 h-[141%] w-auto max-w-none -translate-x-1/2 -translate-y-[48%] opacity-0" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Writes the wheel's pin length in px onto the section (the Traveller reads it), and keeps it fresh on resize. */
function WheelPx({ vh }: { vh: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const set = () => {
      const sec = ref.current?.closest<HTMLElement>("#colour");
      if (sec) sec.dataset.wheelPx = String(Math.round((vh / 100) * window.innerHeight));
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, [vh]);
  return <span ref={ref} hidden />;
}
