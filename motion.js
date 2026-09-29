/* ===========================================================
   Arthur Renard — springs
   Closed-form damped springs: a spring's value is a pure function of
   time since its last retarget, so an interrupted animation picks up
   from exactly where it was (position and velocity) without drift.
   Tuned for a tiny overshoot at most (damping ratio ~0.8).
   =========================================================== */
(function () {
  "use strict";

  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var now = function () { return performance.now(); };

  // stiffness k (mass 1) and damping ratio z. Presets used across the site.
  var PRESETS = {
    snappy: { k: 520, z: 0.82 },   // presses, indicator leading edge
    smooth: { k: 320, z: 0.84 },   // size morphs
    lazy:   { k: 200, z: 0.9 },    // indicator trailing edge
    flight: { k: 190, z: 0.86 },   // the Click Me pill flying into the nav
    fade:   { k: 420, z: 1 },      // content presence (no overshoot)
  };

  function Spring(value, preset) {
    var p = typeof preset === "string" ? PRESETS[preset] : (preset || PRESETS.smooth);
    this.k = p.k;
    this.z = p.z;
    this.x0 = value;
    this.v0 = 0;
    this.to = value;
    this.t0 = now();
  }

  // Displacement from target and velocity at time t (closed form).
  Spring.prototype._at = function (t) {
    var d0 = this.x0 - this.to;
    var dt = (t - this.t0) / 1000;
    if (dt <= 0) return { d: d0, v: this.v0 };
    var w0 = Math.sqrt(this.k), z = this.z, d, v;
    if (z < 0.999) {
      var wd = w0 * Math.sqrt(1 - z * z);
      var A = d0, B = (this.v0 + z * w0 * d0) / wd;
      var e = Math.exp(-z * w0 * dt), c = Math.cos(wd * dt), s = Math.sin(wd * dt);
      d = e * (A * c + B * s);
      v = e * ((-z * w0) * (A * c + B * s) + (-A * wd * s + B * wd * c));
    } else {
      var B2 = this.v0 + w0 * d0, e2 = Math.exp(-w0 * dt);
      d = (d0 + B2 * dt) * e2;
      v = (B2 - w0 * (d0 + B2 * dt)) * e2;
    }
    return { d: d, v: v };
  };

  Spring.prototype.value = function (t) { return this.to + this._at(t === undefined ? now() : t).d; };
  Spring.prototype.velocity = function (t) { return this._at(t === undefined ? now() : t).v; };

  // Retarget from the current position and velocity. `delay` (ms) holds
  // the current value before moving, for staggered content swaps.
  Spring.prototype.set = function (to, delay) {
    var t = now(), s = this._at(t);
    this.x0 = this.to + s.d;
    this.v0 = s.v;
    this.to = to;
    this.t0 = t + (delay || 0);
    if (mq.matches) this.jump(to);
    return this;
  };

  // Change stiffness/damping mid-flight without a jump: re-anchor at the
  // current position and velocity under the old parameters first.
  Spring.prototype.tune = function (preset) {
    var p = typeof preset === "string" ? PRESETS[preset] : preset;
    var t = now();
    if (t >= this.t0) {
      var s = this._at(t);
      this.x0 = this.to + s.d;
      this.v0 = s.v;
      this.t0 = t;
    }
    this.k = p.k;
    this.z = p.z;
    return this;
  };

  Spring.prototype.jump = function (to) {
    this.x0 = this.to = to;
    this.v0 = 0;
    this.t0 = now();
    return this;
  };

  Spring.prototype.done = function (t, eps) {
    t = t === undefined ? now() : t;
    if (t < this.t0) return false;
    var s = this._at(t), e = eps || 0.01;
    return Math.abs(s.d) < e * 10 && Math.abs(s.v) < e * 50;
  };

  // One shared rAF loop. `run(fn)`: fn(t) is called every frame until it
  // returns false. Returns a stop function.
  var jobs = [], raf = null;
  function frame(t) {
    raf = null;
    jobs = jobs.filter(function (j) { return !j.dead && j.fn(t) !== false; });
    if (jobs.length) raf = requestAnimationFrame(frame);
  }
  function run(fn) {
    var job = { fn: fn, dead: false };
    jobs.push(job);
    if (!raf) raf = requestAnimationFrame(frame);
    return function () { job.dead = true; };
  }

  window.Motion = {
    Spring: Spring,
    run: run,
    now: now,
    reduced: function () { return mq.matches; },
    // Presence 0..1 -> content-swap styling (opacity + short blur).
    presence: function (el, p) {
      p = Math.max(0, Math.min(1, p));
      el.style.opacity = p.toFixed(3);
      el.style.filter = p > 0.995 ? "none" : "blur(" + ((1 - p) * 8).toFixed(2) + "px)";
      el.style.visibility = p < 0.01 ? "hidden" : "visible";
    },
  };
})();
