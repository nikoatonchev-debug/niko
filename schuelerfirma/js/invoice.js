// Rechnung zu einer Shop-Bestellung. Die Rechnung wird aus der gespeicherten
// Bestellung erzeugt (Preise, Namen und Mengen kommen von dort) – sie sieht
// also immer gleich aus, egal ob Kund:in oder Admin sie öffnet.
const SFInvoice = (function () {
  const esc = (s) => SF.escapeHtml(s);
  const SELLER = {
    name: "Erdkinderkollektiv",
    sub: "Siebdruck-Schülerfirma der Montessori-Schule Dietramszell",
    address: ["Klosterplatz 1", "83623 Dietramszell"],
    email: "erdkinderkollektiv@gmail.com",
  };

  // Rechnungsnummer: Jahr der Bestellung + Bestellnummer, z. B. R-2026-AB12CD
  function number(o) {
    const d = o.date ? new Date(o.date) : new Date();
    return `R-${d.getFullYear()}-${String(o.id || "").slice(-6).toUpperCase()}`;
  }

  function html(o) {
    const items = o.items || [];
    const rows = items
      .map((i, n) => {
        const details = [`Größe ${i.size}`].concat(i.color ? [`Farbe ${i.color}`] : []).join(", ");
        return `<tr>
          <td>${n + 1}</td>
          <td><strong>${esc(i.name)}</strong><br><span class="inv-muted">${esc(details)}</span></td>
          <td class="num">${Number(i.qty)}</td>
          <td class="num">${SF.formatPrice(i.price)}</td>
          <td class="num">${SF.formatPrice(Number(i.price) * Number(i.qty))}</td>
        </tr>`;
      })
      .join("");
    return `
    <article class="invoice">
      <header class="inv-top">
        <div class="inv-logo"><img src="images/erdkinderkollektiv-logo.png" alt="Logo Erdkinderkollektiv"></div>
        <div class="inv-seller">
          <strong>${esc(SELLER.name)}</strong><br>${esc(SELLER.sub)}<br>
          ${SELLER.address.map(esc).join("<br>")}<br>${esc(SELLER.email)}
        </div>
      </header>
      <div class="inv-title"><span></span><h2>Rechnung</h2><span></span></div>
      <div class="inv-boxes">
        <section class="inv-box">
          <h3>Kunde</h3>
          Name: ${esc(o.customerName || "")}<br>
          ${o.klasse ? `Klasse: ${esc(o.klasse)}<br>` : ""}
          ${o.phone ? `Telefon: ${esc(o.phone)}` : ""}
        </section>
        <section class="inv-box inv-box-strong">
          Rechnungsnr.: <strong>${esc(number(o))}</strong><br>
          Datum: ${SF.formatDate(o.date, true)}<br>
          Bestellnr.: #${esc(String(o.id || "").slice(-6).toUpperCase())}<br>
          Verkäufer: ${esc(SELLER.name)}
        </section>
      </div>
      <table class="inv-table">
        <thead><tr><th>Pos.</th><th>Bezeichnung</th><th class="num">Menge</th><th class="num">Preis</th><th class="num">Gesamt</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td colspan="4" class="num">Gesamtbetrag</td><td class="num">${SF.formatPrice(o.total)}</td></tr></tfoot>
      </table>
      <p class="inv-pay">Zahlung: <strong>bar bei der Abholung</strong> (freitags ab 11 Uhr bei der alten Apotheke).</p>
      <footer class="inv-thanks">Vielen Dank für Ihre Bestellung.<br>Das Erdkinderkollektiv</footer>
    </article>`;
  }

  return { number, html, SELLER };
})();
