(function () {
  function statusBadge(status, map) {
    return `<span class="badge ${map[status] || ""}">${SF.escapeHtml(status)}</span>`;
  }

  const ORDER_STATUS_MAP = { offen: "badge-open", abgeholt: "badge-accepted" };
  const SPECIAL_STATUS_MAP = { offen: "badge-open", akzeptiert: "badge-accepted", abgelehnt: "badge-declined" };

  function orderNumber(id) {
    return id.slice(-6).toUpperCase();
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
        const items = o.items
          .map((i) => `${i.qty}x ${SF.escapeHtml(i.name)} (${SF.escapeHtml(i.size)})`)
          .join("<br>");
        return `
        <div class="review-card">
          <div class="review-head">
            <span class="review-name">Bestellung #${orderNumber(o.id)}</span>
            <span class="review-date">${SF.formatDate(o.date)}</span>
          </div>
          <p>${items}</p>
          <div class="product-meta">
            <span class="price">${SF.formatPrice(o.total)}</span>
            ${statusBadge(o.status, ORDER_STATUS_MAP)}
          </div>
        </div>`;
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
      <div class="review-card">
        <div class="review-head">
          <span class="review-name">Bestellung #${orderNumber(o.id)}</span>
          <span class="review-date">${SF.formatDate(o.date)}</span>
        </div>
        <p>${SF.escapeHtml(o.wunsch)}</p>
        <p class="hint">Größe ${SF.escapeHtml(o.groesse)} &middot; ${o.menge}x</p>
        ${statusBadge(o.status, SPECIAL_STATUS_MAP)}
      </div>`
      )
      .join("");
  }

  function showOrders() {
    const user = SFAuth.getCurrentUser();
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

    if (SFAuth.isLoggedIn()) {
      showOrders();
    } else {
      showLoginHint();
    }
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
