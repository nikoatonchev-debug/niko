(function () {
  let cart = []; // { productId, name, size, color, hex, qty, price }
  let products = []; // aktuelle Produktliste aus der Datenbank
  let detailProduct = null;
  let detailImageIndex = 0;
  const chosenColor = {}; // Produkt-ID -> gewählter Farbname

  const esc = (s) => SF.escapeHtml(s);

  // Gewählte Farbe eines Produkts (oder die erste), null wenn es keine Farben hat
  function currentColor(p) {
    const colors = SF.productColors(p);
    if (!colors.length) return null;
    return SF.findColor(p, chosenColor[p.id]) || colors[0];
  }

  // Foto-Tag: sofort mit Bild, wenn es schon geladen ist, sonst wird es von showPhoto() nachgeladen
  function photoImgHtml(p, index, alt, placeholder) {
    const src = SFDB.cachedProductImage(p, index) || placeholder;
    return `<img ${src ? `src="${esc(src)}"` : ""} alt="${esc(alt)}" class="fill-img" data-photo-index="${index}">`;
  }

  // Lädt Foto Nr. index in das img-Element (bis es da ist, bleibt das alte Bild blass stehen)
  function showPhoto(img, p, index) {
    img.setAttribute("data-photo-index", index);
    const cached = SFDB.cachedProductImage(p, index);
    if (cached) {
      if (img.getAttribute("src") !== cached) img.src = cached;
      img.classList.remove("img-loading");
      return;
    }
    img.classList.add("img-loading");
    SFDB.getProductImage(p, index)
      .then((src) => {
        if (img.getAttribute("data-photo-index") !== String(index)) return; // inzwischen anderes Foto gewählt
        if (src) img.src = src;
        img.classList.remove("img-loading");
      })
      .catch(() => img.classList.remove("img-loading"));
  }

  // Erstes Foto jeder Farbe schon mal laden (z. B. wenn die Maus über den Farbkreisen ist)
  function prefetchColors(p) {
    SF.productColors(p).forEach((c) => SFDB.getProductImage(p, c.image).catch(() => {}));
  }

  function productImagesOrIcon(p) {
    if (SF.photoCount(p)) {
      const c = currentColor(p);
      return photoImgHtml(p, c ? c.image : 0, "");
    }
    return SFIcons.hoodie(SF.safeColor(p.color));
  }

  // Farben als kleine Kreise zum Anklicken (Radio-Buttons, per Tastatur mit Pfeiltasten)
  function swatchesHtml(p, groupName) {
    const colors = SF.productColors(p);
    if (!colors.length) return "";
    const cur = currentColor(p);
    return `
      <fieldset class="swatch-field">
        <legend>Farbe: <span class="swatch-current">${esc(cur.name)}</span></legend>
        <div class="swatches">
          ${colors
            .map(
              (c) => `
            <label class="swatch" title="${esc(c.name)}">
              <input type="radio" name="${esc(groupName)}" value="${esc(c.name)}" data-color-for="${esc(p.id)}" ${SF.colorKey(c.name) === SF.colorKey(cur.name) ? "checked" : ""}>
              <span class="swatch-dot" style="background:${SF.safeColor(c.hex)}" aria-hidden="true"></span>
              <span class="sr-only">${esc(c.name)}</span>
            </label>`
            )
            .join("")}
        </div>
      </fieldset>`;
  }

  // Kreise und Farbname in einem Bereich (Karte oder Detailansicht) an die gewählte Farbe anpassen
  function syncSwatches(scope, c) {
    scope.querySelectorAll(".swatch input").forEach((r) => {
      r.checked = SF.colorKey(r.value) === SF.colorKey(c.name);
    });
    const label = scope.querySelector(".swatch-current");
    if (label) label.textContent = c.name;
  }

  function syncCard(p) {
    const c = currentColor(p);
    const card = document.querySelector(`[data-card="${CSS.escape(p.id)}"]`);
    if (!c || !card) return;
    const img = card.querySelector(".product-image img");
    if (img) showPhoto(img, p, c.image);
    syncSwatches(card, c);
  }

  function productCardHtml(p) {
    const id = esc(p.id);
    const remaining = SF.getProductRemaining(p);
    const soldOut = remaining !== null && remaining <= 0;
    const sizeOptions = (p.sizes || [])
      .map((s) => `<option value="${esc(s)}">${esc(s)}</option>`)
      .join("");
    return `
      <article class="product-card" data-card="${id}">
        <div class="product-image clickable" data-open-detail="${id}" aria-hidden="true">
          ${productImagesOrIcon(p)}
          ${soldOut ? `<div class="sold-out-overlay"><span class="sold-out-text">Ausverkauft</span></div>` : ""}
        </div>
        <div class="product-body">
          <h3><button type="button" class="link-btn" data-open-detail="${id}">${esc(p.name)}</button></h3>
          <p class="product-desc">${esc(p.description || "")}</p>
          ${
            remaining !== null && !soldOut
              ? `<p class="hint">Nur noch ${remaining} Stück verfügbar</p>`
              : ""
          }
          ${swatchesHtml(p, `color-${p.id}`)}
          <div class="field mb-8">
            <label for="size-${id}">Größe</label>
            <select id="size-${id}" ${soldOut ? "disabled" : ""}>${sizeOptions}</select>
          </div>
          <div class="field mb-8">
            <label for="qty-${id}">Menge</label>
            ${SF.qtyStepperHtml(`qty-${id}`, soldOut ? null : remaining, soldOut)}
          </div>
          <div class="product-meta">
            <span class="price">${SF.formatPrice(p.price)}</span>
            <button class="btn btn-primary btn-small" data-add="${id}" ${soldOut ? "disabled" : ""}
              aria-label="${soldOut ? "Ausverkauft" : esc(p.name) + " in den Warenkorb"}">
              ${soldOut ? "Ausverkauft" : "In den Warenkorb"}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function cartQtyForProduct(productId) {
    return cart.filter((c) => c.productId === productId).reduce((s, c) => s + c.qty, 0);
  }

  function renderProducts() {
    const el = document.getElementById("product-grid");
    if (products.length === 0) {
      el.innerHTML = `<p>Aktuell sind keine Produkte im Shop verfügbar. Schau bald wieder vorbei!</p>`;
      return;
    }
    el.innerHTML = products.map(productCardHtml).join("");
    products.forEach((p) => {
      const btn = el.querySelector(`[data-add="${CSS.escape(p.id)}"]`);
      if (btn) btn.addEventListener("click", () => addToCart(p, `size-${p.id}`, `qty-${p.id}`));
      SF.wireQtyStepper(`qty-${p.id}`);
    });
    el.querySelectorAll("[data-open-detail]").forEach((elm) => {
      elm.addEventListener("click", () => openDetail(elm.getAttribute("data-open-detail")));
    });
    // Farbe anklicken: Foto oben wechselt sofort
    el.querySelectorAll("[data-color-for]").forEach((input) => {
      input.addEventListener("change", () => {
        const p = products.find((x) => x.id === input.getAttribute("data-color-for"));
        if (!p) return;
        chosenColor[p.id] = input.value;
        syncCard(p);
      });
    });
    products.forEach((p) => {
      const card = el.querySelector(`[data-card="${CSS.escape(p.id)}"]`);
      const img = card && card.querySelector(".product-image img");
      if (img) showPhoto(img, p, Number(img.getAttribute("data-photo-index")));
      const swatches = card && card.querySelector(".swatches");
      if (swatches) {
        swatches.addEventListener("pointerenter", () => prefetchColors(p), { once: true });
        swatches.addEventListener("focusin", () => prefetchColors(p), { once: true });
      }
    });
  }

  // Passt die Farbe im Warenkorb noch zum Produkt?
  function colorStillValid(p, color) {
    return SF.productColors(p).length ? !!SF.findColor(p, color) : !color;
  }

  async function loadProducts() {
    const el = document.getElementById("product-grid");
    try {
      products = await SFDB.getActiveProducts();
    } catch (e) {
      el.innerHTML = `<p class="form-message error" role="alert">Die Produkte konnten gerade nicht geladen werden. ${SF.escapeHtml(SFDB.errorMessage(e))}</p>`;
      return false;
    }
    // Waren, die inzwischen weniger werden/verschwinden, aus dem Warenkorb nehmen
    cart = cart.filter((c) => {
      const p = products.find((x) => x.id === c.productId);
      return p && colorStillValid(p, c.color);
    });
    renderCart();
    renderProducts();
    return true;
  }

  function addToCart(p, sizeFieldId, qtyFieldId) {
    const size = document.getElementById(sizeFieldId).value;
    const qtyInput = document.getElementById(qtyFieldId);
    let qty = parseInt(qtyInput.value, 10);
    if (!qty || qty < 1) qty = 1;

    const remaining = SF.getProductRemaining(p);
    if (remaining !== null) {
      const room = remaining - cartQtyForProduct(p.id);
      if (room <= 0) {
        renderProducts();
        return;
      }
      if (qty > room) qty = room;
    }

    const c = currentColor(p);
    const color = c ? c.name : "";
    const existing = cart.find((x) => x.productId === p.id && x.size === size && x.color === color);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId: p.id, name: p.name, size, color, hex: c ? c.hex : "", qty, price: p.price });
    }
    renderCart();
    renderProducts();
    flashCart();
    announce(`${qty} × ${p.name} (Größe ${size}${color ? ", " + color : ""}) in den Warenkorb gelegt.`);
  }

  function announce(text) {
    const live = document.getElementById("shop-live");
    if (live) {
      live.textContent = "";
      setTimeout(() => (live.textContent = text), 50);
    }
  }

  function flashCart() {
    const btn = document.getElementById("cart-open-btn");
    btn.classList.add("cart-bump");
    setTimeout(() => btn.classList.remove("cart-bump"), 150);
  }

  function cartTotal() {
    return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  }

  function cartLinesHtml(withRemove) {
    return cart
      .map(
        (c, i) => `
        <div class="cart-line">
          <div class="cart-line-info">
            <strong>${esc(c.name)}</strong>
            Größe ${esc(c.size)} &middot;
            ${
              c.color
                ? `<span class="swatch-dot swatch-dot-sm" style="background:${SF.safeColor(c.hex, "#9e9e9e")}" aria-hidden="true"></span> ${esc(c.color)} &middot;`
                : ""
            }
            ${Number(c.qty)} Stück &middot; ${SF.formatPrice(c.price * c.qty)}
          </div>
          ${
            withRemove
              ? `<button class="btn btn-outline btn-small" data-remove="${i}" aria-label="${esc(c.name)} (Größe ${esc(c.size)}${c.color ? ", " + esc(c.color) : ""}) entfernen">Entfernen</button>`
              : ""
          }
        </div>`
      )
      .join("");
  }

  function renderCart() {
    const count = cart.reduce((n, c) => n + c.qty, 0);
    document.getElementById("cart-count").textContent = count;
    document
      .getElementById("cart-open-btn")
      .setAttribute("aria-label", `Warenkorb öffnen, ${count} Artikel`);

    const linesEl = document.getElementById("cart-lines");
    if (cart.length === 0) {
      linesEl.innerHTML = `<p>Dein Warenkorb ist noch leer.</p>`;
    } else {
      linesEl.innerHTML = cartLinesHtml(true);
      linesEl.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          cart.splice(parseInt(btn.getAttribute("data-remove"), 10), 1);
          renderCart();
          renderProducts();
          const next = linesEl.querySelector("[data-remove]") || document.getElementById("cart-close-btn");
          next.focus();
        });
      });
    }
    document.getElementById("cart-total").textContent = SF.formatPrice(cartTotal());
    document.getElementById("checkout-btn").disabled = cart.length === 0;
  }

  function renderCheckoutSummary() {
    document.getElementById("co-summary-lines").innerHTML = cartLinesHtml(false);
    document.getElementById("co-summary-total").textContent = SF.formatPrice(cartTotal());
  }

  // ---------- Produkt-Detailansicht ----------
  function openDetail(productId) {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    detailProduct = p;
    const c = currentColor(p);
    detailImageIndex = c ? c.image : 0;
    renderDetail();
    openModal("product-detail-modal", c ? "#pd-colors input:checked" : "#pd-size");
  }

  // Beim Blättern durch die Fotos wechselt die Farbe mit (Foto und Farbe passen immer zusammen)
  function showDetailImage(index) {
    const p = detailProduct;
    detailImageIndex = index;
    const ic = (p.imageColors || [])[index];
    const c = ic && SF.findColor(p, ic.name);
    if (c) {
      chosenColor[p.id] = c.name;
      syncSwatches(document.getElementById("pd-colors"), c);
      syncCard(p);
    }
    renderGallery();
  }

  function renderGallery() {
    const p = detailProduct;
    const count = SF.photoCount(p);
    const remaining = SF.getProductRemaining(p);
    const soldOut = remaining !== null && remaining <= 0;
    const overlay = soldOut ? `<div class="sold-out-overlay"><span class="sold-out-text">Ausverkauft</span></div>` : "";

    const galleryEl = document.getElementById("pd-gallery");
    if (count) {
      const n = detailImageIndex + 1;
      const ic = (p.imageColors || [])[detailImageIndex];
      const colorName = ic && ic.name ? ` (${ic.name})` : "";
      // Bis das neue Foto geladen ist, bleibt das bisherige (blass) stehen
      const before = galleryEl.querySelector("img");
      const placeholder = before ? before.getAttribute("src") : null;
      galleryEl.innerHTML = `
        <div class="product-image product-image-detail">
          ${photoImgHtml(p, detailImageIndex, `${p.name + colorName} – Bild ${n} von ${count}`, placeholder)}
          ${overlay}
        </div>
        ${
          count > 1
            ? `<div class="gallery-nav">
                <button type="button" class="btn btn-outline btn-small" id="pd-prev" aria-label="Vorheriges Bild">&larr; Zurück</button>
                <span class="hint" aria-live="polite">${n} / ${count}</span>
                <button type="button" class="btn btn-outline btn-small" id="pd-next" aria-label="Nächstes Bild">Weiter &rarr;</button>
              </div>`
            : ""
        }
      `;
      showPhoto(galleryEl.querySelector("img"), p, detailImageIndex);
      if (count > 1) {
        // Nachbarfotos schon laden, damit Blättern ohne Warten geht
        [1, count - 1].forEach((d) => SFDB.getProductImage(p, (detailImageIndex + d) % count).catch(() => {}));
        document.getElementById("pd-prev").addEventListener("click", () => {
          showDetailImage((detailImageIndex - 1 + count) % count);
          document.getElementById("pd-prev").focus();
        });
        document.getElementById("pd-next").addEventListener("click", () => {
          showDetailImage((detailImageIndex + 1) % count);
          document.getElementById("pd-next").focus();
        });
      }
    } else {
      galleryEl.innerHTML = `
        <div class="product-image product-image-detail">
          ${SFIcons.hoodie(SF.safeColor(p.color))}
          ${overlay}
        </div>`;
    }
  }

  function renderDetail() {
    const p = detailProduct;
    if (!p) return;
    const remaining = SF.getProductRemaining(p);
    const soldOut = remaining !== null && remaining <= 0;
    renderGallery();

    const colorsEl = document.getElementById("pd-colors");
    colorsEl.innerHTML = swatchesHtml(p, "pd-color");
    const detailSwatches = colorsEl.querySelector(".swatches");
    if (detailSwatches) {
      detailSwatches.addEventListener("pointerenter", () => prefetchColors(p), { once: true });
      detailSwatches.addEventListener("focusin", () => prefetchColors(p), { once: true });
    }
    colorsEl.querySelectorAll("[data-color-for]").forEach((input) => {
      input.addEventListener("change", () => {
        chosenColor[p.id] = input.value;
        const c = currentColor(p);
        syncSwatches(colorsEl, c);
        syncCard(p);
        detailImageIndex = c.image;
        renderGallery();
      });
    });

    document.getElementById("pd-name").textContent = p.name;
    document.getElementById("pd-desc").textContent = p.description || "";
    document.getElementById("pd-price").textContent = SF.formatPrice(p.price);
    document.getElementById("pd-stock-hint").textContent =
      remaining !== null && !soldOut ? `Nur noch ${remaining} Stück verfügbar` : "";

    const sizeSelect = document.getElementById("pd-size");
    sizeSelect.innerHTML = (p.sizes || [])
      .map((s) => `<option value="${esc(s)}">${esc(s)}</option>`)
      .join("");
    sizeSelect.disabled = soldOut;

    const qtyWrap = document.getElementById("pd-qty-wrap");
    qtyWrap.innerHTML = SF.qtyStepperHtml("pd-qty", soldOut ? null : remaining, soldOut);
    SF.wireQtyStepper("pd-qty");

    const addBtn = document.getElementById("pd-add");
    addBtn.disabled = soldOut;
    addBtn.textContent = soldOut ? "Ausverkauft" : "In den Warenkorb";
  }

  function openModal(id, initialFocus) {
    SFUI.openDialog(document.getElementById(id), {
      onEscape: () => closeModal(id),
      initialFocus,
    });
  }
  function closeModal(id) {
    SFUI.closeDialog(document.getElementById(id));
  }

  function setup() {
    const grid = document.getElementById("product-grid");
    grid.setAttribute("aria-busy", "true");
    grid.innerHTML = `<p class="hint">Produkte werden geladen …</p>`;
    loadProducts().then(() => grid.removeAttribute("aria-busy"));
    renderCart();

    document.getElementById("cart-open-btn").addEventListener("click", () => openModal("cart-modal"));
    ["cart-modal", "checkout-modal", "product-detail-modal", "confirmation-modal"].forEach((id) => {
      document.getElementById(id).addEventListener("click", (e) => {
        if (e.target.id === id) closeModal(id);
      });
    });
    document.getElementById("cart-close-btn").addEventListener("click", () => closeModal("cart-modal"));
    document.getElementById("pd-close-btn").addEventListener("click", () => closeModal("product-detail-modal"));
    document.getElementById("checkout-close-btn").addEventListener("click", () => closeModal("checkout-modal"));
    document.getElementById("confirmation-close-btn").addEventListener("click", () => closeModal("confirmation-modal"));
    document.getElementById("confirmation-ok-btn").addEventListener("click", () => closeModal("confirmation-modal"));

    document.getElementById("pd-add").addEventListener("click", () => {
      if (detailProduct) {
        addToCart(detailProduct, "pd-size", "pd-qty");
        closeModal("product-detail-modal");
        document.getElementById("cart-open-btn").focus();
      }
    });

    document.getElementById("checkout-btn").addEventListener("click", () => {
      closeModal("cart-modal");
      SFAuth.requireLogin(() => {
        const user = SFAuth.getCurrentUser();
        const nameField = document.getElementById("co-name");
        if (user && !nameField.value) nameField.value = user.username;
        renderCheckoutSummary();
        openModal("checkout-modal", "#co-name");
      });
    });

    document.getElementById("checkout-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = document.getElementById("checkout-message");
      const submitBtn = document.querySelector("#checkout-form button[type=submit]");
      const name = SF.clampText(document.getElementById("co-name").value, 60);
      const klasse = SF.clampText(document.getElementById("co-klasse").value, 20);
      const phone = SF.clampText(document.getElementById("co-phone").value, 25);

      let error = null;
      if (cart.length === 0) error = "Dein Warenkorb ist leer.";
      else if (new Set(cart.map((c) => c.productId)).size > SFDB.MAX_CART_PRODUCTS)
        error = `Bitte bestelle höchstens ${SFDB.MAX_CART_PRODUCTS} verschiedene Produkte auf einmal.`;
      else if (name.length < 2) error = "Bitte gib deinen Namen an.";
      else if (!klasse) error = "Bitte gib deinen Klassennamen an.";
      else if (!/^[0-9 +()/-]{6,25}$/.test(phone)) error = "Bitte gib eine gültige Telefonnummer an (nur Ziffern, Leerzeichen, + / - ( )).";
      if (error) {
        SFUI.showMessage(msg, error, "error");
        return;
      }
      SFUI.hideMessage(msg);

      submitBtn.disabled = true;
      submitBtn.textContent = "Bestellung wird gesendet …";
      try {
        const order = await SFDB.placeOrder({
          customerName: name,
          klasse,
          phone,
          items: cart.map((c) => ({ productId: c.productId, size: c.size, color: c.color, qty: c.qty })),
        });
        cart = [];
        renderCart();
        await loadProducts();
        document.getElementById("checkout-form").reset();
        closeModal("checkout-modal");
        document.getElementById("order-confirmation-id").textContent = order.id.slice(-6).toUpperCase();
        openModal("confirmation-modal", "#confirmation-ok-btn");
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
        if (err && (err.code === "sf/soldout" || err.code === "sf/gone")) {
          await loadProducts();
          renderCheckoutSummary();
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Zahlungspflichtig bestellen";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
