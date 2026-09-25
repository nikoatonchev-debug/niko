/* Kundenkonten: Registrierung mit E-Mail-Bestätigungscode, Login, Session.
 *
 * Solange in js/email-config.js noch keine echten EmailJS-Zugangsdaten
 * eingetragen sind, wird der Bestätigungscode direkt im Browser als
 * "Demo-Modus" angezeigt statt per E-Mail verschickt, damit die
 * Registrierung trotzdem zum Ausprobieren funktioniert.
 */

const SFAuth = (function () {
  const SESSION_KEY = "sf_customer_session";
  let pendingReg = null; // { username, email, passwordHash, code }
  let onSuccessCallback = null;
  let emailjsReady = false;
  let emailjsLoadPromise = null;
  let currentView = null;

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  function setSession(user) {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ id: user.id, username: user.username, email: user.email })
      );
    } catch (e) {
      console.warn("SFAuth: konnte Session nicht speichern", e);
    }
  }
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }
  function isLoggedIn() {
    return !!getSession();
  }
  function getCurrentUser() {
    return getSession();
  }

  function genCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  // Lädt das EmailJS-Skript (falls konfiguriert) und wartet, bis es
  // wirklich einsatzbereit ist. Gibt true/false zurück (nie einen Fehler),
  // mit Zeitlimit, damit die Registrierung nie hängen bleibt, wenn das
  // Skript nicht laden kann (z. B. kein Internet).
  function ensureEmailJs() {
    if (!window.sfEmailIsConfigured || !sfEmailIsConfigured()) {
      return Promise.resolve(false);
    }
    if (emailjsReady && window.emailjs) {
      return Promise.resolve(true);
    }
    if (emailjsLoadPromise) return emailjsLoadPromise;

    emailjsLoadPromise = new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 6000);
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      script.onload = () => {
        clearTimeout(timeout);
        window.emailjs.init({ publicKey: SF_EMAIL_CONFIG.PUBLIC_KEY });
        emailjsReady = true;
        resolve(true);
      };
      script.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      document.head.appendChild(script);
    });
    return emailjsLoadPromise;
  }

  async function sendCodeByEmail(email, code) {
    const ready = await ensureEmailJs();
    if (!ready) {
      throw new Error("EmailJS nicht verfügbar");
    }
    return window.emailjs.send(SF_EMAIL_CONFIG.SERVICE_ID, SF_EMAIL_CONFIG.TEMPLATE_ID, {
      to_email: email,
      code: code,
    });
  }

  function injectModal() {
    if (document.getElementById("auth-modal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="modal-backdrop hidden" id="auth-modal">
        <div class="modal">
          <button type="button" class="modal-close" id="auth-modal-close">&times;</button>

          <div id="auth-view-login">
            <h2>Anmelden</h2>
            <p class="hint">Zum Bestellen musst du angemeldet sein.</p>
            <form id="auth-login-form">
              <div class="field">
                <label for="auth-login-username">Benutzername</label>
                <input type="text" id="auth-login-username" autocomplete="username" required>
              </div>
              <div class="field">
                <label for="auth-login-password">Passwort</label>
                <input type="password" id="auth-login-password" autocomplete="current-password" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Anmelden</button>
              <div id="auth-login-message" class="form-message hidden"></div>
            </form>
            <p class="hint" style="margin-top:14px; text-align:center;">
              Noch kein Konto? <a href="#" id="auth-show-register">Jetzt registrieren</a>
            </p>
          </div>

          <div id="auth-view-register" class="hidden">
            <h2>Registrieren</h2>
            <form id="auth-register-form">
              <div class="field">
                <label for="auth-reg-username">Benutzername</label>
                <input type="text" id="auth-reg-username" autocomplete="username" required>
              </div>
              <div class="field">
                <label for="auth-reg-email">E-Mail-Adresse</label>
                <input type="email" id="auth-reg-email" autocomplete="email" required>
              </div>
              <div class="field">
                <label for="auth-reg-password">Passwort</label>
                <input type="password" id="auth-reg-password" autocomplete="new-password" required>
              </div>
              <div class="field">
                <label for="auth-reg-password2">Passwort bestätigen</label>
                <input type="password" id="auth-reg-password2" autocomplete="new-password" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Code anfordern</button>
              <div id="auth-register-message" class="form-message hidden"></div>
            </form>
            <p class="hint" style="margin-top:14px; text-align:center;">
              Schon registriert? <a href="#" id="auth-show-login">Zum Login</a>
            </p>
          </div>

          <div id="auth-view-verify" class="hidden">
            <h2>E-Mail-Adresse bestätigen</h2>
            <p class="hint" id="auth-verify-info"></p>
            <p class="hint">Keine E-Mail angekommen? Schau bitte auch im Spam-Ordner nach.</p>
            <div id="auth-verify-demo" class="form-message hidden"></div>
            <form id="auth-verify-form">
              <div class="field">
                <label for="auth-verify-code">Bestätigungscode</label>
                <input type="text" id="auth-verify-code" inputmode="numeric" maxlength="6" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Bestätigen &amp; registrieren</button>
              <div id="auth-verify-message" class="form-message hidden"></div>
            </form>
            <button type="button" class="btn btn-outline btn-small" id="auth-resend-code" style="margin-top:10px;">Code erneut senden</button>
            <p style="text-align:center; margin-top:14px;">
              <a href="#" id="auth-verify-cancel" class="hint" style="text-decoration:underline;">Abbrechen</a>
            </p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap.firstElementChild);
  }

  function showView(name) {
    currentView = name;
    ["login", "register", "verify"].forEach((v) => {
      document.getElementById("auth-view-" + v).classList.toggle("hidden", v !== name);
    });
    ["auth-login-message", "auth-register-message", "auth-verify-message"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
    // Während der Code-Eingabe gibt es nur den "Abbrechen"-Link unten als
    // Ausstieg, damit niemand versehentlich per X oben abbricht.
    const closeBtn = document.getElementById("auth-modal-close");
    if (closeBtn) closeBtn.classList.toggle("hidden", name === "verify");
  }

  function openModal(view) {
    injectModal();
    wireModal();
    showView(view || "login");
    document.getElementById("auth-modal").classList.remove("hidden");
  }

  // Während der Code-Eingabe darf sich das Fenster nicht versehentlich
  // schließen lassen (Klick daneben / X oben) - nur über den kleinen
  // "Abbrechen"-Link unten im Verify-Schritt.
  function closeModal() {
    if (currentView === "verify") return;
    forceCloseModal();
  }
  function forceCloseModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.add("hidden");
    pendingReg = null;
    onSuccessCallback = null;
    currentView = null;
  }

  function requireLogin(onSuccess) {
    if (isLoggedIn()) {
      onSuccess();
      return;
    }
    onSuccessCallback = onSuccess;
    openModal("login");
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.className = "form-message error";
    el.classList.remove("hidden");
  }

  let wired = false;
  function wireModal() {
    if (wired) return;
    wired = true;

    document.getElementById("auth-modal-close").addEventListener("click", closeModal);
    document.getElementById("auth-modal").addEventListener("click", (e) => {
      if (e.target.id === "auth-modal") closeModal();
    });

    document.getElementById("auth-show-register").addEventListener("click", (e) => {
      e.preventDefault();
      showView("register");
    });
    document.getElementById("auth-show-login").addEventListener("click", (e) => {
      e.preventDefault();
      showView("login");
    });

    document.getElementById("auth-login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("auth-login-username").value.trim();
      const password = document.getElementById("auth-login-password").value;
      const user = SF.findUserByUsername(username);
      const hashed = await SF.hashText(password);
      if (!user || hashed !== user.passwordHash) {
        showError("auth-login-message", "Benutzername oder Passwort ist falsch.");
        return;
      }
      setSession(user);
      updateHeaderStatus();
      const cb = onSuccessCallback;
      onSuccessCallback = null;
      forceCloseModal();
      if (cb) cb();
    });

    document.getElementById("auth-register-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("auth-reg-username").value.trim();
      const email = document.getElementById("auth-reg-email").value.trim();
      const pw = document.getElementById("auth-reg-password").value;
      const pw2 = document.getElementById("auth-reg-password2").value;

      if (username.length < 2) {
        showError("auth-register-message", "Bitte einen Benutzernamen eingeben.");
        return;
      }
      if (!email || email.indexOf("@") === -1) {
        showError("auth-register-message", "Bitte eine gültige E-Mail-Adresse eingeben.");
        return;
      }
      if (pw.length < 4) {
        showError("auth-register-message", "Das Passwort muss mindestens 4 Zeichen haben.");
        return;
      }
      if (pw !== pw2) {
        showError("auth-register-message", "Die Passwörter stimmen nicht überein.");
        return;
      }
      if (SF.findUserByUsername(username)) {
        showError("auth-register-message", "Dieser Benutzername ist schon vergeben.");
        return;
      }
      if (SF.findUserByEmail(email)) {
        showError("auth-register-message", "Diese E-Mail-Adresse ist schon registriert.");
        return;
      }

      const passwordHash = await SF.hashText(pw);
      const code = genCode();
      pendingReg = { username, email, passwordHash, code };

      document.getElementById("auth-verify-info").textContent =
        "Wir haben einen Bestätigungscode an " + email + " geschickt.";
      document.getElementById("auth-verify-code").value = "";
      await deliverCode(email, code);
      showView("verify");
    });

    document.getElementById("auth-verify-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!pendingReg) {
        showView("register");
        return;
      }
      const entered = document.getElementById("auth-verify-code").value.trim();
      if (entered !== pendingReg.code) {
        showError("auth-verify-message", "Der Code ist leider falsch. Bitte nochmal versuchen.");
        return;
      }
      const user = SF.addUser({
        username: pendingReg.username,
        email: pendingReg.email,
        passwordHash: pendingReg.passwordHash,
      });
      pendingReg = null;
      setSession(user);
      updateHeaderStatus();
      const cb = onSuccessCallback;
      onSuccessCallback = null;
      forceCloseModal();
      if (cb) cb();
    });

    document.getElementById("auth-resend-code").addEventListener("click", async () => {
      if (!pendingReg) return;
      pendingReg.code = genCode();
      await deliverCode(pendingReg.email, pendingReg.code);
      const msg = document.getElementById("auth-verify-message");
      msg.textContent = "Neuer Code wurde verschickt.";
      msg.className = "form-message success";
      msg.classList.remove("hidden");
    });

    document.getElementById("auth-verify-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      forceCloseModal();
    });
  }

  // Versucht den Code per E-Mail (EmailJS) zu verschicken; zeigt ihn
  // zusätzlich/stattdessen als Demo-Hinweis an, wenn EmailJS nicht
  // eingerichtet ist oder der Versand fehlschlägt (z. B. kein Internet
  // zum E-Mail-Anbieter) - so bleibt die Registrierung immer nutzbar.
  async function deliverCode(email, code) {
    try {
      await sendCodeByEmail(email, code);
      hideDemoCode();
    } catch (e) {
      renderDemoCode(code);
    }
  }

  function renderDemoCode(code) {
    const el = document.getElementById("auth-verify-demo");
    el.className = "form-message";
    el.classList.remove("hidden");
    el.style.background = "#fff3d6";
    el.style.color = "#8a6100";
    el.innerHTML =
      "Demo-Modus: Der echte E-Mail-Versand ist noch nicht eingerichtet (siehe js/email-config.js). Euer Code lautet <strong>" +
      SF.escapeHtml(code) +
      "</strong>.";
  }
  function hideDemoCode() {
    document.getElementById("auth-verify-demo").classList.add("hidden");
  }

  function logout() {
    clearSession();
    updateHeaderStatus();
  }

  function updateHeaderStatus() {
    const el = document.getElementById("auth-status");
    if (!el) return;
    const user = getCurrentUser();
    if (user) {
      el.innerHTML =
        '<span class="auth-link">Hallo, ' +
        SF.escapeHtml(user.username) +
        '</span><a href="meine-bestellungen.html" class="auth-link">Meine Bestellungen</a>' +
        '<a href="#" class="auth-link auth-logout" id="auth-logout-link">Abmelden</a>';
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

  document.addEventListener("DOMContentLoaded", () => {
    injectModal();
    updateHeaderStatus();
    ensureEmailJs();
  });

  return {
    isLoggedIn,
    getCurrentUser,
    requireLogin,
    openModal,
    logout,
  };
})();
