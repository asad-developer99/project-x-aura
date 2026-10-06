"use client";

// SP05 (restyled) + M48 · Reviews. A huge "4.8" and "12,406 ratings" spin full digit cycles into place (odometer),
// five stars fill as support, and ONE big quote (readable at reel size). X1: this section slides up over the colour stage.
// The right-hand lane stays empty: the travelling headphones wait there ([data-way=lane]) on their way to the footer.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { QUOTES, RATING, RATINGS_COUNT, SECS } from "../content";

/** One odometer: every digit is a column 0–9 repeated; it rolls through full cycles and lands on its digit. */
function Odo({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`odo inline-flex ${className}`} aria-label={value}>
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="odo-col relative inline-block h-[1em] overflow-hidden leading-none" aria-hidden>
            <span className="odo-strip block" data-digit={ch}>
              {Array.from({ length: 30 }, (_, k) => (
                <span key={k} className="block h-[1em]">
                  {k % 10}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className="inline-block leading-none" aria-hidden>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export default function Reviews() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current!;
    const strips = Array.from(el.querySelectorAll<HTMLElement>(".odo-strip"));
    const stars = el.querySelector<HTMLElement>(".rev-stars");
    const quote = el.querySelector<HTMLElement>(".rev-quote");
    // the landing digit sits in the third cycle: 20 + d
    const land = (s: HTMLElement) => -(20 + Number(s.dataset.digit)) / 30;
    if (prefersReducedMotion()) {
      strips.forEach((s) => gsap.set(s, { yPercent: land(s) * 100 }));
      return;
    }
    strips.forEach((s, i) => gsap.set(s, { yPercent: (-((i * 3) % 10) / 30) * 100 }));
    const tl = gsap.timeline({ paused: true });
    strips.forEach((s, i) => tl.to(s, { yPercent: land(s) * 100, duration: 1.5 + i * 0.12, ease: "power3.inOut" }, i * 0.05));
    tl.fromTo(stars, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power2.out" }, 0.4);
    tl.fromTo(quote, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.45);
    const st = ScrollTrigger.create({ trigger: el, start: "top 60%", onEnter: () => tl.play(), onLeaveBack: () => tl.pause(0) });
    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  const q = QUOTES[0];
  return (
    <section ref={root} id="reviews" className="relative z-[3] -mt-[100svh] min-h-[100svh] bg-bg" data-record-time={SECS.reviews} data-record-label="reviews">
      <div className="container-x grid min-h-[100svh] grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)] items-center">
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-[4vw]">
          <div>
            <p className="font-display text-[13vw] leading-[0.9]">
              <Odo value={RATING} />
            </p>
            <p className="rev-stars mt-4 text-[2.4vw] tracking-[0.18em] text-accent">★★★★★</p>
            <p className="label-xl mt-3 text-muted">
              <Odo value={RATINGS_COUNT} className="text-fg" /> ratings
            </p>
          </div>
          <figure className="rev-quote">
            <blockquote className="font-display text-[40px] leading-[1.18]">“{q.q}”</blockquote>
            <figcaption className="label-xl mt-5 text-muted">{q.who}</figcaption>
          </figure>
        </div>
        {/* the empty lane: the travelling headphones wait here */}
        <div className="relative h-full">
          <div data-way="lane" className="absolute left-1/2 top-1/2 aspect-[0.74] h-[36svh] -translate-x-1/2 -translate-y-1/2" aria-hidden />
        </div>
      </div>
    </section>
  );
}
