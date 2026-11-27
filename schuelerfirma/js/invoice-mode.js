// Von admin.html aus geöffnet (?admin=1, ?alle=1 oder ?manuell=…): dieselbe Anmeldung wie im
// Admin-Bereich verwenden, die nur in diesem Browser-Tab gilt. Muss vor db.js laden.
(function () {
  const q = new URLSearchParams(location.search);
  if (q.get("admin") === "1" || q.get("alle") === "1" || q.get("manuell")) document.body.setAttribute("data-auth-persistence", "session");
})();
