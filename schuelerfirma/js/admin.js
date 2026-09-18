(function () {
  const SESSION_KEY = "sf_admin_authed";

  function isAuthed() {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  }
  function setAuthed(v) {
    if (v) sessionStorage.setItem(SESSION_KEY, "1");
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function showLogin() {
    document.getElementById("admin-login").classList.remove("hidden");
    document.getElementById("admin-dashboard").classList.add("hidden");
  }
  function showDashboard() {
    document.getElementById("admin-login").classList.add("hidden");
    document.getElementById("admin-dashboard").classList.remove("hidden");
    renderAll();
  }

  // ---------- Tabs ----------
  function setupTabs() {
    const buttons = document.querySelectorAll(".admin-tab-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("panel-" + btn.dataset.tab).classList.add("active");
      });
    });
  }

  // ---------- Stats ----------
  function renderStats() {
    const products = SF.getProducts();
    const orders = SF.getOrders();
    const special = SF.getSpecialOrders();
    const reviews = SF.getReviews();

    document.getElementById("stat-products").textContent = products.length;
    document.getElementById("stat-orders").textContent = orders.filter((o) => o.status === "offen").length;
    document.getElementById("stat-special").textContent = special.filter((s) => s.status === "offen").length;
    document.getElementById("stat-reviews").textContent = reviews.length;
  }

  // ---------- Produkte ----------
  function renderProducts() {
    const list = SF.getProducts();
    const el = document.getElementById("product-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="6">Noch keine Produkte angelegt.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map(
        (p) => `
      <tr>
        <td><span style="display:inline-block;width:14px;height:14px;border-radius:4px;background:${SF.escapeHtml(p.color || "#999")};vertical-align:middle;margin-right:6px;"></span>${SF.escapeHtml(p.name)}</td>
        <td>${SF.escapeHtml(p.description || "")}</td>
        <td>${SF.formatPrice(p.price)}</td>
        <td>${SF.escapeHtml((p.sizes || []).join(", "))}</td>
        <td><span class="badge ${p.active !== false ? "badge-accepted" : ""}">${p.active !== false ? "aktiv" : "inaktiv"}</span></td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-small" data-toggle="${p.id}">${p.active !== false ? "Deaktivieren" : "Aktivieren"}</button>
          <button class="btn btn-danger btn-small" data-delete-product="${p.id}">Löschen</button>
        </td>
      </tr>`
      )
      .join("");

    el.querySelectorAll("[data-toggle]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-toggle");
        const p = SF.getProducts().find((x) => x.id === id);
        SF.updateProduct(id, { active: !(p.active !== false) });
        renderProducts();
        renderStats();
      })
    );
    el.querySelectorAll("[data-delete-product]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (confirm("Dieses Produkt wirklich löschen?")) {
          SF.deleteProduct(btn.getAttribute("data-delete-product"));
          renderProducts();
          renderStats();
        }
      })
    );
  }

  function setupProductForm() {
    const form = document.getElementById("product-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("pf-name").value.trim();
      const description = document.getElementById("pf-description").value.trim();
      const price = parseFloat(document.getElementById("pf-price").value);
      const color = document.getElementById("pf-color").value;
      const sizes = document
        .getElementById("pf-sizes")
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (!name || !price || sizes.length === 0) return;

      SF.addProduct({ name, description, price, color, sizes, active: true });
      form.reset();
      document.getElementById("pf-color").value = "#2c6e6b";
      renderProducts();
      renderStats();
    });
  }

  // ---------- Bestellungen (Shop) ----------
  function renderOrders() {
    const list = SF.getOrders();
    const el = document.getElementById("orders-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="6">Noch keine Bestellungen.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map((o) => {
        const items = o.items
          .map((i) => `${i.qty}x ${SF.escapeHtml(i.name)} (${SF.escapeHtml(i.size)})`)
          .join("<br>");
        const badgeClass = o.status === "abgeholt" ? "badge-accepted" : "badge-open";
        return `
        <tr>
          <td>${SF.formatDate(o.date)}</td>
          <td>${SF.escapeHtml(o.customerName)}${o.klasse ? " (" + SF.escapeHtml(o.klasse) + ")" : ""}${o.phone ? "<br><span class='hint'>Tel: " + SF.escapeHtml(o.phone) + "</span>" : ""}</td>
          <td>${items}</td>
          <td>${SF.formatPrice(o.total)}</td>
          <td><span class="badge ${badgeClass}">${SF.escapeHtml(o.status)}</span></td>
          <td class="actions-cell">
            ${o.status !== "abgeholt" ? `<button class="btn btn-secondary btn-small" data-collect="${o.id}">Als abgeholt markieren</button>` : ""}
            <button class="btn btn-danger btn-small" data-delete-order="${o.id}">Löschen</button>
          </td>
        </tr>`;
      })
      .join("");

    el.querySelectorAll("[data-collect]").forEach((btn) =>
      btn.addEventListener("click", () => {
        SF.updateOrder(btn.getAttribute("data-collect"), { status: "abgeholt" });
        renderOrders();
        renderStats();
      })
    );
    el.querySelectorAll("[data-delete-order]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (confirm("Diese Bestellung wirklich löschen?")) {
          SF.deleteOrder(btn.getAttribute("data-delete-order"));
          renderOrders();
          renderStats();
        }
      })
    );
  }

  // ---------- Spezialbestellungen ----------
  function statusBadge(status) {
    const map = {
      offen: "badge-open",
      akzeptiert: "badge-accepted",
      abgelehnt: "badge-declined",
    };
    return `<span class="badge ${map[status] || ""}">${SF.escapeHtml(status)}</span>`;
  }

  function renderSpecial() {
    const list = SF.getSpecialOrders();
    const el = document.getElementById("special-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="7">Noch keine Spezialbestellungen.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map(
        (s) => `
      <tr>
        <td>${SF.formatDate(s.date)}</td>
        <td>${SF.escapeHtml(s.name)}${s.klasse ? " (" + SF.escapeHtml(s.klasse) + ")" : ""}</td>
        <td><strong>${SF.escapeHtml(s.phone)}</strong></td>
        <td>${SF.escapeHtml(s.groesse)} &middot; ${s.menge}x</td>
        <td>${SF.escapeHtml(s.wunsch)}</td>
        <td>${statusBadge(s.status)}</td>
        <td class="actions-cell">
          ${s.status !== "akzeptiert" ? `<button class="btn btn-secondary btn-small" data-accept="${s.id}">Annehmen</button>` : ""}
          ${s.status !== "abgelehnt" ? `<button class="btn btn-outline btn-small" data-decline="${s.id}">Ablehnen</button>` : ""}
          <button class="btn btn-danger btn-small" data-delete-special="${s.id}">Löschen</button>
        </td>
      </tr>`
      )
      .join("");

    el.querySelectorAll("[data-accept]").forEach((btn) =>
      btn.addEventListener("click", () => {
        SF.updateSpecialOrder(btn.getAttribute("data-accept"), { status: "akzeptiert" });
        renderSpecial();
        renderStats();
      })
    );
    el.querySelectorAll("[data-decline]").forEach((btn) =>
      btn.addEventListener("click", () => {
        SF.updateSpecialOrder(btn.getAttribute("data-decline"), { status: "abgelehnt" });
        renderSpecial();
        renderStats();
      })
    );
    el.querySelectorAll("[data-delete-special]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (confirm("Diese Spezialbestellung wirklich löschen?")) {
          SF.deleteSpecialOrder(btn.getAttribute("data-delete-special"));
          renderSpecial();
          renderStats();
        }
      })
    );
  }

  // ---------- Bewertungen ----------
  function renderReviewsAdmin() {
    const list = SF.getReviews();
    const el = document.getElementById("reviews-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="4">Noch keine Bewertungen.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map(
        (r) => `
      <tr>
        <td>${SF.formatDate(r.date)}</td>
        <td>${SF.escapeHtml(r.name || "Anonym")}</td>
        <td>${r.rating ? "★".repeat(r.rating) + "☆".repeat(5 - r.rating) : "&ndash;"}</td>
        <td>${SF.escapeHtml(r.comment)}</td>
        <td class="actions-cell"><button class="btn btn-danger btn-small" data-delete-review="${r.id}">Löschen</button></td>
      </tr>`
      )
      .join("");

    el.querySelectorAll("[data-delete-review]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (confirm("Diese Bewertung wirklich löschen?")) {
          SF.deleteReview(btn.getAttribute("data-delete-review"));
          renderReviewsAdmin();
          renderStats();
        }
      })
    );
  }

  // ---------- Einstellungen ----------
  function setupSettings() {
    const form = document.getElementById("password-form");
    const msg = document.getElementById("password-message");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const current = document.getElementById("pw-current").value;
      const next = document.getElementById("pw-new").value;
      const confirmPw = document.getElementById("pw-confirm").value;

      if (!SF.checkPassword(current)) {
        msg.textContent = "Aktuelles Passwort ist falsch.";
        msg.className = "form-message error";
        msg.classList.remove("hidden");
        return;
      }
      if (next.length < 4) {
        msg.textContent = "Neues Passwort muss mindestens 4 Zeichen haben.";
        msg.className = "form-message error";
        msg.classList.remove("hidden");
        return;
      }
      if (next !== confirmPw) {
        msg.textContent = "Die neuen Passwörter stimmen nicht überein.";
        msg.className = "form-message error";
        msg.classList.remove("hidden");
        return;
      }

      SF.setPassword(next);
      form.reset();
      msg.textContent = "Passwort erfolgreich geändert.";
      msg.className = "form-message success";
      msg.classList.remove("hidden");
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
      setAuthed(false);
      showLogin();
    });
  }

  function renderAll() {
    renderStats();
    renderProducts();
    renderOrders();
    renderSpecial();
    renderReviewsAdmin();
  }

  function setupLogin() {
    const form = document.getElementById("login-form");
    const msg = document.getElementById("login-message");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const pw = document.getElementById("login-password").value;
      if (SF.checkPassword(pw)) {
        setAuthed(true);
        form.reset();
        msg.classList.add("hidden");
        showDashboard();
      } else {
        msg.textContent = "Falsches Passwort.";
        msg.className = "form-message error";
        msg.classList.remove("hidden");
      }
    });
  }

  function setup() {
    setupLogin();
    setupTabs();
    setupProductForm();
    setupSettings();
    document.getElementById("pf-color").value = "#2c6e6b";

    if (isAuthed()) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
