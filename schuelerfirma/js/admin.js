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
    const users = SF.getUsers();

    document.getElementById("stat-products").textContent = products.length;
    document.getElementById("stat-orders").textContent = orders.filter((o) => o.status === "offen").length;
    document.getElementById("stat-special").textContent = special.filter((s) => s.status === "offen").length;
    document.getElementById("stat-reviews").textContent = reviews.length;
    document.getElementById("stat-users").textContent = users.length;
  }

  // ---------- Produkte ----------
  let editingProductId = null;
  let pendingImages = [];

  function renderProducts() {
    const list = SF.getProducts();
    const el = document.getElementById("product-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="8">Noch keine Produkte angelegt.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map((p) => {
        const remaining = SF.getProductRemaining(p);
        const soldOut = remaining !== null && remaining <= 0;
        const stockBadge =
          remaining === null
            ? "unbegrenzt"
            : soldOut
            ? `<span class="badge badge-declined">ausverkauft</span>`
            : `${remaining} / ${p.stock} übrig`;
        const thumb = (p.images && p.images[0])
          ? `<img src="${p.images[0]}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">`
          : `<span style="display:inline-block;width:40px;height:40px;border-radius:6px;background:${SF.escapeHtml(p.color || "#999")};"></span>`;
        return `
      <tr>
        <td>${thumb}</td>
        <td>${SF.escapeHtml(p.name)}</td>
        <td>${SF.escapeHtml(p.description || "")}</td>
        <td>${SF.formatPrice(p.price)}</td>
        <td>${SF.escapeHtml((p.sizes || []).join(", "))}</td>
        <td>${stockBadge}</td>
        <td><span class="badge ${p.active !== false ? "badge-accepted" : ""}">${p.active !== false ? "aktiv" : "inaktiv"}</span></td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-small" data-edit-product="${p.id}">Bearbeiten</button>
          <button class="btn btn-outline btn-small" data-toggle="${p.id}">${p.active !== false ? "Deaktivieren" : "Aktivieren"}</button>
          <button class="btn btn-danger btn-small" data-delete-product="${p.id}">Löschen</button>
        </td>
      </tr>`;
      })
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
          if (editingProductId === btn.getAttribute("data-delete-product")) exitEditMode();
          renderProducts();
          renderStats();
        }
      })
    );
    el.querySelectorAll("[data-edit-product]").forEach((btn) =>
      btn.addEventListener("click", () => enterEditMode(btn.getAttribute("data-edit-product")))
    );
  }

  function renderImagePreview() {
    const el = document.getElementById("pf-image-preview");
    el.innerHTML = pendingImages
      .map(
        (src, i) =>
          `<div style="position:relative;">
            <img src="${src}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;">
            <button type="button" data-remove-image="${i}" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:999px;border:none;background:#b23a3a;color:#fff;cursor:pointer;font-size:12px;line-height:1;">&times;</button>
          </div>`
      )
      .join("");
    el.querySelectorAll("[data-remove-image]").forEach((btn) =>
      btn.addEventListener("click", () => {
        pendingImages.splice(parseInt(btn.getAttribute("data-remove-image"), 10), 1);
        renderImagePreview();
      })
    );
  }

  function enterEditMode(id) {
    const p = SF.getProductById(id);
    if (!p) return;
    editingProductId = id;
    document.getElementById("pf-name").value = p.name;
    document.getElementById("pf-description").value = p.description || "";
    document.getElementById("pf-price").value = p.price;
    document.getElementById("pf-color").value = p.color || "#2c6e6b";
    document.getElementById("pf-sizes").value = (p.sizes || []).join(", ");
    document.getElementById("pf-stock").value = p.stock === null || p.stock === undefined ? "" : p.stock;
    pendingImages = (p.images || []).slice();
    renderImagePreview();
    document.getElementById("product-form-title").textContent = "Produkt bearbeiten: " + p.name;
    document.getElementById("product-form-submit").textContent = "Änderungen speichern";
    document.getElementById("product-form-cancel").classList.remove("hidden");
    document.getElementById("product-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exitEditMode() {
    editingProductId = null;
    pendingImages = [];
    document.getElementById("product-form").reset();
    document.getElementById("pf-color").value = "#2c6e6b";
    renderImagePreview();
    document.getElementById("product-form-title").textContent = "Produkt hinzufügen";
    document.getElementById("product-form-submit").textContent = "Produkt hinzufügen";
    document.getElementById("product-form-cancel").classList.add("hidden");
  }

  function setupProductForm() {
    const form = document.getElementById("product-form");
    document.getElementById("pf-color").value = "#2c6e6b";

    document.getElementById("pf-images").addEventListener("change", async (e) => {
      const files = Array.from(e.target.files || []);
      for (const file of files) {
        try {
          const dataUrl = await SF.resizeImageFile(file);
          pendingImages.push(dataUrl);
        } catch (err) {
          console.warn("Bild konnte nicht verarbeitet werden", err);
        }
      }
      e.target.value = "";
      renderImagePreview();
    });

    document.getElementById("product-form-cancel").addEventListener("click", exitEditMode);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("pf-name").value.trim();
      const description = document.getElementById("pf-description").value.trim();
      const price = parseFloat(document.getElementById("pf-price").value);
      const color = document.getElementById("pf-color").value;
      const stockRaw = document.getElementById("pf-stock").value;
      const stock = stockRaw === "" ? null : Math.max(0, parseInt(stockRaw, 10));
      const sizes = document
        .getElementById("pf-sizes")
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (!name || !price || sizes.length === 0) return;

      const payload = { name, description, price, color, sizes, stock, images: pendingImages.slice() };

      if (editingProductId) {
        SF.updateProduct(editingProductId, payload);
      } else {
        SF.addProduct(Object.assign({ active: true }, payload));
      }
      exitEditMode();
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
          <td>${SF.escapeHtml(o.customerName)}${o.klasse ? " (" + SF.escapeHtml(o.klasse) + ")" : ""}${o.phone ? "<br><span class='hint'>Tel: " + SF.escapeHtml(o.phone) + "</span>" : ""}${o.username ? "<br><span class='hint'>Konto: " + SF.escapeHtml(o.username) + "</span>" : ""}</td>
          <td>${items}</td>
          <td>${SF.formatPrice(o.total)}</td>
          <td><span class="badge ${badgeClass}">${SF.escapeHtml(SF.orderStatusLabel(o.status))}</span></td>
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
        <td>${SF.escapeHtml(s.name)}${s.klasse ? " (" + SF.escapeHtml(s.klasse) + ")" : ""}${s.username ? "<br><span class='hint'>Konto: " + SF.escapeHtml(s.username) + "</span>" : ""}</td>
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

  // ---------- Kund:innen ----------
  function renderUsers() {
    const list = SF.getUsers();
    const el = document.getElementById("users-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="4">Noch keine registrierten Kund:innen.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map(
        (u) => `
      <tr>
        <td>${SF.formatDate(u.registeredAt)}</td>
        <td>${SF.escapeHtml(u.username)}</td>
        <td>${SF.escapeHtml(u.email)}</td>
        <td class="actions-cell"><button class="btn btn-danger btn-small" data-delete-user="${u.id}">Löschen</button></td>
      </tr>`
      )
      .join("");

    el.querySelectorAll("[data-delete-user]").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (confirm("Dieses Konto wirklich löschen?")) {
          SF.deleteUser(btn.getAttribute("data-delete-user"));
          renderUsers();
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
    renderUsers();
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

    if (isAuthed()) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
