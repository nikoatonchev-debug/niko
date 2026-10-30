/* Kundenkonten: Registrierung, Anmeldung und E-Mail-Bestätigung über Firebase.
 *
 * Ablauf: Registrieren -> Firebase schickt einen Bestätigungslink per E-Mail
 * -> man klickt ihn an und tippt dann hier auf "Ich habe bestätigt". Bestellen
 * und Bewerten geht nur mit bestätigter E-Mail-Adresse (das prüft auch die
 * Datenbank selbst, nicht nur diese Seite).
 */

const SFAuth = (function () {
  const MAIL_COOLDOWN_S = 60;
  const PASSWORD_MIN = 8;

  let onSuccessCallback = null;
  let currentView = null;
  let resendTimer = null;
  let wired = false;

  function getCurrentUser() {
    return SFDB.currentUser();
  }
  function isLoggedIn() {
    const u = SFDB.currentUser();
    return !!(u && u.emailVerified);
  }

  function injectModal() {
    if (document.getElementById("auth-modal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="modal-backdrop hidden" id="auth-modal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title-login">
          <button type="button" class="modal-close" id="auth-modal-close" aria-label="Schließen">&times;</button>

          <div id="auth-view-login">
            <h2 id="auth-title-login">Anmelden</h2>
            <p class="hint">Zum Bestellen musst du angemeldet sein.</p>
            <form id="auth-login-form" novalidate>
              <div class="field">
                <label for="auth-login-email">E-Mail-Adresse</label>
                <input type="email" id="auth-login-email" autocomplete="email" maxlength="100" required>
              </div>
              <div class="field">
                <label for="auth-login-password">Passwort</label>
                <input type="password" id="auth-login-password" autocomplete="current-password" maxlength="128" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block" id="auth-login-submit">Anmelden</button>
              <div id="auth-login-message" class="form-message hidden"></div>
            </form>
            <p class="hint text-center mt-14">
              <a href="#" id="auth-show-reset">Passwort vergessen?</a>
            </p>
            <p class="hint text-center">
              Noch kein Konto? <a href="#" id="auth-show-register">Jetzt registrieren</a>
            </p>
          </div>

          <div id="auth-view-register" class="hidden">
            <h2 id="auth-title-register">Registrieren</h2>
            <form id="auth-register-form" novalidate>
              <div class="field">
                <label for="auth-reg-username">Benutzername <span class="hint">(wird bei Bewertungen angezeigt)</span></label>
                <input type="text" id="auth-reg-username" autocomplete="nickname" minlength="2" maxlength="30" required>
              </div>
              <div class="field">
                <label for="auth-reg-email">E-Mail-Adresse</label>
                <input type="email" id="auth-reg-email" autocomplete="email" maxlength="100" required>
              </div>
              <div class="field">
                <label for="auth-reg-password">Passwort <span class="hint">(mindestens ${PASSWORD_MIN} Zeichen)</span></label>
                <input type="password" id="auth-reg-password" autocomplete="new-password" minlength="${PASSWORD_MIN}" maxlength="128" required>
              </div>
              <div class="field">
                <label for="auth-reg-password2">Passwort bestätigen</label>
                <input type="password" id="auth-reg-password2" autocomplete="new-password" maxlength="128" required>
              </div>
              <p class="hint">
                Wir speichern Benutzername und E-Mail-Adresse bei unserem Anbieter Google Firebase.
                Dein Passwort speichert Firebase nur verschlüsselt. Wir schicken dir eine E-Mail mit
                einem Bestätigungslink. Mehr dazu in der <a href="datenschutz.html">Datenschutzerklärung</a>.
              </p>
              <button type="submit" class="btn btn-primary btn-block" id="auth-register-submit">Registrieren</button>
              <div id="auth-register-message" class="form-message hidden"></div>
            </form>
            <p class="hint text-center mt-14">
              Schon registriert? <a href="#" id="auth-show-login">Zum Login</a>
            </p>
          </div>

          <div id="auth-view-verify" class="hidden">
            <h2 id="auth-title-verify">E-Mail-Adresse bestätigen</h2>
            <p class="hint" id="auth-verify-info"></p>
            <p class="hint">
              Klicke in der E-Mail auf den Bestätigungslink und tippe danach hier auf
              „Ich habe bestätigt“. Keine E-Mail angekommen? Schau bitte auch im Spam-Ordner nach.
            </p>
            <div id="auth-verify-message" class="form-message hidden"></div>
            <button type="button" class="btn btn-primary btn-block mt-10" id="auth-verify-check">Ich habe bestätigt</button>
            <button type="button" class="btn btn-outline btn-small mt-10" id="auth-resend-code">E-Mail erneut senden</button>
            <p class="text-center mt-14">
              <a href="#" id="auth-verify-cancel" class="hint underline">Abbrechen</a>
            </p>
          </div>

          <div id="auth-view-reset" class="hidden">
            <h2 id="auth-title-reset">Passwort zurücksetzen</h2>
            <p class="hint">Wir schicken dir eine E-Mail mit einem Link, über den du ein neues Passwort festlegen kannst.</p>
            <form id="auth-reset-form" novalidate>
              <div class="field">
                <label for="auth-reset-email">E-Mail-Adresse</label>
                <input type="email" id="auth-reset-email" autocomplete="email" maxlength="100" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block" id="auth-reset-submit">Link senden</button>
              <div id="auth-reset-message" class="form-message hidden"></div>
            </form>
            <p class="hint text-center mt-14"><a href="#" id="auth-reset-back">Zurück zum Login</a></p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap.firstElementChild);
  }

  function msgEl(id) {
    return document.getElementById(id);
  }

  function showView(name) {
    currentView = name;
    ["login", "register", "verify", "reset"].forEach((v) => {
      document.getElementById("auth-view-" + v).classList.toggle("hidden", v !== name);
    });
    ["login", "register", "verify", "reset"].forEach((v) => SFUI.hideMessage(msgEl("auth-" + v + "-message")));
    document.querySelector("#auth-modal .modal").setAttribute("aria-labelledby", "auth-title-" + name);
    // Während der Bestätigung gibt es nur den "Abbrechen"-Link unten als
    // Ausstieg, damit niemand versehentlich per X oben abbricht.
    document.getElementById("auth-modal-close").classList.toggle("hidden", name === "verify");
    if (name === "verify") {
      const u = SFDB.currentUser();
      document.getElementById("auth-verify-info").textContent = u
        ? "Wir haben eine E-Mail an " + u.email + " geschickt."
        : "";
      startResendTimer();
    } else {
      stopResendTimer();
    }
    const firstField = document.querySelector("#auth-view-" + name + " input");
    if (firstField && !document.getElementById("auth-modal").classList.contains("hidden")) {
      firstField.focus();
    }
  }

  function openModal(view) {
    injectModal();
    wireModal();
    showView(view || "login");
    SFUI.openDialog(document.getElementById("auth-modal"), {
      onEscape: closeModal,
      initialFocus: "#auth-view-" + (view || "login") + " input",
    });
  }

  // Während der Bestätigung darf sich das Fenster nicht versehentlich
  // schließen lassen (Klick daneben / X / Escape) - nur über "Abbrechen".
  function closeModal() {
    if (currentView === "verify") return;
    forceCloseModal();
  }
  function forceCloseModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) SFUI.closeDialog(modal);
    onSuccessCallback = null;
    currentView = null;
    stopResendTimer();
  }

  async function requireLogin(onSuccess) {
    await SFDB.ready;
    const u = SFDB.currentUser();
    if (u && u.emailVerified) {
      onSuccess();
      return;
    }
    onSuccessCallback = onSuccess;
    openModal(u ? "verify" : "login");
  }

  function finishLogin() {
    const cb = onSuccessCallback;
    onSuccessCallback = null;
    forceCloseModal();
    if (cb) cb();
  }

  function startResendTimer() {
    stopResendTimer();
    const btn = document.getElementById("auth-resend-code");
    function tick() {
      const left = SF.cooldownSecondsLeft("verify-mail", MAIL_COOLDOWN_S);
      if (left > 0) {
        btn.disabled = true;
        btn.textContent = `E-Mail erneut senden (${left} s)`;
      } else {
        btn.disabled = false;
        btn.textContent = "E-Mail erneut senden";
        stopResendTimer();
      }
    }
    tick();
    resendTimer = setInterval(tick, 1000);
  }
  function stopResendTimer() {
    if (resendTimer) clearInterval(resendTimer);
    resendTimer = null;
  }

  function setBusy(btn, busy, busyText, idleText) {
    btn.disabled = busy;
    btn.textContent = busy ? busyText : idleText;
  }

  function wireModal() {
    if (wired) return;
    wired = true;

    document.getElementById("auth-modal-close").addEventListener("click", closeModal);
    document.getElementById("auth-modal").addEventListener("click", (e) => {
      if (e.target.id === "auth-modal") closeModal();
    });
    const link = (id, view) =>
      document.getElementById(id).addEventListener("click", (e) => {
        e.preventDefault();
        showView(view);
      });
    link("auth-show-register", "register");
    link("auth-show-login", "login");
    link("auth-show-reset", "reset");
    link("auth-reset-back", "login");

    document.getElementById("auth-login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = msgEl("auth-login-message");
      const btn = document.getElementById("auth-login-submit");
      const email = SF.clampText(document.getElementById("auth-login-email").value, 100);
      const password = document.getElementById("auth-login-password").value;
      if (!email || !password) {
        SFUI.showMessage(msg, "Bitte gib E-Mail-Adresse und Passwort ein.", "error");
        return;
      }
      setBusy(btn, true, "Einen Moment …", "Anmelden");
      try {
        const u = await SFDB.login(email, password);
        document.getElementById("auth-login-form").reset();
        if (u.emailVerified) {
          finishLogin();
        } else {
          showView("verify");
        }
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      } finally {
        setBusy(btn, false, "", "Anmelden");
      }
    });

    document.getElementById("auth-register-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = msgEl("auth-register-message");
      const btn = document.getElementById("auth-register-submit");
      const username = SF.clampText(document.getElementById("auth-reg-username").value, 30);
      const email = SF.clampText(document.getElementById("auth-reg-email").value, 100);
      const pw = document.getElementById("auth-reg-password").value;
      const pw2 = document.getElementById("auth-reg-password2").value;

      let error = null;
      if (username.length < 2) error = "Bitte einen Benutzernamen mit mindestens 2 Zeichen eingeben.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) error = "Bitte eine gültige E-Mail-Adresse eingeben.";
      else if (pw.length < PASSWORD_MIN) error = `Das Passwort muss mindestens ${PASSWORD_MIN} Zeichen haben.`;
      else if (pw.length > 128) error = "Das Passwort darf höchstens 128 Zeichen haben.";
      else if (pw !== pw2) error = "Die Passwörter stimmen nicht überein.";
      if (error) {
        SFUI.showMessage(msg, error, "error");
        return;
      }
      setBusy(btn, true, "Konto wird angelegt …", "Registrieren");
      try {
        await SFDB.register({ username, email, password: pw });
        SF.startCooldown("verify-mail");
        document.getElementById("auth-register-form").reset();
        showView("verify");
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      } finally {
        setBusy(btn, false, "", "Registrieren");
      }
    });

    document.getElementById("auth-verify-check").addEventListener("click", async () => {
      const msg = msgEl("auth-verify-message");
      const btn = document.getElementById("auth-verify-check");
      setBusy(btn, true, "Ich prüfe das …", "Ich habe bestätigt");
      try {
        const u = await SFDB.refreshUser();
        if (u && u.emailVerified) {
          finishLogin();
        } else {
          SFUI.showMessage(
            msg,
            "Deine E-Mail-Adresse ist noch nicht bestätigt. Bitte klicke auf den Link in der E-Mail (schau auch im Spam-Ordner nach) und tippe dann noch einmal hier.",
            "error"
          );
        }
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      } finally {
        setBusy(btn, false, "", "Ich habe bestätigt");
      }
    });

    document.getElementById("auth-resend-code").addEventListener("click", async () => {
      const msg = msgEl("auth-verify-message");
      if (SF.cooldownSecondsLeft("verify-mail", MAIL_COOLDOWN_S) > 0) return;
      try {
        await SFDB.resendVerification();
        SF.startCooldown("verify-mail");
        SFUI.showMessage(msg, "Wir haben dir die E-Mail noch einmal geschickt.", "success");
        startResendTimer();
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      }
    });

    document.getElementById("auth-verify-cancel").addEventListener("click", async (e) => {
      e.preventDefault();
      forceCloseModal();
      try {
        await SFDB.logout();
      } catch (err) {
        console.warn(err);
      }
    });

    document.getElementById("auth-reset-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = msgEl("auth-reset-message");
      const btn = document.getElementById("auth-reset-submit");
      const email = SF.clampText(document.getElementById("auth-reset-email").value, 100);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        SFUI.showMessage(msg, "Bitte gib deine E-Mail-Adresse ein.", "error");
        return;
      }
      setBusy(btn, true, "Einen Moment …", "Link senden");
      try {
        await SFDB.resetPassword(email);
        SFUI.showMessage(
          msg,
          "Falls es ein Konto mit dieser E-Mail-Adresse gibt, haben wir dir einen Link geschickt (schau auch im Spam-Ordner nach).",
          "success"
        );
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      } finally {
        setBusy(btn, false, "", "Link senden");
      }
    });
  }

  async function logout() {
    await SFDB.logout();
  }

  function updateHeaderStatus() {
    const el = document.getElementById("auth-status");
    if (!el) return;
    const user = SFDB.currentUser();
    if (user && user.emailVerified) {
      el.innerHTML =
        '<span class="auth-link">Hallo, ' +
        SF.escapeHtml(user.username) +
        '</span><a href="meine-bestellungen.html" class="auth-link">Meine Bestellungen</a>' +
        '<a href="#" class="auth-link auth-logout" id="auth-logout-link">Abmelden</a>';
      document.getElementById("auth-logout-link").addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    } else if (user) {
      el.innerHTML =
        '<a href="#" class="auth-link" id="auth-verify-link">E-Mail bestätigen</a>' +
        '<a href="#" class="auth-link auth-logout" id="auth-logout-link">Abmelden</a>';
      document.getElementById("auth-verify-link").addEventListener("click", (e) => {
        e.preventDefault();
        openModal("verify");
      });
      document.getElementById("auth-logout-link").addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    } else {
      el.innerHTML = '<a href="#" class="auth-link" id="auth-login-link">Anmelden</a>';
      document.getElementById("auth-login-link").addEventListener("click", (e) => {
        e.preventDefault();
        openModal("login");
      });
    }
  }

  // Hinweis-Leiste auf jeder Seite, sobald eine eigene Bestellung abholbereit ist.
  // Auf "Meine Bestellungen" (dort steht es direkt dran) und im Admin-Bereich nicht.
  let readyCheckedFor = null;
  async function updateReadyBanner() {
    const user = SFDB.currentUser();
    const page = document.body.getAttribute("data-page");
    const old = document.getElementById("ready-banner");
    if (!user || !user.emailVerified || page === "orders" || page === "admin") {
      if (old) old.remove();
      readyCheckedFor = null;
      return;
    }
    if (readyCheckedFor === user.uid) return;
    readyCheckedFor = user.uid;
    let count = 0;
    try {
      const [shop, special] = await Promise.all([SFDB.getMyOrders(), SFDB.getMySpecialOrders()]);
      count = shop.concat(special).filter((o) => o.status === "abholbereit").length;
    } catch (e) {
      return; // Hinweis ist nur ein Extra – bei Fehlern einfach weglassen
    }
    if (count === 0 || document.getElementById("ready-banner")) return;
    const header = document.getElementById("site-header");
    if (!header) return;
    const banner = document.createElement("div");
    banner.id = "ready-banner";
    banner.className = "ready-banner";
    banner.setAttribute("role", "status");
    banner.innerHTML =
      '<div class="container"><span><strong>' +
      (count === 1 ? "Deine Bestellung ist abholbereit!" : count + " deiner Bestellungen sind abholbereit!") +
      "</strong> Hol sie freitags ab 11 Uhr bei der alten Apotheke ab.</span>" +
      '<a href="meine-bestellungen.html">Zu meinen Bestellungen</a></div>';
    header.insertAdjacentElement("afterend", banner);
  }

  function onAuth() {
    updateHeaderStatus();
    updateReadyBanner();
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectModal();
    // Hinweise auf die „abholbereit“-E-Mail nur zeigen, wenn sie eingerichtet ist
    document.querySelectorAll("[data-if-email]").forEach((el) => (el.hidden = !SFDB.readyEmailEnabled()));
    SFDB.ready.then(onAuth);
    SFDB.onAuthChange(onAuth);
  });

  return {
    isLoggedIn,
    getCurrentUser,
    requireLogin,
    openModal,
    logout,
  };
})();
