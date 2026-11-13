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

  // Rechnungsnummer: fortlaufend (1, 2, 3 …). Ältere Bestellungen ohne Nummer:
  // Jahr + Bestellnummer, z. B. R-2026-AB12CD
  function number(o) {
    if (o.invoiceNo) return String(o.invoiceNo);
    const d = o.date ? new Date(o.date) : new Date();
    return `R-${d.getFullYear()}-${String(o.id || "").slice(-6).toUpperCase()}`;
  }

  // Einheitliches Rechnungs-Modell aus einer Shop-Bestellung …
  function fromOrder(o) {
    return {
      number: number(o),
      date: o.date,
      customer: {
        name: o.customerName || "",
        lines: [o.klasse ? `Klasse: ${o.klasse}` : "", o.phone ? `Telefon: ${o.phone}` : ""].filter(Boolean),
      },
      extra: [`Bestellnr.: #${String(o.id || "").slice(-6).toUpperCase()}`],
      items: (o.items || []).map((i) => ({
        name: i.name,
        details: [`Größe ${i.size}`].concat(i.color ? [`Farbe ${i.color}`] : []).join(", "),
        qty: Number(i.qty),
        unit: "Stück",
        price: Number(i.price),
      })),
      total: Number(o.total),
      pay: "bar bei der Abholung (freitags ab 11 Uhr bei der alten Apotheke)",
      note: "",
    };
  }

  // … oder aus einer selbst erstellten Rechnung (Admin-Bereich)
  function fromManual(m) {
    const items = (m.items || []).map((i) => ({
      name: i.name || "",
      details: i.details || "",
      qty: Number(i.qty) || 0,
      unit: i.unit || "Stück",
      price: Number(i.price) || 0,
    }));
    return {
      number: String(m.number || ""),
      date: m.date,
      customer: {
        name: m.customerName || "",
        lines: String(m.address || "")
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean)
          .concat(m.klasse ? [`Klasse: ${m.klasse}`] : [], m.phone ? [`Telefon: ${m.phone}`] : [], m.email ? [`E-Mail: ${m.email}`] : []),
      },
      extra: [],
      items,
      total: items.reduce((n, i) => n + Math.round(i.qty * i.price * 100) / 100, 0),
      pay: m.pay || "",
      note: m.note || "",
    };
  }

  function render(r) {
    const rows = r.items
      .map(
        (i, n) => `<tr>
          <td>${n + 1}</td>
          <td><strong>${esc(i.name)}</strong>${i.details ? `<br><span class="inv-muted">${esc(i.details)}</span>` : ""}</td>
          <td class="num">${esc(String(i.qty))} ${esc(i.unit)}</td>
          <td class="num">${SF.formatPrice(i.price)}</td>
          <td class="num">${SF.formatPrice(i.price * i.qty)}</td>
        </tr>`
      )
      .join("");
    return `
    <article class="invoice">
      <header class="inv-top">
        <div class="inv-logo"><img src="images/logo-erdkinderplan.png" alt="Logo Erdkinderkollektiv"></div>
        <div class="inv-seller">
          <strong>${esc(SELLER.name)}</strong><br>${esc(SELLER.sub)}<br>
          ${SELLER.address.map(esc).join("<br>")}<br>${esc(SELLER.email)}
        </div>
      </header>
      <div class="inv-title"><span></span><h2>Rechnung</h2><span></span></div>
      <div class="inv-boxes">
        <section class="inv-box">
          <h3>Kunde</h3>
          Name: ${esc(r.customer.name)}${r.customer.lines.map((l) => "<br>" + esc(l)).join("")}
        </section>
        <section class="inv-box inv-box-strong">
          Rechnungsnr.: <strong>${esc(r.number)}</strong><br>
          Datum: ${SF.formatDate(r.date, true)}<br>
          ${r.extra.map((l) => esc(l) + "<br>").join("")}
          Verkäufer: ${esc(SELLER.name)}
        </section>
      </div>
      <table class="inv-table">
        <thead><tr><th>Pos.</th><th>Bezeichnung</th><th class="num">Menge</th><th class="num">Preis</th><th class="num">Gesamt</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td colspan="4" class="num">Gesamtbetrag</td><td class="num">${SF.formatPrice(r.total)}</td></tr></tfoot>
      </table>
      ${r.pay ? `<p class="inv-pay">Zahlung: <strong>${esc(r.pay)}</strong></p>` : ""}
      ${r.note ? `<p class="inv-pay">${esc(r.note).replace(/\n/g, "<br>")}</p>` : ""}
      <footer class="inv-thanks">Vielen Dank für Ihre Bestellung.<br>Das Erdkinderkollektiv</footer>
    </article>`;
  }

  const html = (o) => render(fromOrder(o));

  return { number, html, render, fromOrder, fromManual, SELLER };
})();
