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
  let pendingImages = []; // { src, name, hex, hexTouched } – jedes Foto mit seiner Farbe

  // Farbnamen-Vorschläge mit passendem Farbkreis (man kann auch eigene Namen eintragen)
  const COLOR_PRESETS = [
    ["Schwarz", "#1b1b1b"], ["Weiß", "#ffffff"], ["Grau", "#8c8c8c"], ["Hellgrau", "#c9c9c9"],
    ["Dunkelgrau", "#4a4a4a"], ["Blau", "#1f5fbf"], ["Hellblau", "#86bce8"], ["Dunkelblau", "#1c2a4d"],
    ["Navy", "#1f2a44"], ["Türkis", "#1fa5a5"], ["Grün", "#2e7d32"], ["Hellgrün", "#8bc34a"],
    ["Dunkelgrün", "#1e4d2b"], ["Mint", "#a8e6cf"], ["Oliv", "#6b6b2e"], ["Gelb", "#f4d03f"],
    ["Orange", "#ef7d22"], ["Rot", "#c62828"], ["Bordeaux", "#6d1a2b"], ["Rosa", "#f4b6c8"],
    ["Pink", "#e84f8a"], ["Lila", "#7b4ea8"], ["Braun", "#6d4c35"], ["Beige", "#d9c7a3"],
    ["Creme", "#f3ead6"], ["Sand", "#cbb68e"],
  ];
  function presetHex(name) {
    const key = SF.colorKey(name).replace("weiss", "weiß");
    const hit = COLOR_PRESETS.find(([n]) => SF.colorKey(n) === key);
    return hit ? hit[1] : null;
  }

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
        const soldInfo = `<br><span class="hint">${Number(p.sold) || 0} verkauft</span>`;
        const stockBadge =
          (remaining === null
            ? "unbegrenzt"
            : soldOut
            ? `<span class="badge badge-declined">ausverkauft</span>`
            : `${remaining} übrig`) + soldInfo;
        const thumb =
          p.images && p.images[0]
            ? `<img src="${esc(p.images[0])}" alt="" class="admin-thumb">`
            : `<span class="admin-thumb" style="background:${SF.safeColor(p.color, "#999999")};"></span>`;
        const colors = SF.productColors(p);
        const colorDots = colors.length
          ? `<div class="swatch-mini-row">${colors
              .map(
                (c) =>
                  `<span class="swatch-dot swatch-dot-sm" style="background:${SF.safeColor(c.hex)}" title="${esc(c.name)}" aria-hidden="true"></span>`
              )
              .join("")}<span class="sr-only">Farben: ${esc(colors.map((c) => c.name).join(", "))}</span></div>`
          : p.images && p.images.length
          ? `<br><span class="hint">Fotos ohne Farbe – bitte bearbeiten</span>`
          : "";
        return `
      <tr>
        <td>${thumb}</td>
        <td>${esc(p.name)}</td>
        <td>${esc(p.description || "")}</td>
        <td>${SF.formatPrice(p.price)}</td>
        <td>${esc((p.sizes || []).join(", "))}${colorDots}</td>
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

  // Jedes Foto mit Farbname und Farbkreis. Die Eingaben werden über
  // setupImageColorFields() (einmal, per Event-Delegation) ausgewertet.
  function renderImagePreview() {
    const el = document.getElementById("pf-image-preview");
    el.innerHTML = pendingImages
      .map(
        (img, i) =>
          `<div class="img-preview">
            <div class="img-preview-pic">
              <img src="${esc(img.src)}" alt="Bild ${i + 1}">
              <button type="button" data-remove-image="${i}" aria-label="Bild ${i + 1} entfernen">&times;</button>
            </div>
            <label for="pf-img-name-${i}" class="img-color-label">Farbe<span class="sr-only"> von Bild ${i + 1}</span></label>
            <div class="img-color">
              <input type="color" id="pf-img-hex-${i}" data-img-hex="${i}" value="${SF.safeColor(img.hex, "#9e9e9e")}" aria-label="Farbkreis für Bild ${i + 1}">
              <input type="text" id="pf-img-name-${i}" data-img-name="${i}" list="pf-color-names" maxlength="20"
                placeholder="z. B. Blau" autocomplete="off" value="${esc(img.name)}">
            </div>
          </div>`
      )
      .join("");
    // Die einzelne Farbe wird nur noch gebraucht, wenn es gar kein Foto gibt
    document.getElementById("pf-color-field").classList.toggle("hidden", pendingImages.length > 0);
    document.getElementById("pf-images-hint").classList.toggle("hidden", pendingImages.length === 0);
  }

  function setupImageColorFields() {
    const el = document.getElementById("pf-image-preview");
    el.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-image]");
      if (!btn) return;
      pendingImages.splice(parseInt(btn.getAttribute("data-remove-image"), 10), 1);
      renderImagePreview();
    });
    el.addEventListener("input", (e) => {
      const t = e.target;
      if (t.hasAttribute("data-img-name")) {
        const i = parseInt(t.getAttribute("data-img-name"), 10);
        const img = pendingImages[i];
        img.name = t.value;
        t.removeAttribute("aria-invalid");
        // Hinweis "Farbe fehlt" weg, sobald jedes Foto eine Farbe hat
        const msg = document.getElementById("product-message");
        if (msg.dataset.kind === "color" && pendingImages.every((x) => SF.colorKey(x.name))) {
          SFUI.hideMessage(msg);
          delete msg.dataset.kind;
        }
        // Gleicher Name wie bei einem anderen Foto -> gleicher Kreis; sonst Vorschlag aus der Liste
        const same = pendingImages.find((x, j) => j !== i && SF.colorKey(x.name) && SF.colorKey(x.name) === SF.colorKey(img.name));
        const hex = same ? same.hex : !img.hexTouched ? presetHex(img.name) : null;
        if (hex) {
          img.hex = hex;
          document.getElementById(`pf-img-hex-${i}`).value = hex;
        }
      } else if (t.hasAttribute("data-img-hex")) {
        const i = parseInt(t.getAttribute("data-img-hex"), 10);
        const img = pendingImages[i];
        img.hex = SF.safeColor(t.value, "#9e9e9e");
        img.hexTouched = true;
        // Alle Fotos mit demselben Farbnamen bekommen denselben Kreis
        pendingImages.forEach((x, j) => {
          if (j !== i && SF.colorKey(x.name) && SF.colorKey(x.name) === SF.colorKey(img.name)) {
            x.hex = img.hex;
            x.hexTouched = true;
            document.getElementById(`pf-img-hex-${j}`).value = img.hex;
          }
        });
      }
    });
  }

  // Gleich geschriebene Farben vereinheitlichen ("blau" und "Blau" = eine Farbe, ein Kreis)
  function imageColorsForSave() {
    const seen = {};
    return pendingImages.map((img) => {
      let name = SF.clampText(img.name, 20);
      name = name.charAt(0).toUpperCase() + name.slice(1);
      const key = SF.colorKey(name);
      if (!seen[key]) seen[key] = { name, hex: SF.safeColor(img.hex, "#9e9e9e") };
      return seen[key];
    });
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
    // Angezeigt wird, wie viele Stück NOCH DA sind (nicht der ursprüngliche Bestand)
    const remaining = SF.getProductRemaining(p);
    document.getElementById("pf-stock").value = remaining === null ? "" : remaining;
    const info = document.getElementById("pf-stock-info");
    info.textContent = `Bisher verkauft: ${Number(p.sold) || 0} Stück. Trag hier ein, wie viele ab jetzt noch zu haben sind.`;
    info.classList.remove("hidden");
    pendingImages = (p.images || []).map((src, i) => {
      const c = (p.imageColors || [])[i] || {};
      return { src, name: c.name || "", hex: SF.safeColor(c.hex, "#9e9e9e"), hexTouched: !!c.name };
    });
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
    document.getElementById("pf-stock-info").classList.add("hidden");
  }

  function totalImageBytes() {
    return pendingImages.reduce((n, img) => n + SF.dataUrlBytes(img.src), 0);
  }

  function setupProductForm() {
    const form = document.getElementById("product-form");
    const msg = document.getElementById("product-message");
    document.getElementById("pf-color").value = "#2c6e6b";
    document.getElementById("pf-color-names").innerHTML = COLOR_PRESETS.map(([n]) => `<option value="${esc(n)}"></option>`).join("");
    setupImageColorFields();

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
          pendingImages.push({ src: img, name: "", hex: "#9e9e9e", hexTouched: false });
        } catch (err) {
          problems.push(`„${file.name}“ konnte nicht gelesen werden.`);
        }
      }
      e.target.value = "";
      const firstNew = pendingImages.findIndex((x) => !SF.colorKey(x.name));
      renderImagePreview();
      if (problems.length) SFUI.showMessage(msg, problems.join(" "), "error");
      else SFUI.hideMessage(msg);
      // Gleich zur Farbe des ersten neuen Fotos springen
      if (firstNew > -1 && !problems.length) document.getElementById(`pf-img-name-${firstNew}`).focus();
    });

    document.getElementById("product-form-cancel").addEventListener("click", exitEditMode);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = SF.clampText(document.getElementById("pf-name").value, 60);
      const description = SF.clampText(document.getElementById("pf-description").value, 500);
      const price = Math.round(parseFloat(document.getElementById("pf-price").value) * 100) / 100;
      const color = SF.safeColor(document.getElementById("pf-color").value);
      const stockRaw = document.getElementById("pf-stock").value;
      const available = stockRaw === "" ? null : Math.max(0, parseInt(stockRaw, 10) || 0);
      const sizes = SF.clampText(document.getElementById("pf-sizes").value, 120)
        .split(",")
        .map((s) => s.trim().slice(0, 10))
        .filter(Boolean);

      let error = null;
      if (!name) error = "Bitte einen Namen eingeben.";
      else if (!(price > 0 && price <= 1000)) error = "Bitte einen Preis zwischen 0,01 und 1000 € eingeben.";
      else if (sizes.length === 0) error = "Bitte mindestens eine Größe angeben.";
      delete msg.dataset.kind;
      const missingColor = pendingImages.findIndex((x) => !SF.colorKey(x.name));
      if (!error && missingColor > -1) {
        error = `Bitte bei jedem Foto eine Farbe eintragen (z. B. Blau) – bei Bild ${missingColor + 1} fehlt sie noch.`;
        const field = document.getElementById(`pf-img-name-${missingColor}`);
        field.setAttribute("aria-invalid", "true");
        field.focus();
      }
      if (error) {
        SFUI.showMessage(msg, error, "error");
        if (missingColor > -1) msg.dataset.kind = "color";
        return;
      }
      SFUI.hideMessage(msg);

      const submit = document.getElementById("product-form-submit");
      submit.disabled = true;
      submit.textContent = "Wird gespeichert …";
      const payload = {
        name,
        description,
        price,
        color,
        sizes,
        available,
        images: pendingImages.map((x) => x.src),
        imageColors: imageColorsForSave(),
      };
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
          .map((i) => `${Number(i.qty)}x ${esc(i.name)} (${esc(i.size)}${i.color ? ", " + esc(i.color) : ""})`)
          .join("<br>");
        return `
        <tr>
          <td>${SF.formatDate(o.date)}<br><span class="hint">#${esc(String(o.id).slice(-6).toUpperCase())}</span></td>
          <td>${esc(o.customerName)}${o.klasse ? " (" + esc(o.klasse) + ")" : ""}${o.phone ? "<br><span class='hint'>Tel: " + esc(o.phone) + "</span>" : ""}${o.username ? "<br><span class='hint'>Konto: " + esc(o.username) + "</span>" : ""}</td>
          <td>${items}</td>
          <td>${SF.formatPrice(o.total)}</td>
          <td>${SF.pickupBadgeHtml(o.status)}</td>
          <td class="actions-cell">
            ${pickupButtons(o.status, id, "offen")}
            <button class="btn btn-danger btn-small" data-delete-order="${id}" aria-label="Bestellung #${esc(String(o.id).slice(-6).toUpperCase())} löschen">Löschen</button>
          </td>
        </tr>`;
      })
      .join("");

    el.querySelectorAll("[data-set-status]").forEach((btn) =>
      btn.addEventListener("click", () =>
        guarded(async () => {
          const id = btn.getAttribute("data-id");
          const status = btn.getAttribute("data-set-status");
          const o = orders.find((x) => x.id === id);
          SFUI.hideMessage(document.getElementById("orders-notice"));
          await SFDB.updateOrderStatus(id, status);
          await renderOrders();
          renderStats();
          if (status === "abholbereit" && o) {
            await notifyReady("orders-notice", { collection: "orders", orderId: o.id });
          }
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

  // E-Mail „Deine Bestellung ist abholbereit“ an die Kundschaft. Der Status ist
  // zu diesem Zeitpunkt schon gespeichert; klappt die E-Mail nicht, steht es
  // trotzdem auf der Website – das sagen wir hier deutlich dazu.
  async function notifyReady(noticeId, data) {
    const box = document.getElementById(noticeId);
    if (!SFDB.readyEmailEnabled()) {
      SFUI.showMessage(box, "Als abholbereit markiert. (E-Mail-Benachrichtigung ist noch nicht eingerichtet – die Kundschaft sieht es auf der Website.)", "success");
      return;
    }
    SFUI.showMessage(box, "Als abholbereit markiert – E-Mail wird gesendet …", "success");
    try {
      const r = await SFDB.sendReadyEmail(data);
      const rest = typeof r.heuteNochMoeglich === "number" ? ` (heute noch ${r.heuteNochMoeglich} E-Mails möglich)` : "";
      SFUI.showMessage(
        box,
        r.already
          ? `Als abholbereit markiert. Die E-Mail an ${r.email} wurde gerade eben schon gesendet.`
          : `Als abholbereit markiert und E-Mail an ${r.email} gesendet${rest}.`,
        "success"
      );
    } catch (err) {
      const why = SFDB.errorMessage(err).replace(/[.!]?\s*$/, ".");
      SFUI.showMessage(box, "Als abholbereit markiert, aber die E-Mail konnte nicht gesendet werden: " + why + " Die Kundschaft sieht es trotzdem auf der Website.", "error");
    }
  }

  // Knöpfe für den Abhol-Status. notReady = Status, zu dem „Nicht abholbereit“
  // zurückkehrt („offen“ bei Shop-, „akzeptiert“ bei Spezialbestellungen).
  function pickupButtons(status, id, notReady) {
    if (status === "abholbereit") {
      return `<button class="btn btn-secondary btn-small" data-set-status="abgeholt" data-id="${id}">Als abgeholt markieren</button>
        <button class="btn btn-outline btn-small" data-set-status="${notReady}" data-id="${id}">Doch nicht abholbereit</button>`;
    }
    if (status === "abgeholt") {
      return `<button class="btn btn-outline btn-small" data-set-status="abholbereit" data-id="${id}">Doch nicht abgeholt</button>`;
    }
    return `<button class="btn btn-secondary btn-small" data-set-status="abholbereit" data-id="${id}">Abholbereit</button>`;
  }

  // ---------- Spezialbestellungen ----------
  let specials = [];

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
        <td><div class="badge-row">${SF.specialDecisionBadgeHtml(s.status)} ${SF.pickupBadgeHtml(s.status)}</div></td>
        <td class="actions-cell">
          ${s.status === "offen" || s.status === "abgelehnt" ? `<button class="btn btn-secondary btn-small" data-set-status="akzeptiert" data-id="${id}">Annehmen</button>` : ""}
          ${s.status === "offen" || s.status === "akzeptiert" ? `<button class="btn btn-outline btn-small" data-set-status="abgelehnt" data-id="${id}">Ablehnen</button>` : ""}
          ${s.status === "offen" || s.status === "abgelehnt" ? "" : pickupButtons(s.status, id, "akzeptiert")}
          <button class="btn btn-danger btn-small" data-delete-special="${id}">Löschen</button>
        </td>
      </tr>`;
      })
      .join("");

    el.querySelectorAll("[data-set-status]").forEach((btn) =>
      btn.addEventListener("click", () =>
        guarded(async () => {
          const id = btn.getAttribute("data-id");
          const status = btn.getAttribute("data-set-status");
          const o = specials.find((x) => x.id === id);
          SFUI.hideMessage(document.getElementById("special-notice"));
          await SFDB.updateSpecialOrderStatus(id, status);
          await renderSpecial();
          renderStats();
          if (status === "abholbereit" && o) {
            await notifyReady("special-notice", { collection: "specialOrders", orderId: o.id });
          }
        })
      )
    );
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
