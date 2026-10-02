(function () {
  const SESSION_KEY = "sf_admin_session";
  const IDLE_LIMIT_MS = 30 * 60 * 1000;
  const PASSWORD_MIN = 8;
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
  const MAX_IMAGES = 8;
  const esc = (s) => SF.escapeHtml(s);

  function accountLabel(o) {
    if (o.username) return "<br><span class='hint'>Konto: " + esc(o.username) + "</span>";
    if (o.accountDeleted) return "<br><span class='hint'>Konto gelöscht</span>";
    return "";
  }

  // ---------- Session (nur in diesem Tab, mit Auto-Logout bei Inaktivität) ----------
  function isAuthed() {
    const last = parseInt(sessionStorage.getItem(SESSION_KEY) || "0", 10);
    if (!last) return false;
    if (Date.now() - last > IDLE_LIMIT_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  }
  function touchSession() {
    if (sessionStorage.getItem(SESSION_KEY)) sessionStorage.setItem(SESSION_KEY, String(Date.now()));
  }
  function setAuthed(v) {
    if (v) sessionStorage.setItem(SESSION_KEY, String(Date.now()));
    else sessionStorage.removeItem(SESSION_KEY);
  }
  function watchIdle() {
    ["click", "keydown"].forEach((ev) => document.addEventListener(ev, touchSession, { passive: true }));
    setInterval(() => {
      if (!document.getElementById("admin-dashboard").classList.contains("hidden") && !isAuthed()) {
        showLogin("Du wurdest nach 30 Minuten ohne Aktivität automatisch abgemeldet.");
      }
    }, 60 * 1000);
  }

  function showOnly(id) {
    ["admin-login", "admin-force-pw", "admin-dashboard"].forEach((s) =>
      document.getElementById(s).classList.toggle("hidden", s !== id)
    );
  }
  function showLogin(notice) {
    setAuthed(false);
    showOnly("admin-login");
    const msg = document.getElementById("login-message");
    if (notice) SFUI.showMessage(msg, notice, "error");
    document.getElementById("login-password").focus();
  }
  function showDashboard() {
    if (SF.adminPasswordIsDefault()) {
      showOnly("admin-force-pw");
      document.getElementById("fpw-new").focus();
      return;
    }
    showOnly("admin-dashboard");
    renderAll();
  }

  // ---------- Tabs ----------
  function setupTabs() {
    const buttons = Array.from(document.querySelectorAll(".admin-tab-btn"));
    document.querySelector(".admin-tabs").setAttribute("role", "tablist");
    function activate(btn) {
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("tabindex", on ? "0" : "-1");
        document.getElementById("panel-" + b.dataset.tab).classList.toggle("active", on);
      });
    }
    buttons.forEach((btn, i) => {
      btn.setAttribute("role", "tab");
      btn.id = "tab-" + btn.dataset.tab;
      btn.setAttribute("aria-controls", "panel-" + btn.dataset.tab);
      const panel = document.getElementById("panel-" + btn.dataset.tab);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", btn.id);
      btn.addEventListener("click", () => activate(btn));
      btn.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowRight") next = buttons[(i + 1) % buttons.length];
        if (e.key === "ArrowLeft") next = buttons[(i - 1 + buttons.length) % buttons.length];
        if (e.key === "Home") next = buttons[0];
        if (e.key === "End") next = buttons[buttons.length - 1];
        if (next) {
          e.preventDefault();
          activate(next);
          next.focus();
        }
      });
    });
    activate(buttons.find((b) => b.classList.contains("active")) || buttons[0]);
  }

  // ---------- Stats ----------
  function renderStats() {
    document.getElementById("stat-products").textContent = SF.getProducts().length;
    document.getElementById("stat-orders").textContent = SF.getOrders().filter((o) => o.status === "offen").length;
    document.getElementById("stat-special").textContent = SF.getSpecialOrders().filter((s) => s.status === "offen").length;
    document.getElementById("stat-reviews").textContent = SF.getReviews().length;
    document.getElementById("stat-users").textContent = SF.getUsers().length;
  }

  // ---------- Produkte ----------
  let editingProductId = null;
  let pendingImages = [];

  function renderProducts() {
    const list = SF.getProducts();
    const el = document.getElementById("product-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="8" class="table-empty">Noch keine Produkte angelegt.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map((p) => {
        const id = esc(p.id);
        const remaining = SF.getProductRemaining(p);
        const soldOut = remaining !== null && remaining <= 0;
        const stockBadge =
          remaining === null
            ? "unbegrenzt"
            : soldOut
            ? `<span class="badge badge-declined">ausverkauft</span>`
            : `${remaining} / ${Number(p.stock)} übrig`;
        const thumb =
          p.images && p.images[0]
            ? `<img src="${esc(p.images[0])}" alt="" class="admin-thumb">`
            : `<span class="admin-thumb" style="background:${SF.safeColor(p.color, "#999999")};"></span>`;
        const active = p.active !== false;
        return `
      <tr>
        <td>${thumb}</td>
        <td>${esc(p.name)}</td>
        <td>${esc(p.description || "")}</td>
        <td>${SF.formatPrice(p.price)}</td>
        <td>${esc((p.sizes || []).join(", "))}</td>
        <td>${stockBadge}</td>
        <td><span class="badge ${active ? "badge-accepted" : ""}">${active ? "aktiv" : "inaktiv"}</span></td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-small" data-edit-product="${id}" aria-label="${esc(p.name)} bearbeiten">Bearbeiten</button>
          <button class="btn btn-outline btn-small" data-toggle="${id}" aria-label="${esc(p.name)} ${active ? "deaktivieren" : "aktivieren"}">${active ? "Deaktivieren" : "Aktivieren"}</button>
          <button class="btn btn-danger btn-small" data-delete-product="${id}" aria-label="${esc(p.name)} löschen">Löschen</button>
        </td>
      </tr>`;
      })
      .join("");

    el.querySelectorAll("[data-toggle]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-toggle");
        const p = SF.getProductById(id);
        if (!p) return;
        SF.updateProduct(id, { active: !(p.active !== false) });
        renderProducts();
        renderStats();
      })
    );
    el.querySelectorAll("[data-delete-product]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-delete-product");
        if (confirm("Dieses Produkt wirklich löschen?")) {
          SF.deleteProduct(id);
          if (editingProductId === id) exitEditMode();
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
          `<div class="img-preview">
            <img src="${esc(src)}" alt="Bild ${i + 1}">
            <button type="button" data-remove-image="${i}" aria-label="Bild ${i + 1} entfernen">&times;</button>
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
    document.getElementById("pf-color").value = SF.safeColor(p.color);
    document.getElementById("pf-sizes").value = (p.sizes || []).join(", ");
    document.getElementById("pf-stock").value = p.stock === null || p.stock === undefined ? "" : p.stock;
    pendingImages = (p.images || []).slice();
    renderImagePreview();
    document.getElementById("product-form-title").textContent = "Produkt bearbeiten: " + p.name;
    document.getElementById("product-form-submit").textContent = "Änderungen speichern";
    document.getElementById("product-form-cancel").classList.remove("hidden");
    document.getElementById("product-form").scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("pf-name").focus({ preventScroll: true });
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
    const msg = document.getElementById("product-message");
    document.getElementById("pf-color").value = "#2c6e6b";

    // Bilder werden neu als JPEG gezeichnet: das entfernt versteckte Daten
    // (z. B. GPS-Standort aus Handyfotos) und alles, was kein Bild ist.
    document.getElementById("pf-images").addEventListener("change", async (e) => {
      const problems = [];
      for (const file of Array.from(e.target.files || [])) {
        if (pendingImages.length >= MAX_IMAGES) {
          problems.push(`Maximal ${MAX_IMAGES} Bilder pro Produkt.`);
          break;
        }
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          problems.push(`„${file.name}“ ist kein JPG-, PNG-, WebP- oder GIF-Bild.`);
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          problems.push(`„${file.name}“ ist größer als 15 MB.`);
          continue;
        }
        try {
          pendingImages.push(await SF.resizeImageFile(file));
        } catch (err) {
          problems.push(`„${file.name}“ konnte nicht gelesen werden.`);
        }
      }
      e.target.value = "";
      renderImagePreview();
      if (problems.length) SFUI.showMessage(msg, problems.join(" "), "error");
      else SFUI.hideMessage(msg);
    });

    document.getElementById("product-form-cancel").addEventListener("click", exitEditMode);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = SF.clampText(document.getElementById("pf-name").value, 60);
      const description = SF.clampText(document.getElementById("pf-description").value, 500);
      const price = Math.round(parseFloat(document.getElementById("pf-price").value) * 100) / 100;
      const color = SF.safeColor(document.getElementById("pf-color").value);
      const stockRaw = document.getElementById("pf-stock").value;
      const stock = stockRaw === "" ? null : Math.max(0, parseInt(stockRaw, 10) || 0);
      const sizes = SF.clampText(document.getElementById("pf-sizes").value, 120)
        .split(",")
        .map((s) => s.trim().slice(0, 10))
        .filter(Boolean);

      let error = null;
      if (!name) error = "Bitte einen Namen eingeben.";
      else if (!(price > 0 && price <= 1000)) error = "Bitte einen Preis zwischen 0,01 und 1000 € eingeben.";
      else if (sizes.length === 0) error = "Bitte mindestens eine Größe angeben.";
      if (error) {
        SFUI.showMessage(msg, error, "error");
        return;
      }
      SFUI.hideMessage(msg);

      const payload = { name, description, price, color, sizes, stock, images: pendingImages.slice() };
      const ok = editingProductId
        ? SF.updateProduct(editingProductId, payload)
        : SF.addProduct(Object.assign({ active: true }, payload));
      if (!ok) {
        SFUI.showMessage(
          msg,
          "Konnte nicht gespeichert werden: Der Speicher des Browsers ist voll. Bitte weniger oder kleinere Bilder verwenden.",
          "error"
        );
        return;
      }
      exitEditMode();
      renderProducts();
      renderStats();
      SFUI.showMessage(msg, "Gespeichert.", "success");
    });
  }

  // ---------- Bestellungen (Shop) ----------
  function renderOrders() {
    const list = SF.getOrders();
    const el = document.getElementById("orders-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="6" class="table-empty">Noch keine Bestellungen.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map((o) => {
        const id = esc(o.id);
        const items = (o.items || [])
          .map((i) => `${Number(i.qty)}x ${esc(i.name)} (${esc(i.size)})`)
          .join("<br>");
        const badgeClass = o.status === "abgeholt" ? "badge-accepted" : "badge-open";
        return `
        <tr>
          <td>${SF.formatDate(o.date)}</td>
          <td>${esc(o.customerName)}${o.klasse ? " (" + esc(o.klasse) + ")" : ""}${o.phone ? "<br><span class='hint'>Tel: " + esc(o.phone) + "</span>" : ""}${accountLabel(o)}</td>
          <td>${items}</td>
          <td>${SF.formatPrice(o.total)}</td>
          <td><span class="badge ${badgeClass}">${esc(SF.orderStatusLabel(o.status))}</span></td>
          <td class="actions-cell">
            ${o.status !== "abgeholt" ? `<button class="btn btn-secondary btn-small" data-collect="${id}">Als abgeholt markieren</button>` : ""}
            <button class="btn btn-danger btn-small" data-delete-order="${id}" aria-label="Bestellung vom ${SF.formatDate(o.date)} löschen">Löschen</button>
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
    const map = { offen: "badge-open", akzeptiert: "badge-accepted", abgelehnt: "badge-declined" };
    return `<span class="badge ${map[status] || ""}">${esc(status)}</span>`;
  }

  function renderSpecial() {
    const list = SF.getSpecialOrders();
    const el = document.getElementById("special-table-body");
    if (list.length === 0) {
      el.innerHTML = `<tr><td colspan="7" class="table-empty">Noch keine Spezialbestellungen.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map((s) => {
        const id = esc(s.id);
        return `
      <tr>
        <td>${SF.formatDate(s.date)}</td>
        <td>${esc(s.name)}${s.klasse ? " (" + esc(s.klasse) + ")" : ""}${accountLabel(s)}</td>
        <td><strong>${esc(s.phone)}</strong></td>
        <td>${esc(s.groesse)} &middot; ${Number(s.menge) || 1}x</td>
        <td>${esc(s.wunsch)}</td>
        <td>${statusBadge(s.status)}</td>
        <td class="actions-cell">
          ${s.status !== "akzeptiert" ? `<button class="btn btn-secondary btn-small" data-accept="${id}">Annehmen</button>` : ""}
          ${s.status !== "abgelehnt" ? `<button class="btn btn-outline btn-small" data-decline="${id}">Ablehnen</button>` : ""}
          <button class="btn btn-danger btn-small" data-delete-special="${id}">Löschen</button>
        </td>
      </tr>`;
      })
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
      el.innerHTML = `<tr><td colspan="5" class="table-empty">Noch keine Bewertungen.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map((r) => {
        const rating = Math.max(0, Math.min(5, Number(r.rating) || 0));
        return `
      <tr>
        <td>${SF.formatDate(r.date)}</td>
        <td>${esc(r.name || "Anonym")}</td>
        <td>${rating ? `<span role="img" aria-label="${rating} von 5 Sternen">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span>` : "&ndash;"}</td>
        <td>${esc(r.comment)}</td>
        <td class="actions-cell"><button class="btn btn-danger btn-small" data-delete-review="${esc(r.id)}">Löschen</button></td>
      </tr>`;
      })
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
      el.innerHTML = `<tr><td colspan="4" class="table-empty">Noch keine registrierten Kund:innen.</td></tr>`;
      return;
    }
    el.innerHTML = list
      .map(
        (u) => `
      <tr>
        <td>${SF.formatDate(u.registeredAt)}</td>
        <td>${esc(u.username)}</td>
        <td>${esc(u.email)}</td>
        <td class="actions-cell"><button class="btn btn-danger btn-small" data-delete-user="${esc(u.id)}" aria-label="Konto ${esc(u.username)} löschen">Löschen</button></td>
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

  // ---------- Passwort ----------
  function validateNewPassword(next, confirmPw) {
    if (next.length < PASSWORD_MIN) return `Das neue Passwort muss mindestens ${PASSWORD_MIN} Zeichen haben.`;
    if (next.length > 128) return "Das neue Passwort darf höchstens 128 Zeichen haben.";
    if (next === "1234") return "Bitte wähle ein anderes Passwort als das Startpasswort.";
    if (next !== confirmPw) return "Die neuen Passwörter stimmen nicht überein.";
    return null;
  }

  function setupForcePassword() {
    const form = document.getElementById("force-pw-form");
    const msg = document.getElementById("force-pw-message");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const next = document.getElementById("fpw-new").value;
      const error = validateNewPassword(next, document.getElementById("fpw-confirm").value);
      if (error) {
        SFUI.showMessage(msg, error, "error");
        return;
      }
      await SF.setAdminPassword(next);
      form.reset();
      SFUI.hideMessage(msg);
      showDashboard();
    });
  }

  function setupSettings() {
    const form = document.getElementById("password-form");
    const msg = document.getElementById("password-message");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const current = document.getElementById("pw-current").value;
      const next = document.getElementById("pw-new").value;

      if (!(await SF.verifyAdminPassword(current))) {
        SFUI.showMessage(msg, "Aktuelles Passwort ist falsch.", "error");
        return;
      }
      const error = validateNewPassword(next, document.getElementById("pw-confirm").value);
      if (error) {
        SFUI.showMessage(msg, error, "error");
        return;
      }
      await SF.setAdminPassword(next);
      form.reset();
      SFUI.showMessage(msg, "Passwort erfolgreich geändert.", "success");
    });

    document.getElementById("logout-btn").addEventListener("click", () => showLogin());
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
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const locked = SF.lockSecondsLeft("admin-login");
      if (locked > 0) {
        SFUI.showMessage(msg, `Zu viele Fehlversuche. Bitte warte ${locked} Sekunden.`, "error");
        return;
      }
      const pw = document.getElementById("login-password").value;
      if (await SF.verifyAdminPassword(pw)) {
        SF.clearFailures("admin-login");
        setAuthed(true);
        form.reset();
        SFUI.hideMessage(msg);
        showDashboard();
      } else {
        const lockedNow = SF.registerFailure("admin-login", 5, 30);
        SFUI.showMessage(
          msg,
          lockedNow > 0 ? `Zu viele Fehlversuche. Bitte warte ${lockedNow} Sekunden.` : "Falsches Passwort.",
          "error"
        );
      }
    });
  }

  function setup() {
    setupLogin();
    setupForcePassword();
    setupTabs();
    setupProductForm();
    setupSettings();
    watchIdle();
    sessionStorage.removeItem("sf_admin_authed");

    if (isAuthed()) {
      showDashboard();
    } else {
      showOnly("admin-login");
    }
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
