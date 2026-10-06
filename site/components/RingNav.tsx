"use client";

// NV07 (restyled) + M26 · Corner logo + progress ring. Wordmark top left (Syncopate). Top right: a "Bag" pill and a
// round button whose lilac ring fills with the page progress like a volume knob (a tiny % inside). The button opens
// the menu as a black circle growing from the ring, with four big mono links.
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { BRAND, NAV_LINKS } from "../content";

const C = 2 * Math.PI * 21;

export default function RingNav({ bag, bagRef }: { bag: number; bagRef: React.RefObject<HTMLSpanElement | null> }) {
  const arc = useRef<SVGCircleElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      arc.current?.style.setProperty("stroke-dashoffset", (C * (1 - p)).toFixed(2));
      if (pct.current) pct.current.textContent = String(Math.round(p * 100));
    };
    gsap.ticker.add(tick);
    tick();
    return () => gsap.ticker.remove(tick);
  }, []);

  useEffect(() => {
    const m = menu.current!;
    const d = prefersReducedMotion() ? 0 : 0.7;
    gsap.to(m, {
      clipPath: open ? "circle(150% at calc(100% - 52px) 40px)" : "circle(0% at calc(100% - 52px) 40px)",
      duration: d,
      ease: "power3.inOut",
    });
    if (open) gsap.fromTo(m.querySelectorAll("li"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: d, stagger: 0.06, ease: "power3.out", delay: d * 0.3 });
  }, [open]);

  return (
    <>
      <header className="nav fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[clamp(20px,4.5vw,72px)] py-5">
        <a href="#spin" className="font-display text-[13px] tracking-[0.34em]" onClick={() => setOpen(false)}>
          {BRAND}
        </a>
        <div className="flex items-center gap-3">
          <a href="#colour" className="bag-pill label flex items-center gap-2 border border-line px-4 py-[9px]">
            Bag <span ref={bagRef} className="inline-block tabular-nums text-accent">{bag}</span>
          </a>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)} className="ring-btn relative h-[46px] w-[46px]">
            <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
              <circle cx="24" cy="24" r="21" className="ring-track" />
              <circle ref={arc} cx="24" cy="24" r="21" className="ring-fill" strokeDasharray={C} strokeDashoffset={C} />
            </svg>
            <span className="label absolute inset-0 grid place-items-center text-[11px] tabular-nums">
              {open ? "×" : <span ref={pct}>0</span>}
            </span>
          </button>
        </div>
      </header>
      <div ref={menu} className="fixed inset-0 z-[45] bg-[#060607]" style={{ clipPath: "circle(0% at calc(100% - 52px) 40px)" }} aria-hidden={!open}>
        <ul className="container-x flex h-full flex-col justify-center gap-[3svh]">
          {NAV_LINKS.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="font-display flex items-baseline gap-6 text-[clamp(36px,6vw,92px)] leading-none hover:text-accent" tabIndex={open ? 0 : -1}>
                <span className="label text-muted">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
