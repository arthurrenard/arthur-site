/* ===========================================================
   Arthur Renard — contact form (Connect page)
   Posts to Web3Forms so the owner's email is NEVER in the page.
   Replace ACCESS_KEY below with the key from https://web3forms.com
   (enter your email once, they email you a key). Visitors only ever
   see the form; your address appears nowhere in the source.
   =========================================================== */
(function () {
  "use strict";

  // ⬇⬇⬇  PASTE YOUR WEB3FORMS ACCESS KEY BETWEEN THE QUOTES  ⬇⬇⬇
  var ACCESS_KEY = "580759ce-354a-4c1d-9dcb-ab746e13eb9e";
  // ⬆⬆⬆  (looks like: 1a2b3c4d-5e6f-7890-abcd-ef1234567890)     ⬆⬆⬆

  var form = document.getElementById("contactForm");
  if (!form) return;

  var status = form.querySelector(".form-status");
  var button = form.querySelector('button[type="submit"]');
  var btnLabel = button.querySelector(".btn-label");

  function t(key, fallback) {
    // Pull a localized string from the i18n layer if present, else fallback.
    try {
      if (window.SiteI18n && typeof window.SiteI18n.str === "function") {
        var s = window.SiteI18n.str(key);
        if (s) return s;
      }
    } catch (e) {}
    return fallback;
  }

  function setStatus(kind, msg) {
    status.textContent = msg;
    status.className = "form-status show " + kind;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot: real users never fill this hidden field.
    if (form.botcheck && form.botcheck.checked) return;

    if (!ACCESS_KEY || ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
      setStatus("error", t("formNotConfigured",
        "The form isn't connected yet. In the meantime, please reach me on LinkedIn."));
      return;
    }

    var data = {
      access_key: ACCESS_KEY,
      subject: "New message from arthur-renard.com",
      from_name: "arthur-renard.com",
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };

    button.disabled = true;
    if (btnLabel) btnLabel.textContent = t("formSending", "Sending…");
    setStatus("pending", "");

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.success) {
          form.reset();
          setStatus("success", t("formSuccess",
            "Thanks — your message is on its way. I'll get back to you soon."));
        } else {
          setStatus("error", t("formError",
            "Something went wrong. Please try again, or reach me on LinkedIn."));
        }
      })
      .catch(function () {
        setStatus("error", t("formError",
          "Something went wrong. Please try again, or reach me on LinkedIn."));
      })
      .finally(function () {
        button.disabled = false;
        if (btnLabel) btnLabel.textContent = t("formSend", "Send message");
      });
  });
})();
