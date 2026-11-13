// Von admin.html aus geöffnet (?admin=1 oder ?alle=1): dieselbe Anmeldung wie im
// Admin-Bereich verwenden, die nur in diesem Browser-Tab gilt. Muss vor db.js laden.
(function () {
  const q = new URLSearchParams(location.search);
  if (q.get("admin") === "1" || q.get("alle") === "1") document.body.setAttribute("data-auth-persistence", "session");
})();
