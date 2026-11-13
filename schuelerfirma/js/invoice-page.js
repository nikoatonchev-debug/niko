// Seite rechnung.html
//   ?id=<Bestell-ID>  eine Rechnung (Kund:in: nur eigene, Admin: alle)
//   ?alle=1           alle Rechnungen untereinander (nur Admin) – zum Speichern als eine PDF
//   &drucken=1        Druckfenster gleich öffnen
(function () {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "";
  const all = params.get("alle") === "1";
  const autoPrint = params.get("drucken") === "1";
  let shown = false;

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
    if (all || params.get("admin") === "1") document.getElementById("invoice-back").href = "admin.html";
    out.innerHTML = `<p class="hint">Rechnung wird geladen …</p>`;
    try {
      let orders;
      if (all) {
        orders = await SFDB.getAllOrders();
        if (!orders.length) {
          out.innerHTML = `<p class="hint">Es gibt noch keine Rechnungen.</p>`;
          return;
        }
        document.title = `Rechnungen ${new Date().toLocaleDateString("de-DE")} – Erdkinderkollektiv`;
      } else {
        if (!/^[A-Za-z0-9]{1,64}$/.test(id)) throw new Error("Diese Rechnung gibt es nicht.");
        const o = await SFDB.getOrder(id);
        if (!o) throw new Error("Diese Rechnung gibt es nicht.");
        orders = [o];
        document.title = `Rechnung ${SFInvoice.number(o)} – Erdkinderkollektiv`; // = Dateiname beim Speichern als PDF
        if (o.invoiceByEmail && !isAdmin) {
          message("Diese Rechnung haben wir dir auch per E-Mail geschickt. Schau auch im Spam-Ordner nach.", "success");
        }
      }
      out.innerHTML = orders.map(SFInvoice.html).join("");
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
