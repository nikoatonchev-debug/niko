/* Baut Header und Footer auf jeder Seite gleich auf.
 * Erwartet <div id="site-header"></div> und <div id="site-footer"></div>
 * sowie <body data-page="..."> zur Markierung des aktiven Menüpunkts. */

(function () {
  const NAV_LINKS = [
    { href: "index.html", page: "home", label: "Startseite" },
    { href: "shop.html", page: "shop", label: "Shop" },
    { href: "spezialbestellungen.html", page: "special", label: "Spezialbestellungen" },
    { href: "bewertungen.html", page: "reviews", label: "Bewertungen" },
  ];

  function renderHeader(activePage) {
    const el = document.getElementById("site-header");
    if (!el) return;
    const links = NAV_LINKS.map(
      (l) =>
        `<a href="${l.href}" class="${l.page === activePage ? "active" : ""}">${l.label}</a>`
    ).join("");
    el.innerHTML = `
      <div class="container">
        <a href="index.html" class="brand">
          <img class="brand-logo" src="images/logo-erdkinderplan.png" alt="Erdkinderplan Logo">
          <span class="brand-text">
            <strong>Siebdruck-Schülerfirma</strong>
            <span>Montessori-Schule vom Zelt</span>
          </span>
        </a>
        <nav class="main-nav">${links}</nav>
      </div>
    `;
  }

  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    const year = new Date().getFullYear();
    el.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <h4>Siebdruck-Schülerfirma</h4>
            <p>Ein Projekt von Schüler:innen der 7.&ndash;10. Klasse an der Montessori-Schule vom Zelt. Wir bedrucken Pullis im Siebdruck &ndash; von Hand, mit viel Liebe zum Detail.</p>
          </div>
          <div>
            <h4>Abholung &amp; Bezahlung</h4>
            <p>Abholung jeden Freitag ab 11 Uhr bei der alten Apotheke.<br>Bezahlung ausschließlich bar bei Abholung.</p>
          </div>
          <div>
            <h4>Navigation</h4>
            <p><a href="index.html">Startseite</a></p>
            <p><a href="shop.html">Shop</a></p>
            <p><a href="spezialbestellungen.html">Spezialbestellungen</a></p>
            <p><a href="bewertungen.html">Bewertungen</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <div>&copy; ${year} Siebdruck-Schülerfirma &middot; Montessori-Schule vom Zelt</div>
          <button type="button" class="admin-access" id="admin-access-btn" title="Admin-Bereich">
            ${SFIcons.gear} Admin
          </button>
        </div>
      </div>
    `;
    const btn = document.getElementById("admin-access-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = "admin.html";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.getAttribute("data-page") || "";
    renderHeader(page);
    renderFooter();
  });
})();
