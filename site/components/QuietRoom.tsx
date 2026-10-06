"use client";

// FT10 (restyled) + M351 · The room goes quiet (signature). Pinned. A crowded night train (public/video/aura-room.mp4,
// a seamless 7.5 s loop) plays by the clock, two rows of noise words drift in opposite directions over it and a sine line
// shakes across the screen. Then noise cancelling switches on with the scroll: every word tumbles back into depth and
// fades (outer words first), the line flattens to one hairline, the video slows to ¼ speed, desaturates and blurs
// everywhere except the listener, "−42 dB" counts down, and it ends on "QUIET." with slow grain.
// The video is drawn into a canvas (cover), graded and faded into the page on every edge (lesson 5).
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { NOISE_A, NOISE_B, ROOM_HEAD, SECS, VH_PER_SEC } from "../content";
import { clamp01, lerp, live, pageTop, smooth, span } from "../live";

const ARRIVE = 1.2; // record seconds through black from the hero (X12)
const PIN_SECS = SECS.quiet - ARRIVE;
const PIN_VH = Math.round(PIN_SECS * VH_PER_SEC);
const PAGE = "15,16,17";

/** The listener: a soft vertical ellipse that stays sharp while the crowd blurs (fractions of the video frame). */
const LISTENER = { cx: 0.49, cy: 0.62, rx: 0.15, ry: 0.5 };

export default function QuietRoom() {
  const outer = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const draw = useRef({ x: 0, y: 0, w: 0, h: 0 }); // where the video sits in the canvas (css px)

  useEffect(() => {
    const sec = outer.current!;
    const st = stage.current!;
    const cv = canvas.current!;
    const v = video.current!;
    const ctx = cv.getContext("2d")!;
    const off = document.createElement("canvas");
    const octx = off.getContext("2d")!;
    const still = prefersReducedMotion();
    v.src = "/video/aura-room.mp4";
    v.load();

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      off.width = Math.max(1, Math.round(cv.width / 4)); // the blurred crowd is drawn at quarter size, then upscaled
      off.height = Math.max(1, Math.round(cv.height / 4));
      // cover the canvas
      const cw = r.width;
      const ch = r.height;
      const ar = 16 / 9;
      let w = cw;
      let h = cw / ar;
      if (h < ch) {
        h = ch;
        w = ch * ar;
      }
      draw.current = { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    live.head = () => {
      const d = draw.current;
      const c = cv.getBoundingClientRect();
      return { cx: c.left + d.x + ROOM_HEAD.cx * d.w, cy: c.top + d.y + ROOM_HEAD.cy * d.h, h: ROOM_HEAD.h * d.h };
    };

    const words = Array.from(st.querySelectorAll<HTMLElement>(".noise-word"));
    const rows = Array.from(st.querySelectorAll<HTMLElement>(".noise-row"));
    const line = st.querySelector<SVGPathElement>(".quiet-wave")!;
    const db = st.querySelector<HTMLElement>(".quiet-db")!;
    const quiet = st.querySelector<HTMLElement>(".quiet-word")!;
    const statement = st.querySelector<HTMLElement>(".quiet-statement")!;
    const grain = st.querySelector<HTMLElement>(".quiet-grain")!;

    let top = 0;
    let vh = window.innerHeight;
    let pinPx = 1;
    const measure = () => {
      top = pageTop(sec);
      vh = window.innerHeight;
      pinPx = Math.max(1, sec.offsetHeight - vh);
    };
    measure();
    const ro2 = new ResizeObserver(measure);
    ro2.observe(document.body);

    let playing = false;
    let rate = 1;
    let raf = 0;
    let visible = false;
    const io = new IntersectionObserver((e) => {
      visible = e.some((x) => x.isIntersecting);
      if (visible && !playing && !still) {
        playing = true;
        v.currentTime = 0.6; // the busiest second (1.5–2.5 s of the raw clip) lands while the words drift
        v.play().catch(() => {});
      } else if (!visible && playing) {
        playing = false;
        v.pause();
      }
    });
    io.observe(sec);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible && !still) return;
      const t = now / 1000;
      const y = window.scrollY;
      const p = still ? 1 : clamp01((y - top) / pinPx);
      // X12 arrival: the words come out of the black first, then the train
      const enterWords = still ? 1 : span(y, top - vh * 0.7, top - vh * 0.15);
      const enterVideo = still ? 1 : span(y, top, top + pinPx * 0.08); // in as the flying pair lands on the head (Traveller)
      const nc = still ? 1 : smooth(span(p, 0.4, 0.8)); // noise cancelling amount

      // ---- the video: ¼ speed, desaturate + blur the crowd, the listener stays sharp ----
      const want = lerp(1, 0.3, nc);
      if (Math.abs(want - rate) > 0.02) {
        rate = want;
        v.playbackRate = rate;
      }
      const W = cv.width;
      const H = cv.height;
      const d = draw.current;
      const dx = d.x * dpr;
      const dy = d.y * dpr;
      const dw = d.w * dpr;
      const dh = d.h * dpr;
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgb(${PAGE})`;
      ctx.fillRect(0, 0, W, H);
      if (v.readyState >= 2) {
        // sharp frame first (no filter: cheap), then the crowd blurred at quarter size with the listener cut out of it
        ctx.globalAlpha = enterVideo;
        ctx.drawImage(v, dx, dy, dw, dh);
        if (nc > 0.01) {
          const sw = off.width;
          const shh = off.height;
          const q = sw / W;
          octx.globalCompositeOperation = "source-over";
          octx.clearRect(0, 0, sw, shh);
          octx.filter = `blur(${(1.8 * nc).toFixed(2)}px)`;
          octx.drawImage(v, dx * q, dy * q, dw * q, dh * q);
          octx.filter = "none";
          octx.globalCompositeOperation = "destination-out";
          const cx = (dx + LISTENER.cx * dw) * q;
          const cy = (dy + LISTENER.cy * dh) * q;
          const rr = LISTENER.rx * dw * q;
          octx.save();
          octx.translate(cx, cy);
          octx.scale(1, (LISTENER.ry / LISTENER.rx) * (dh / dw));
          const g = octx.createRadialGradient(0, 0, rr * 0.5, 0, 0, rr);
          g.addColorStop(0, "rgba(0,0,0,1)");
          g.addColorStop(1, "rgba(0,0,0,0)");
          octx.fillStyle = g;
          octx.fillRect(-rr, -rr, rr * 2, rr * 2);
          octx.restore();
          ctx.globalAlpha = enterVideo * Math.min(1, nc * 1.4);
          ctx.imageSmoothingQuality = "low";
          ctx.drawImage(off, 0, 0, W, H);
          // desaturate (a blend fill, no filter) and sink the room a little
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "saturation";
          ctx.fillStyle = `rgba(128,128,128,${(0.8 * nc).toFixed(3)})`;
          ctx.fillRect(0, 0, W, H);
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = `rgba(${PAGE},${(0.28 * nc).toFixed(3)})`;
          ctx.fillRect(0, 0, W, H);
        }
        ctx.globalAlpha = 1;
      }
      // soft edges into the page colour on every side, plus a dark pool under the text (bottom)
      const band = (x0: number, y0: number, x1: number, y1: number, a = 1) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, `rgba(${PAGE},${a})`);
        g.addColorStop(0.4, `rgba(${PAGE},${0.7 * a})`);
        g.addColorStop(1, `rgba(${PAGE},0)`);
        return g;
      };
      ctx.fillStyle = band(0, 0, 0, H * 0.18);
      ctx.fillRect(0, 0, W, H * 0.18);
      ctx.fillStyle = band(0, H, 0, H * 0.62);
      ctx.fillRect(0, H * 0.62, W, H * 0.38);
      ctx.fillStyle = band(0, 0, W * 0.12, 0);
      ctx.fillRect(0, 0, W * 0.12, H);
      ctx.fillStyle = band(W, 0, W * 0.88, 0);
      ctx.fillRect(W * 0.88, 0, W * 0.12, H);

      // ---- noise words: drift in two rows, then tumble back into depth (outer words first) ----
      rows.forEach((row, ri) => {
        const dir = ri === 0 ? -1 : 1;
        const speed = lerp(46, 10, nc);
        const shift = ((t * speed) % (row.scrollWidth / 2)) * dir;
        row.style.transform = `translate3d(${(dir < 0 ? shift : shift - row.scrollWidth / 2).toFixed(1)}px,0,0)`;
        row.style.opacity = enterWords.toFixed(3);
      });
      const cxv = window.innerWidth / 2;
      words.forEach((w) => {
        const r = w.getBoundingClientRect();
        const dist = Math.min(1, Math.abs(r.left + r.width / 2 - cxv) / cxv); // 1 = at the edge
        const k = still ? 1 : smooth(span(nc, 0.55 - dist * 0.5, 0.95 - dist * 0.5));
        w.style.transform = `translate3d(0,${(-k * 140).toFixed(1)}px,${(-k * 900).toFixed(1)}px) rotateX(${(k * 55).toFixed(1)}deg)`;
        w.style.opacity = (1 - k).toFixed(3);
      });

      // ---- the sine line flattens to one hairline ----
      const amp = lerp(30, 0, nc) * (0.75 + 0.25 * Math.sin(t * 3.1));
      const pts: string[] = [];
      for (let i = 0; i <= 64; i++) {
        const x = (i / 64) * 1000;
        const yy = 50 + Math.sin(i * 0.55 + t * 7) * amp * Math.sin((i / 64) * Math.PI) + Math.sin(i * 1.7 - t * 11) * amp * 0.25;
        pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${yy.toFixed(2)}`);
      }
      line.setAttribute("d", pts.join(""));
      line.style.opacity = (enterWords * lerp(0.9, 0.55, nc)).toFixed(3);

      // ---- −42 dB, the statement, QUIET. ----
      const level = still ? 42 : 42 * smooth(span(p, 0.42, 0.86));
      db.textContent = `−${level.toFixed(level >= 41.95 ? 0 : 1)} dB`;
      statement.style.opacity = (enterWords * (1 - span(p, 0.78, 0.86))).toFixed(3);
      const q = still ? 1 : smooth(span(p, 0.8, 0.92));
      quiet.style.opacity = q.toFixed(3);
      quiet.style.transform = `scale(${(0.96 + 0.08 * span(p, 0.8, 1) + Math.sin(t * 0.9) * 0.006).toFixed(4)})`;
      quiet.style.letterSpacing = "0.3em";
      grain.style.opacity = (0.04 + 0.12 * q).toFixed(3);
      grain.style.transform = `translate(${(Math.sin(t * 13) * 3).toFixed(1)}%, ${(Math.cos(t * 11) * 3).toFixed(1)}%)`;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ro2.disconnect();
      io.disconnect();
      v.pause();
      live.head = null;
    };
  }, []);

  const Row = ({ items, cls }: { items: readonly string[]; cls: string }) => (
    <div className={`noise-row ${cls} absolute left-0 flex w-max gap-[6vw] whitespace-nowrap will-change-transform`}>
      {[...items, ...items, ...items, ...items].map((w, i) => (
        <span key={i} className="noise-word font-display">
          {w}
        </span>
      ))}
    </div>
  );

  return (
    <section ref={outer} id="quiet" className="pin-outer relative" style={{ height: `calc(100svh + ${PIN_VH}vh)` }}>
      {/* record stops: arrive through black, then the pinned switch-off */}
      <div aria-hidden className="rec-stop pointer-events-none absolute left-0 top-0 h-px w-px" data-record-time={ARRIVE} data-record-label="quiet" />
      <div aria-hidden className="rec-stop pointer-events-none absolute left-0 h-px w-px" style={{ top: `${PIN_VH}vh` }} data-record-time={PIN_SECS} data-record-label="quiet-end" />
      <div ref={stage} className="pin-stage quiet-stage">
        <video ref={video} className="hidden" muted loop playsInline preload="auto" aria-hidden />
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        <div className="quiet-words pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <Row items={NOISE_A} cls="top-[55svh]" />
          <Row items={NOISE_B} cls="top-[69svh]" />
        </div>
        <svg className="quiet-line pointer-events-none absolute inset-x-0 top-[48svh] h-[60px] w-full" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden>
          <path className="quiet-wave" d="M0 50 L1000 50" />
        </svg>
        <div className="quiet-grain pointer-events-none absolute -inset-[10%]" aria-hidden />
        <div className="quiet-statement absolute bottom-[7svh] left-[clamp(20px,4.5vw,72px)] max-w-[36ch]">
          <p className="label-lg text-accent">Adaptive noise cancelling</p>
          <h2 className="font-display mt-3 text-[clamp(24px,2.6vw,40px)] leading-[1.08]">
            The room
            <br />
            goes quiet.
          </h2>
        </div>
        <p className="quiet-db font-display absolute bottom-[7svh] right-[clamp(20px,4.5vw,72px)] text-[clamp(28px,3.4vw,52px)] tabular-nums text-accent">
          −0.0 dB
        </p>
        <p className="quiet-word font-display pointer-events-none absolute inset-x-0 top-[60svh] text-center text-[clamp(44px,7vw,112px)] opacity-0">
          Quiet.
        </p>
      </div>
    </section>
  );
}
