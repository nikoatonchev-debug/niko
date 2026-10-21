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
    const links = NAV_LINKS.map((l) =>
      l.page === activePage
        ? `<a href="${l.href}" class="active" aria-current="page">${l.label}</a>`
        : `<a href="${l.href}">${l.label}</a>`
    ).join("");
    el.innerHTML = `
      <a class="skip-link" href="#main">Zum Inhalt springen</a>
      <div class="container">
        <a href="index.html" class="brand">
          <img class="brand-logo" src="images/logo-erdkinderplan.png" alt="" width="48" height="40">
          <span class="brand-text">
            <strong>Siebdruck-Schülerfirma</strong>
            <span>Montessori-Schule Dietramszell</span>
          </span>
        </a>
        <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Menü öffnen" aria-expanded="false" aria-controls="main-nav">
          <span></span><span></span><span></span>
        </button>
        <nav class="main-nav" id="main-nav" aria-label="Hauptnavigation">
          ${links}
          <span class="auth-status" id="auth-status"></span>
        </nav>
      </div>
    `;

    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");
    function setOpen(open) {
      nav.classList.toggle("open", open);
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    }
    toggle.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    const main = document.querySelector("main");
    if (main) {
      if (!main.id) main.id = "main";
      main.setAttribute("tabindex", "-1");
    }
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
            <p>Ein Projekt von Schüler:innen der 7.&ndash;10. Klasse an der Montessori-Schule Dietramszell. Wir bedrucken Pullis im Siebdruck &ndash; von Hand, mit viel Liebe zum Detail.</p>
          </div>
          <div>
            <h4>Abholung &amp; Bezahlung</h4>
            <p>Abholung jeden Freitag ab 11 Uhr bei der alten Apotheke.<br>Bezahlung ausschließlich bar bei Abholung.</p>
          </div>
          <nav aria-label="Seiten">
            <h4>Navigation</h4>
            <p><a href="index.html">Startseite</a></p>
            <p><a href="shop.html">Shop</a></p>
            <p><a href="spezialbestellungen.html">Spezialbestellungen</a></p>
            <p><a href="bewertungen.html">Bewertungen</a></p>
          </nav>
          <nav aria-label="Rechtliches">
            <h4>Rechtliches</h4>
            <p><a href="impressum.html">Impressum</a></p>
            <p><a href="datenschutz.html">Datenschutz</a></p>
            <p><a href="agb.html">AGB</a></p>
            <p><a href="agb.html#rueckgabe">Rückgabe &amp; Umtausch</a></p>
          </nav>
        </div>
        <div class="footer-bottom">
          <div>&copy; ${year} Siebdruck-Schülerfirma &middot; Montessori-Schule Dietramszell</div>
          <button type="button" class="admin-access" id="admin-access-btn">
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
