(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var hero = document.querySelector(".hero");
  var heroImg = document.querySelector(".hero-photo img");
  if (heroImg) {
    function showHero() {
      if (reduce) {
        heroImg.classList.add("ready");
        if (hero) hero.classList.add("is-in");
        return;
      }
      requestAnimationFrame(function () {
        heroImg.classList.add("ready");
        if (hero) hero.classList.add("is-in");
      });
    }
    if (heroImg.complete) showHero();
    else heroImg.addEventListener("load", showHero);
    setTimeout(function () {
      if (hero) hero.classList.add("is-in");
    }, 80);
  } else if (hero) {
    hero.classList.add("is-in");
  }

  var mast = document.getElementById("mast");
  var isHome = document.body.classList.contains("home");
  function dockMast() {
    if (!mast || !isHome || !hero) return;
    var past = window.scrollY > hero.offsetHeight - 72;
    mast.classList.toggle("is-on", past);
  }
  if (isHome && mast) {
    dockMast();
    window.addEventListener("scroll", dockMast, { passive: true });
    window.addEventListener("resize", dockMast);
  }

  var layers = document.querySelectorAll(".plx");
  var mx = 0;
  var my = 0;
  function applyLayers() {
    if (reduce || !layers.length) return;
    var y = window.scrollY || 0;
    layers.forEach(function (el) {
      var d = parseFloat(el.getAttribute("data-depth") || "0");
      var s = parseFloat(el.getAttribute("data-scroll") || "0");
      var tx = mx * d * 28;
      var ty = my * d * 20 + y * s;
      el.style.transform = "translate3d(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px,0)";
    });
  }
  if (!reduce && hero && layers.length) {
    window.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      applyLayers();
    });
    window.addEventListener("scroll", applyLayers, { passive: true });
  }

  var rules = document.querySelectorAll("h2.section.rule-draw");
  if (rules.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      rules.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      rules.forEach(function (el) { io.observe(el); });
    }
  }

  document.querySelectorAll(".thumb img, .hero-photo img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.display = "none"; });
  });

  function syncThemeBtn() {
    var dark = document.documentElement.getAttribute("data-theme") !== "light";
    var btn = document.getElementById("theme-btn");
    var lbl = document.getElementById("theme-lbl");
    if (lbl) lbl.textContent = dark ? "Light" : "Dark";
    if (btn) btn.setAttribute("aria-pressed", dark ? "true" : "false");
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    syncThemeBtn();
  }
  syncThemeBtn();
  var themeBtn = document.getElementById("theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }
})();


  var rules = document.querySelectorAll("h2.section.rule-draw");
  if (rules.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      rules.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      rules.forEach(function (el) { io.observe(el); });
    }
  }

  document.querySelectorAll(".thumb img, .hero-photo img").forEach(function (img) {
    img.addEventListener("error", function () { img.style.display = "none"; });
  });

  function syncThemeBtn() {
    var dark = document.documentElement.getAttribute("data-theme") !== "light";
    var btn = document.getElementById("theme-btn");
    var lbl = document.getElementById("theme-lbl");
    if (lbl) lbl.textContent = dark ? "Light" : "Dark";
    if (btn) btn.setAttribute("aria-pressed", dark ? "true" : "false");
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    syncThemeBtn();
  }
  syncThemeBtn();
  var themeBtn = document.getElementById("theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    });
  }
})();
