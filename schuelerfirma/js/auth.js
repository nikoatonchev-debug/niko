/* Kundenkonten: Registrierung (mit Demo-SMS-Code), Login, Session.
 *
 * Wichtig: Diese Website hat (noch) keinen Server. Ein echter SMS-Versand
 * ist damit nicht möglich – der Bestätigungscode wird hier stattdessen
 * direkt und klar sichtbar als "Demo-Modus" angezeigt. Für echten
 * SMS-Versand braucht ihr später einen Server mit einem SMS-Anbieter.
 */

const SFAuth = (function () {
  const SESSION_KEY = "sf_customer_session";
  let pendingReg = null; // { username, phone, passwordHash, code }
  let onSuccessCallback = null;

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
        JSON.stringify({ id: user.id, username: user.username, phone: user.phone })
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
                <label for="auth-reg-phone">Telefonnummer</label>
                <input type="tel" id="auth-reg-phone" autocomplete="tel" required>
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
            <h2>Telefonnummer bestätigen</h2>
            <p class="hint" id="auth-verify-info"></p>
            <div id="auth-verify-demo" class="form-message"></div>
            <form id="auth-verify-form">
              <div class="field">
                <label for="auth-verify-code">Bestätigungscode</label>
                <input type="text" id="auth-verify-code" inputmode="numeric" maxlength="6" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%;">Bestätigen &amp; registrieren</button>
              <div id="auth-verify-message" class="form-message hidden"></div>
            </form>
            <button type="button" class="btn btn-outline btn-small" id="auth-resend-code" style="margin-top:10px;">Code erneut senden</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrap.firstElementChild);
  }

  function showView(name) {
    ["login", "register", "verify"].forEach((v) => {
      document.getElementById("auth-view-" + v).classList.toggle("hidden", v !== name);
    });
    ["auth-login-message", "auth-register-message", "auth-verify-message"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
  }

  function openModal(view) {
    injectModal();
    wireModal();
    showView(view || "login");
    document.getElementById("auth-modal").classList.remove("hidden");
  }
  function closeModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.add("hidden");
    onSuccessCallback = null;
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
      closeModal();
      if (cb) cb();
    });

    document.getElementById("auth-register-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("auth-reg-username").value.trim();
      const phone = document.getElementById("auth-reg-phone").value.trim();
      const pw = document.getElementById("auth-reg-password").value;
      const pw2 = document.getElementById("auth-reg-password2").value;

      if (username.length < 2) {
        showError("auth-register-message", "Bitte einen Benutzernamen eingeben.");
        return;
      }
      if (!phone) {
        showError("auth-register-message", "Bitte eine Telefonnummer eingeben.");
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
      if (SF.findUserByPhone(phone)) {
        showError("auth-register-message", "Diese Telefonnummer ist schon registriert.");
        return;
      }

      const passwordHash = await SF.hashText(pw);
      const code = genCode();
      pendingReg = { username, phone, passwordHash, code };

      document.getElementById("auth-verify-info").textContent =
        "Wir haben einen Bestätigungscode an " + phone + " geschickt.";
      renderDemoCode(code);
      document.getElementById("auth-verify-code").value = "";
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
        phone: pendingReg.phone,
        passwordHash: pendingReg.passwordHash,
      });
      pendingReg = null;
      setSession(user);
      updateHeaderStatus();
      const cb = onSuccessCallback;
      onSuccessCallback = null;
      closeModal();
      if (cb) cb();
    });

    document.getElementById("auth-resend-code").addEventListener("click", () => {
      if (!pendingReg) return;
      pendingReg.code = genCode();
      renderDemoCode(pendingReg.code);
      const msg = document.getElementById("auth-verify-message");
      msg.textContent = "Neuer Code wurde (im Demo-Modus) erzeugt.";
      msg.className = "form-message success";
      msg.classList.remove("hidden");
    });
  }

  function renderDemoCode(code) {
    const el = document.getElementById("auth-verify-demo");
    el.className = "form-message";
    el.style.background = "#fff3d6";
    el.style.color = "#8a6100";
    el.innerHTML =
      "Demo-Modus: Diese Website hat noch keinen echten SMS-Versand. Euer Code lautet <strong>" +
      SF.escapeHtml(code) +
      "</strong>. In einer echten Version würde er per SMS verschickt.";
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
        '</span><a href="#" class="auth-link auth-logout" id="auth-logout-link">Abmelden</a>';
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
  });

  return {
    isLoggedIn,
    getCurrentUser,
    requireLogin,
    openModal,
    logout,
  };
})();
