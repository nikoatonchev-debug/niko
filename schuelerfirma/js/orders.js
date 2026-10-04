(function () {
  const esc = (s) => SF.escapeHtml(s);

  // Hinweis direkt an einer abholbereiten Bestellung
  const READY_NOTE = `<p class="ready-note"><strong>Deine Bestellung ist abholbereit!</strong> Hol sie freitags ab 11 Uhr bei der alten Apotheke ab und bring deine Bestellnummer mit. Bezahlt wird bar.</p>`;

  function orderNumber(id) {
    return esc(String(id || "").slice(-6).toUpperCase());
  }

  function renderShopOrders(list) {
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
        const ready = o.status === "abholbereit";
        return `
        <article class="review-card${ready ? " order-ready" : ""}">
          <div class="review-head">
            <h3 class="review-name">Bestellung #${orderNumber(o.id)}</h3>
            <span class="review-date">${SF.formatDate(o.date)}</span>
          </div>
          <p>${items}</p>
          <div class="product-meta">
            <span class="price">${SF.formatPrice(o.total)}</span>
            ${SF.pickupBadgeHtml(o.status)}
          </div>
          ${ready ? READY_NOTE : ""}
        </article>`;
      })
      .join("");
  }

  function renderSpecialOrders(list) {
    const el = document.getElementById("special-orders-list");
    if (list.length === 0) {
      el.innerHTML = `<p class="hint">Du hast noch keine Spezialbestellungen aufgegeben.</p>`;
      return;
    }
    el.innerHTML = list
      .map((o) => {
        const ready = o.status === "abholbereit";
        return `
      <article class="review-card${ready ? " order-ready" : ""}">
        <div class="review-head">
          <h3 class="review-name">Bestellung #${orderNumber(o.id)}</h3>
          <span class="review-date">${SF.formatDate(o.date)}</span>
        </div>
        <p>${esc(o.wunsch)}</p>
        <p class="hint">Größe ${esc(o.groesse)} &middot; ${Number(o.menge) || 1}x</p>
        <div class="badge-row">${SF.specialDecisionBadgeHtml(o.status)} ${SF.pickupBadgeHtml(o.status)}</div>
        ${ready ? READY_NOTE : ""}
      </article>`;
      })
      .join("");
  }

  function showLoginHint(text) {
    document.getElementById("orders-content").classList.add("hidden");
    const hint = document.getElementById("orders-login-hint");
    hint.classList.remove("hidden");
    if (text) hint.querySelector("p").textContent = text;
  }

  async function showOrders() {
    const user = SFDB.currentUser();
    if (!user || !user.emailVerified) {
      showLoginHint();
      return;
    }
    document.getElementById("orders-login-hint").classList.add("hidden");
    document.getElementById("orders-content").classList.remove("hidden");
    const shopEl = document.getElementById("shop-orders-list");
    const specialEl = document.getElementById("special-orders-list");
    shopEl.innerHTML = specialEl.innerHTML = `<p class="hint">Wird geladen …</p>`;
    try {
      const [orders, special] = await Promise.all([SFDB.getMyOrders(), SFDB.getMySpecialOrders()]);
      renderShopOrders(orders);
      renderSpecialOrders(special);
    } catch (e) {
      const m = `<p class="form-message error" role="alert">${esc(SFDB.errorMessage(e))}</p>`;
      shopEl.innerHTML = specialEl.innerHTML = m;
    }
  }

  function setupDeleteAccount() {
    const openBtn = document.getElementById("delete-account-btn");
    const form = document.getElementById("delete-account-form");
    const msg = document.getElementById("delete-account-message");
    openBtn.addEventListener("click", () => {
      form.classList.remove("hidden");
      openBtn.classList.add("hidden");
      document.getElementById("delete-account-password").focus();
    });
    document.getElementById("delete-account-cancel").addEventListener("click", () => {
      form.classList.add("hidden");
      form.reset();
      SFUI.hideMessage(msg);
      openBtn.classList.remove("hidden");
      openBtn.focus();
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const password = document.getElementById("delete-account-password").value;
      if (!password) {
        SFUI.showMessage(msg, "Bitte gib zur Sicherheit dein Passwort ein.", "error");
        return;
      }
      try {
        await SFDB.deleteAccount(password);
        form.reset();
        form.classList.add("hidden");
        openBtn.classList.remove("hidden");
        showLoginHint("Dein Konto wurde gelöscht.");
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      }
    });
  }

  async function setup() {
    document.getElementById("orders-login-btn").addEventListener("click", () => {
      SFAuth.requireLogin(showOrders);
    });
    setupDeleteAccount();
    await SFDB.ready;
    showOrders();
    SFDB.onAuthChange(() => showOrders());
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
