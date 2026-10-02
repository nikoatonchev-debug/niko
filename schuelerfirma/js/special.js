(function () {
  function setup() {
    const form = document.getElementById("special-form");
    const msg = document.getElementById("special-message");

    function renderMenge() {
      document.getElementById("sp-menge-wrap").innerHTML = SF.qtyStepperHtml("sp-menge", 500, false);
      SF.wireQtyStepper("sp-menge");
    }
    renderMenge();

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = SF.clampText(document.getElementById("sp-name").value, 60);
      const phone = SF.clampText(document.getElementById("sp-phone").value, 25);
      const klasse = SF.clampText(document.getElementById("sp-klasse").value, 20);
      const groesse = SF.clampText(document.getElementById("sp-groesse").value, 30);
      const menge = Math.min(500, Math.max(1, parseInt(document.getElementById("sp-menge").value, 10) || 1));
      const wunsch = SF.clampText(document.getElementById("sp-wunsch").value, 1000);

      let error = null;
      if (name.length < 2) error = "Bitte gib deinen Namen an.";
      else if (!/^[0-9 +()/-]{6,25}$/.test(phone))
        error = "Bitte gib eine gültige Telefonnummer an, damit wir dich erreichen können.";
      else if (!groesse) error = "Bitte gib die gewünschte Größe an.";
      else if (wunsch.length < 5) error = "Bitte beschreibe deinen Wunsch kurz.";
      if (error) {
        SFUI.showMessage(msg, error, "error");
        return;
      }

      SFAuth.requireLogin(async () => {
        const btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        btn.textContent = "Wird gesendet …";
        try {
          await SFDB.addSpecialOrder({ name, phone, klasse, groesse, menge, wunsch });
          form.reset();
          renderMenge();
          SFUI.showMessage(
            msg,
            "Danke! Deine Spezialbestellung ist bei uns eingegangen. Wir melden uns telefonisch bei dir, sobald wir sie angenommen haben. Du findest sie auch unter „Meine Bestellungen“.",
            "success"
          );
          msg.setAttribute("tabindex", "-1");
          msg.focus();
        } catch (err) {
          SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
        } finally {
          btn.disabled = false;
          btn.textContent = "Spezialbestellung senden";
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
