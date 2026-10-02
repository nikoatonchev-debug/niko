/* Kundenkonten: Registrierung mit E-Mail-Bestätigungscode, Login, Session.
 *
 * Der Code wird über EmailJS verschickt (Zugangsdaten in js/email-config.js,
 * Skript lokal unter js/vendor/). Klappt der Versand nicht, wird die
 * Registrierung abgebrochen – der Code wird nie auf dem Bildschirm gezeigt.
 */

const SFAuth = (function () {
  const SESSION_KEY = "sf_customer_session";
  const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
  const CODE_TTL_MS = 15 * 60 * 1000;
  const CODE_MAX_ATTEMPTS = 5;
  const MAIL_COOLDOWN_S = 30;
  const LOGIN_MAX_ATTEMPTS = 5;
  const LOGIN_LOCK_S = 30;
  const PASSWORD_MIN = 8;
  const EMAILJS_SRC = "js/vendor/emailjs-browser-4.4.1.min.js";

  let pendingReg = null; // { username, email, passwordHash, code, expiresAt, attempts }
  let onSuccessCallback = null;
  let emailjsLoadPromise = null;
  let currentView = null;
  let resendTimer = null;

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s.loggedInAt || Date.now() - s.loggedInAt > SESSION_MAX_AGE_MS) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return s;
    } catch (e) {
      return null;
    }
  }
  function setSession(user) {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ id: user.id, username: user.username, email: user.email, loggedInAt: Date.now() })
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
    return String((crypto.getRandomValues(new Uint32Array(1))[0] % 900000) + 100000);
  }

  // Lädt das EmailJS-Skript und gibt true/false zurück (nie einen Fehler),
  // mit Zeitlimit, damit die Registrierung nie hängen bleibt.
  function ensureEmailJs() {
    if (!window.sfEmailIsConfigured || !sfEmailIsConfigured()) return Promise.resolve(false);
    if (emailjsLoadPromise) return emailjsLoadPromise;

    emailjsLoadPromise = new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 6000);
      const script = document.createElement("script");
      script.src = EMAILJS_SRC;
      script.onload = () => {
        clearTimeout(timeout);
        window.emailjs.init({
          publicKey: SF_EMAIL_CONFIG.PUBLIC_KEY,
          blockHeadless: true,
          limitRate: { id: "sf-code-mail", throttle: MAIL_COOLDOWN_S * 1000 },
        });
        resolve(true);
      };
      script.onerror = () => {
        clearTimeout(timeout);
        emailjsLoadPromise = null;
        resolve(false);
      };
      document.head.appendChild(script);
    });
    return emailjsLoadPromise;
  }

  async function sendCodeByEmail(email, code) {
    const ready = await ensureEmailJs();
    if (!ready) throw new Error("EmailJS nicht verfügbar");
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
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="auth-title-login">
          <button type="button" class="modal-close" id="auth-modal-close" aria-label="Schließen">&times;</button>

          <div id="auth-view-login">
            <h2 id="auth-title-login">Anmelden</h2>
            <p class="hint">Zum Bestellen musst du angemeldet sein.</p>
            <form id="auth-login-form" novalidate>
              <div class="field">
                <label for="auth-login-username">Benutzername</label>
                <input type="text" id="auth-login-username" autocomplete="username" maxlength="30" required>
              </div>
              <div class="field">
                <label for="auth-login-password">Passwort</label>
                <input type="password" id="auth-login-password" autocomplete="current-password" maxlength="128" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Anmelden</button>
              <div id="auth-login-message" class="form-message hidden"></div>
            </form>
            <p class="hint text-center mt-14">
              Noch kein Konto? <a href="#" id="auth-show-register">Jetzt registrieren</a>
            </p>
          </div>

          <div id="auth-view-register" class="hidden">
            <h2 id="auth-title-register">Registrieren</h2>
            <form id="auth-register-form" novalidate>
              <div class="field">
                <label for="auth-reg-username">Benutzername <span class="hint">(2–30 Zeichen)</span></label>
                <input type="text" id="auth-reg-username" autocomplete="username" minlength="2" maxlength="30" required>
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
                Wir speichern Benutzername, E-Mail-Adresse und dein Passwort (nur verschlüsselt),
                um dein Konto anzulegen. An deine E-Mail-Adresse schicken wir einen Bestätigungscode.
                Mehr dazu in der <a href="datenschutz.html">Datenschutzerklärung</a>.
              </p>
              <button type="submit" class="btn btn-primary btn-block" id="auth-register-submit">Code anfordern</button>
              <div id="auth-register-message" class="form-message hidden"></div>
            </form>
            <p class="hint text-center mt-14">
              Schon registriert? <a href="#" id="auth-show-login">Zum Login</a>
            </p>
          </div>

          <div id="auth-view-verify" class="hidden">
            <h2 id="auth-title-verify">E-Mail-Adresse bestätigen</h2>
            <p class="hint" id="auth-verify-info"></p>
            <p class="hint">Keine E-Mail angekommen? Schau bitte auch im Spam-Ordner nach. Der Code ist 15 Minuten gültig.</p>
            <form id="auth-verify-form" novalidate>
              <div class="field">
                <label for="auth-verify-code">Bestätigungscode</label>
                <input type="text" id="auth-verify-code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Bestätigen &amp; registrieren</button>
              <div id="auth-verify-message" class="form-message hidden"></div>
            </form>
            <button type="button" class="btn btn-outline btn-small mt-10" id="auth-resend-code">Code erneut senden</button>
            <p class="text-center mt-14">
              <a href="#" id="auth-verify-cancel" class="hint underline">Abbrechen</a>
            </p>
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
    ["login", "register", "verify"].forEach((v) => {
      document.getElementById("auth-view-" + v).classList.toggle("hidden", v !== name);
    });
    ["auth-login-message", "auth-register-message", "auth-verify-message"].forEach((id) =>
      SFUI.hideMessage(msgEl(id))
    );
    document.querySelector("#auth-modal .modal").setAttribute("aria-labelledby", "auth-title-" + name);
    // Während der Code-Eingabe gibt es nur den "Abbrechen"-Link unten als
    // Ausstieg, damit niemand versehentlich per X oben abbricht.
    document.getElementById("auth-modal-close").classList.toggle("hidden", name === "verify");
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

  // Während der Code-Eingabe darf sich das Fenster nicht versehentlich
  // schließen lassen (Klick daneben / X / Escape) - nur über "Abbrechen".
  function closeModal() {
    if (currentView === "verify") return;
    forceCloseModal();
  }
  function forceCloseModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) SFUI.closeDialog(modal);
    pendingReg = null;
    onSuccessCallback = null;
    currentView = null;
    stopResendTimer();
  }

  function requireLogin(onSuccess) {
    if (isLoggedIn()) {
      onSuccess();
      return;
    }
    onSuccessCallback = onSuccess;
    openModal("login");
  }

  function finishLogin(user) {
    setSession(user);
    updateHeaderStatus();
    const cb = onSuccessCallback;
    onSuccessCallback = null;
    forceCloseModal();
    if (cb) cb();
  }

  function lockMessage(seconds) {
    return seconds >= 60
      ? `Zu viele Fehlversuche. Bitte warte ${Math.ceil(seconds / 60)} Minute(n) und versuche es dann erneut.`
      : `Zu viele Fehlversuche. Bitte warte ${seconds} Sekunden und versuche es dann erneut.`;
  }

  function startResendTimer() {
    stopResendTimer();
    const btn = document.getElementById("auth-resend-code");
    function tick() {
      const left = SF.cooldownSecondsLeft("mail", MAIL_COOLDOWN_S);
      if (left > 0) {
        btn.disabled = true;
        btn.textContent = `Code erneut senden (${left} s)`;
      } else {
        btn.disabled = false;
        btn.textContent = "Code erneut senden";
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

  async function deliverCode(email, code) {
    try {
      await sendCodeByEmail(email, code);
      SF.startCooldown("mail");
      return true;
    } catch (e) {
      console.warn("SFAuth: E-Mail-Versand fehlgeschlagen", e);
      return false;
    }
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
      const msg = msgEl("auth-login-message");
      const locked = SF.lockSecondsLeft("login");
      if (locked > 0) {
        SFUI.showMessage(msg, lockMessage(locked), "error");
        return;
      }
      const username = SF.clampText(document.getElementById("auth-login-username").value, 30);
      const password = document.getElementById("auth-login-password").value;
      const user = SF.findUserByUsername(username);
      const result = user ? await SF.verifyPassword(password, user.passwordHash) : { ok: false };
      if (!result.ok) {
        const lockedNow = SF.registerFailure("login", LOGIN_MAX_ATTEMPTS, LOGIN_LOCK_S);
        SFUI.showMessage(
          msg,
          lockedNow > 0 ? lockMessage(lockedNow) : "Benutzername oder Passwort ist falsch.",
          "error"
        );
        return;
      }
      SF.clearFailures("login");
      if (result.needsUpgrade) {
        SF.updateUser(user.id, { passwordHash: await SF.hashPassword(password) });
      }
      document.getElementById("auth-login-form").reset();
      finishLogin(user);
    });

    document.getElementById("auth-register-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = msgEl("auth-register-message");
      const submitBtn = document.getElementById("auth-register-submit");
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
      else if (SF.findUserByUsername(username)) error = "Dieser Benutzername ist schon vergeben.";
      else if (SF.findUserByEmail(email)) error = "Diese E-Mail-Adresse ist schon registriert.";
      if (error) {
        SFUI.showMessage(msg, error, "error");
        return;
      }
      const wait = SF.cooldownSecondsLeft("mail", MAIL_COOLDOWN_S);
      if (wait > 0) {
        SFUI.showMessage(msg, `Bitte warte noch ${wait} Sekunden, bevor ein neuer Code verschickt wird.`, "error");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Code wird gesendet …";
      try {
        const passwordHash = await SF.hashPassword(pw);
        const code = genCode();
        const sent = await deliverCode(email, code);
        if (!sent) {
          SFUI.showMessage(
            msg,
            "Die E-Mail mit dem Code konnte gerade nicht verschickt werden. Bitte prüfe deine Internetverbindung und versuche es in ein paar Minuten erneut.",
            "error"
          );
          return;
        }
        pendingReg = { username, email, passwordHash, code, expiresAt: Date.now() + CODE_TTL_MS, attempts: 0 };
        document.getElementById("auth-verify-info").textContent =
          "Wir haben einen Bestätigungscode an " + email + " geschickt.";
        document.getElementById("auth-verify-code").value = "";
        document.getElementById("auth-register-form").reset();
        showView("verify");
        startResendTimer();
      } catch (err) {
        SFUI.showMessage(msg, err.message || "Registrierung fehlgeschlagen.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Code anfordern";
      }
    });

    document.getElementById("auth-verify-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = msgEl("auth-verify-message");
      if (!pendingReg) {
        showView("register");
        return;
      }
      if (Date.now() > pendingReg.expiresAt) {
        SFUI.showMessage(msg, "Der Code ist abgelaufen. Bitte fordere einen neuen Code an.", "error");
        return;
      }
      if (pendingReg.attempts >= CODE_MAX_ATTEMPTS) {
        SFUI.showMessage(msg, "Zu viele falsche Eingaben. Bitte fordere einen neuen Code an.", "error");
        return;
      }
      const entered = document.getElementById("auth-verify-code").value.trim();
      if (entered !== pendingReg.code) {
        pendingReg.attempts += 1;
        const left = CODE_MAX_ATTEMPTS - pendingReg.attempts;
        SFUI.showMessage(
          msg,
          left > 0
            ? `Der Code ist leider falsch. Noch ${left} Versuch(e).`
            : "Zu viele falsche Eingaben. Bitte fordere einen neuen Code an.",
          "error"
        );
        return;
      }
      const user = SF.addUser({
        username: pendingReg.username,
        email: pendingReg.email,
        passwordHash: pendingReg.passwordHash,
      });
      pendingReg = null;
      finishLogin(user);
    });

    document.getElementById("auth-resend-code").addEventListener("click", async () => {
      if (!pendingReg) return;
      const msg = msgEl("auth-verify-message");
      if (SF.cooldownSecondsLeft("mail", MAIL_COOLDOWN_S) > 0) return;
      const code = genCode();
      const sent = await deliverCode(pendingReg.email, code);
      if (!sent) {
        SFUI.showMessage(msg, "Der Code konnte gerade nicht verschickt werden. Bitte versuche es gleich noch einmal.", "error");
        return;
      }
      pendingReg.code = code;
      pendingReg.expiresAt = Date.now() + CODE_TTL_MS;
      pendingReg.attempts = 0;
      SFUI.showMessage(msg, "Neuer Code wurde verschickt.", "success");
      startResendTimer();
    });

    document.getElementById("auth-verify-cancel").addEventListener("click", (e) => {
      e.preventDefault();
      forceCloseModal();
    });
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
  });

  return {
    isLoggedIn,
    getCurrentUser,
    requireLogin,
    openModal,
    logout,
  };
})();
