/* Schülerfirma Siebdruck – gemeinsame Datenschicht
 *
 * Es gibt (noch) keinen Server: Alles wird im localStorage des Browsers
 * gespeichert. Das reicht für den ersten Auftritt der Website und zum
 * Ausprobieren des Admin-Bereichs. Wichtig zu wissen: Daten, die auf einem
 * Handy/Computer eingegeben werden, tauchen NICHT automatisch auf einem
 * anderen Gerät auf. Für "echten" Betrieb mit Bestellungen von überall
 * braucht ihr später einen kleinen Server / eine Datenbank im Hintergrund.
 */

const SF = (() => {
  const KEYS = {
    products: "sf_products",
    orders: "sf_orders",
    specialOrders: "sf_special_orders",
    reviews: "sf_reviews",
    adminPassword: "sf_admin_password",
    users: "sf_users",
  };

  const DEFAULT_PASSWORD = "1234";

  const DEFAULT_PRODUCTS = [
    {
      id: "p1",
      name: "Waldtier-Pulli",
      description: "Hoodie mit unserem Waldtier-Motiv, von uns von Hand im Siebdruck bedruckt.",
      price: 18,
      color: "#4f7d54",
      sizes: ["128", "140", "152", "164", "S", "M", "L"],
      active: true,
    },
    {
      id: "p2",
      name: "Sonnen-Pulli",
      description: "Fröhliches Sonnen-Motiv im Siebdruck, gedruckt von unserer Klein-Gruppe.",
      price: 18,
      color: "#e0632c",
      sizes: ["140", "152", "164", "S", "M", "L", "XL"],
      active: true,
    },
    {
      id: "p3",
      name: "Berg-Pulli",
      description: "Motiv mit Bergen und Sonnenaufgang.",
      price: 19,
      color: "#2c6e6b",
      sizes: ["152", "164", "S", "M", "L"],
      active: true,
    },
    {
      id: "p4",
      name: "Schülerfirma-Logo-Pulli",
      description: "Schlichter Pulli mit dem Logo unserer Schülerfirma auf der Brust.",
      price: 16,
      color: "#2b2620",
      sizes: ["128", "140", "152", "164", "S", "M", "L", "XL"],
      active: true,
    },
  ];

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("SF: konnte", key, "nicht lesen", e);
      return fallback;
    }
  }

  // Gibt false zurück, wenn der Browser-Speicher voll/gesperrt ist, damit
  // die Oberfläche eine Fehlermeldung zeigen kann statt still zu scheitern.
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("SF: konnte", key, "nicht speichern", e);
      return false;
    }
  }

  function ensureSeeded() {
    if (localStorage.getItem(KEYS.products) === null) {
      write(KEYS.products, DEFAULT_PRODUCTS);
    }
    if (localStorage.getItem(KEYS.orders) === null) {
      write(KEYS.orders, []);
    }
    if (localStorage.getItem(KEYS.specialOrders) === null) {
      write(KEYS.specialOrders, []);
    }
    if (localStorage.getItem(KEYS.reviews) === null) {
      write(KEYS.reviews, []);
    }
    if (localStorage.getItem(KEYS.users) === null) {
      write(KEYS.users, []);
    }
  }

  // Bereinigt Daten aus älteren Versionen der Website, die schon in
  // Browsern von Besucher:innen gespeichert sind.
  const LEGACY_DESCRIPTIONS = {
    p1: "Handgesiebdruckter Hoodie mit unserem Waldtier-Motiv. Jedes Stück ein Unikat.",
    p3: "Motiv mit Bergen und Sonnenaufgang – unser Bestseller.",
  };
  function migrateLegacyData() {
    const reviews = read(KEYS.reviews, []);
    const realReviews = reviews.filter((r) => r.id !== "r_seed1");
    if (realReviews.length !== reviews.length) write(KEYS.reviews, realReviews);

    const products = read(KEYS.products, []);
    let changed = false;
    products.forEach((p) => {
      if (LEGACY_DESCRIPTIONS[p.id] && p.description === LEGACY_DESCRIPTIONS[p.id]) {
        p.description = DEFAULT_PRODUCTS.find((d) => d.id === p.id).description;
        changed = true;
      }
    });
    if (changed) write(KEYS.products, products);
  }

  ensureSeeded();
  migrateLegacyData();

  function uid(prefix) {
    return (
      (prefix || "id") +
      "_" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 8)
    );
  }

  function escapeHtml(str) {
    return String(str === undefined || str === null ? "" : str).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );
  }

  function formatPrice(n) {
    return Number(n).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";
  }

  function formatDate(iso, dateOnly) {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return escapeHtml(iso);
      const datePart = d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (dateOnly) return datePart;
      return datePart + " " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return escapeHtml(iso);
    }
  }

  function safeColor(c, fallback) {
    return /^#[0-9a-f]{6}$/i.test(String(c)) ? c : fallback || "#2c6e6b";
  }

  function clampText(value, maxLen) {
    return String(value === undefined || value === null ? "" : value).trim().slice(0, maxLen);
  }

  // Wiederverwendbares +/- Mengenfeld (Shop, Produkt-Detailansicht,
  // Spezialbestellungen) – ein Widget statt unterschiedlicher Eingabefelder.
  function qtyStepperHtml(id, max, disabled) {
    const maxAttr = max !== null && max !== undefined ? `max="${Number(max)}"` : "";
    return `
      <div class="qty-stepper">
        <button type="button" class="qty-btn" data-qty-dec="${id}" aria-label="Menge verringern" ${disabled ? "disabled" : ""}>&minus;</button>
        <input type="number" id="${id}" min="1" ${maxAttr} value="1" readonly aria-live="polite" ${disabled ? "disabled" : ""}>
        <button type="button" class="qty-btn" data-qty-inc="${id}" aria-label="Menge erhöhen" ${disabled ? "disabled" : ""}>+</button>
      </div>
    `;
  }

  function wireQtyStepper(id) {
    const input = document.getElementById(id);
    const dec = document.querySelector(`[data-qty-dec="${id}"]`);
    const inc = document.querySelector(`[data-qty-inc="${id}"]`);
    if (!input || !dec || !inc) return;

    function update() {
      const min = parseInt(input.min, 10) || 1;
      const max = input.max !== "" ? parseInt(input.max, 10) : null;
      let val = parseInt(input.value, 10) || min;
      if (val < min) val = min;
      if (max !== null && val > max) val = max;
      input.value = val;
      dec.disabled = input.disabled || val <= min;
      inc.disabled = input.disabled || (max !== null && val >= max);
    }
    dec.addEventListener("click", () => {
      input.value = (parseInt(input.value, 10) || 1) - 1;
      update();
    });
    inc.addEventListener("click", () => {
      input.value = (parseInt(input.value, 10) || 1) + 1;
      update();
    });
    update();
  }

  // Anzeigetext für den Shop-Bestellstatus (der gespeicherte Wert bleibt
  // "offen"/"abgeholt", nur die Anzeige soll freundlicher sein).
  function orderStatusLabel(status) {
    if (status === "offen") return "Noch nicht abgeholt";
    if (status === "abgeholt") return "Abgeholt";
    return status;
  }

  // Verkleinert ein Bild (z. B. Produktfoto) auf eine sinnvolle Größe und
  // gibt es als komprimierte data:-URL zurück, damit es platzsparend im
  // localStorage gespeichert werden kann (es gibt ja keinen Server/Upload).
  function resizeImageFile(file, maxDim) {
    maxDim = maxDim || 900;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Bild konnte nicht gelesen werden"));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // ---- Products ----
  function getProducts() {
    return read(KEYS.products, []);
  }
  function getActiveProducts() {
    return getProducts().filter((p) => p.active !== false);
  }
  function saveProducts(list) {
    return write(KEYS.products, list);
  }
  function addProduct(product) {
    const list = getProducts();
    list.push(Object.assign({ id: uid("p"), active: true }, product));
    return saveProducts(list);
  }
  function updateProduct(id, changes) {
    const list = getProducts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    list[idx] = Object.assign({}, list[idx], changes);
    return saveProducts(list);
  }
  function deleteProduct(id) {
    saveProducts(getProducts().filter((p) => p.id !== id));
  }
  function getProductById(id) {
    return getProducts().find((p) => p.id === id) || null;
  }
  // Zählt, wie viele Stück eines Produkts schon in Bestellungen stecken
  // (egal ob abgeholt oder nicht - die Ware ist dafür reserviert/weg).
  function getProductSoldCount(productId) {
    return getOrders().reduce((sum, order) => {
      const inOrder = (order.items || [])
        .filter((i) => i.productId === productId)
        .reduce((s, i) => s + (i.qty || 0), 0);
      return sum + inOrder;
    }, 0);
  }
  // Gibt zurück, wie viele Stück noch verfügbar sind, oder null wenn die
  // Menge nicht begrenzt ist (kein stock-Feld gesetzt).
  function getProductRemaining(product) {
    if (product.stock === null || product.stock === undefined || product.stock === "") {
      return null;
    }
    const remaining = Number(product.stock) - getProductSoldCount(product.id);
    return Math.max(0, remaining);
  }

  // ---- Orders (Shop) ----
  function getOrders() {
    return read(KEYS.orders, []);
  }
  function addOrder(order) {
    const list = getOrders();
    const full = Object.assign(
      {
        id: uid("o"),
        date: new Date().toISOString(),
        status: "offen",
      },
      order
    );
    list.unshift(full);
    return write(KEYS.orders, list) ? full : null;
  }
  function updateOrder(id, changes) {
    const list = getOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx !== -1) {
      list[idx] = Object.assign({}, list[idx], changes);
      write(KEYS.orders, list);
    }
  }
  function deleteOrder(id) {
    write(KEYS.orders, getOrders().filter((o) => o.id !== id));
  }
  // Neue Bestellungen hängen an der Konto-ID; ältere (ohne userId) werden
  // noch über den Benutzernamen zugeordnet.
  function belongsTo(order, user) {
    if (!user) return false;
    if (order.userId) return order.userId === user.id;
    return !!order.username && order.username.toLowerCase() === String(user.username || "").toLowerCase();
  }
  function getOrdersForUser(user) {
    return getOrders().filter((o) => belongsTo(o, user));
  }

  // ---- Special orders (Spezialbestellungen) ----
  function getSpecialOrders() {
    return read(KEYS.specialOrders, []);
  }
  function addSpecialOrder(order) {
    const list = getSpecialOrders();
    const full = Object.assign(
      {
        id: uid("so"),
        date: new Date().toISOString(),
        status: "offen",
      },
      order
    );
    list.unshift(full);
    return write(KEYS.specialOrders, list) ? full : null;
  }
  function updateSpecialOrder(id, changes) {
    const list = getSpecialOrders();
    const idx = list.findIndex((o) => o.id === id);
    if (idx !== -1) {
      list[idx] = Object.assign({}, list[idx], changes);
      write(KEYS.specialOrders, list);
    }
  }
  function deleteSpecialOrder(id) {
    write(KEYS.specialOrders, getSpecialOrders().filter((o) => o.id !== id));
  }
  function getSpecialOrdersForUser(user) {
    return getSpecialOrders().filter((o) => belongsTo(o, user));
  }

  // ---- Reviews / Feedback ----
  function getReviews() {
    return read(KEYS.reviews, []);
  }
  function addReview(review) {
    const list = getReviews();
    const full = Object.assign(
      { id: uid("r"), date: new Date().toISOString() },
      review
    );
    list.unshift(full);
    return write(KEYS.reviews, list) ? full : null;
  }
  function deleteReview(id) {
    write(KEYS.reviews, getReviews().filter((r) => r.id !== id));
  }

  // ---- Passwörter ----
  // PBKDF2 mit zufälligem Salt pro Passwort, gespeichert als
  // "pbkdf2$<iterationen>$<salt>$<hash>". Ältere Einträge (SHA-256 ohne
  // Salt bzw. Klartext beim Admin) werden beim nächsten Login automatisch
  // auf dieses Format umgestellt.
  const PBKDF2_ITERATIONS = 150000;

  function bytesToB64(bytes) {
    let s = "";
    bytes.forEach((b) => (s += String.fromCharCode(b)));
    return btoa(s);
  }
  function b64ToBytes(b64) {
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }
  function hasSubtleCrypto() {
    return !!(window.crypto && window.crypto.subtle);
  }
  async function pbkdf2(password, salt, iterations) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations },
      key,
      256
    );
    return new Uint8Array(bits);
  }
  async function hashPassword(password) {
    if (!hasSubtleCrypto()) {
      throw new Error("Dieser Browser unterstützt keine sichere Passwort-Speicherung.");
    }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
    return ["pbkdf2", PBKDF2_ITERATIONS, bytesToB64(salt), bytesToB64(hash)].join("$");
  }
  function timingSafeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }
  // Gibt { ok, needsUpgrade } zurück.
  async function verifyPassword(password, stored) {
    if (typeof stored !== "string" || !stored) return { ok: false, needsUpgrade: false };
    if (stored.startsWith("pbkdf2$")) {
      const [, iterStr, saltB64, hashB64] = stored.split("$");
      const iterations = parseInt(iterStr, 10);
      const hash = await pbkdf2(password, b64ToBytes(saltB64), iterations);
      const ok = timingSafeEqual(bytesToB64(hash), hashB64);
      return { ok, needsUpgrade: ok && iterations < PBKDF2_ITERATIONS };
    }
    const legacy = await legacyHash(password);
    const ok = timingSafeEqual(legacy, stored);
    return { ok, needsUpgrade: ok };
  }
  async function legacyHash(text) {
    if (hasSubtleCrypto()) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    let h = 0;
    const str = String(text);
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return "fallback_" + h;
  }

  // ---- Admin-Passwort ----
  // Gespeichert wird { hash, isDefault }. Solange nichts gespeichert ist,
  // gilt das Startpasswort "1234" – das muss nach dem ersten Login sofort
  // geändert werden.
  function readAdminRecord() {
    const rec = read(KEYS.adminPassword, null);
    if (rec === null) return { legacyPlain: DEFAULT_PASSWORD, isDefault: true };
    if (typeof rec === "string") return { legacyPlain: rec, isDefault: rec === DEFAULT_PASSWORD };
    return rec;
  }
  async function verifyAdminPassword(pw) {
    const rec = readAdminRecord();
    if (rec.legacyPlain !== undefined) {
      const ok = timingSafeEqual(String(pw), rec.legacyPlain);
      if (ok && hasSubtleCrypto()) {
        write(KEYS.adminPassword, { hash: await hashPassword(pw), isDefault: rec.isDefault });
      }
      return ok;
    }
    return (await verifyPassword(pw, rec.hash)).ok;
  }
  async function setAdminPassword(pw) {
    write(KEYS.adminPassword, { hash: await hashPassword(pw), isDefault: false });
  }
  function adminPasswordIsDefault() {
    return !!readAdminRecord().isDefault;
  }

  // ---- Schutz gegen Durchprobieren (Rate-Limit) ----
  // Nach mehreren Fehlversuchen wird der Login für eine Weile gesperrt,
  // jede weitere Sperre dauert doppelt so lang (max. 15 Minuten).
  const RL_PREFIX = "sf_rl_";
  function lockSecondsLeft(name) {
    const rec = read(RL_PREFIX + name, null);
    if (!rec || !rec.until) return 0;
    return Math.max(0, Math.ceil((rec.until - Date.now()) / 1000));
  }
  function registerFailure(name, maxAttempts, baseLockSeconds) {
    const rec = read(RL_PREFIX + name, { fails: 0, locks: 0, until: 0 });
    rec.fails += 1;
    if (rec.fails >= maxAttempts) {
      const seconds = Math.min(baseLockSeconds * Math.pow(2, rec.locks), 900);
      rec.until = Date.now() + seconds * 1000;
      rec.locks += 1;
      rec.fails = 0;
    }
    write(RL_PREFIX + name, rec);
    return lockSecondsLeft(name);
  }
  function clearFailures(name) {
    localStorage.removeItem(RL_PREFIX + name);
  }
  // Einfache Abkühlzeit zwischen zwei Aktionen (z. B. Code-E-Mails).
  function cooldownSecondsLeft(name, seconds) {
    const last = read(RL_PREFIX + "cd_" + name, 0);
    return Math.max(0, Math.ceil((last + seconds * 1000 - Date.now()) / 1000));
  }
  function startCooldown(name) {
    write(RL_PREFIX + "cd_" + name, Date.now());
  }

  // ---- Kundenkonten ----
  function getUsers() {
    return read(KEYS.users, []);
  }
  function findUserByUsername(username) {
    const needle = String(username || "").trim().toLowerCase();
    return getUsers().find((u) => u.username.toLowerCase() === needle) || null;
  }
  function findUserByEmail(email) {
    const needle = String(email || "").trim().toLowerCase();
    return getUsers().find((u) => u.email.toLowerCase() === needle) || null;
  }
  function addUser(user) {
    const list = getUsers();
    const full = Object.assign(
      { id: uid("u"), registeredAt: new Date().toISOString() },
      user
    );
    list.unshift(full);
    return write(KEYS.users, list) ? full : null;
  }
  function updateUser(id, changes) {
    const list = getUsers();
    const idx = list.findIndex((u) => u.id === id);
    if (idx !== -1) {
      list[idx] = Object.assign({}, list[idx], changes);
      write(KEYS.users, list);
    }
  }
  // Löscht das Konto und löst die Bestellungen davon, damit ein späteres
  // Konto mit demselben Namen sie nicht sehen kann. Name/Telefon bleiben
  // für die Abwicklung im Admin-Bereich erhalten.
  function deleteUser(id) {
    const user = getUsers().find((u) => u.id === id);
    if (user) {
      [KEYS.orders, KEYS.specialOrders].forEach((key) => {
        const list = read(key, []);
        let changed = false;
        list.forEach((o) => {
          if (belongsTo(o, user)) {
            o.userId = null;
            o.username = null;
            o.accountDeleted = true;
            changed = true;
          }
        });
        if (changed) write(key, list);
      });
    }
    write(KEYS.users, getUsers().filter((u) => u.id !== id));
  }

  return {
    KEYS,
    uid,
    escapeHtml,
    formatPrice,
    formatDate,
    safeColor,
    clampText,
    qtyStepperHtml,
    wireQtyStepper,
    orderStatusLabel,
    resizeImageFile,
    getProducts,
    getActiveProducts,
    saveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductSoldCount,
    getProductRemaining,
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrdersForUser,
    getSpecialOrders,
    addSpecialOrder,
    updateSpecialOrder,
    deleteSpecialOrder,
    getSpecialOrdersForUser,
    getReviews,
    addReview,
    deleteReview,
    hashPassword,
    verifyPassword,
    verifyAdminPassword,
    setAdminPassword,
    adminPasswordIsDefault,
    lockSecondsLeft,
    registerFailure,
    clearFailures,
    cooldownSecondsLeft,
    startCooldown,
    getUsers,
    findUserByUsername,
    findUserByEmail,
    addUser,
    updateUser,
    deleteUser,
  };
})();
