"use client";

// The whole Aura Sound page (client): sections in order, the travelling headphones, the letterbox cut and the bag.
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import DotRingLoader from "./DotRingLoader";
import RingNav from "./RingNav";
import SpinHero from "./SpinHero";
import QuietRoom from "./QuietRoom";
import InsideCup from "./InsideCup";
import HearEverything from "./HearEverything";
import BatteryBand from "./BatteryBand";
import ColourWheel from "./ColourWheel";
import Reviews from "./Reviews";
import RecordFooter from "./RecordFooter";
import Traveller from "./Traveller";
import Letterbox from "./Letterbox";
import { COLOURS, SECS, TRAVEL } from "../content";
import { live } from "../live";

export default function AuraPage() {
  const [bag, setBag] = useState(0);
  const bagRef = useRef<HTMLSpanElement>(null);

  // ?static=1 flag on <html> (after hydration) + preload every travelling image so the hand-over never shows a gap
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("static")) document.documentElement.classList.add("is-static");
    [TRAVEL.front, TRAVEL.back, ...COLOURS.map((c) => c.img)].forEach((src) => {
      const i = new Image();
      i.src = src;
      i.decode?.().catch(() => {});
    });
  }, []);

  // F8 · Land in UI: a copy of the pair flies on an up-arc into the Bag pill, the count bumps
  const onAdd = useCallback((img: string, from: DOMRect) => {
    const pill = bagRef.current;
    if (!pill) return;
    live.bagged = true;
    const to = pill.getBoundingClientRect();
    const el = document.createElement("img");
    el.src = img;
    el.alt = "";
    const size = Math.min(from.height * 1.25, 640); // starts as big as the product on screen
    Object.assign(el.style, {
      position: "fixed",
      left: `${from.left + from.width / 2 - size / 2}px`,
      top: `${from.top + from.height / 2 - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      zIndex: "55",
      filter: "drop-shadow(0 18px 40px rgba(0,0,0,.55)) drop-shadow(0 0 30px rgba(201,184,255,.25))",
      pointerEvents: "none",
      opacity: "0",
    });
    document.body.appendChild(el);
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const box = pill.closest<HTMLElement>(".bag-pill");
    // a clear 0.8 s flight on an up-arc into the Bag pill, then the pill lights up and the count bumps
    gsap
      .timeline({ onComplete: () => el.remove() })
      .to(el, { opacity: 1, scale: 0.9, duration: 0.15, ease: "power2.out" })
      .to(el, { x: dx, duration: 0.8, ease: "power2.inOut" }, 0.15)
      .to(el, { y: dy - 140, duration: 0.35, ease: "power2.out" }, 0.15)
      .to(el, { y: dy, duration: 0.45, ease: "power2.in" }, 0.5)
      .to(el, { scale: 0.08, duration: 0.8, ease: "power2.in" }, 0.15)
      .to(el, { opacity: 0, duration: 0.12 }, 0.85)
      .add(() => {
        setBag((n) => n + 1);
        gsap.fromTo(pill, { scale: 2.2 }, { scale: 1, duration: 0.7, ease: "expo.out" });
        if (box) gsap.fromTo(box, { boxShadow: "0 0 0 1px rgba(201,184,255,1), 0 0 34px rgba(201,184,255,.65)", borderColor: "#c9b8ff" }, { boxShadow: "0 0 0 0px rgba(201,184,255,0), 0 0 0px rgba(201,184,255,0)", borderColor: "#26272a", duration: 1.4, ease: "power2.out" });
      }, 0.93);
  }, []);

  return (
    <>
      <DotRingLoader />
      <RingNav bag={bag} bagRef={bagRef} />
      <Traveller />
      <Letterbox />
      <main className="relative z-[1] bg-bg">
        <SpinHero />
        <QuietRoom />
        <InsideCup />
        <HearEverything />
        <BatteryBand />
        <ColourWheel onAdd={onAdd} />
        <Reviews />
      </main>
      <RecordFooter />
      {/* the last record stop: the very bottom of the page (the footer fully revealed; sticky, so it is not the stop itself) */}
      <div aria-hidden className="h-0" data-record-time={SECS.footer} data-record-label="footer" />
    </>
  );
}
