(function () {
  let cart = []; // { productId, name, size, qty, price }

  function productCardHtml(p) {
    const sizeOptions = p.sizes
      .map((s) => `<option value="${SF.escapeHtml(s)}">${SF.escapeHtml(s)}</option>`)
      .join("");
    return `
      <div class="product-card">
        <div class="product-image">${SFIcons.hoodie(p.color || "#2c6e6b")}</div>
        <div class="product-body">
          <h3>${SF.escapeHtml(p.name)}</h3>
          <p class="product-desc">${SF.escapeHtml(p.description || "")}</p>
          <div class="field" style="margin-bottom:8px;">
            <label for="size-${p.id}">Größe</label>
            <select id="size-${p.id}">${sizeOptions}</select>
          </div>
          <div class="field" style="margin-bottom:8px;">
            <label for="qty-${p.id}">Menge</label>
            <input type="number" id="qty-${p.id}" min="1" value="1">
          </div>
          <div class="product-meta">
            <span class="price">${SF.formatPrice(p.price)}</span>
            <button class="btn btn-primary btn-small" data-add="${p.id}">In den Warenkorb</button>
          </div>
        </div>
      </div>
    `;
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
      document
        .querySelector(`[data-add="${p.id}"]`)
        .addEventListener("click", () => addToCart(p));
    });
  }

  function addToCart(p) {
    const size = document.getElementById(`size-${p.id}`).value;
    const qtyInput = document.getElementById(`qty-${p.id}`);
    let qty = parseInt(qtyInput.value, 10);
    if (!qty || qty < 1) qty = 1;

    const existing = cart.find((c) => c.productId === p.id && c.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId: p.id, name: p.name, size, qty, price: p.price });
    }
    renderCart();
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
        });
      });
    }
    document.getElementById("cart-total").textContent = SF.formatPrice(cartTotal());
    document.getElementById("checkout-btn").disabled = cart.length === 0;
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
      document.getElementById("checkout-form").reset();
      closeModal("checkout-modal");
      document.getElementById("order-confirmation-id").textContent = order.id.slice(-6).toUpperCase();
      openModal("confirmation-modal");
    });

    document.getElementById("confirmation-close-btn").addEventListener("click", () => closeModal("confirmation-modal"));
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
