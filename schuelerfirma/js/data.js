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
      description:
        "Handgesiebdruckter Hoodie mit unserem Waldtier-Motiv. Jedes Stück ein Unikat.",
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
      description: "Motiv mit Bergen und Sonnenaufgang – unser Bestseller.",
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

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("SF: konnte", key, "nicht speichern", e);
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
      write(KEYS.reviews, [
        {
          id: "r_seed1",
          name: "Frau Keller (Klassenlehrerin)",
          rating: 5,
          comment:
            "Tolle Pullis, super Druckqualität! Unsere Klasse ist total begeistert.",
          date: "2025-06-12",
        },
      ]);
    }
    if (localStorage.getItem(KEYS.adminPassword) === null) {
      write(KEYS.adminPassword, DEFAULT_PASSWORD);
    }
    if (localStorage.getItem(KEYS.users) === null) {
      write(KEYS.users, []);
    }
  }

  ensureSeeded();

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
      if (isNaN(d.getTime())) return iso;
      const datePart = d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (dateOnly) return datePart;
      return datePart + " " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return iso;
    }
  }

  // Wiederverwendbares +/- Mengenfeld (Shop, Produkt-Detailansicht,
  // Spezialbestellungen) – ein Widget statt unterschiedlicher Eingabefelder.
  function qtyStepperHtml(id, max, disabled) {
    return `
      <div class="qty-stepper">
        <button type="button" class="qty-btn" data-qty-dec="${id}" ${disabled ? "disabled" : ""}>&minus;</button>
        <input type="number" id="${id}" min="1" ${max !== null && max !== undefined ? `max="${max}"` : ""} value="1" readonly ${disabled ? "disabled" : ""}>
        <button type="button" class="qty-btn" data-qty-inc="${id}" ${disabled ? "disabled" : ""}>+</button>
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
    write(KEYS.products, list);
  }
  function addProduct(product) {
    const list = getProducts();
    list.push(Object.assign({ id: uid("p"), active: true }, product));
    saveProducts(list);
  }
  function updateProduct(id, changes) {
    const list = getProducts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx !== -1) {
      list[idx] = Object.assign({}, list[idx], changes);
      saveProducts(list);
    }
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
    write(KEYS.orders, list);
    return full;
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
  function getOrdersByUsername(username) {
    const needle = String(username || "").toLowerCase();
    return getOrders().filter((o) => (o.username || "").toLowerCase() === needle);
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
    write(KEYS.specialOrders, list);
    return full;
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
  function getSpecialOrdersByUsername(username) {
    const needle = String(username || "").toLowerCase();
    return getSpecialOrders().filter((o) => (o.username || "").toLowerCase() === needle);
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
    write(KEYS.reviews, list);
    return full;
  }
  function deleteReview(id) {
    write(KEYS.reviews, getReviews().filter((r) => r.id !== id));
  }

  // ---- Admin password ----
  function checkPassword(pw) {
    return read(KEYS.adminPassword, DEFAULT_PASSWORD) === pw;
  }
  function setPassword(pw) {
    write(KEYS.adminPassword, pw);
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
    write(KEYS.users, list);
    return full;
  }
  function deleteUser(id) {
    write(KEYS.users, getUsers().filter((u) => u.id !== id));
  }

  // Einfacher Hash fürs Passwort (kein echtes Backend, also keine echte
  // Sicherheit – nutzt SubtleCrypto wenn verfügbar, sonst einen simplen
  // Fallback, damit die Registrierung nicht crasht, z. B. bei file://).
  async function hashText(text) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const enc = new TextEncoder().encode(text);
        const buf = await window.crypto.subtle.digest("SHA-256", enc);
        return Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      }
    } catch (e) {
      console.warn("SF: SubtleCrypto nicht verfügbar, nutze Fallback-Hash", e);
    }
    let h = 0;
    const str = String(text);
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) | 0;
    }
    return "fallback_" + h;
  }

  return {
    KEYS,
    uid,
    escapeHtml,
    formatPrice,
    formatDate,
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
    getOrdersByUsername,
    getSpecialOrders,
    addSpecialOrder,
    updateSpecialOrder,
    deleteSpecialOrder,
    getSpecialOrdersByUsername,
    getReviews,
    addReview,
    deleteReview,
    checkPassword,
    setPassword,
    getUsers,
    findUserByUsername,
    findUserByEmail,
    addUser,
    deleteUser,
    hashText,
  };
})();
