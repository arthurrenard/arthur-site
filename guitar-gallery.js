/* ===========================================================
   Arthur Renard — Guitar build progression lightbox
   Black Strat → EVH-style Frankenstrat. Self-contained.
   =========================================================== */
(function () {
  "use strict";

  var STEPS = [
    {
      src: "images/guitar-1-teardown.png",
      tKey: "guitarT1", dKey: "guitarD1",
      title: "Teardown & sanding",
      desc: "Stripped the guitar down to a bare body — pickguard off, all the electronics out — then sanded the old finish back to a flat, even surface (photographing the wiring first so reassembly wouldn't be guesswork).",
    },
    {
      src: "images/guitar-4-masking.jpg",
      tKey: "guitarT2", dKey: "guitarD2",
      title: "White base + masking",
      desc: "Sprayed a white base coat over the whole body, then hand-masked the Frankenstrat stripe pattern with tape. The tape is what guards the white you see in the final design.",
    },
    {
      src: "images/guitar-3-crop.jpg",
      tKey: "guitarT3", dKey: "guitarD3",
      title: "Black coat + gold flake",
      desc: "Laid black over the taped body, then flicked gold specks across the back — a one-off finish you won't find on any factory guitar.",
    },
    {
      src: "images/guitar-red-crop.jpg",
      tKey: "guitarT4", dKey: "guitarD4",
      title: "Cherry red",
      desc: "The final color goes on: cherry red, sprayed over everything. Under all that red, the tape is still holding the whole pattern in place.",
    },
    {
      src: "images/guitar-5-crop.jpg",
      tKey: "guitarT5", dKey: "guitarD5",
      title: "Peel the tape",
      desc: "Peeling the tape back reveals the stripes hiding underneath — the classic red, white, and black Frankenstrat pattern, crisp lines and all.",
    },
    {
      src: "images/guitar-7-final.png",
      tKey: "guitarT6", dKey: "guitarD6",
      title: "Reassembled & wired hot",
      desc: "Back together with a Seymour Duncan SH-4 JB humbucker in the bridge, locking tuners, and fresh strings. Fatter EVH tone, screaming harmonics, and far less buzz.",
    },
  ];

  // Pull a localized string, falling back to the English baked into STEPS.
  function t(key, fallback) {
    var s = window.SiteI18n && window.SiteI18n.str ? window.SiteI18n.str(key) : undefined;
    return s || fallback;
  }

  var lb = document.getElementById("guitarLightbox");
  var trigger = document.getElementById("guitarTrigger");
  if (!lb || !trigger) return;

  var imgEl = document.getElementById("glbImg");
  var numEl = document.getElementById("glbNum");
  var titleEl = document.getElementById("glbTitle");
  var descEl = document.getElementById("glbDesc");
  var dotsEl = document.getElementById("glbDots");
  var prevBtn = lb.querySelector(".glb-prev");
  var nextBtn = lb.querySelector(".glb-next");

  var idx = 0;
  var lastFocus = null;

  // Preload images once opened so navigation is instant.
  var preloaded = false;
  function preload() {
    if (preloaded) return;
    preloaded = true;
    STEPS.forEach(function (s) { var i = new Image(); i.src = s.src; });
  }

  // Build the dot indicators.
  STEPS.forEach(function (s, i) {
    var d = document.createElement("button");
    d.className = "glb-dot";
    d.type = "button";
    d.setAttribute("role", "tab");
    d.setAttribute("aria-label", "Step " + (i + 1) + ": " + t(s.tKey, s.title));
    d.addEventListener("click", function () { go(i); });
    dotsEl.appendChild(d);
  });
  var dots = Array.prototype.slice.call(dotsEl.children);

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function render() {
    var s = STEPS[idx];
    var sTitle = t(s.tKey, s.title);
    imgEl.classList.remove("is-in");
    // swap after a tick so the fade restarts
    imgEl.src = s.src;
    imgEl.alt = sTitle + " — step " + (idx + 1) + " of the guitar build";
    numEl.textContent = pad(idx + 1);
    titleEl.textContent = sTitle;
    descEl.textContent = t(s.dKey, s.desc);
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === idx);
      d.setAttribute("aria-label", "Step " + (i + 1) + ": " + t(STEPS[i].tKey, STEPS[i].title));
      if (i === idx) d.setAttribute("aria-selected", "true");
      else d.removeAttribute("aria-selected");
    });
    requestAnimationFrame(function () { imgEl.classList.add("is-in"); });
  }

  function go(i) {
    idx = (i + STEPS.length) % STEPS.length;
    render();
  }
  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }

  function open(startIndex) {
    lastFocus = document.activeElement;
    preload();
    idx = startIndex || 0;
    render();
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("glb-lock");
    document.addEventListener("keydown", onKey);
    // focus the close button for accessibility
    var closeBtn = lb.querySelector(".glb-close");
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("glb-lock");
    document.removeEventListener("keydown", onKey);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (e.key === "Escape") { close(); }
    else if (e.key === "ArrowRight") { next(); }
    else if (e.key === "ArrowLeft") { prev(); }
  }

  // Re-render captions live if the visitor switches language while open.
  document.addEventListener("langchange", function () {
    if (lb.classList.contains("open")) render();
  });

  trigger.addEventListener("click", function () { open(0); });
  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);
  Array.prototype.forEach.call(lb.querySelectorAll("[data-glb-close]"), function (el) {
    el.addEventListener("click", close);
  });

  // Swipe support on touch devices.
  var startX = null;
  var stage = lb.querySelector(".glb-stage");
  if (stage) {
    stage.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (startX == null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); }
      startX = null;
    }, { passive: true });
  }
})();
