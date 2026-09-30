/* ===========================================================
   Arthur Renard — sound: music toggle, mini player, UI clicks, toasts
   A sound button in the nav opens a menu of toggles. Turning Music on
   plays a royalty-free loop ("Hooligans" by Michael Ramir C., Mixkit free
   license) and the button grows into a mini player: play/pause that
   morphs, a draggable progress bar, and volume in the menu. Interface
   sounds are tiny synthesized clicks (no audio files). Nothing ever
   autoplays; preferences persist in localStorage.
   =========================================================== */
(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  if (!nav || !window.Motion) return;
  var M = window.Motion, Spring = M.Spring;

  var TRACK = { src: "music/hooligans.m4a", title: "Hooligans", artist: "Michael Ramir C." };
  // The saved position is per track, so switching songs never resumes mid-way.
  var KEY = { music: "snd-music", vol: "snd-vol", ui: "snd-ui", time: "snd-time:" + TRACK.src };

  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function put(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) {} }
  function t(key, fallback) { return window.SiteI18n && window.SiteI18n.t ? window.SiteI18n.t(key, fallback) : fallback; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  var state = {
    enabled: get(KEY.music, "0") === "1",   // player shown
    playing: false,
    vol: clamp(parseFloat(get(KEY.vol, "0.6")) || 0.6, 0, 1),
    ui: get(KEY.ui, "0") === "1",
  };

  /* ---------------- Audio engine ---------------- */
  var audio = null, ctx = null, musicGain = null, uiBus = null, restored = false;

  function ensureCtx() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
      uiBus = ctx.createGain();
      uiBus.gain.value = 0.7;
      uiBus.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function ensureAudio() {
    if (audio) return audio;
    audio = new Audio();
    audio.preload = "none";
    audio.loop = true;
    audio.src = TRACK.src;
    audio.addEventListener("error", function () {
      if (!state.enabled) return;
      setPlaying(false);
      toast(t("toastMusicError", "Couldn't load the music"));
    });
    audio.addEventListener("loadedmetadata", function () {
      if (restored) return;
      restored = true;
      var saved = parseFloat(get(KEY.time, "0")) || 0;
      if (saved > 0 && saved < audio.duration) audio.currentTime = saved;
    });
    // Route through a GainNode: fades, and volume on iOS (which ignores audio.volume).
    if (ensureCtx()) {
      try {
        var src = ctx.createMediaElementSource(audio);
        musicGain = ctx.createGain();
        musicGain.gain.value = 0;
        src.connect(musicGain);
        musicGain.connect(ctx.destination);
      } catch (e) { musicGain = null; }
    }
    return audio;
  }

  function level() { return state.vol * state.vol; }   // perceptual curve

  function rampTo(v, secs) {
    if (musicGain && ctx) {
      var now = ctx.currentTime, g = musicGain.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(v, now + secs);
    } else if (audio) {
      audio.volume = clamp(v, 0, 1);
    }
  }

  var pauseT = null;
  function setPlaying(on) {
    clearTimeout(pauseT);
    if (on) {
      ensureAudio();
      ensureCtx();
      var p = audio.play();
      state.playing = true;
      rampTo(0, 0);
      rampTo(level(), 0.8);
      if (p && p.catch) p.catch(function () {
        state.playing = false;
        render();
        toast(t("toastMusicError", "Couldn't start the music"));
      });
    } else if (audio) {
      state.playing = false;
      rampTo(0, 0.25);
      pauseT = setTimeout(function () { audio.pause(); saveTime(); }, 270);
    } else {
      state.playing = false;
    }
    root.classList.toggle("playing", state.playing);
    render();
    if (state.playing) progressLoop();
  }

  function saveTime() { if (audio && audio.currentTime) put(KEY.time, audio.currentTime.toFixed(1)); }
  setInterval(function () { if (state.playing) saveTime(); }, 5000);
  window.addEventListener("pagehide", saveTime);

  /* ---------------- Interface sounds (synthesized) ---------------- */
  function tone(f1, f2, dur, peak, delay) {
    var c = ensureCtx();
    if (!c) return;
    var start = c.currentTime + (delay || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f1, start);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, start + dur);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g);
    g.connect(uiBus);
    o.start(start);
    o.stop(start + dur + 0.02);
  }

  function whoosh() {
    var c = ensureCtx();
    if (!c) return;
    var len = Math.floor(c.sampleRate * 0.4), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), s = c.currentTime;
    n.buffer = buf;
    f.type = "bandpass";
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(350, s);
    f.frequency.exponentialRampToValueAtTime(2200, s + 0.35);
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(0.05, s + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, s + 0.4);
    n.connect(f); f.connect(g); g.connect(uiBus);
    n.start(s);
  }

  var FX = {
    tick:   function () { tone(1600, 1150, 0.05, 0.045); },
    open:   function () { tone(560, 840, 0.09, 0.05); },
    close:  function () { tone(840, 560, 0.08, 0.04); },
    on:     function () { tone(660, 0, 0.07, 0.05); tone(990, 0, 0.09, 0.05, 0.06); },
    off:    function () { tone(990, 0, 0.07, 0.045); tone(660, 0, 0.09, 0.045, 0.06); },
    whoosh: whoosh,
  };
  function fx(name, force) { if ((state.ui || force) && FX[name]) FX[name](); }

  // Soft tick on every link/button press that doesn't make its own sound.
  document.addEventListener("click", function (e) {
    if (!state.ui) return;
    var el = e.target.closest && e.target.closest("a[href], button, [role='slider']");
    if (!el || el.closest(".cm") || el.classList.contains("sw") || el.closest(".snd")) return;
    fx("tick");
  }, true);

  /* ---------------- Toasts ---------------- */
  var stack = document.createElement("div");
  stack.className = "toasts";
  stack.setAttribute("role", "status");
  stack.setAttribute("aria-live", "polite");
  document.body.appendChild(stack);

  function toast(text) {
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="toast-dot" aria-hidden="true"></span><span class="toast-text"></span>';
    el.querySelector(".toast-text").textContent = text;
    stack.appendChild(el);
    while (stack.children.length > 3) stack.removeChild(stack.firstChild);
    var y = new Spring(18, "smooth"), p = new Spring(0, "fade");
    y.set(0); p.set(1);
    var leaving = false;
    setTimeout(function () { leaving = true; y.set(-8); p.set(0); kick(); }, 2800);
    function draw(tm) {
      if (!el.isConnected) return false;
      el.style.transform = "translateY(" + y.value(tm).toFixed(2) + "px)";
      M.presence(el, p.value(tm));
      if (leaving && p.done(tm, 0.001)) { el.parentNode && el.parentNode.removeChild(el); return false; }
      return !(y.done(tm) && p.done(tm, 0.001));
    }
    var stop = null;
    function kick() { if (stop) stop(); draw(M.now()); stop = M.run(draw); }
    kick();
  }

  /* ---------------- Markup ---------------- */
  var ICON_PP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="pp1"></path><path class="pp2"></path></svg>';
  var root = document.createElement("div");
  root.className = "snd";
  root.innerHTML =
    '<div class="snd-pill">' +
      '<div class="snd-player">' +
        '<button class="snd-play" type="button">' + ICON_PP + '</button>' +
        '<div class="snd-meta">' +
          '<span class="snd-title"></span>' +
          '<div class="snd-bar" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
            '<span class="snd-bar-track"><span class="snd-bar-fill"></span></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="snd-btn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="sndMenu">' +
        '<span class="snd-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
      '</button>' +
    '</div>' +
    '<div class="snd-menu" id="sndMenu" role="dialog">' +
      '<div class="snd-row">' +
        '<span class="snd-row-text"><span class="snd-row-title" data-i18n="sndMusic">Music</span><span class="snd-row-sub"></span></span>' +
        '<button class="sw" type="button" role="switch" aria-checked="false" data-sw="music"><span class="sw-fill"></span><span class="sw-knob"></span></button>' +
      '</div>' +
      '<div class="snd-row snd-vol-row">' +
        '<span class="snd-row-title" data-i18n="sndVolume">Volume</span>' +
        '<div class="vol" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><span class="vol-track"><span class="vol-fill"></span><span class="vol-knob"></span></span></div>' +
      '</div>' +
      '<div class="snd-row">' +
        '<span class="snd-row-text"><span class="snd-row-title" data-i18n="sndUi">Interface sounds</span><span class="snd-row-sub" data-i18n="sndUiSub">Soft clicks on buttons</span></span>' +
        '<button class="sw" type="button" role="switch" aria-checked="false" data-sw="ui"><span class="sw-fill"></span><span class="sw-knob"></span></button>' +
      '</div>' +
      '<p class="snd-credit"><span data-i18n="sndCredit">Music</span>: <span class="snd-credit-track"></span> · ' +
        '<a href="https://mixkit.co/free-stock-music/" target="_blank" rel="noopener">Mixkit</a></p>' +
    '</div>';
  nav.insertBefore(root, nav.querySelector(".nav-toggle"));

  var pill = root.querySelector(".snd-pill");
  var player = root.querySelector(".snd-player");
  var playBtn = root.querySelector(".snd-play");
  var bar = root.querySelector(".snd-bar");
  var barFill = root.querySelector(".snd-bar-fill");
  var btn = root.querySelector(".snd-btn");
  var menu = root.querySelector(".snd-menu");
  var vol = root.querySelector(".vol");
  var volFill = root.querySelector(".vol-fill");
  var volKnob = root.querySelector(".vol-knob");
  var volTrack = root.querySelector(".vol-track");
  var pp1 = root.querySelector(".pp1"), pp2 = root.querySelector(".pp2");
  root.querySelector(".snd-title").textContent = TRACK.title;
  root.querySelector(".snd-row-sub").textContent = TRACK.title + " · " + TRACK.artist;
  root.querySelector(".snd-credit-track").textContent = "“" + TRACK.title + "” · " + TRACK.artist;
  if (window.SiteI18n && window.SiteI18n.refresh) window.SiteI18n.refresh(root);

  function labels() {
    btn.setAttribute("aria-label", t("sndSettings", "Sound settings"));
    menu.setAttribute("aria-label", t("sndSettings", "Sound settings"));
    playBtn.setAttribute("aria-label", state.playing ? t("sndPause", "Pause music") : t("sndPlay", "Play music"));
    bar.setAttribute("aria-label", t("sndSeek", "Song position"));
    vol.setAttribute("aria-label", t("sndVolume", "Volume"));
    root.querySelector('[data-sw="music"]').setAttribute("aria-label", t("sndMusic", "Music"));
    root.querySelector('[data-sw="ui"]').setAttribute("aria-label", t("sndUi", "Interface sounds"));
  }
  document.addEventListener("langchange", function () { labels(); measure(); });
  var resizeT = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(measure, 120);
  }, { passive: true });

  /* ---------------- Springs + rendering ---------------- */
  var pillW = new Spring(40, "smooth"), playerP = new Spring(0, "fade");
  var ppMorph = new Spring(1, "snappy");          // 1 = play triangle, 0 = pause bars
  var menuP = new Spring(0, "fade"), menuY = new Spring(-6, "smooth");
  var volStretch = new Spring(0, "snappy");
  var switches = Array.prototype.map.call(root.querySelectorAll(".sw"), function (el) {
    return { el: el, fill: el.querySelector(".sw-fill"), knob: el.querySelector(".sw-knob"),
             l: new Spring(3, "snappy"), r: new Spring(23, "snappy"), p: new Spring(0, "fade") };
  });
  var menuOpen = false, busy = false, dragVol = null;

  var PAUSE = [[[6, 5], [10, 5], [10, 19], [6, 19]], [[14, 5], [18, 5], [18, 19], [14, 19]]];
  var PLAY = [[[7, 4.5], [13, 8.1], [13, 15.9], [7, 19.5]], [[13, 8.1], [19.5, 12], [19.5, 12], [13, 15.9]]];
  function shape(k, p) {
    var a = PAUSE[k], b = PLAY[k];
    return "M" + a.map(function (pt, i) {
      return (pt[0] + (b[i][0] - pt[0]) * p).toFixed(2) + " " + (pt[1] + (b[i][1] - pt[1]) * p).toFixed(2);
    }).join(" L") + " Z";
  }

  // Pill widths: just the button, or the player plus the button (plus the pill's border).
  function widths() {
    var edge = pill.offsetWidth - pill.clientWidth;
    return { closed: btn.offsetWidth + edge, open: player.scrollWidth + btn.offsetWidth + edge };
  }

  function measure() {
    var w = widths();
    pillW.set(state.enabled ? w.open : w.closed);
    render();
  }

  function draw(tm) {
    pill.style.width = pillW.value(tm).toFixed(2) + "px";
    M.presence(player, playerP.value(tm));
    var p = clamp(ppMorph.value(tm), -0.1, 1.1);
    pp1.setAttribute("d", shape(0, p));
    pp2.setAttribute("d", shape(1, p));
    var mp = menuP.value(tm);
    M.presence(menu, mp);
    menu.style.transform = "translateY(" + menuY.value(tm).toFixed(2) + "px)";
    menu.style.pointerEvents = menuOpen ? "auto" : "none";
    switches.forEach(function (s) {
      var l = s.l.value(tm), r = s.r.value(tm);
      s.knob.style.transform = "translateX(" + l.toFixed(2) + "px)";
      s.knob.style.width = Math.max(10, r - l).toFixed(2) + "px";
      s.fill.style.opacity = clamp(s.p.value(tm), 0, 1).toFixed(3);
    });
    var st = volStretch.value(tm);
    volTrack.style.left = Math.min(0, st).toFixed(2) + "px";
    volTrack.style.right = (-Math.max(0, st)).toFixed(2) + "px";
    drawVolume();
    var springs = [pillW, menuY, volStretch].concat(switches.reduce(function (a, s) { return a.concat([s.l, s.r]); }, []));
    var fades = [playerP, ppMorph, menuP].concat(switches.map(function (s) { return s.p; }));
    return !!dragVol || !(springs.every(function (s) { return s.done(tm); }) && fades.every(function (s) { return s.done(tm, 0.001); }));
  }

  function render() {
    draw(M.now());
    if (busy) return;
    busy = true;
    M.run(function (tm) { busy = draw(tm); return busy; });
  }

  function drawVolume() {
    var pct = state.vol * 100;
    volFill.style.width = pct + "%";
    volKnob.style.left = pct + "%";
    vol.setAttribute("aria-valuenow", Math.round(pct));
    vol.setAttribute("aria-valuetext", Math.round(pct) + "%");
  }

  var progRunning = false;
  function progressLoop() {
    if (progRunning) return;
    progRunning = true;
    M.run(function () {
      if (audio && audio.duration) {
        var pct = (audio.currentTime / audio.duration) * 100;
        if (!dragSeek) barFill.style.width = pct.toFixed(2) + "%";
        bar.setAttribute("aria-valuenow", Math.round(pct));
        var s = Math.floor(audio.currentTime);
        bar.setAttribute("aria-valuetext", Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2));
      }
      progRunning = state.playing;
      return progRunning;
    });
  }

  function setSwitch(name, on, instant) {
    var s = switches.filter(function (x) { return x.el.getAttribute("data-sw") === name; })[0];
    s.el.setAttribute("aria-checked", on ? "true" : "false");
    var l = on ? 21 : 3, r = on ? 41 : 23;
    if (instant) { s.l.jump(l); s.r.jump(r); s.p.jump(on ? 1 : 0); }
    else {
      // the leading edge races ahead; the knob stretches, then catches up
      s.l.tune(on ? "lazy" : "snappy").set(l);
      s.r.tune(on ? "snappy" : "lazy").set(r);
      s.p.set(on ? 1 : 0);
    }
  }

  function syncUI(instant) {
    root.classList.toggle("enabled", state.enabled);
    root.classList.toggle("playing", state.playing);
    vol.setAttribute("aria-disabled", state.enabled ? "false" : "true");
    setSwitch("music", state.enabled, instant);
    setSwitch("ui", state.ui, instant);
    var w = widths();
    if (instant) {
      pillW.jump(state.enabled ? w.open : w.closed);
      playerP.jump(state.enabled ? 1 : 0);
      ppMorph.jump(state.playing ? 0 : 1);
    } else {
      pillW.set(state.enabled ? w.open : w.closed);
      playerP.set(state.enabled ? 1 : 0, state.enabled ? 120 : 0);
      ppMorph.set(state.playing ? 0 : 1);
    }
    player.toggleAttribute("inert", !state.enabled);
    labels();
    render();
  }

  /* ---------------- Controls ---------------- */
  function setEnabled(on) {
    state.enabled = on;
    put(KEY.music, on ? "1" : "0");
    setPlaying(on);
    syncUI();
    fx(on ? "on" : "off");
    toast(on ? t("toastNowPlaying", "Now playing") + " · " + TRACK.title + " — " + TRACK.artist
             : t("toastMusicOff", "Music off"));
  }

  function setMenu(open) {
    if (menuOpen === open) return;
    menuOpen = open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    menuP.set(open ? 1 : 0);
    menuY.set(open ? 0 : -6);
    fx(open ? "open" : "close");
    render();
  }

  btn.addEventListener("click", function (e) { e.stopPropagation(); setMenu(!menuOpen); });
  document.addEventListener("pointerdown", function (e) { if (menuOpen && !root.contains(e.target)) setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuOpen) { setMenu(false); btn.focus(); }
  });
  document.addEventListener("pagechange", function () { setMenu(false); });

  root.querySelector('[data-sw="music"]').addEventListener("click", function () { setEnabled(!state.enabled); });
  root.querySelector('[data-sw="ui"]').addEventListener("click", function () {
    state.ui = !state.ui;
    put(KEY.ui, state.ui ? "1" : "0");
    syncUI();
    fx(state.ui ? "on" : "off", true);
    toast(state.ui ? t("toastUiOn", "Interface sounds on") : t("toastUiOff", "Interface sounds off"));
  });

  playBtn.addEventListener("click", function () {
    setPlaying(!state.playing);
    syncUI();
    fx("tick");
  });

  // Seek bar: direct manipulation while held.
  var dragSeek = false;
  function seekTo(clientX) {
    var r = bar.getBoundingClientRect();
    var f = clamp((clientX - r.left) / r.width, 0, 1);
    barFill.style.width = (f * 100).toFixed(2) + "%";
    ensureAudio();
    if (audio.duration) audio.currentTime = f * audio.duration;
  }
  bar.addEventListener("pointerdown", function (e) {
    dragSeek = true;
    try { bar.setPointerCapture(e.pointerId); } catch (err) {}
    seekTo(e.clientX);
  });
  bar.addEventListener("pointermove", function (e) { if (dragSeek) seekTo(e.clientX); });
  bar.addEventListener("pointerup", function () { dragSeek = false; saveTime(); });
  bar.addEventListener("pointercancel", function () { dragSeek = false; });
  bar.addEventListener("keydown", function (e) {
    if (!audio || !audio.duration) return;
    var step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 5 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -5 : 0;
    if (!step) return;
    e.preventDefault();
    audio.currentTime = clamp(audio.currentTime + step, 0, audio.duration - 0.1);
    progressLoop();
  });

  // Volume: drag past either end and the track stretches (rubber band),
  // then springs back from wherever it was on release.
  function rubber(d) { return 26 * (1 - 1 / (Math.abs(d) / 70 + 1)) * (d < 0 ? -1 : 1); }
  function setVol(v) {
    state.vol = clamp(v, 0, 1);
    put(KEY.vol, state.vol.toFixed(2));
    if (state.playing) rampTo(level(), 0.08);
  }
  vol.addEventListener("pointerdown", function (e) {
    if (!state.enabled) return;
    try { vol.setPointerCapture(e.pointerId); } catch (err) {}
    dragVol = { id: e.pointerId };
    moveVol(e.clientX);
    render();
  });
  function moveVol(clientX) {
    var r = vol.getBoundingClientRect();          // the unstretched slider box
    var raw = (clientX - r.left) / r.width;
    setVol(raw);
    var over = raw > 1 ? (raw - 1) * r.width : raw < 0 ? raw * r.width : 0;
    volStretch.jump(rubber(over));
  }
  vol.addEventListener("pointermove", function (e) { if (dragVol) moveVol(e.clientX); });
  function endVol() { if (!dragVol) return; dragVol = null; volStretch.set(0); render(); }
  vol.addEventListener("pointerup", endVol);
  vol.addEventListener("pointercancel", endVol);
  vol.addEventListener("keydown", function (e) {
    if (!state.enabled) return;
    var d = { ArrowRight: 0.05, ArrowUp: 0.05, ArrowLeft: -0.05, ArrowDown: -0.05 }[e.key];
    if (e.key === "Home") d = -1;
    if (e.key === "End") d = 1;
    if (d === undefined) return;
    e.preventDefault();
    setVol(state.vol + d);
    render();
  });

  /* ---------------- Start ---------------- */
  syncUI(true);
  menuP.jump(0);
  render();
  if (state.enabled) {
    // Browsers block autoplay after a reload: show the player paused and say so.
    setTimeout(function () { toast(t("toastResume", "Music was on · press play to resume")); }, 900);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { syncUI(true); });

  window.SiteSound = { fx: fx, toast: toast };
  window.SiteToast = { show: toast };
})();
