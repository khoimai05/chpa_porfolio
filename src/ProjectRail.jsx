import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PROJECTS } from "./data.js";

const GAP = 28;
const TAU = 72;
const WHEEL_GAIN = 2.15;
const SNAP_MS = 200;

export default function ProjectRail() {
  const railRef = useRef(null);
  const target = useRef(0);
  const current = useRef(0);
  const drag = useRef(null);
  const dragged = useRef(false);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let snapT = 0;
    let lastT = performance.now();

    const max = () => Math.max(0, el.scrollWidth - el.clientWidth);
    const step = () => {
      const card = el.querySelector(".card");
      return card ? card.getBoundingClientRect().width + GAP : 360;
    };
    const clamp = (n) => Math.min(max(), Math.max(0, n));
    const loop = (t) => {
      const dt = Math.min(32, t - lastT);
      lastT = t;
      target.current = clamp(target.current);
      const k = reduce ? 1 : 1 - Math.exp(-dt / TAU);
      current.current += (target.current - current.current) * k;
      if (Math.abs(target.current - current.current) < 0.35) current.current = target.current;
      el.scrollLeft = current.current;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const snap = () => {
      if (reduce) return;
      clearTimeout(snapT);
      snapT = setTimeout(() => {
        const s = step();
        target.current = Math.round(target.current / s) * s;
      }, SNAP_MS);
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      let d = e.deltaY + e.deltaX;
      if (e.deltaMode === 1) d *= 40;
      else if (e.deltaMode === 2) d *= el.clientWidth;
      d *= WHEEL_GAIN;
      const next = target.current + d;
      const atStart = target.current <= 0.5 && d < 0;
      const atEnd = target.current >= max() - 0.5 && d > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      target.current = clamp(next);
      snap();
    };
    const down = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragged.current = false;
      drag.current = { id: e.pointerId, x: e.clientX, start: target.current };
      el.classList.add("is-drag");
      el.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!drag.current || e.pointerId !== drag.current.id) return;
      const dx = e.clientX - drag.current.x;
      if (Math.abs(dx) > 6) dragged.current = true;
      target.current = drag.current.start - dx;
    };
    const up = (e) => {
      if (!drag.current || e.pointerId !== drag.current.id) return;
      drag.current = null;
      el.classList.remove("is-drag");
      snap();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(snapT);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  const nudge = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector(".card");
    const s = card ? card.getBoundingClientRect().width + GAP : 360;
    target.current += dir * s;
  };

  return (
    <>
      <div className="projects-head">
        <h2 className="section">Projects</h2>
        <div className="rail-btns">
          <button type="button" aria-label="Previous" onClick={() => nudge(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next" onClick={() => nudge(1)}>
            →
          </button>
        </div>
      </div>
      <div className="rail" ref={railRef}>
        {PROJECTS.map((p) => (
          <Link
            className="card"
            to="/projects"
            key={p.id}
            draggable={false}
            onClick={(e) => {
              if (dragged.current) e.preventDefault();
            }}
          >
            <div className="xp-shot">
              <img src={p.img} alt="" draggable={false} />
            </div>
            <h3>{p.title}</h3>
            <p className="meta">{p.meta}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
