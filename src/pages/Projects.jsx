import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "../data.js";

const TAU = 72;
const WHEEL_GAIN = 2.15;
const SNAP_MS = 220;

export default function Projects() {
  const deckRef = useRef(null);
  const target = useRef(0);
  const current = useRef(0);
  const drag = useRef(null);
  const vel = useRef(0);
  const [i, setI] = useState(0);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let snapT = 0;
    let lastT = performance.now();
    let lastIdx = 0;

    const width = () => el.clientWidth;
    const max = () => width() * (PROJECTS.length - 1);
    const clamp = (n) => Math.min(max(), Math.max(0, n));

    const loop = (t) => {
      const dt = Math.min(32, t - lastT);
      lastT = t;
      target.current = clamp(target.current);
      const k = reduce ? 1 : 1 - Math.exp(-dt / TAU);
      current.current += (target.current - current.current) * k;
      if (Math.abs(target.current - current.current) < 0.35) current.current = target.current;
      el.scrollLeft = current.current;
      const idx = Math.round(current.current / Math.max(1, width()));
      if (idx !== lastIdx) {
        lastIdx = idx;
        setI(idx);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const snap = () => {
      clearTimeout(snapT);
      snapT = setTimeout(() => {
        const w = width();
        target.current = Math.round(clamp(target.current) / w) * w;
        vel.current = 0;
      }, SNAP_MS);
    };

    const onWheel = (e) => {
      e.preventDefault();
      let d = e.deltaY + e.deltaX;
      if (e.deltaMode === 1) d *= 40;
      else if (e.deltaMode === 2) d *= width();
      d *= WHEEL_GAIN;
      target.current = clamp(target.current + d);
      vel.current = d;
      snap();
    };
    const down = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag.current = {
        id: e.pointerId,
        x: e.clientX,
        lastX: e.clientX,
        start: target.current,
        t: performance.now(),
      };
      vel.current = 0;
      el.classList.add("is-drag");
      el.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!drag.current || e.pointerId !== drag.current.id) return;
      const now = performance.now();
      const dx = e.clientX - drag.current.x;
      const step = e.clientX - drag.current.lastX;
      const dt = Math.max(8, now - drag.current.t);
      vel.current = (-step / dt) * 16;
      target.current = drag.current.start - dx * 1.2;
      drag.current.lastX = e.clientX;
      drag.current.t = now;
    };
    const up = (e) => {
      if (!drag.current || e.pointerId !== drag.current.id) return;
      target.current = clamp(target.current + vel.current * 12);
      drag.current = null;
      el.classList.remove("is-drag");
      snap();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    window.addEventListener("resize", snap);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(snapT);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      window.removeEventListener("resize", snap);
    };
  }, []);

  const go = (dir) => {
    const el = deckRef.current;
    if (!el) return;
    target.current += dir * el.clientWidth;
  };

  return (
    <>
      <div className="deck" ref={deckRef}>
        {PROJECTS.map((p) => (
          <article className="slide" key={p.id}>
            <div className="xp-shot">
              <img src={p.img} alt="" draggable={false} />
            </div>
            <div>
              <p className="eyebrow">
                {i + 1} / {PROJECTS.length}
              </p>
              <h2>{p.title}</h2>
              <p className="meta">{p.meta}</p>
              <p className="blurb">{p.blurb}</p>
              <a className="more" href={p.href} target="_blank" rel="noopener">
                {p.link} →
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="deck-ui rail-btns">
        <button type="button" aria-label="Previous" onClick={() => go(-1)}>
          ←
        </button>
        <button type="button" aria-label="Next" onClick={() => go(1)}>
          →
        </button>
      </div>
    </>
  );
}
