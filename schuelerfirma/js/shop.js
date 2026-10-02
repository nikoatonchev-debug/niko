(function () {
  let cart = []; // { productId, name, size, qty, price }
  let detailProduct = null;
  let detailImageIndex = 0;

  const esc = (s) => SF.escapeHtml(s);

  function productImagesOrIcon(p) {
    if (p.images && p.images.length) {
      return `<img src="${esc(p.images[0])}" alt="" class="fill-img">`;
    }
    return SFIcons.hoodie(SF.safeColor(p.color));
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
    const products = SF.getActiveProducts();
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

    const existing = cart.find((c) => c.productId === p.id && c.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId: p.id, name: p.name, size, qty, price: p.price });
    }
    renderCart();
    renderProducts();
    flashCart();
    announce(`${qty} × ${p.name} (Größe ${size}) in den Warenkorb gelegt.`);
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
            Größe ${esc(c.size)} &middot; ${Number(c.qty)} Stück &middot; ${SF.formatPrice(c.price * c.qty)}
          </div>
          ${
            withRemove
              ? `<button class="btn btn-outline btn-small" data-remove="${i}" aria-label="${esc(c.name)} (Größe ${esc(c.size)}) entfernen">Entfernen</button>`
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
    const p = SF.getProducts().find((x) => x.id === productId);
    if (!p) return;
    detailProduct = p;
    detailImageIndex = 0;
    renderDetail();
    openModal("product-detail-modal", "#pd-size");
  }

  function renderDetail() {
    const p = detailProduct;
    if (!p) return;
    const images = p.images && p.images.length ? p.images : null;
    const remaining = SF.getProductRemaining(p);
    const soldOut = remaining !== null && remaining <= 0;
    const overlay = soldOut ? `<div class="sold-out-overlay"><span class="sold-out-text">Ausverkauft</span></div>` : "";

    const galleryEl = document.getElementById("pd-gallery");
    if (images) {
      const n = detailImageIndex + 1;
      galleryEl.innerHTML = `
        <div class="product-image product-image-detail">
          <img src="${esc(images[detailImageIndex])}" alt="${esc(p.name)} – Bild ${n} von ${images.length}" class="fill-img">
          ${overlay}
        </div>
        ${
          images.length > 1
            ? `<div class="gallery-nav">
                <button type="button" class="btn btn-outline btn-small" id="pd-prev" aria-label="Vorheriges Bild">&larr; Zurück</button>
                <span class="hint" aria-live="polite">${n} / ${images.length}</span>
                <button type="button" class="btn btn-outline btn-small" id="pd-next" aria-label="Nächstes Bild">Weiter &rarr;</button>
              </div>`
            : ""
        }
      `;
      if (images.length > 1) {
        document.getElementById("pd-prev").addEventListener("click", () => {
          detailImageIndex = (detailImageIndex - 1 + images.length) % images.length;
          renderDetail();
          document.getElementById("pd-prev").focus();
        });
        document.getElementById("pd-next").addEventListener("click", () => {
          detailImageIndex = (detailImageIndex + 1) % images.length;
          renderDetail();
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
    renderProducts();
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

    document.getElementById("checkout-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("checkout-message");
      const name = SF.clampText(document.getElementById("co-name").value, 60);
      const klasse = SF.clampText(document.getElementById("co-klasse").value, 20);
      const phone = SF.clampText(document.getElementById("co-phone").value, 25);
      const user = SFAuth.getCurrentUser();

      let error = null;
      if (cart.length === 0) error = "Dein Warenkorb ist leer.";
      else if (name.length < 2) error = "Bitte gib deinen Namen an.";
      else if (!klasse) error = "Bitte gib deinen Klassennamen an.";
      else if (!/^[0-9 +()/-]{6,25}$/.test(phone)) error = "Bitte gib eine gültige Telefonnummer an (nur Ziffern, Leerzeichen, + / - ( )).";
      if (error) {
        SFUI.showMessage(msg, error, "error");
        return;
      }
      SFUI.hideMessage(msg);

      const order = SF.addOrder({
        customerName: name,
        klasse: klasse,
        phone: phone,
        userId: user ? user.id : null,
        username: user ? user.username : null,
        items: cart.map((c) => ({ ...c })),
        total: cartTotal(),
      });
      if (!order) {
        SFUI.showMessage(
          msg,
          "Deine Bestellung konnte nicht gespeichert werden (Speicher deines Browsers ist voll oder gesperrt). Bitte versuche es in einem anderen Browser.",
          "error"
        );
        return;
      }

      cart = [];
      renderCart();
      renderProducts();
      document.getElementById("checkout-form").reset();
      closeModal("checkout-modal");
      document.getElementById("order-confirmation-id").textContent = order.id.slice(-6).toUpperCase();
      openModal("confirmation-modal", "#confirmation-ok-btn");
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
