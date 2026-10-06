"use client";

// Magnetic button (Round 4 detail): it leans toward the pointer and settles back on a calm power3 ease (no elastic,
// house style). On camera (?record=1) nobody moves the mouse, so it plays one slow lean by itself when it first
// comes on screen, and its lilac shine sweeps once.
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { recording } from "../live";

export default function Magnet({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    let io: IntersectionObserver | null = null;
    if (recording()) {
      io = new IntersectionObserver((entries) => {
        if (!entries.some((x) => x.isIntersecting)) return;
        io?.disconnect();
        const btn = el.querySelector(".btn");
        gsap
          .timeline({ delay: 0.6 })
          .to(el, { x: 10, y: -6, duration: 0.6, ease: "power3.out" })
          .add(() => btn?.classList.add("shine-now"), 0.1)
          .to(el, { x: 0, y: 0, duration: 0.8, ease: "power3.inOut" });
      });
      io.observe(el);
    }
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      io?.disconnect();
    };
  }, [strength]);
  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
