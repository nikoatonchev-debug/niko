(function () {
  const IDLE_LIMIT_MS = 30 * 60 * 1000;
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
  const MAX_IMAGES = 6;
  const MAX_TOTAL_IMAGE_BYTES = 800 * 1024; // Firestore: höchstens 1 MB pro Dokument
  const esc = (s) => SF.escapeHtml(s);

  let lastActivity = Date.now();
  let products = [];
  let editingProductId = null;
  let pendingImages = [];

  // ---------- Anmeldung / Ansicht ----------
  function showOnly(id) {
    ["admin-login", "admin-dashboard"].forEach((s) =>
      document.getElementById(s).classList.toggle("hidden", s !== id)
    );
  }
  function showLogin(notice, type) {
    showOnly("admin-login");
    if (notice) SFUI.showMessage(document.getElementById("login-message"), notice, type || "error");
  }
  async function showDashboard() {
    const user = SFDB.currentUser();
    document.getElementById("admin-email-label").textContent = user ? user.email : "";
    showOnly("admin-dashboard");
    await renderAll();
  }

  async function handleAuthState(user) {
    if (!user) {
      showOnly("admin-login");
      return;
    }
    if (!user.isAdmin) {
      await SFDB.logout();
      showLogin(
        user.emailVerified
          ? "Dieses Konto hat keinen Zugriff auf den Admin-Bereich."
          : "Bitte bestätige zuerst deine E-Mail-Adresse (Link in der E-Mail) und melde dich dann erneut an.",
        "error"
      );
      return;
    }
    lastActivity = Date.now();
    await showDashboard();
  }

  function watchIdle() {
    ["click", "keydown"].forEach((ev) =>
      document.addEventListener(ev, () => (lastActivity = Date.now()), { passive: true })
    );
    setInterval(async () => {
      if (!document.getElementById("admin-dashboard").classList.contains("hidden") && Date.now() - lastActivity > IDLE_LIMIT_MS) {
        await SFDB.logout();
        showLogin("Du wurdest nach 30 Minuten ohne Aktivität automatisch abgemeldet.", "error");
      }
    }, 60 * 1000);
  }

  function setupLogin() {
    const form = document.getElementById("login-form");
    const msg = document.getElementById("login-message");
    const btn = document.getElementById("login-submit");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = SF.clampText(document.getElementById("login-email").value, 100);
      const pw = document.getElementById("login-password").value;
      if (!email || !pw) {
        SFUI.showMessage(msg, "Bitte gib E-Mail-Adresse und Passwort ein.", "error");
        return;
      }
      btn.disabled = true;
      btn.textContent = "Einen Moment …";
      try {
        await SFDB.login(email, pw);
        form.reset();
        SFUI.hideMessage(msg);
        // Weiter geht es in handleAuthState (onAuthChange)
        await handleAuthState(SFDB.currentUser());
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      } finally {
        btn.disabled = false;
        btn.textContent = "Anmelden";
      }
    });

    document.getElementById("admin-reset-link").addEventListener("click", async (e) => {
      e.preventDefault();
      const email = SF.clampText(document.getElementById("login-email").value, 100);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        SFUI.showMessage(msg, "Bitte gib oben deine E-Mail-Adresse ein und tippe dann noch einmal auf „Passwort vergessen?“.", "error");
        return;
      }
      try {
        await SFDB.resetPassword(email);
        SFUI.showMessage(msg, "Falls es ein Konto mit dieser E-Mail-Adresse gibt, haben wir dir einen Link geschickt (auch im Spam-Ordner nachsehen).", "success");
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      }
    });
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

  function loadError(tbodyId, cols, err) {
    document.getElementById(tbodyId).innerHTML = `<tr><td colspan="${cols}" class="table-empty">${esc(SFDB.errorMessage(err))}</td></tr>`;
  }

  async function guarded(fn) {
    try {
      await fn();
    } catch (err) {
      alert(SFDB.errorMessage(err));
    }
  }

  // ---------- Produkte ----------
  async function renderProducts() {
    const el = document.getElementById("product-table-body");
    try {
      products = await SFDB.getProducts();
    } catch (err) {
      loadError("product-table-body", 8, err);
      return;
    }
    if (products.length === 0) {
      el.innerHTML = `<tr><td colspan="8" class="table-empty">Noch keine Produkte angelegt.</td></tr>`;
      return;
    }
    el.innerHTML = products
      .map((p) => {
        const id = esc(p.id);
        const remaining = SF.getProductRemaining(p);
        const soldOut = remaining !== null && remaining <= 0;
        const stockBadge =
          remaining === null
            ? `unbegrenzt<br><span class="hint">${p.sold} verkauft</span>`
            : soldOut
            ? `<span class="badge badge-declined">ausverkauft</span>`
            : `${remaining} / ${Number(p.stock)} übrig`;
        const thumb =
          p.images && p.images[0]
            ? `<img src="${esc(p.images[0])}" alt="" class="admin-thumb">`
            : `<span class="admin-thumb" style="background:${SF.safeColor(p.color, "#999999")};"></span>`;
        return `
      <tr>
        <td>${thumb}</td>
        <td>${esc(p.name)}</td>
        <td>${esc(p.description || "")}</td>
        <td>${SF.formatPrice(p.price)}</td>
        <td>${esc((p.sizes || []).join(", "))}</td>
        <td>${stockBadge}</td>
        <td><span class="badge ${p.active ? "badge-accepted" : ""}">${p.active ? "aktiv" : "inaktiv"}</span></td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-small" data-edit-product="${id}" aria-label="${esc(p.name)} bearbeiten">Bearbeiten</button>
          <button class="btn btn-outline btn-small" data-toggle="${id}" aria-label="${esc(p.name)} ${p.active ? "deaktivieren" : "aktivieren"}">${p.active ? "Deaktivieren" : "Aktivieren"}</button>
          <button class="btn btn-danger btn-small" data-delete-product="${id}" aria-label="${esc(p.name)} löschen">Löschen</button>
        </td>
      </tr>`;
      })
      .join("");

    el.querySelectorAll("[data-toggle]").forEach((btn) =>
      btn.addEventListener("click", () =>
        guarded(async () => {
          const p = products.find((x) => x.id === btn.getAttribute("data-toggle"));
          if (!p) return;
          await SFDB.setProductActive(p.id, !p.active);
          await renderProducts();
          renderStats();
        })
      )
    );
    el.querySelectorAll("[data-delete-product]").forEach((btn) =>
      btn.addEventListener("click", () =>
        guarded(async () => {
          const id = btn.getAttribute("data-delete-product");
          if (!confirm("Dieses Produkt wirklich löschen?")) return;
          await SFDB.deleteProduct(id);
          if (editingProductId === id) exitEditMode();
          await renderProducts();
          renderStats();
        })
      )
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
    const p = products.find((x) => x.id === id);
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

  function totalImageBytes() {
    return pendingImages.reduce((n, src) => n + SF.dataUrlBytes(src), 0);
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
          const img = await SF.resizeImageFile(file, 800, 150 * 1024);
          if (totalImageBytes() + SF.dataUrlBytes(img) > MAX_TOTAL_IMAGE_BYTES) {
            problems.push(`„${file.name}“ passt nicht mehr dazu: Alle Bilder eines Produkts zusammen dürfen höchstens etwa 800 KB groß sein.`);
            continue;
          }
          pendingImages.push(img);
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

    form.addEventListener("submit", async (e) => {
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

      const submit = document.getElementById("product-form-submit");
      submit.disabled = true;
      submit.textContent = "Wird gespeichert …";
      const payload = { name, description, price, color, sizes, stock, images: pendingImages.slice() };
      try {
        if (editingProductId) await SFDB.updateProduct(editingProductId, payload);
        else await SFDB.addProduct(Object.assign({ active: true }, payload));
        exitEditMode();
        await renderProducts();
        renderStats();
        SFUI.showMessage(msg, "Gespeichert.", "success");
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      } finally {
        submit.disabled = false;
        submit.textContent = editingProductId ? "Änderungen speichern" : "Produkt hinzufügen";
      }
    });
  }

  // ---------- Bestellungen (Shop) ----------
  let orders = [];
  async function renderOrders() {
    const el = document.getElementById("orders-table-body");
    try {
      orders = await SFDB.getAllOrders();
    } catch (err) {
      loadError("orders-table-body", 6, err);
      return;
    }
    if (orders.length === 0) {
      el.innerHTML = `<tr><td colspan="6" class="table-empty">Noch keine Bestellungen.</td></tr>`;
      return;
    }
    el.innerHTML = orders
      .map((o) => {
        const id = esc(o.id);
        const items = (o.items || [])
          .map((i) => `${Number(i.qty)}x ${esc(i.name)} (${esc(i.size)})`)
          .join("<br>");
        const badgeClass = o.status === "abgeholt" ? "badge-accepted" : "badge-open";
        return `
        <tr>
          <td>${SF.formatDate(o.date)}<br><span class="hint">#${esc(String(o.id).slice(-6).toUpperCase())}</span></td>
          <td>${esc(o.customerName)}${o.klasse ? " (" + esc(o.klasse) + ")" : ""}${o.phone ? "<br><span class='hint'>Tel: " + esc(o.phone) + "</span>" : ""}${o.username ? "<br><span class='hint'>Konto: " + esc(o.username) + "</span>" : ""}</td>
          <td>${items}</td>
          <td>${SF.formatPrice(o.total)}</td>
          <td><span class="badge ${badgeClass}">${esc(SF.orderStatusLabel(o.status))}</span></td>
          <td class="actions-cell">
            ${o.status !== "abgeholt" ? `<button class="btn btn-secondary btn-small" data-collect="${id}">Als abgeholt markieren</button>` : ""}
            <button class="btn btn-danger btn-small" data-delete-order="${id}" aria-label="Bestellung #${esc(String(o.id).slice(-6).toUpperCase())} löschen">Löschen</button>
          </td>
        </tr>`;
      })
      .join("");

    el.querySelectorAll("[data-collect]").forEach((btn) =>
      btn.addEventListener("click", () =>
        guarded(async () => {
          await SFDB.updateOrderStatus(btn.getAttribute("data-collect"), "abgeholt");
          await renderOrders();
          renderStats();
        })
      )
    );
    el.querySelectorAll("[data-delete-order]").forEach((btn) =>
      btn.addEventListener("click", () =>
        guarded(async () => {
          if (!confirm("Diese Bestellung wirklich löschen?")) return;
          await SFDB.deleteOrder(btn.getAttribute("data-delete-order"));
          await renderOrders();
          renderStats();
        })
      )
    );
  }

  // ---------- Spezialbestellungen ----------
  let specials = [];
  function statusBadge(status) {
    const map = { offen: "badge-open", akzeptiert: "badge-accepted", abgelehnt: "badge-declined" };
    return `<span class="badge ${map[status] || ""}">${esc(status)}</span>`;
  }

  async function renderSpecial() {
    const el = document.getElementById("special-table-body");
    try {
      specials = await SFDB.getAllSpecialOrders();
    } catch (err) {
      loadError("special-table-body", 7, err);
      return;
    }
    if (specials.length === 0) {
      el.innerHTML = `<tr><td colspan="7" class="table-empty">Noch keine Spezialbestellungen.</td></tr>`;
      return;
    }
    el.innerHTML = specials
      .map((s) => {
        const id = esc(s.id);
        return `
      <tr>
        <td>${SF.formatDate(s.date)}</td>
        <td>${esc(s.name)}${s.klasse ? " (" + esc(s.klasse) + ")" : ""}${s.username ? "<br><span class='hint'>Konto: " + esc(s.username) + "</span>" : ""}</td>
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

    const setStatus = (attr, status) =>
      el.querySelectorAll(`[${attr}]`).forEach((btn) =>
        btn.addEventListener("click", () =>
          guarded(async () => {
            await SFDB.updateSpecialOrderStatus(btn.getAttribute(attr), status);
            await renderSpecial();
            renderStats();
          })
        )
      );
    setStatus("data-accept", "akzeptiert");
    setStatus("data-decline", "abgelehnt");
    el.querySelectorAll("[data-delete-special]").forEach((btn) =>
      btn.addEventListener("click", () =>
        guarded(async () => {
          if (!confirm("Diese Spezialbestellung wirklich löschen?")) return;
          await SFDB.deleteSpecialOrder(btn.getAttribute("data-delete-special"));
          await renderSpecial();
          renderStats();
        })
      )
    );
  }

  // ---------- Bewertungen ----------
  let reviews = [];
  async function renderReviewsAdmin() {
    const el = document.getElementById("reviews-table-body");
    try {
      reviews = await SFDB.getReviews();
    } catch (err) {
      loadError("reviews-table-body", 5, err);
      return;
    }
    if (reviews.length === 0) {
      el.innerHTML = `<tr><td colspan="5" class="table-empty">Noch keine Bewertungen.</td></tr>`;
      return;
    }
    el.innerHTML = reviews
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
      btn.addEventListener("click", () =>
        guarded(async () => {
          if (!confirm("Diese Bewertung wirklich löschen?")) return;
          await SFDB.deleteReview(btn.getAttribute("data-delete-review"));
          await renderReviewsAdmin();
          renderStats();
        })
      )
    );
  }

  // ---------- Kund:innen ----------
  let users = [];
  async function renderUsers() {
    const el = document.getElementById("users-table-body");
    try {
      users = await SFDB.getUsers();
    } catch (err) {
      loadError("users-table-body", 3, err);
      return;
    }
    if (users.length === 0) {
      el.innerHTML = `<tr><td colspan="3" class="table-empty">Noch keine registrierten Kund:innen.</td></tr>`;
      return;
    }
    el.innerHTML = users
      .map(
        (u) => `
      <tr>
        <td>${SF.formatDate(u.createdAt)}</td>
        <td>${esc(u.username)}</td>
        <td>${esc(u.email)}</td>
      </tr>`
      )
      .join("");
  }

  // ---------- Stats ----------
  function renderStats() {
    document.getElementById("stat-products").textContent = products.length;
    document.getElementById("stat-orders").textContent = orders.filter((o) => o.status === "offen").length;
    document.getElementById("stat-special").textContent = specials.filter((s) => s.status === "offen").length;
    document.getElementById("stat-reviews").textContent = reviews.length;
    document.getElementById("stat-users").textContent = users.length;
  }

  async function renderAll() {
    await Promise.all([renderProducts(), renderOrders(), renderSpecial(), renderReviewsAdmin(), renderUsers()]);
    renderStats();
  }

  // ---------- Einstellungen ----------
  function setupSettings() {
    const msg = document.getElementById("password-message");
    document.getElementById("admin-reset-btn").addEventListener("click", async () => {
      const user = SFDB.currentUser();
      if (!user) return;
      try {
        await SFDB.resetPassword(user.email);
        SFUI.showMessage(msg, "Wir haben dir einen Link an " + user.email + " geschickt (auch im Spam-Ordner nachsehen).", "success");
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      }
    });
    document.getElementById("logout-btn").addEventListener("click", async () => {
      await SFDB.logout();
      showLogin();
    });
    document.getElementById("refresh-btn").addEventListener("click", () => guarded(renderAll));
  }

  async function setup() {
    setupLogin();
    setupTabs();
    setupProductForm();
    setupSettings();
    watchIdle();
    await SFDB.ready;
    await handleAuthState(SFDB.currentUser());
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
