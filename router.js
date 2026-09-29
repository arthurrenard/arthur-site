/* ===========================================================
   Arthur Renard — in-place page navigation
   Internal links swap the content between the nav and the footer
   (and the footer itself) instead of loading a new document, so the
   nav, the music player and anything playing survive a page change.
   Back/forward work, each page's own scripts re-run on arrival, and
   any failure falls back to a normal navigation.
   =========================================================== */
(function () {
  "use strict";

  if (!window.fetch || !window.DOMParser || !window.history || !history.pushState) return;

  var PAGES = ["index.html", "about.html", "work.html", "connect.html"];
  // Scripts that live for the whole visit. Anything else a page loads
  // (contact form, orbit widget, guitar gallery) re-runs on arrival.
  var CORE = ["image-slot.js", "app.js", "i18n.js", "router.js", "motion.js", "morph.js", "sound.js"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cache = {};
  var busy = false;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function fileOf(pathname) { return pathname.split("/").pop() || "index.html"; }
  function isPage(url) { return url.origin === location.origin && PAGES.indexOf(fileOf(url.pathname)) !== -1; }
  function scriptName(src) { return fileOf(new URL(src, location.href).pathname); }

  function fetchPage(url) {
    var key = url.pathname;
    if (!cache[key]) {
      // no-cache = revalidate (a cheap 304 when unchanged), so a returning
      // visitor never gets a stale page from the HTTP cache.
      cache[key] = fetch(key, { credentials: "same-origin", cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      });
      cache[key].catch(function () { delete cache[key]; });
    }
    return cache[key];
  }

  // Everything between the nav and the footer (main, plus page-level
  // extras such as the About page's lightbox), and the footer itself.
  function region(doc) {
    var nav = doc.querySelector("nav.nav");
    var foot = doc.querySelector("footer.site-footer");
    if (!nav || !foot || nav.parentNode !== foot.parentNode) return null;
    var nodes = [];
    for (var n = nav.nextSibling; n && n !== foot; n = n.nextSibling) nodes.push(n);
    return { nodes: nodes, footer: foot };
  }

  function syncHead(doc) {
    document.title = doc.title;
    [["name", "description"], ["property", "og:title"], ["property", "og:description"],
     ["property", "og:url"], ["property", "og:type"]].forEach(function (m) {
      var sel = "meta[" + m[0] + '="' + m[1] + '"]';
      var from = doc.head.querySelector(sel), to = document.head.querySelector(sel);
      if (from && to) to.setAttribute("content", from.getAttribute("content"));
    });
    var fromC = doc.head.querySelector('link[rel="canonical"]');
    var toC = document.head.querySelector('link[rel="canonical"]');
    if (fromC && toC) toC.setAttribute("href", fromC.getAttribute("href"));
  }

  function swap(doc) {
    var next = region(doc), cur = region(document);
    if (!next || !cur) throw new Error("unexpected page structure");
    cur.nodes.forEach(function (n) { n.parentNode.removeChild(n); });
    var frag = document.createDocumentFragment();
    // importNode (not adoptNode) so <image-slot> elements upgrade on insert
    next.nodes.forEach(function (n) { frag.appendChild(document.importNode(n, true)); });
    cur.footer.parentNode.insertBefore(frag, cur.footer);
    cur.footer.parentNode.replaceChild(document.importNode(next.footer, true), cur.footer);
    document.body.classList.remove("glb-lock");
    syncHead(doc);
  }

  function runPageScripts(doc) {
    Array.prototype.forEach.call(document.querySelectorAll("script[data-page-script]"), function (s) {
      s.parentNode.removeChild(s);
    });
    Array.prototype.forEach.call(doc.querySelectorAll("body script[src]"), function (old) {
      var src = old.getAttribute("src");
      if (CORE.indexOf(scriptName(src)) !== -1) return;
      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.setAttribute("data-page-script", "");
      document.body.appendChild(s);
    });
  }

  function mainEl() { return document.querySelector("main"); }

  function leave() {
    var m = mainEl();
    if (reduce || !m || !m.animate) return Promise.resolve();
    var a = m.animate(
      [{ opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
       { opacity: 0, transform: "translateY(-10px)", filter: "blur(6px)" }],
      { duration: 180, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" });
    // Never let a paused animation (background tab, frozen preview) block navigation.
    return Promise.race([a.finished.catch(function () {}), new Promise(function (r) { setTimeout(r, 260); })]);
  }

  function enter() {
    var m = mainEl();
    if (reduce || !m || !m.animate) return;
    m.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
  }

  var live = document.createElement("div");
  live.className = "sr-only";
  live.setAttribute("aria-live", "polite");
  document.body.appendChild(live);

  function arrive(doc, url, y) {
    if (url.hash) {
      var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target) y = target.getBoundingClientRect().top + window.scrollY - 90;
    }
    window.scrollTo({ top: y || 0, left: 0, behavior: "instant" });
    if (window.SiteI18n && window.SiteI18n.refresh) window.SiteI18n.refresh(document.body);
    if (window.SiteApp && window.SiteApp.refresh) window.SiteApp.refresh();
    runPageScripts(doc);
    enter();
    var m = mainEl();
    if (m) {
      m.setAttribute("tabindex", "-1");
      m.focus({ preventScroll: true });
    }
    live.textContent = document.title;
    document.dispatchEvent(new CustomEvent("pagechange", { detail: { page: fileOf(url.pathname) } }));
  }

  // opts.push (default true) adds a history entry; opts.y restores scroll.
  function go(href, opts) {
    opts = opts || {};
    var url = new URL(href, location.href);
    if (!isPage(url)) { location.assign(url.href); return Promise.resolve(); }
    if (busy) return Promise.resolve();
    busy = true;
    // Remember where we were on the page we're leaving (for Back).
    if (opts.push !== false) history.replaceState({ y: window.scrollY }, "", location.href);
    document.dispatchEvent(new CustomEvent("pageleave", { detail: { page: fileOf(url.pathname) } }));
    return Promise.all([fetchPage(url), leave()])
      .then(function (res) {
        var doc = new DOMParser().parseFromString(res[0], "text/html");
        swap(doc);
        if (opts.push !== false) history.pushState({ y: 0 }, "", url.href);
        arrive(doc, url, opts.y);
      })
      .catch(function () { location.assign(url.href); })
      .then(function () { busy = false; });
  }

  // ---- Link interception ----
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
    var url = new URL(a.href, location.href);
    if (!isPage(url)) return;
    if (fileOf(url.pathname) === fileOf(location.pathname)) {
      if (url.hash) return;                        // in-page anchor: browser default
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
      return;
    }
    e.preventDefault();
    go(url.href);
  });

  // Warm the cache on intent so the swap is instant.
  function prefetchFrom(e) {
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var url = new URL(a.href, location.href);
    if (isPage(url) && fileOf(url.pathname) !== fileOf(location.pathname)) fetchPage(url);
  }
  document.addEventListener("pointerover", prefetchFrom, { passive: true });
  document.addEventListener("focusin", prefetchFrom);

  // ---- History ----
  var saveT = null;
  window.addEventListener("scroll", function () {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      history.replaceState({ y: window.scrollY }, "", location.href);
    }, 150);
  }, { passive: true });

  var current = fileOf(location.pathname);
  document.addEventListener("pagechange", function (e) { current = e.detail.page; });

  window.addEventListener("popstate", function (e) {
    var url = new URL(location.href);
    if (!isPage(url) || fileOf(url.pathname) === current) return;   // same page (hash-only entry)
    var y = e.state && typeof e.state.y === "number" ? e.state.y : 0;
    go(url.href, { push: false, y: y });
  });

  history.replaceState({ y: window.scrollY }, "", location.href);
  Array.prototype.forEach.call(document.querySelectorAll("body script[src]"), function (s) {
    if (CORE.indexOf(scriptName(s.getAttribute("src"))) === -1) s.setAttribute("data-page-script", "");
  });

  window.SiteRouter = {
    go: go,
    prefetch: function (href) { var u = new URL(href, location.href); if (isPage(u)) fetchPage(u); },
    page: function () { return fileOf(location.pathname); },
  };
})();
