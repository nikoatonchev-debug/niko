(function () {
  const esc = (s) => SF.escapeHtml(s);

  function statusBadge(status, map, label) {
    return `<span class="badge ${map[status] || ""}">${esc(label || status)}</span>`;
  }

  const ORDER_STATUS_MAP = { offen: "badge-open", abgeholt: "badge-accepted" };
  const SPECIAL_STATUS_MAP = { offen: "badge-open", akzeptiert: "badge-accepted", abgelehnt: "badge-declined" };

  function orderNumber(id) {
    return esc(String(id || "").slice(-6).toUpperCase());
  }

  function renderShopOrders(username) {
    const list = SF.getOrdersByUsername(username);
    const el = document.getElementById("shop-orders-list");
    if (list.length === 0) {
      el.innerHTML = `<p class="hint">Du hast noch keine Shop-Bestellungen aufgegeben.</p>`;
      return;
    }
    el.innerHTML = list
      .map((o) => {
        const items = (o.items || [])
          .map((i) => `${Number(i.qty)}x ${esc(i.name)} (${esc(i.size)})`)
          .join("<br>");
        return `
        <article class="review-card">
          <div class="review-head">
            <h3 class="review-name">Bestellung #${orderNumber(o.id)}</h3>
            <span class="review-date">${SF.formatDate(o.date)}</span>
          </div>
          <p>${items}</p>
          <div class="product-meta">
            <span class="price">${SF.formatPrice(o.total)}</span>
            ${statusBadge(o.status, ORDER_STATUS_MAP, SF.orderStatusLabel(o.status))}
          </div>
        </article>`;
      })
      .join("");
  }

  function renderSpecialOrders(username) {
    const list = SF.getSpecialOrdersByUsername(username);
    const el = document.getElementById("special-orders-list");
    if (list.length === 0) {
      el.innerHTML = `<p class="hint">Du hast noch keine Spezialbestellungen aufgegeben.</p>`;
      return;
    }
    el.innerHTML = list
      .map(
        (o) => `
      <article class="review-card">
        <div class="review-head">
          <h3 class="review-name">Bestellung #${orderNumber(o.id)}</h3>
          <span class="review-date">${SF.formatDate(o.date)}</span>
        </div>
        <p>${esc(o.wunsch)}</p>
        <p class="hint">Größe ${esc(o.groesse)} &middot; ${Number(o.menge) || 1}x</p>
        ${statusBadge(o.status, SPECIAL_STATUS_MAP)}
      </article>`
      )
      .join("");
  }

  function showOrders() {
    const user = SFAuth.getCurrentUser();
    if (!user) {
      showLoginHint();
      return;
    }
    document.getElementById("orders-login-hint").classList.add("hidden");
    document.getElementById("orders-content").classList.remove("hidden");
    renderShopOrders(user.username);
    renderSpecialOrders(user.username);
  }

  function showLoginHint() {
    document.getElementById("orders-content").classList.add("hidden");
    document.getElementById("orders-login-hint").classList.remove("hidden");
  }

  function setup() {
    document.getElementById("orders-login-btn").addEventListener("click", () => {
      SFAuth.requireLogin(showOrders);
    });

    document.getElementById("delete-account-btn").addEventListener("click", () => {
      const user = SFAuth.getCurrentUser();
      if (!user) return;
      if (!confirm("Möchtest du dein Konto wirklich löschen? Das kann nicht rückgängig gemacht werden.")) return;
      SF.deleteUser(user.id);
      SFAuth.logout();
      showLoginHint();
      document.getElementById("orders-login-hint").querySelector("p").textContent =
        "Dein Konto wurde gelöscht.";
    });

    if (SFAuth.isLoggedIn()) {
      showOrders();
    } else {
      showLoginHint();
    }
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
