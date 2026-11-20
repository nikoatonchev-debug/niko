// Seite rechnung.html
//   ?id=<Bestell-ID>  eine Rechnung (Kund:in: nur eigene, Admin: alle)
//   ?manuell=<ID>     selbst erstellte Rechnung (nur Admin)
//   ?alle=1           alle Rechnungen untereinander (nur Admin) – zum Speichern als eine PDF
//   &drucken=1        Druckfenster gleich öffnen
(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "";
  const manualId = params.get("manuell") || "";
  const all = params.get("alle") === "1";
  const autoPrint = params.get("drucken") === "1";
  let shown = false;

  // Fortlaufende Nummern zuerst (aufsteigend), ältere Rechnungen ohne Nummer danach
  function sortKey(r) {
    const n = Number(r.number);
    return Number.isFinite(n) ? n : 1e9 + new Date(r.date || 0).getTime() / 1e3;
  }

  function message(text, type) {
    SFUI.showMessage(document.getElementById("invoice-message"), text, type || "error");
  }

  async function show() {
    const user = SFDB.currentUser();
    const loginHint = document.getElementById("invoice-login-hint");
    if (!user || !user.emailVerified) {
      loginHint.classList.remove("hidden");
      return;
    }
    loginHint.classList.add("hidden");
    if (shown) return;
    const out = document.getElementById("invoice-out");
    const isAdmin = user.isAdmin;
    if (all || manualId || params.get("admin") === "1") document.getElementById("invoice-back").href = "admin.html";
    out.innerHTML = `<p class="hint">Rechnung wird geladen …</p>`;
    try {
      let models;
      if (all) {
        const [orders, manual] = await Promise.all([
          SFDB.getAllOrders(),
          SFDB.invoicesLive() ? SFDB.getManualInvoices() : Promise.resolve([]),
        ]);
        models = orders
          .map(SFInvoice.fromOrder)
          .concat(manual.filter((m) => m.kind === "manuell").map(SFInvoice.fromManual))
          .sort((a, b) => sortKey(a) - sortKey(b));
        if (!models.length) {
          out.innerHTML = `<p class="hint">Es gibt noch keine Rechnungen.</p>`;
          return;
        }
        document.title = `Rechnungen ${SF.formatDate(SF.now().toISOString(), true)} – Erdkinderkollektiv`;
      } else if (manualId) {
        if (!/^[A-Za-z0-9]{1,64}$/.test(manualId)) throw new Error("Diese Rechnung gibt es nicht.");
        const m = await SFDB.getManualInvoice(manualId);
        if (!m || m.kind !== "manuell") throw new Error("Diese Rechnung gibt es nicht.");
        models = [SFInvoice.fromManual(m)];
        document.title = `Rechnung ${models[0].number} – Erdkinderkollektiv`;
      } else {
        if (!/^[A-Za-z0-9]{1,64}$/.test(id)) throw new Error("Diese Rechnung gibt es nicht.");
        const o = await SFDB.getOrder(id);
        if (!o) throw new Error("Diese Rechnung gibt es nicht.");
        models = [SFInvoice.fromOrder(o)];
        document.title = `Rechnung ${SFInvoice.number(o)} – Erdkinderkollektiv`; // = Dateiname beim Speichern als PDF
        if (o.invoiceByEmail && !isAdmin) {
          message("Diese Rechnung haben wir dir auch per E-Mail geschickt. Schau auch im Spam-Ordner nach.", "success");
        }
      }
      out.innerHTML = models.map(SFInvoice.render).join("");
      shown = true;
      document.getElementById("invoice-print").classList.remove("hidden");
      document.getElementById("invoice-print-hint").classList.remove("hidden");
      if (autoPrint) setTimeout(() => window.print(), 400);
    } catch (e) {
      out.innerHTML = "";
      message(e.userMessage || (e.code ? SFDB.errorMessage(e) : e.message));
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("invoice-print").addEventListener("click", () => window.print());
    document.getElementById("invoice-login-btn").addEventListener("click", () => SFAuth.requireLogin(show));
    await SFDB.ready;
    show();
    SFDB.onAuthChange(() => show());
  });
})();
