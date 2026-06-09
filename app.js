/* ===========================================================
   Arthur Renard — site behavior
   - nav: shrink-on-scroll, active link, mobile toggle
   - signature motion: lateral-drift reveals (reversible)
   - scroll progress + subtle blob parallax
   =========================================================== */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Capability probe ----
     This preview/runtime may freeze time-based animation. Detect whether
     CSS transitions actually advance; if not, switch to a static mode where
     every reveal sits at its visible end-state (no motion, but never blank). */
  function enableStatic() { document.documentElement.classList.add("no-anim"); }
  (function probeAnim() {
    if (reduce) { enableStatic(); return; }
    var p = document.createElement("div");
    p.style.cssText = "position:fixed;top:-9999px;left:0;width:1px;height:1px;opacity:0;transition:opacity 80ms linear;pointer-events:none";
    document.body.appendChild(p);
    var settled = false;
    function ok() { if (settled) return; settled = true; clearTimeout(t); p.removeEventListener("transitionstart", ok); p.remove(); }
    function fail() { if (settled) return; settled = true; p.removeEventListener("transitionstart", ok); p.remove(); enableStatic(); }
    p.addEventListener("transitionstart", ok);
    requestAnimationFrame(function () { p.style.opacity = "1"; });
    var t = setTimeout(fail, 200);
  })();

  /* ---- Mobile nav toggle ---- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---- Active link (by filename) ---- */
  if (nav) {
    var here = location.pathname.split("/").pop() || "index.html";
    nav.querySelectorAll(".nav-links a").forEach(function (a) {
      var target = a.getAttribute("href");
      if (target === here || (here === "" && target === "index.html")) {
        a.classList.add("active");
      }
    });
  }

  /* ---- Reveal: lateral-drift, reversible both directions ----
     Scroll-position based (robust across embedded/preview viewports
     where IntersectionObserver can be unreliable). */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function updateReveals() {
    var vh = window.innerHeight;
    for (var i = 0; i < revealEls.length; i++) {
      var el = revealEls[i];
      var r = el.getBoundingClientRect();
      // trigger when the element's top crosses ~88% of the viewport,
      // un-trigger only once it has fully left below the fold (replays on scroll-up)
      var enter = r.top < vh * 0.88 && r.bottom > 0;
      if (enter) el.classList.add("in");
      else if (r.top >= vh) el.classList.remove("in");
    }
  }

  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Scroll-driven chrome: progress, nav shrink, blob parallax ---- */
  var progress = document.querySelector(".scroll-progress");
  var bg = document.querySelector(".bg-field");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var p = docH > 0 ? y / docH : 0;

    if (progress) progress.style.setProperty("--p", p.toFixed(4));

    if (nav) {
      if (y > 24) nav.classList.add("shrink");
      else nav.classList.remove("shrink");
    }

    if (bg && !reduce) {
      bg.style.setProperty("--blob1", (y * -0.06).toFixed(1) + "px");
      bg.style.setProperty("--blob2", (y * 0.05).toFixed(1) + "px");
    }

    if (!reduce) updateReveals();
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", function () {
    if (!reduce) updateReveals();
  }, { passive: true });

  // initial paint (and a second pass after fonts/images settle)
  onScroll();
  window.requestAnimationFrame(onScroll);
  window.addEventListener("load", onScroll);
})();
