import { useEffect, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [on, setOn] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    document.documentElement.classList.add("has-cursor");
    setOk(true);
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => setOn(!!e.target.closest("a, button"));
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  if (!ok) return null;
  return (
    <div
      className={`cursor${on ? " is-on" : ""}`}
      aria-hidden="true"
      style={{ transform: `translate3d(${pos.x}px,${pos.y}px,0)` }}
    >
      <span className="cursor-petal" />
    </div>
  );
}
