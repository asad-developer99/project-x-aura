"use client";

// S9 · Letterbox bars (Inside the cup → Sound). A quick film cut (≤ 0.6 s): two black bars with a lilac gate edge close
// to a wide slit as the exploded view ends and open straight away on the word HEAR EVERYTHING (no squashed-strip hold).
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { pageTop, smooth, span } from "../live";

export default function Letterbox() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const [topBar, botBar] = Array.from(root.current!.children) as HTMLElement[];
    const tick = () => {
      const inside = document.getElementById("inside");
      if (!inside) return;
      const vh = window.innerHeight;
      const end = pageTop(inside) + inside.offsetHeight - vh; // the end of the exploded view's pin
      const y = window.scrollY;
      // ≤ 0.6 s in the reel: ~0.25 s to close (the last 14 vh of the explode pin), ~0.35 s to open (the next 14 vh)
      const close = smooth(span(y, end - vh * 0.14, end));
      const open = smooth(span(y, end, end + vh * 0.14));
      const k = close * (1 - open); // 1 = closed to the slit
      const h = k * vh * 0.39; // a cinematic 22% slit: the page keeps moving inside it (never a black frame)
      topBar.style.transform = `translate3d(0, ${(h - vh / 2).toFixed(1)}px, 0)`;
      botBar.style.transform = `translate3d(0, ${(vh / 2 - h).toFixed(1)}px, 0)`;
      topBar.style.opacity = botBar.style.opacity = k > 0.002 ? "1" : "0";
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-40" aria-hidden>
      {/* two half-screen bars with a thin lilac gate edge, slid in from the top and the bottom */}
      <div className="lb-bar lb-top absolute inset-x-0 top-0 h-[50svh] opacity-0" style={{ transform: "translate3d(0,-50svh,0)" }} />
      <div className="lb-bar lb-bot absolute inset-x-0 bottom-0 h-[50svh] opacity-0" style={{ transform: "translate3d(0,50svh,0)" }} />
    </div>
  );
}
