import { createElement as h, useEffect, useRef } from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";

var PROJECTS = [
  { src: "images/oscars.jfif", title: "Movie Awards and Ratings", meta: "Python · Pandas" },
  { src: "images/deposit.avif", title: "Bank Deposits and Interest Rates", meta: "SQL · Warehouse" },
  { src: "images/sales.avif", title: "Sales Insights and Profitability", meta: "R · MGMT 173" },
  { src: "images/code.avif", title: "Code Breaker", meta: "Python · COMP 152" },
  { src: "images/purdue.avif", title: "Sustainable Purdue Housing", meta: "Top 10 · CYC" }
];

var GAP = 28;
var EASE = 0.14;

function maxScroll(el) {
  return Math.max(0, el.scrollWidth - el.clientWidth);
}

function stepSize(el) {
  var card = el.querySelector(".card");
  return card ? card.getBoundingClientRect().width + GAP : 360;
}

function ProjectRail() {
  var railRef = useRef(null);
  var target = useRef(0);
  var current = useRef(0);
  var drag = useRef(null);
  var dragged = useRef(false);
  var snapTimer = useRef(0);
  var reduce = useRef(false);

  useEffect(function () {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var el = railRef.current;
    if (!el) return;

    var raf = 0;
    function loop() {
      var max = maxScroll(el);
      target.current = Math.min(max, Math.max(0, target.current));
      var k = reduce.current ? 1 : EASE;
      current.current += (target.current - current.current) * k;
      if (Math.abs(target.current - current.current) < 0.4) current.current = target.current;
      el.scrollLeft = current.current;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function scheduleSnap() {
      if (reduce.current) return;
      clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(function () {
        var s = stepSize(el);
        target.current = Math.round(target.current / s) * s;
      }, 120);
    }

    function onWheel(e) {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      var max = maxScroll(el);
      var next = target.current + e.deltaY;
      var atStart = target.current <= 0.5 && e.deltaY < 0;
      var atEnd = target.current >= max - 0.5 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      target.current = Math.min(max, Math.max(0, next));
      scheduleSnap();
    }

    function onPointerDown(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragged.current = false;
      drag.current = { id: e.pointerId, x: e.clientX, start: target.current };
      el.classList.add("is-drag");
      el.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
      if (!drag.current || e.pointerId !== drag.current.id) return;
      var dx = e.clientX - drag.current.x;
      if (Math.abs(dx) > 6) dragged.current = true;
      target.current = drag.current.start - dx;
    }

    function onPointerUp(e) {
      if (!drag.current || e.pointerId !== drag.current.id) return;
      drag.current = null;
      el.classList.remove("is-drag");
      scheduleSnap();
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return function () {
      cancelAnimationFrame(raf);
      clearTimeout(snapTimer.current);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  function nudge(dir) {
    var el = railRef.current;
    if (!el) return;
    target.current += dir * stepSize(el);
  }

  function onCardClick(e) {
    if (dragged.current) e.preventDefault();
  }

  return h("div", null,
    h("div", { className: "projects-head" },
      h("h2", { className: "section" }, "Projects"),
      h("div", { className: "rail-btns" },
        h("button", { type: "button", "aria-label": "Previous projects", onClick: function () { nudge(-1); } }, "←"),
        h("button", { type: "button", "aria-label": "Next projects", onClick: function () { nudge(1); } }, "→")
      )
    ),
    h("div", { className: "rail", ref: railRef },
      PROJECTS.map(function (p) {
        return h("a", {
          className: "card",
          href: "projects.html",
          key: p.title,
          onClick: onCardClick,
          draggable: false
        },
          h("div", { className: "xp-shot" },
            h("img", {
              src: p.src,
              alt: "",
              draggable: false,
              onError: function (e) { e.target.style.display = "none"; }
            })
          ),
          h("h3", null, p.title),
          h("p", { className: "meta" }, p.meta)
        );
      })
    )
  );
}

var root = document.getElementById("project-rail-root");
if (root) createRoot(root).render(h(ProjectRail));
