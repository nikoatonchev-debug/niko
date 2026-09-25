(function () {
  let cart = []; // { productId, name, size, qty, price }
  let detailProduct = null;
  let detailImageIndex = 0;

  function productImagesOrIcon(p) {
    if (p.images && p.images.length) {
      return `<img src="${p.images[0]}" alt="${SF.escapeHtml(p.name)}" style="width:100%;height:100%;object-fit:cover;">`;
    }
    return SFIcons.hoodie(p.color || "#2c6e6b");
  }

  function productCardHtml(p) {
    const remaining = SF.getProductRemaining(p);
    const soldOut = remaining !== null && remaining <= 0;
    const sizeOptions = p.sizes
      .map((s) => `<option value="${SF.escapeHtml(s)}">${SF.escapeHtml(s)}</option>`)
      .join("");
    return `
      <div class="product-card" data-card="${p.id}">
        <div class="product-image" data-open-detail="${p.id}" style="cursor:pointer; position:relative;">
          ${productImagesOrIcon(p)}
          ${soldOut ? `<div class="sold-out-banner">Ausverkauft</div>` : ""}
        </div>
        <div class="product-body">
          <h3 data-open-detail="${p.id}" style="cursor:pointer;">${SF.escapeHtml(p.name)}</h3>
          <p class="product-desc">${SF.escapeHtml(p.description || "")}</p>
          ${
            remaining !== null && !soldOut
              ? `<p class="hint">Nur noch ${remaining} Stück verfügbar</p>`
              : ""
          }
          <div class="field" style="margin-bottom:8px;">
            <label for="size-${p.id}">Größe</label>
            <select id="size-${p.id}" ${soldOut ? "disabled" : ""}>${sizeOptions}</select>
          </div>
          <div class="field" style="margin-bottom:8px;">
            <label for="qty-${p.id}">Menge</label>
            <input type="number" id="qty-${p.id}" min="1" value="1" ${soldOut ? "disabled" : ""}>
          </div>
          <div class="product-meta">
            <span class="price">${SF.formatPrice(p.price)}</span>
            <button class="btn btn-primary btn-small" data-add="${p.id}" ${soldOut ? "disabled" : ""}>
              ${soldOut ? "Ausverkauft" : "In den Warenkorb"}
            </button>
          </div>
        </div>
      </div>
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
      const btn = document.querySelector(`[data-add="${p.id}"]`);
      if (btn) btn.addEventListener("click", () => addToCart(p, `size-${p.id}`, `qty-${p.id}`));
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
      const already = cartQtyForProduct(p.id);
      const room = remaining - already;
      if (room <= 0) {
        renderProducts();
        return;
      }
      if (qty > room) {
        qty = room;
      }
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
  }

  function flashCart() {
    const btn = document.getElementById("cart-open-btn");
    btn.style.transform = "scale(1.08)";
    setTimeout(() => (btn.style.transform = ""), 150);
  }

  function cartTotal() {
    return cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  }

  function renderCart() {
    const countEl = document.getElementById("cart-count");
    countEl.textContent = cart.reduce((n, c) => n + c.qty, 0);

    const linesEl = document.getElementById("cart-lines");
    if (cart.length === 0) {
      linesEl.innerHTML = `<p>Dein Warenkorb ist noch leer.</p>`;
    } else {
      linesEl.innerHTML = cart
        .map(
          (c, i) => `
        <div class="cart-line">
          <div class="cart-line-info">
            <strong>${SF.escapeHtml(c.name)}</strong>
            Größe ${SF.escapeHtml(c.size)} &middot; ${c.qty} Stück &middot; ${SF.formatPrice(c.price * c.qty)}
          </div>
          <button class="btn btn-outline btn-small" data-remove="${i}">Entfernen</button>
        </div>`
        )
        .join("");
      linesEl.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          cart.splice(parseInt(btn.getAttribute("data-remove"), 10), 1);
          renderCart();
          renderProducts();
        });
      });
    }
    document.getElementById("cart-total").textContent = SF.formatPrice(cartTotal());
    document.getElementById("checkout-btn").disabled = cart.length === 0;
  }

  // ---------- Produkt-Detailansicht ----------
  function openDetail(productId) {
    const p = SF.getProducts().find((x) => x.id === productId);
    if (!p) return;
    detailProduct = p;
    detailImageIndex = 0;
    renderDetail();
    openModal("product-detail-modal");
  }

  function renderDetail() {
    const p = detailProduct;
    if (!p) return;
    const images = p.images && p.images.length ? p.images : null;
    const remaining = SF.getProductRemaining(p);
    const soldOut = remaining !== null && remaining <= 0;

    const galleryEl = document.getElementById("pd-gallery");
    if (images) {
      galleryEl.innerHTML = `
        <img src="${images[detailImageIndex]}" alt="${SF.escapeHtml(p.name)}" style="width:100%; aspect-ratio:4/3; object-fit:cover; border-radius:var(--radius-sm);">
        ${
          images.length > 1
            ? `<div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <button type="button" class="btn btn-outline btn-small" id="pd-prev">&larr; Zurück</button>
                <span class="hint">${detailImageIndex + 1} / ${images.length}</span>
                <button type="button" class="btn btn-outline btn-small" id="pd-next">Weiter &rarr;</button>
              </div>`
            : ""
        }
      `;
      if (images.length > 1) {
        document.getElementById("pd-prev").addEventListener("click", () => {
          detailImageIndex = (detailImageIndex - 1 + images.length) % images.length;
          renderDetail();
        });
        document.getElementById("pd-next").addEventListener("click", () => {
          detailImageIndex = (detailImageIndex + 1) % images.length;
          renderDetail();
        });
      }
    } else {
      galleryEl.innerHTML = `<div class="product-image" style="aspect-ratio:4/3;">${SFIcons.hoodie(p.color || "#2c6e6b")}</div>`;
    }

    document.getElementById("pd-name").textContent = p.name;
    document.getElementById("pd-desc").textContent = p.description || "";
    document.getElementById("pd-price").textContent = SF.formatPrice(p.price);
    document.getElementById("pd-stock-hint").textContent =
      remaining !== null && !soldOut ? `Nur noch ${remaining} Stück verfügbar` : "";

    const sizeSelect = document.getElementById("pd-size");
    sizeSelect.innerHTML = p.sizes.map((s) => `<option value="${SF.escapeHtml(s)}">${SF.escapeHtml(s)}</option>`).join("");
    sizeSelect.disabled = soldOut;
    document.getElementById("pd-qty").disabled = soldOut;
    document.getElementById("pd-qty").value = 1;
    const addBtn = document.getElementById("pd-add");
    addBtn.disabled = soldOut;
    addBtn.textContent = soldOut ? "Ausverkauft" : "In den Warenkorb";
  }

  function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
  }
  function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
  }

  function setup() {
    renderProducts();
    renderCart();

    document.getElementById("cart-open-btn").addEventListener("click", () => openModal("cart-modal"));
    document.getElementById("cart-close-btn").addEventListener("click", () => closeModal("cart-modal"));
    document.getElementById("cart-modal").addEventListener("click", (e) => {
      if (e.target.id === "cart-modal") closeModal("cart-modal");
    });

    document.getElementById("pd-close-btn").addEventListener("click", () => closeModal("product-detail-modal"));
    document.getElementById("product-detail-modal").addEventListener("click", (e) => {
      if (e.target.id === "product-detail-modal") closeModal("product-detail-modal");
    });
    document.getElementById("pd-add").addEventListener("click", () => {
      if (detailProduct) {
        addToCart(detailProduct, "pd-size", "pd-qty");
        closeModal("product-detail-modal");
      }
    });

    document.getElementById("checkout-btn").addEventListener("click", () => {
      closeModal("cart-modal");
      SFAuth.requireLogin(() => {
        const user = SFAuth.getCurrentUser();
        if (user) {
          const nameField = document.getElementById("co-name");
          if (!nameField.value) nameField.value = user.username;
        }
        openModal("checkout-modal");
      });
    });
    document.getElementById("checkout-close-btn").addEventListener("click", () => closeModal("checkout-modal"));

    document.getElementById("checkout-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("co-name").value.trim();
      const klasse = document.getElementById("co-klasse").value.trim();
      const phone = document.getElementById("co-phone").value.trim();
      const user = SFAuth.getCurrentUser();

      const order = SF.addOrder({
        customerName: name,
        klasse: klasse,
        phone: phone || null,
        username: user ? user.username : null,
        items: cart.map((c) => ({ ...c })),
        total: cartTotal(),
      });

      cart = [];
      renderCart();
      renderProducts();
      document.getElementById("checkout-form").reset();
      closeModal("checkout-modal");
      document.getElementById("order-confirmation-id").textContent = order.id.slice(-6).toUpperCase();
      openModal("confirmation-modal");
    });

    document.getElementById("confirmation-close-btn").addEventListener("click", () => closeModal("confirmation-modal"));
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
