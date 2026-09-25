(function () {
  function setup() {
    const form = document.getElementById("special-form");
    const msg = document.getElementById("special-message");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("sp-name").value.trim();
      const phone = document.getElementById("sp-phone").value.trim();
      const klasse = document.getElementById("sp-klasse").value.trim();
      const groesse = document.getElementById("sp-groesse").value.trim();
      const menge = parseInt(document.getElementById("sp-menge").value, 10) || 1;
      const wunsch = document.getElementById("sp-wunsch").value.trim();

      if (!phone) {
        msg.textContent = "Bitte gib eine Telefonnummer an, damit wir dich erreichen können.";
        msg.className = "form-message error";
        msg.classList.remove("hidden");
        return;
      }

      SFAuth.requireLogin(() => {
        const user = SFAuth.getCurrentUser();

        SF.addSpecialOrder({
          name,
          phone,
          klasse,
          groesse,
          menge,
          wunsch,
          username: user ? user.username : null,
        });

        form.reset();
        msg.textContent =
          "Danke! Deine Spezialbestellung ist bei uns eingegangen. Wir melden uns telefonisch bei dir, sobald wir sie angenommen haben.";
        msg.className = "form-message success";
        msg.classList.remove("hidden");
      });
    });

    document.getElementById("sp-phone").addEventListener("focus", () => {
      const user = SFAuth.getCurrentUser();
      const field = document.getElementById("sp-phone");
      if (user && !field.value) field.value = user.phone;
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
