/* Datenbank- und Konto-Schicht (Firebase Auth + Firestore).
 *
 * Alles hier läuft asynchron. Wer darf was, entscheiden die Regeln in
 * firestore.rules auf den Servern von Google – dieser Code hier hilft nur
 * dabei, freundliche Fehlermeldungen zu zeigen und die Daten sauber
 * aufzubereiten.
 */

const SFDB = (function () {
  const F = window.SFFirebase;
  const ADMIN_EMAILS = (window.SF_ADMIN_EMAILS || []).map((e) => e.toLowerCase());
  const MAX_CART_PRODUCTS = 8;

  let auth = null;
  let db = null;
  let user = null;
  const listeners = [];
  let readyResolve;
  const ready = new Promise((resolve) => (readyResolve = resolve));

  function init() {
    if (!F || !window.SF_FIREBASE_CONFIG) {
      console.warn("SFDB: Firebase konnte nicht geladen werden");
      readyResolve();
      return;
    }
    const app = F.initializeApp(window.SF_FIREBASE_CONFIG);
    const sessionOnly = document.body && document.body.getAttribute("data-auth-persistence") === "session";
    auth = F.initializeAuth(app, {
      persistence: sessionOnly
        ? F.browserSessionPersistence
        : [F.indexedDBLocalPersistence, F.browserLocalPersistence],
    });
    db = F.initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
    if (window.__SF_EMULATOR) {
      F.connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
      F.connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
    F.onAuthStateChanged(auth, (u) => {
      user = u;
      readyResolve();
      notify();
    });
  }

  function snap(u) {
    if (!u) return null;
    const email = (u.email || "").toLowerCase();
    return {
      uid: u.uid,
      email,
      username: u.displayName || email.split("@")[0],
      emailVerified: !!u.emailVerified,
      isAdmin: !!u.emailVerified && ADMIN_EMAILS.includes(email),
    };
  }
  function notify() {
    const s = snap(user);
    listeners.forEach((cb) => {
      try {
        cb(s);
      } catch (e) {
        console.warn(e);
      }
    });
  }
  function currentUser() {
    return snap(user);
  }
  function onAuthChange(cb) {
    listeners.push(cb);
  }
  function requireDb() {
    if (!db) throw withMessage("Die Datenbank konnte nicht geladen werden. Bitte lade die Seite neu.");
    return db;
  }

  // ---------- Fehlermeldungen ----------
  function withMessage(message, code) {
    const e = new Error(message);
    e.userMessage = message;
    if (code) e.code = code;
    return e;
  }
  function errorMessage(e) {
    if (e && e.userMessage) return e.userMessage;
    const code = (e && e.code) || "";
    const map = {
      "auth/email-already-in-use": "Diese E-Mail-Adresse ist schon registriert. Bitte melde dich an.",
      "auth/invalid-email": "Bitte gib eine gültige E-Mail-Adresse ein.",
      "auth/missing-email": "Bitte gib deine E-Mail-Adresse ein.",
      "auth/weak-password": "Das Passwort ist zu schwach. Bitte nimm mindestens 8 Zeichen.",
      "auth/invalid-credential": "E-Mail-Adresse oder Passwort ist falsch.",
      "auth/invalid-login-credentials": "E-Mail-Adresse oder Passwort ist falsch.",
      "auth/wrong-password": "E-Mail-Adresse oder Passwort ist falsch.",
      "auth/user-not-found": "E-Mail-Adresse oder Passwort ist falsch.",
      "auth/user-disabled": "Dieses Konto wurde gesperrt. Bitte melde dich bei uns.",
      "auth/too-many-requests": "Zu viele Versuche. Bitte warte ein paar Minuten und versuche es dann erneut.",
      "auth/network-request-failed": "Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung.",
      "auth/requires-recent-login": "Bitte melde dich zur Sicherheit noch einmal neu an.",
      "auth/operation-not-allowed": "Die Anmeldung mit E-Mail und Passwort ist noch nicht freigeschaltet.",
      "auth/unauthorized-domain": "Diese Website-Adresse ist bei Firebase noch nicht freigegeben.",
      "permission-denied": "Dafür fehlt die Berechtigung. Bitte melde dich an und bestätige deine E-Mail-Adresse.",
      unavailable: "Keine Verbindung zum Server. Bitte versuche es gleich noch einmal.",
      "deadline-exceeded": "Der Server antwortet gerade nicht. Bitte versuche es gleich noch einmal.",
      "resource-exhausted": "Heute sind zu viele Anfragen eingegangen. Bitte versuche es morgen noch einmal.",
    };
    return map[code] || "Das hat leider nicht geklappt. Bitte versuche es noch einmal.";
  }

  function toIso(v) {
    if (!v) return null;
    if (typeof v.toDate === "function") return v.toDate().toISOString();
    return v;
  }
  function withId(d) {
    const x = d.data();
    if ("date" in x) x.date = toIso(x.date);
    if ("createdAt" in x) x.createdAt = toIso(x.createdAt);
    return Object.assign({ id: d.id }, x);
  }

  // ---------- Konten ----------
  function actionSettings() {
    const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, "");
    return { url: base + "index.html" };
  }

  async function sendVerification() {
    const u = auth.currentUser;
    try {
      await F.sendEmailVerification(u, actionSettings());
    } catch (e) {
      if (e.code === "auth/unauthorized-continue-uri" || e.code === "auth/invalid-continue-uri") {
        await F.sendEmailVerification(u);
      } else {
        throw e;
      }
    }
  }

  async function register({ username, email, password }) {
    requireDb();
    const cred = await F.createUserWithEmailAndPassword(auth, email, password);
    try {
      await F.updateProfile(cred.user, { displayName: username });
      await F.setDoc(F.doc(db, "users", cred.user.uid), {
        username,
        email: (cred.user.email || "").toLowerCase(),
        createdAt: F.serverTimestamp(),
      });
    } catch (e) {
      console.warn("SFDB: Profil konnte nicht gespeichert werden", e);
    }
    await sendVerification();
    user = auth.currentUser;
    notify();
    return snap(user);
  }

  async function login(email, password) {
    requireDb();
    const cred = await F.signInWithEmailAndPassword(auth, email, password);
    user = cred.user;
    return snap(user);
  }

  async function logout() {
    if (auth) await F.signOut(auth);
  }

  async function resendVerification() {
    if (!auth || !auth.currentUser) throw withMessage("Bitte melde dich zuerst an.");
    await sendVerification();
  }

  // Liest den Konto-Status neu (z. B. nachdem der Link in der E-Mail angeklickt
  // wurde) und holt ein frisches Anmelde-Token, damit die Datenbank die
  // bestätigte E-Mail-Adresse sieht.
  async function refreshUser() {
    if (!auth || !auth.currentUser) return null;
    await F.reload(auth.currentUser);
    await auth.currentUser.getIdToken(true);
    user = auth.currentUser;
    notify();
    return snap(user);
  }

  async function resetPassword(email) {
    requireDb();
    try {
      await F.sendPasswordResetEmail(auth, email, actionSettings());
    } catch (e) {
      if (e.code === "auth/unauthorized-continue-uri" || e.code === "auth/invalid-continue-uri") {
        await F.sendPasswordResetEmail(auth, email);
      } else if (e.code !== "auth/user-not-found") {
        throw e;
      }
    }
  }

  async function deleteAccount(password) {
    requireDb();
    const u = auth.currentUser;
    if (!u) throw withMessage("Bitte melde dich zuerst an.");
    await F.reauthenticateWithCredential(u, F.EmailAuthProvider.credential(u.email, password));
    for (const col of ["users", "reviews"]) {
      try {
        await F.deleteDoc(F.doc(db, col, u.uid));
      } catch (e) {
        console.warn("SFDB: konnte", col, "nicht löschen", e);
      }
    }
    await F.deleteUser(u);
  }

  // ---------- Produkte ----------
  function productFrom(d) {
    const x = d.data();
    return {
      id: d.id,
      name: x.name || "",
      description: x.description || "",
      price: Number(x.price) || 0,
      color: x.color || "#2c6e6b",
      sizes: Array.isArray(x.sizes) ? x.sizes : [],
      images: Array.isArray(x.images) ? x.images : [], // alte Produkte: Fotos direkt im Produkt
      imageIds: Array.isArray(x.imageIds) ? x.imageIds.filter((id) => /^[A-Za-z0-9]{20}$/.test(id)) : [],
      imageColors: cleanImageColors(x.imageColors),
      stock: x.stock === undefined ? null : x.stock,
      sold: Number(x.sold) || 0,
      active: x.active !== false,
      createdAt: toIso(x.createdAt),
    };
  }

  async function getProducts() {
    const s = await F.getDocs(F.collection(requireDb(), "products"));
    return s.docs
      .map(productFrom)
      .sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")) || a.name.localeCompare(b.name));
  }
  async function getActiveProducts() {
    return (await getProducts()).filter((p) => p.active);
  }

  // Zu jedem Foto gehört eine Farbe { name, hex } (gleiche Reihenfolge wie images)
  function cleanImageColors(list) {
    if (!Array.isArray(list)) return [];
    return list.map((c) => ({
      name: String((c && c.name) || "").trim().slice(0, 20),
      hex: SF.safeColor(c && c.hex, "#9e9e9e"),
    }));
  }
  function cleanProduct(p, imageIds) {
    return {
      name: p.name,
      description: p.description || "",
      price: p.price,
      color: p.color,
      sizes: p.sizes,
      images: [],
      imageIds,
      imageColors: cleanImageColors(p.imageColors).slice(0, imageIds.length),
    };
  }
  // „available“ = wie viele Stück ab jetzt noch zu haben sind (null = unbegrenzt).
  // Gespeichert wird der Gesamtbestand stock = bisher verkauft + noch verfügbar.
  function availableToStock(available, sold) {
    return available === null || available === undefined ? null : (Number(sold) || 0) + Math.max(0, Number(available) || 0);
  }

  // ---------- Produktfotos ----------
  // Jedes Foto ist ein eigenes Dokument in "productImages" (ein Firestore-Dokument
  // darf höchstens 1 MB groß sein – so passen beliebig viele Fotos zu einem Produkt).
  // Der Shop lädt nur die Fotos, die gerade gezeigt werden. Alte Produkte haben
  // ihre Fotos noch direkt im Feld "images".
  const imagePromises = new Map(); // Foto-ID -> Promise<src>
  const imageSrcs = new Map(); // Foto-ID -> src (schon geladen)
  function rememberImage(id, src) {
    imageSrcs.set(id, src);
    imagePromises.set(id, Promise.resolve(src));
  }
  function cachedProductImage(p, i) {
    if (p.imageIds && p.imageIds.length) return imageSrcs.get(p.imageIds[i]) || null;
    return (p.images || [])[i] || null;
  }
  function getProductImage(p, i) {
    if (!(p.imageIds && p.imageIds.length)) return Promise.resolve((p.images || [])[i] || null);
    const id = p.imageIds[i];
    if (!id) return Promise.resolve(null);
    if (!imagePromises.has(id)) {
      const load = F.getDoc(F.doc(requireDb(), "productImages", id)).then(
        (snap) => {
          const src = snap.exists() ? String(snap.data().src || "") : "";
          if (!/^data:image\/(jpeg|png|webp|gif);base64,/.test(src)) return null;
          imageSrcs.set(id, src);
          return src;
        },
        (e) => {
          imagePromises.delete(id); // später nochmal versuchen
          throw e;
        }
      );
      imagePromises.set(id, load);
    }
    return imagePromises.get(id);
  }
  function getAllProductImages(p) {
    return Promise.all(Array.from({ length: SF.photoCount(p) }, (_, i) => getProductImage(p, i)));
  }
  async function deleteImages(ids) {
    await Promise.all(ids.map((id) => F.deleteDoc(F.doc(requireDb(), "productImages", id)).catch(() => {})));
  }
  // photos: [{ src, imageId }] – mit imageId = schon gespeichert, sonst wird es neu angelegt
  async function savePhotos(productId, photos) {
    const db = requireDb();
    const created = [];
    try {
      const ids = await Promise.all(
        photos.map(async (ph) => {
          if (ph.imageId) return ph.imageId;
          const ref = F.doc(F.collection(db, "productImages"));
          await F.setDoc(ref, { productId, src: ph.src, createdAt: F.serverTimestamp() });
          created.push(ref.id);
          rememberImage(ref.id, ph.src);
          return ref.id;
        })
      );
      return { ids, created };
    } catch (e) {
      await deleteImages(created);
      if (e && e.code === "permission-denied") {
        throw withMessage(
          "Die Fotos konnten nicht gespeichert werden: Die neuen Datenbank-Regeln sind noch nicht veröffentlicht (Firebase-Konsole → Firestore → Regeln).",
          "sf/rules"
        );
      }
      throw e;
    }
  }

  async function addProduct(p) {
    const ref = F.doc(F.collection(requireDb(), "products"));
    const photos = await savePhotos(ref.id, p.photos || []);
    try {
      await F.setDoc(
        ref,
        Object.assign(cleanProduct(p, photos.ids), {
          stock: availableToStock(p.available, 0),
          active: p.active !== false,
          sold: 0,
          createdAt: F.serverTimestamp(),
        })
      );
    } catch (e) {
      await deleteImages(photos.created);
      throw e;
    }
    return ref.id;
  }
  async function updateProduct(id, p) {
    const db = requireDb();
    const ref = F.doc(db, "products", id);
    const photos = await savePhotos(id, p.photos || []);
    let oldIds = [];
    try {
      // In einer Transaktion, damit eine Bestellung genau in diesem Moment nicht verloren geht
      await F.runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw withMessage("Dieses Produkt gibt es nicht mehr.");
        const sold = Number(snap.data().sold) || 0;
        oldIds = productFrom(snap).imageIds;
        tx.update(ref, Object.assign(cleanProduct(p, photos.ids), { stock: availableToStock(p.available, sold) }));
      });
    } catch (e) {
      await deleteImages(photos.created);
      throw e;
    }
    // Entfernte Fotos löschen
    await deleteImages(oldIds.filter((x) => !photos.ids.includes(x)));
  }
  async function setProductActive(id, active) {
    await F.updateDoc(F.doc(requireDb(), "products", id), { active: !!active });
  }
  async function deleteProduct(id) {
    const db = requireDb();
    await F.deleteDoc(F.doc(db, "products", id));
    // Fotos des Produkts mitlöschen
    try {
      const s = await F.getDocs(F.query(F.collection(db, "productImages"), F.where("productId", "==", id)));
      await deleteImages(s.docs.map((d) => d.id));
    } catch (e) {
      console.warn("SFDB: Fotos von", id, "nicht gelöscht", e);
    }
  }

  // ---------- Bestellungen ----------
  // Legt die Bestellung an und erhöht in derselben Transaktion den Zähler
  // "sold" der Produkte. Preise und Namen kommen frisch aus der Datenbank,
  // und es wird nie mehr verkauft als vorrätig ist.
  async function placeOrder({ customerName, klasse, phone, items }) {
    requireDb();
    const u = auth.currentUser;
    if (!u) throw withMessage("Bitte melde dich zuerst an.");
    const qtyByProduct = {};
    items.forEach((i) => {
      qtyByProduct[i.productId] = (qtyByProduct[i.productId] || 0) + i.qty;
    });
    const productIds = Object.keys(qtyByProduct);
    if (productIds.length === 0) throw withMessage("Dein Warenkorb ist leer.");
    if (productIds.length > MAX_CART_PRODUCTS) {
      throw withMessage(`Bitte bestelle höchstens ${MAX_CART_PRODUCTS} verschiedene Produkte auf einmal.`);
    }
    let result = null;

    // Bestellen zwei Personen gleichzeitig das letzte Stück, lehnt die
    // Datenbank die zweite Bestellung ab (kein Überverkauf). Dann wird neu
    // geprüft: Ist wirklich nichts mehr da, kommt die passende Meldung
    // ("ausverkauft"), sonst klappt der zweite Versuch.
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        result = await runOrderTransaction();
        break;
      } catch (e) {
        if (e && e.code === "permission-denied" && attempt < 3) {
          await new Promise((r) => setTimeout(r, 150 * attempt));
          continue;
        }
        throw e;
      }
    }
    return result;

    async function runOrderTransaction() {
      const orderRef = F.doc(F.collection(db, "orders"));
      let out = null;
      await F.runTransaction(db, async (tx) => {
        const snaps = [];
        for (const id of productIds) snaps.push(await tx.get(F.doc(db, "products", id)));
        const products = {};
        snaps.forEach((s) => {
          if (!s.exists() || s.data().active === false) {
            throw withMessage("Ein Produkt in deinem Warenkorb gibt es leider nicht mehr. Bitte lade die Seite neu.", "sf/gone");
          }
          products[s.id] = productFrom(s);
        });
        let total = 0;
        const cleanItems = items.map((i) => {
          const p = products[i.productId];
          if (!p.sizes.includes(i.size)) {
            throw withMessage(`Die Größe „${i.size}“ gibt es bei „${p.name}“ nicht mehr.`, "sf/gone");
          }
          // Hat das Produkt Farben, muss eine davon gewählt sein
          let color = "";
          if (SF.productColors(p).length) {
            const c = SF.findColor(p, i.color);
            if (!c) {
              throw withMessage(
                i.color
                  ? `Die Farbe „${i.color}“ gibt es bei „${p.name}“ nicht mehr.`
                  : `Bitte wähle bei „${p.name}“ eine Farbe aus.`,
                "sf/gone"
              );
            }
            color = c.name;
          }
          total += p.price * i.qty;
          const line = { productId: i.productId, name: p.name, size: i.size, qty: i.qty, price: p.price };
          if (color) line.color = color;
          return line;
        });
        productIds.forEach((id) => {
          const remaining = SF.getProductRemaining(products[id]);
          if (remaining !== null && remaining < qtyByProduct[id]) {
            throw withMessage(
              remaining > 0
                ? `Von „${products[id].name}“ gibt es nur noch ${remaining} Stück.`
                : `„${products[id].name}“ ist leider gerade ausverkauft worden.`,
              "sf/soldout"
            );
          }
        });
        total = Math.round(total * 100) / 100;
        tx.set(orderRef, {
          userId: u.uid,
          username: u.displayName || "",
          customerName,
          klasse,
          phone,
          items: cleanItems,
          total,
          qtyByProduct,
          date: F.serverTimestamp(),
          status: "offen",
        });
        productIds.forEach((id) => {
          tx.update(F.doc(db, "products", id), {
            sold: products[id].sold + qtyByProduct[id],
            lastOrderId: orderRef.id,
          });
        });
        out = { id: orderRef.id, total };
      });
      return out;
    }
  }

  async function getMyOrders() {
    const u = auth && auth.currentUser;
    if (!u) return [];
    const s = await F.getDocs(F.query(F.collection(requireDb(), "orders"), F.where("userId", "==", u.uid)));
    return s.docs.map(withId).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }
  async function getAllOrders() {
    const s = await F.getDocs(F.query(F.collection(requireDb(), "orders"), F.orderBy("date", "desc")));
    return s.docs.map(withId);
  }
  async function updateOrderStatus(id, status) {
    await F.updateDoc(F.doc(requireDb(), "orders", id), { status });
  }
  async function deleteOrder(id) {
    await F.deleteDoc(F.doc(requireDb(), "orders", id));
  }

  // ---------- Spezialbestellungen ----------
  async function addSpecialOrder({ name, phone, klasse, groesse, menge, wunsch }) {
    requireDb();
    const u = auth.currentUser;
    if (!u) throw withMessage("Bitte melde dich zuerst an.");
    const ref = F.doc(F.collection(db, "specialOrders"));
    const data = {
      userId: u.uid,
      username: u.displayName || "",
      name,
      phone,
      groesse,
      menge,
      wunsch,
      date: F.serverTimestamp(),
      status: "offen",
    };
    if (klasse) data.klasse = klasse;
    await F.setDoc(ref, data);
    return ref.id;
  }
  async function getMySpecialOrders() {
    const u = auth && auth.currentUser;
    if (!u) return [];
    const s = await F.getDocs(F.query(F.collection(requireDb(), "specialOrders"), F.where("userId", "==", u.uid)));
    return s.docs.map(withId).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }
  async function getAllSpecialOrders() {
    const s = await F.getDocs(F.query(F.collection(requireDb(), "specialOrders"), F.orderBy("date", "desc")));
    return s.docs.map(withId);
  }
  async function updateSpecialOrderStatus(id, status) {
    await F.updateDoc(F.doc(requireDb(), "specialOrders", id), { status });
  }
  async function deleteSpecialOrder(id) {
    await F.deleteDoc(F.doc(requireDb(), "specialOrders", id));
  }

  // ---------- Bewertungen (pro Konto genau eine) ----------
  async function getReviews() {
    const s = await F.getDocs(
      F.query(F.collection(requireDb(), "reviews"), F.orderBy("date", "desc"), F.limit(100))
    );
    return s.docs.map(withId);
  }
  async function saveMyReview({ name, rating, comment }) {
    requireDb();
    const u = auth.currentUser;
    if (!u) throw withMessage("Bitte melde dich zuerst an.");
    await F.setDoc(F.doc(db, "reviews", u.uid), {
      userId: u.uid,
      name,
      rating,
      comment,
      date: F.serverTimestamp(),
    });
  }
  async function deleteReview(id) {
    await F.deleteDoc(F.doc(requireDb(), "reviews", id));
  }

  // ---------- Kund:innen (nur Admin) ----------
  async function getUsers() {
    const s = await F.getDocs(F.query(F.collection(requireDb(), "users"), F.orderBy("createdAt", "desc")));
    return s.docs.map(withId);
  }

  // ---------- E-Mail „abholbereit“ (Gmail über Google Apps Script, nur Admin) ----------
  // Geschickt wird nur, welche Bestellung es ist, plus der Login-Nachweis des Admins.
  // Empfänger und Text bestimmt das Skript selbst aus der Datenbank.
  const MAIL_URL_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
  function readyEmailEnabled() {
    return MAIL_URL_PATTERN.test(String(window.SF_MAIL_URL || ""));
  }
  async function sendReadyEmail({ collection, orderId }) {
    if (!readyEmailEnabled()) return { skipped: true };
    const u = auth && auth.currentUser;
    if (!u) throw withMessage("Bitte melde dich neu an.");
    const idToken = await u.getIdToken();
    let res;
    try {
      // text/plain: so braucht der Browser keine Vorab-Anfrage, die Apps Script nicht beantworten kann
      res = await fetch(window.SF_MAIL_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ idToken, collection, orderId }),
      });
    } catch (e) {
      throw withMessage("Keine Verbindung zum E-Mail-Dienst.");
    }
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      /* keine JSON-Antwort */
    }
    if (!res.ok || !data || !data.ok) {
      throw withMessage((data && data.error) || "Der E-Mail-Dienst hat nicht richtig geantwortet.");
    }
    return data;
  }

  init();

  return {
    ready,
    currentUser,
    onAuthChange,
    errorMessage,
    register,
    login,
    logout,
    resendVerification,
    refreshUser,
    resetPassword,
    deleteAccount,
    getProducts,
    getActiveProducts,
    addProduct,
    updateProduct,
    setProductActive,
    deleteProduct,
    cachedProductImage,
    getProductImage,
    getAllProductImages,
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    addSpecialOrder,
    getMySpecialOrders,
    getAllSpecialOrders,
    updateSpecialOrderStatus,
    deleteSpecialOrder,
    getReviews,
    saveMyReview,
    deleteReview,
    getUsers,
    readyEmailEnabled,
    sendReadyEmail,
    MAX_CART_PRODUCTS,
  };
})();
