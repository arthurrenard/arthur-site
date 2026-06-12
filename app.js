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

  /* ---- Brand monogram: rotating green emoji silhouettes ----
     Each emoji is rendered as a CSS mask so it paints in the brand's
     dark green (var(--ink-on-light)) rather than its native colors.
     Set spans Arthur: stars/celestial, music, math/science, finance,
     and nature/outdoors. */
  var mono = document.querySelector(".brand .monogram");
  if (mono) {
    var glyph = mono.querySelector(".mono-glyph");
    if (glyph) {
      var EMOJI = ["\u2B50","\uD83E\uDE90","\uD83C\uDF19","\uD83C\uDFB8","\uD83C\uDFB5",
                   "\u03C0","\u2211","\uD83D\uDD2C","\uD83C\uDF32","\uD83C\uDFD4\uFE0F","\uD83E\uDD8A"];
      var svgFor = function (ch, x, y) {
        return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
          "<text x='" + x + "' y='" + y + "' font-size='78' text-anchor='middle' dominant-baseline='central'>" + ch + "</text></svg>";
      };
      var maskUrl = function (svg) { return "url(\"data:image/svg+xml;utf8," + encodeURIComponent(svg) + "\")"; };
      // Measure each glyph's painted bounding box and bake an offset into its
      // mask so every emoji ends up individually centered in the square.
      var buildCentered = function (ch) {
        return new Promise(function (resolve) {
          var img = new Image();
          img.onload = function () {
            var ox = 0, oy = 0;
            try {
              var c = document.createElement("canvas"); c.width = 100; c.height = 100;
              var cx2 = c.getContext("2d"); cx2.drawImage(img, 0, 0, 100, 100);
              var d = cx2.getImageData(0, 0, 100, 100).data;
              var minX = 100, maxX = 0, minY = 100, maxY = 0, found = false;
              for (var i = 0; i < d.length; i += 4) {
                if (d[i + 3] > 12) { found = true; var p = i / 4, px = p % 100, py = (p / 100) | 0;
                  if (px < minX) minX = px; if (px > maxX) maxX = px;
                  if (py < minY) minY = py; if (py > maxY) maxY = py; }
              }
              if (found) { ox = 50 - (minX + maxX) / 2; oy = 50 - (minY + maxY) / 2; }
            } catch (e) { /* tainted canvas — fall back to un-offset */ }
            resolve(maskUrl(svgFor(ch, 50 + ox, 50 + oy)));
          };
          img.onerror = function () { resolve(maskUrl(svgFor(ch, 50, 50))); };
          img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svgFor(ch, 50, 50));
        });
      };
      // shuffle so the order varies between loads
      var order = EMOJI.slice();
      for (var oi = order.length - 1; oi > 0; oi--) {
        var oj = Math.floor(Math.random() * (oi + 1));
        var tmp = order[oi]; order[oi] = order[oj]; order[oj] = tmp;
      }
      var k = 0, masks = order.map(function (ch) { return maskUrl(svgFor(ch, 50, 50)); });
      var setMask = function (m) { glyph.style.webkitMaskImage = m; glyph.style.maskImage = m; };
      setMask(masks[0]);
      // upgrade to centered masks as soon as measurements finish
      Promise.all(order.map(buildCentered)).then(function (centered) {
        masks = centered;
        setMask(masks[k]);
      });
      var cycle = function () {
        // current glyph falls out the bottom
        glyph.classList.add("mono-out");
        setTimeout(function () {
          k = (k + 1) % order.length;
          // jump the (now hidden) glyph above the square, swap the emoji,
          // then release so it falls down into the centered position
          glyph.classList.add("mono-prep");
          glyph.classList.remove("mono-out");
          setMask(masks[k]);
          void glyph.offsetWidth; // reflow so the prep state takes hold first
          glyph.classList.remove("mono-prep");
        }, 540);
      };
      var MONO_EVERY = 4200;
      var monoIv = setInterval(cycle, MONO_EVERY);
      document.addEventListener("visibilitychange", function () {
        clearInterval(monoIv);
        if (!document.hidden) monoIv = setInterval(cycle, MONO_EVERY);
      });
    }
  }
})();
