/* ===========================================================
   Arthur Renard — Click Me pill + liquid nav indicator
   One shape on the home hero: "Click Me" opens into the three other
   pages, and picking one flies the same pill up into the nav before
   the page swaps in (router.js). While the pill is on screen the nav
   links are "docked" inside it; they appear once it scrolls away.
   The nav's active pill is a liquid indicator: its two edges ride
   different springs, so the leading edge stretches ahead.
   =========================================================== */
(function () {
  "use strict";

  if (!window.Motion) return;
  var M = window.Motion, Spring = M.Spring;
  var nav = document.querySelector(".nav");
  var links = nav && nav.querySelector(".nav-links");
  var mobileMq = window.matchMedia("(max-width: 760px)");

  function fx(name) { if (window.SiteSound && window.SiteSound.fx) window.SiteSound.fx(name); }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  /* ---------------- Liquid nav indicator ---------------- */
  var ind = null, indL, indR, indP, indBusy = false;

  function initNavIndicator() {
    if (!links) return;
    ind = document.createElement("span");
    ind.className = "nav-ind";
    ind.setAttribute("aria-hidden", "true");
    links.insertBefore(ind, links.firstChild);
    indL = new Spring(0, "snappy");
    indR = new Spring(0, "snappy");
    indP = new Spring(0, "fade");
    placeIndicator(true);
  }

  // Move `left`/`right` edge springs to [l, r]; the edge in the direction
  // of travel is stiffer, so the pill stretches, then catches up.
  function slideEdges(sl, sr, l, r) {
    var right = l > sl.to;
    sl.tune(right ? "lazy" : "snappy").set(l);
    sr.tune(right ? "snappy" : "lazy").set(r);
  }

  function placeIndicator(instant) {
    if (!ind) return;
    var a = links.querySelector("a.active");
    if (!a || mobileMq.matches) {
      instant ? indP.jump(0) : indP.set(0);
    } else {
      var l = a.offsetLeft, r = l + a.offsetWidth;
      if (instant || indP.value() < 0.05) { indL.jump(l); indR.jump(r); }
      else slideEdges(indL, indR, l, r);
      instant ? indP.jump(1) : indP.set(1);
    }
    animateIndicator();
  }

  function renderIndicator(t) {
    var l = indL.value(t), r = indR.value(t);
    ind.style.transform = "translateX(" + l.toFixed(2) + "px)";
    ind.style.width = Math.max(0, r - l).toFixed(2) + "px";
    ind.style.opacity = clamp01(indP.value(t)).toFixed(3);
    return !(indL.done(t) && indR.done(t) && indP.done(t, 0.001));
  }

  function animateIndicator() {
    renderIndicator(M.now());           // paint now, even if frames are paused
    if (indBusy) return;
    indBusy = true;
    M.run(function (t) { indBusy = renderIndicator(t); return indBusy; });
  }

  /* ---------------- Docking (home only) ---------------- */
  function dock(on) {
    if (!nav) return;
    nav.classList.toggle("docked", on);
    var tog = nav.querySelector(".nav-toggle");
    [links, tog].forEach(function (el) {
      if (!el) return;
      if (on) el.setAttribute("inert", ""); else el.removeAttribute("inert");
    });
  }

  function instantly(fn) {
    nav.classList.add("nav-instant");
    fn();
    void nav.offsetWidth;
    requestAnimationFrame(function () { nav.classList.remove("nav-instant"); });
  }

  /* ---------------- Click Me ---------------- */
  var cm = null;

  function ClickMe(root) {
    var self = this;
    this.root = root;
    this.trigger = root.querySelector(".cm-trigger");
    this.label = root.querySelector(".cm-trigger-in");
    this.opts = root.querySelector(".cm-options");
    this.fill = root.querySelector(".cm-fill");
    this.hi = root.querySelector(".cm-ind");
    this.items = Array.prototype.slice.call(root.querySelectorAll(".cm-opt"));
    this.isOpen = false;
    this.flying = false;
    this.pressed = false;
    this.busy = false;

    this.w = new Spring(0, "smooth");
    this.h = new Spring(0, "smooth");
    this.fillP = new Spring(1, "fade");
    this.labelP = new Spring(1, "fade");
    this.optsP = new Spring(0, "fade");
    this.hl = new Spring(0, "snappy");
    this.hr = new Spring(0, "snappy");
    this.hp = new Spring(0, "fade");

    root.classList.add("cm-live");
    try { if (sessionStorage.getItem("cm-seen")) root.classList.add("cm-seen"); } catch (e) {}
    this.items.forEach(function (a) { a.setAttribute("tabindex", "-1"); });
    this.measure(true);

    var on = function (el, ev, fn, opt) { el.addEventListener(ev, fn, opt); self._off.push(function () { el.removeEventListener(ev, fn, opt); }); };
    this._off = [];

    on(this.trigger, "click", function (e) {
      self.setOpen(!self.isOpen);
      if (self.isOpen && e.detail === 0) self.items[0].focus();   // opened from the keyboard
    });
    on(this.trigger, "pointerdown", function () { self.press(true); });
    on(window, "pointerup", function () { self.press(false); });
    on(window, "pointercancel", function () { self.press(false); });

    on(this.opts, "pointermove", function (e) {
      var a = e.target.closest && e.target.closest(".cm-opt");
      if (a) self.highlight(a);
    });
    on(this.opts, "pointerleave", function () {
      if (!self.flying && document.activeElement && self.items.indexOf(document.activeElement) === -1) self.highlight(null);
    });
    on(this.opts, "focusin", function (e) { if (self.items.indexOf(e.target) !== -1) self.highlight(e.target); });
    on(this.opts, "click", function (e) {
      var a = e.target.closest && e.target.closest(".cm-opt");
      if (a) self.fly(a, e);
    });
    on(root, "keydown", function (e) {
      var i = self.items.indexOf(document.activeElement);
      if (e.key === "Escape" && self.isOpen) { self.setOpen(false); self.trigger.focus(); }
      else if (i !== -1 && (e.key === "ArrowRight" || e.key === "ArrowDown")) { e.preventDefault(); self.items[(i + 1) % self.items.length].focus(); }
      else if (i !== -1 && (e.key === "ArrowLeft" || e.key === "ArrowUp")) { e.preventDefault(); self.items[(i + self.items.length - 1) % self.items.length].focus(); }
    });
    on(document, "pointerdown", function (e) {
      if (self.isOpen && !self.flying && !root.contains(e.target)) self.setOpen(false);
    });
    on(document, "focusin", function (e) {
      if (self.isOpen && !self.flying && !root.contains(e.target)) self.setOpen(false);
    });
  }

  ClickMe.prototype.destroy = function () {
    this._off.forEach(function (f) { f(); });
    this._off = [];
  };

  ClickMe.prototype.sizes = function () {
    return {
      idleW: this.label.offsetWidth,
      openW: this.opts.offsetWidth,
      h: this.label.offsetHeight,
    };
  };

  ClickMe.prototype.measure = function (instant) {
    var s = this.sizes();
    var w = this.isOpen ? s.openW : s.idleW;
    if (instant) { this.w.jump(w); this.h.jump(s.h); }
    else { this.w.set(w); this.h.set(s.h); }
    if (this.isOpen && this.hot) this.highlight(this.hot, true);
    this.animate();
  };

  ClickMe.prototype.press = function (down) {
    if (this.pressed === down || this.flying) return;
    this.pressed = down;
    var s = this.sizes();
    var base = this.isOpen ? s.openW : s.idleW;
    this.w.tune("snappy").set(down ? base - 6 : base);
    this.h.tune("snappy").set(down ? s.h - 4 : s.h);
    this.animate();
  };

  ClickMe.prototype.setOpen = function (open) {
    if (this.isOpen === open || this.flying) return;
    this.isOpen = open;
    var s = this.sizes();
    this.root.setAttribute("data-state", open ? "open" : "idle");
    this.trigger.setAttribute("aria-expanded", open ? "true" : "false");
    this.trigger.setAttribute("tabindex", open ? "-1" : "0");
    this.items.forEach(function (a) { a.setAttribute("tabindex", open ? "0" : "-1"); });
    this.w.tune("smooth").set(open ? s.openW : s.idleW);
    this.h.tune("smooth").set(s.h);
    // exit fast, enter a beat later, so the two labels never overlap
    this.fillP.set(open ? 0 : 1, open ? 0 : 60);
    this.labelP.set(open ? 0 : 1, open ? 0 : 110);
    this.optsP.set(open ? 1 : 0, open ? 110 : 0);
    if (!open) this.highlight(null);
    if (open) {
      // They found it: stop the attention hop for the rest of the visit.
      this.root.classList.add("cm-seen");
      try { sessionStorage.setItem("cm-seen", "1"); } catch (e) {}
    }
    fx(open ? "open" : "close");
    this.animate();
  };

  ClickMe.prototype.highlight = function (a, instant) {
    this.items.forEach(function (x) { x.classList.toggle("hot", x === a); });
    this.hot = a;
    if (!a) { this.hp.set(0); this.animate(); return; }
    var l = a.offsetLeft, r = l + a.offsetWidth;
    if (instant || this.hp.value() < 0.05) { this.hl.jump(l); this.hr.jump(r); }
    else slideEdges(this.hl, this.hr, l, r);
    this.hp.set(1);
    this.animate();
  };

  ClickMe.prototype.animate = function () {
    this.render(M.now());               // paint now, even if frames are paused
    if (this.busy) return;
    this.busy = true;
    var self = this;
    M.run(function (t) {
      if (!self.root.isConnected) { self.busy = false; return false; }
      self.busy = self.render(t);
      return self.busy;
    });
  };

  ClickMe.prototype.render = function (t) {
    var self = this;
    self.root.style.width = self.w.value(t).toFixed(2) + "px";
    self.root.style.height = self.h.value(t).toFixed(2) + "px";
    self.fill.style.opacity = clamp01(self.fillP.value(t)).toFixed(3);
    M.presence(self.label, self.labelP.value(t));
    M.presence(self.opts, self.optsP.value(t));
    var l = self.hl.value(t), r = self.hr.value(t);
    self.hi.style.transform = "translateX(" + l.toFixed(2) + "px)";
    self.hi.style.width = Math.max(0, r - l).toFixed(2) + "px";
    self.hi.style.opacity = clamp01(self.hp.value(t)).toFixed(3);
    var springs = [self.w, self.h, self.hl, self.hr];
    var fades = [self.fillP, self.labelP, self.optsP, self.hp];
    return !(springs.every(function (s) { return s.done(t); }) &&
             fades.every(function (s) { return s.done(t, 0.001); }));
  };

  // Fly the pill into the nav, then swap the page in.
  ClickMe.prototype.fly = function (a, e) {
    var href = a.getAttribute("href");
    if (this.flying) { e.preventDefault(); return; }
    if (!window.SiteRouter || M.reduced() || !nav) return;   // router (or the browser) handles it
    e.preventDefault();
    this.flying = true;
    window.SiteRouter.prefetch(href);
    this.highlight(a);
    fx("whoosh");

    var mobile = mobileMq.matches;
    var target = mobile ? nav.querySelector(".nav-toggle") : links;
    var from = this.root.getBoundingClientRect();
    var to = target.getBoundingClientRect();

    var ghost = document.createElement("div");
    ghost.className = "cm-ghost";
    ghost.setAttribute("aria-hidden", "true");
    var gA = this.opts.cloneNode(true);
    gA.removeAttribute("id");
    ghost.appendChild(gA);
    var gB = null;
    if (!mobile) {
      gB = links.cloneNode(true);
      gB.removeAttribute("inert");
      gB.classList.add("cm-ghost-links");
      Array.prototype.forEach.call(gB.querySelectorAll("a"), function (x) {
        x.classList.toggle("active", x.getAttribute("href") === href);
        x.removeAttribute("aria-current");
        x.setAttribute("tabindex", "-1");
      });
      ghost.appendChild(gB);
    }
    document.body.appendChild(ghost);
    if (gB) {
      var chosen = gB.querySelector('a[href="' + href + '"]');
      var gi = gB.querySelector(".nav-ind");
      if (chosen && gi) {
        gi.style.transform = "translateX(" + chosen.offsetLeft + "px)";
        gi.style.width = chosen.offsetWidth + "px";
        gi.style.opacity = "1";
      }
    }
    this.root.style.visibility = "hidden";

    var x = new Spring(from.left, "flight"), y = new Spring(from.top, "flight");
    var w = new Spring(from.width, "flight"), h = new Spring(from.height, "flight");
    var pA = new Spring(1, "fade"), pB = new Spring(0, "fade"), bg = new Spring(1, "fade");
    x.set(to.left); y.set(to.top); w.set(to.width); h.set(to.height);
    pA.set(0, 40);
    if (gB) { pB.set(1, 170); bg.set(0, 220); }
    else bg.set(0.001, 380);

    var start = M.now(), landed = false;
    // Safety net: land even if animation frames are paused (background tab).
    setTimeout(function () { land(); }, 1300);
    var land = function () {
      if (landed) return;
      landed = true;
      instantly(function () {
        dock(false);
        Array.prototype.forEach.call(links.querySelectorAll("a"), function (x2) {
          x2.classList.toggle("active", x2.getAttribute("href") === href);
        });
        placeIndicator(true);
      });
      ghost.parentNode && ghost.parentNode.removeChild(ghost);
      window.SiteRouter.go(href);
    };

    M.run(function (t) {
      ghost.style.transform = "translate(" + x.value(t).toFixed(2) + "px," + y.value(t).toFixed(2) + "px)";
      ghost.style.width = w.value(t).toFixed(2) + "px";
      ghost.style.height = h.value(t).toFixed(2) + "px";
      var b = clamp01(bg.value(t));
      ghost.style.backgroundColor = "rgba(255,255,255," + (0.07 * b).toFixed(4) + ")";
      ghost.style.borderColor = "rgba(255,255,255," + (0.22 * b).toFixed(4) + ")";
      ghost.style.opacity = gB ? "1" : Math.max(b, 0).toFixed(3);
      M.presence(gA, pA.value(t));
      if (gB) M.presence(gB, pB.value(t));
      var settled = [x, y, w, h].every(function (s) { return s.done(t, 0.05); });
      if ((settled && pB.done(t, 0.001)) || t - start > 1100) { land(); return false; }
      return true;
    });
  };

  /* ---------------- Page lifecycle ---------------- */
  var onScrollDock = null;

  function setupPage() {
    if (cm) { cm.destroy(); cm = null; }
    if (onScrollDock) { window.removeEventListener("scroll", onScrollDock); window.removeEventListener("resize", onScrollDock); onScrollDock = null; }
    var root = document.querySelector(".cm");
    if (!root || !nav) { if (nav) instantly(function () { dock(false); }); return; }
    cm = new ClickMe(root);

    // Docked while the pill is on screen below the nav bar.
    var ticking = false;
    var check = function () {
      ticking = false;
      if (!cm || cm.flying) return;
      var r = cm.root.getBoundingClientRect();
      var navBottom = nav.getBoundingClientRect().bottom;
      dock(r.bottom > navBottom && r.top < window.innerHeight);
    };
    onScrollDock = function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
    window.addEventListener("scroll", onScrollDock, { passive: true });
    window.addEventListener("resize", onScrollDock, { passive: true });
    check();
  }

  function remeasure() {
    placeIndicator(true);
    if (cm && !cm.flying) cm.measure(true);
  }

  initNavIndicator();
  setupPage();
  document.addEventListener("pagechange", function () { setupPage(); placeIndicator(false); });
  document.addEventListener("langchange", remeasure);
  window.addEventListener("resize", remeasure, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  window.addEventListener("load", remeasure);
})();
