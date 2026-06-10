/* ===========================================================
   Arthur Renard — Celestial Sandbox (Connect side widget)
   A tiny gravity toy: click to launch a planet into orbit around
   a sage "star"; drag to slingshot it. Comet trails, fully canvas.
   Self-contained, theme-colored, respects reduced motion.
   =========================================================== */
(function () {
  "use strict";

  var card = document.querySelector(".orbit-card");
  if (!card) return;
  var canvas = card.querySelector(".orbit-canvas");
  var resetBtn = card.querySelector(".orbit-reset");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme colors
  var SAGE = "#91ac8f", SAGE_LIGHT = "#b2c9ad", WHITE = "#ffffff";

  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  var cx = 0, cy = 0;
  var SUN_R = 11;
  var K = 600;          // gravitational constant * star mass
  var SOFT = 42;        // softening to avoid singularity
  var MAX_V = 8;        // velocity clamp
  var DT = 0.45;        // global time scale (slows the whole simulation down)
  var MAX_PULL = 55;    // cap how far a slingshot drag counts
  var MAX_PLANETS = 6;
  var TRAIL = 34;

  var planets = [];
  var stars = [];       // static background dots
  var pulse = 0;

  function size() {
    var r = canvas.getBoundingClientRect();
    W = Math.max(10, r.width); H = Math.max(10, r.height);
    cx = W / 2; cy = H / 2;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seedStars();
  }

  function seedStars() {
    stars = [];
    var n = Math.round((W * H) / 2600);
    for (var i = 0; i < n; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + 0.3, a: Math.random() * 0.5 + 0.2 });
    }
  }

  function planetColor(i) {
    var cols = [SAGE_LIGHT, WHITE, SAGE, "#cde0c8", "#9fc3a8", "#e6efe1"];
    return cols[i % cols.length];
  }

  // Launch a planet at (x,y). If vx/vy omitted, give it a near-circular orbit.
  function launch(x, y, vx, vy) {
    var dx = x - cx, dy = y - cy;
    var r = Math.sqrt(dx * dx + dy * dy) || 1;
    if (r < SUN_R + 6) { r = SUN_R + 24; x = cx + (dx / (Math.sqrt(dx*dx+dy*dy)||1)) * r; y = cy; }
    if (vx === undefined) {
      // perpendicular to radius → orbit; consistent counter-clockwise spin
      var v = Math.sqrt(K / r);
      vx = (-dy / r) * v;
      vy = (dx / r) * v;
    }
    var sp = Math.sqrt(vx * vx + vy * vy);
    if (sp > MAX_V) { vx = vx / sp * MAX_V; vy = vy / sp * MAX_V; }
    planets.push({ x: x, y: y, vx: vx, vy: vy, trail: [], color: planetColor(planets.length), born: performance.now() });
    if (planets.length > MAX_PLANETS) planets.shift();
    if (!running) start();   // ensure the loop is live (covers reduced-motion + any missed start)
  }

  function step() {
    for (var i = planets.length - 1; i >= 0; i--) {
      var p = planets[i];
      var dx = cx - p.x, dy = cy - p.y;
      var r2 = dx * dx + dy * dy;
      var r = Math.sqrt(r2);
      var a = K / (r2 + SOFT);
      p.vx += a * dx / r * DT;
      p.vy += a * dy / r * DT;
      var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp > MAX_V) { p.vx = p.vx / sp * MAX_V; p.vy = p.vy / sp * MAX_V; }
      p.x += p.vx * DT; p.y += p.vy * DT;
      p.trail.push(p.x, p.y);
      if (p.trail.length > TRAIL * 2) p.trail.splice(0, 2);
      // struck the star → supernova; flung far off-screen → gone
      if (r < SUN_R - 1) { boom(); break; }
      var m = 80;
      if (p.x < -m || p.x > W + m || p.y < -m || p.y > H + m) planets.splice(i, 1);
    }
  }

  var flashes = [];
  function flash(x, y) { flashes.push({ x: x, y: y, t: 0 }); }

  // Supernova: triggered when a planet strikes the star. Expands to fill the
  // whole canvas in a bright flash, then fades back to the background.
  var nova = null;
  var novaCount = 0;        // supernovas since last reckoning
  var penalty = null;       // the harmless "punishment" overlay
  function boom() { nova = { t: 0 }; planets.length = 0; flashes.length = 0; novaCount++; }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // background stars
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      ctx.globalAlpha = s.a;
      ctx.fillStyle = SAGE_LIGHT;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // planet trails + bodies
    for (var j = 0; j < planets.length; j++) {
      var p = planets[j], t = p.trail, n = t.length / 2;
      for (var k = 0; k < n - 1; k++) {
        var alpha = (k / n) * 0.5;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = (k / n) * 2.2 + 0.3;
        ctx.beginPath();
        ctx.moveTo(t[k * 2], t[k * 2 + 1]);
        ctx.lineTo(t[k * 2 + 2], t[k * 2 + 3]);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(p.x, p.y, 3.1, 0, 6.2832); ctx.fill();
      ctx.shadowBlur = 0;
    }

    // aim line while dragging
    if (drag && drag.moved) {
      ctx.strokeStyle = SAGE_LIGHT; ctx.globalAlpha = 0.6;
      ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(drag.sx, drag.sy); ctx.lineTo(drag.x, drag.y); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = WHITE;
      ctx.beginPath(); ctx.arc(drag.sx, drag.sy, 3, 0, 6.2832); ctx.fill();
    }

    // capture flashes
    for (var f = flashes.length - 1; f >= 0; f--) {
      var fl = flashes[f]; fl.t += 0.08;
      if (fl.t >= 1) { flashes.splice(f, 1); continue; }
      ctx.globalAlpha = 1 - fl.t;
      ctx.strokeStyle = SAGE_LIGHT; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(fl.x, fl.y, fl.t * 16, 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // the star
    var glow = SUN_R + 9 + (reduce ? 0 : Math.sin(pulse) * 2.2);
    var g = ctx.createRadialGradient(cx, cy, 1, cx, cy, glow + 14);
    g.addColorStop(0, "rgba(230,240,225,0.95)");
    g.addColorStop(0.45, "rgba(178,201,173,0.55)");
    g.addColorStop(1, "rgba(178,201,173,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, glow + 14, 0, 6.2832); ctx.fill();
    ctx.fillStyle = "#eef4ea";
    ctx.beginPath(); ctx.arc(cx, cy, SUN_R - 3, 0, 6.2832); ctx.fill();

    // supernova overlay (drawn on top, engulfs everything, then fades)
    if (nova) {
      var nt = nova.t;
      var diag = Math.sqrt(W * W + H * H);
      var grow = 1 - Math.pow(1 - Math.min(nt / 0.42, 1), 3); // ease-out expand
      var rad = SUN_R + grow * diag * 1.15;
      var na = nt < 0.42 ? (nt / 0.42) : (1 - (nt - 0.42) / 0.58);
      na = Math.max(0, Math.min(1, na));
      var ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      ng.addColorStop(0, "rgba(247,251,244," + na + ")");
      ng.addColorStop(0.55, "rgba(206,224,200," + (na * 0.92) + ")");
      ng.addColorStop(0.82, "rgba(178,201,173," + (na * 0.45) + ")");
      ng.addColorStop(1, "rgba(178,201,173,0)");
      ctx.fillStyle = ng;
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 6.2832); ctx.fill();
      // leading shock ring
      ctx.globalAlpha = na * 0.8;
      ctx.strokeStyle = "rgba(247,251,244,1)";
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, rad * 0.97, 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 1;
      nova.t += 0.016;
      if (nova.t >= 1) { nova = null; if (novaCount >= 3) penalty = { t: 0 }; }
    }

    // Harmless joke after every 3rd supernova: the cosmos files a complaint.
    if (penalty) {
      var pt = penalty.t;
      var pa = pt < 0.12 ? pt / 0.12 : (pt > 0.82 ? (1 - (pt - 0.82) / 0.18) : 1);
      pa = Math.max(0, Math.min(1, pa));
      ctx.globalAlpha = pa * 0.8;
      ctx.fillStyle = "#181e15";
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = pa;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#eef4ea";
      ctx.font = "600 15px -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
      ctx.fillText("Three stars destroyed.", cx, cy - 17);
      ctx.fillStyle = "#b2c9ad";
      ctx.font = "500 12.5px -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
      ctx.fillText("The cosmos is not amused.", cx, cy + 3);
      var dots = new Array(1 + (Math.floor(pt * 14) % 3) + 1).join(".");
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "500 12px -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
      ctx.fillText("Rebooting universe" + dots, cx, cy + 23);
      ctx.globalAlpha = 1;
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
      penalty.t += 0.006;
      if (penalty.t >= 1) { penalty = null; novaCount = 0; if (!reduce) seedInitial(); }
    }
  }

  var raf = null, running = false;
  function loop() {
    if (!reduce) pulse += 0.05;
    step();
    draw();
    raf = requestAnimationFrame(loop);
  }
  function start() { if (!running) { running = true; loop(); } }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

  // ---- Interaction ----
  var drag = null;
  function pos(e) {
    var r = canvas.getBoundingClientRect();
    var t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }
  canvas.addEventListener("pointerdown", function (e) {
    var p = pos(e);
    drag = { sx: p.x, sy: p.y, x: p.x, y: p.y, moved: false };
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var p = pos(e); drag.x = p.x; drag.y = p.y;
    if (Math.abs(p.x - drag.sx) + Math.abs(p.y - drag.sy) > 6) drag.moved = true;
  });
  function release() {
    if (!drag) return;
    if (penalty) { drag = null; return; }   // locked out during the timeout
    if (drag.moved) {
      // slingshot: pull back to launch forward. Cap the pull length, then
      // apply a gentle scale → much weaker, slower launches.
      var pdx = drag.sx - drag.x, pdy = drag.sy - drag.y;
      var pl = Math.sqrt(pdx * pdx + pdy * pdy);
      if (pl > MAX_PULL) { pdx = pdx / pl * MAX_PULL; pdy = pdy / pl * MAX_PULL; }
      var vx = pdx * 0.045;
      var vy = pdy * 0.045;
      launch(drag.sx, drag.sy, vx, vy);
    } else {
      launch(drag.sx, drag.sy);
    }
    drag = null;
  }
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", function () { drag = null; });

  if (resetBtn) resetBtn.addEventListener("click", function () { planets = []; flashes = []; seedInitial(); });

  // Seed a couple of gentle orbits so it's alive on arrival
  function seedInitial() {
    launch(cx + 64, cy);
    launch(cx - 92, cy, 0, -Math.sqrt(K / 92) * 0.96);
  }

  // Pause when off-screen / tab hidden (perf + battery)
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
  }, { threshold: 0.05 });

  window.addEventListener("resize", size, { passive: true });
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });

  size();
  // Start immediately (don't depend on IntersectionObserver to kick the loop).
  // Reduced-motion: no ambient orbits — stays still until the user launches one.
  if (!reduce) { seedInitial(); start(); }
  else { draw(); }
  io.observe(card);
})();
