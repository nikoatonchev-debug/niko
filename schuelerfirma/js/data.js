/* Schülerfirma Siebdruck – gemeinsame Hilfsfunktionen (ohne Datenspeicher).
 *
 * Alle Daten (Produkte, Bestellungen, Bewertungen, Konten) liegen in der
 * Firebase-Datenbank und werden über js/db.js (SFDB) gelesen/geschrieben.
 */

const SF = (() => {
  // Reste der früheren Browser-Speicherung (Version ohne Datenbank) aufräumen.
  try {
    [
      "sf_products", "sf_orders", "sf_special_orders", "sf_reviews",
      "sf_admin_password", "sf_users", "sf_customer_session",
      "sf_rl_login", "sf_rl_admin-login", "sf_rl_cd_review", "sf_rl_cd_mail",
    ].forEach((k) => localStorage.removeItem(k));
    ["sf_admin_session", "sf_admin_authed"].forEach((k) => sessionStorage.removeItem(k));
  } catch (e) {
    /* Browser-Speicher gesperrt: für diese Aufräumarbeit unwichtig */
  }

  function escapeHtml(str) {
    return String(str === undefined || str === null ? "" : str).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );
  }

  function formatPrice(n) {
    return Number(n).toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €";
  }

  function formatDate(iso, dateOnly) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return escapeHtml(iso);
      const datePart = d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (dateOnly) return datePart;
      return datePart + " " + d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return escapeHtml(iso);
    }
  }

  function safeColor(c, fallback) {
    return /^#[0-9a-f]{6}$/i.test(String(c)) ? c : fallback || "#2c6e6b";
  }

  function clampText(value, maxLen) {
    return String(value === undefined || value === null ? "" : value).trim().slice(0, maxLen);
  }

  // Wiederverwendbares +/- Mengenfeld (Shop, Produkt-Detailansicht,
  // Spezialbestellungen) – ein Widget statt unterschiedlicher Eingabefelder.
  function qtyStepperHtml(id, max, disabled) {
    const maxAttr = max !== null && max !== undefined ? `max="${Number(max)}"` : "";
    return `
      <div class="qty-stepper">
        <button type="button" class="qty-btn" data-qty-dec="${id}" aria-label="Menge verringern" ${disabled ? "disabled" : ""}>&minus;</button>
        <input type="number" id="${id}" min="1" ${maxAttr} value="1" readonly aria-live="polite" ${disabled ? "disabled" : ""}>
        <button type="button" class="qty-btn" data-qty-inc="${id}" aria-label="Menge erhöhen" ${disabled ? "disabled" : ""}>+</button>
      </div>
    `;
  }

  function wireQtyStepper(id) {
    const input = document.getElementById(id);
    const dec = document.querySelector(`[data-qty-dec="${id}"]`);
    const inc = document.querySelector(`[data-qty-inc="${id}"]`);
    if (!input || !dec || !inc) return;

    function update() {
      const min = parseInt(input.min, 10) || 1;
      const max = input.max !== "" ? parseInt(input.max, 10) : null;
      let val = parseInt(input.value, 10) || min;
      if (val < min) val = min;
      if (max !== null && val > max) val = max;
      input.value = val;
      dec.disabled = input.disabled || val <= min;
      inc.disabled = input.disabled || (max !== null && val >= max);
    }
    dec.addEventListener("click", () => {
      input.value = (parseInt(input.value, 10) || 1) - 1;
      update();
    });
    inc.addEventListener("click", () => {
      input.value = (parseInt(input.value, 10) || 1) + 1;
      update();
    });
    update();
  }

  // Abhol-Status einer Bestellung (Shop und Spezial). Gespeichert wird
  // "offen"/"akzeptiert"/"abholbereit"/"abgeholt"/"abgelehnt"; für die
  // Kundschaft zählt nur: noch nicht abholbereit, abholbereit oder abgeholt.
  // Abgelehnte Spezialbestellungen haben keinen Abhol-Status (null).
  function pickupStatus(status) {
    if (status === "abgelehnt") return null;
    if (status === "abholbereit") return { label: "Abholbereit", badge: "badge-ready" };
    if (status === "abgeholt") return { label: "Abgeholt", badge: "badge-done" };
    return { label: "Nicht abholbereit", badge: "badge-open" };
  }
  function pickupBadgeHtml(status) {
    const p = pickupStatus(status);
    return p ? `<span class="badge ${p.badge}">${p.label}</span>` : "";
  }

  // Entscheidung bei Spezialbestellungen (angenommen ja/nein).
  function specialDecision(status) {
    if (status === "offen") return { label: "In Prüfung", badge: "badge-open" };
    if (status === "abgelehnt") return { label: "Abgelehnt", badge: "badge-declined" };
    return { label: "Angenommen", badge: "badge-accepted" };
  }
  function specialDecisionBadgeHtml(status) {
    const d = specialDecision(status);
    return `<span class="badge ${d.badge}">${d.label}</span>`;
  }

  // Wie viele Stück eines Produkts noch verfügbar sind, oder null wenn die
  // Menge nicht begrenzt ist. "sold" wird beim Bestellen in der Datenbank
  // hochgezählt.
  function getProductRemaining(product) {
    if (product.stock === null || product.stock === undefined || product.stock === "") return null;
    return Math.max(0, Number(product.stock) - (Number(product.sold) || 0));
  }

  // Verkleinert ein Bild (z. B. Produktfoto) und gibt es als komprimierte
  // JPEG-data:-URL zurück. Beim Neuzeichnen gehen versteckte Daten (z. B.
  // GPS-Standort aus Handyfotos) verloren. Die Qualität wird so lange
  // gesenkt, bis das Bild unter maxBytes liegt (Firestore erlaubt höchstens
  // 1 MB pro Dokument).
  function resizeImageFile(file, maxDim, maxBytes) {
    maxDim = maxDim || 800;
    maxBytes = maxBytes || 150 * 1024;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Bild konnte nicht gelesen werden"));
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          let out = "";
          for (const q of [0.78, 0.66, 0.54, 0.42, 0.3]) {
            out = canvas.toDataURL("image/jpeg", q);
            if (dataUrlBytes(out) <= maxBytes) break;
          }
          resolve(out);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function dataUrlBytes(dataUrl) {
    return Math.round((String(dataUrl).length * 3) / 4);
  }

  // Einfache Abkühlzeit zwischen zwei Aktionen (z. B. Bestätigungs-E-Mails).
  // Nur eine Komfortfunktion im Browser – der eigentliche Schutz vor
  // Missbrauch läuft bei Firebase.
  function cooldownSecondsLeft(name, seconds) {
    try {
      const last = parseInt(localStorage.getItem("sf_cd_" + name) || "0", 10);
      return Math.max(0, Math.ceil((last + seconds * 1000 - Date.now()) / 1000));
    } catch (e) {
      return 0;
    }
  }
  function startCooldown(name) {
    try {
      localStorage.setItem("sf_cd_" + name, String(Date.now()));
    } catch (e) {
      /* egal */
    }
  }

  return {
    escapeHtml,
    formatPrice,
    formatDate,
    safeColor,
    clampText,
    qtyStepperHtml,
    wireQtyStepper,
    pickupStatus,
    pickupBadgeHtml,
    specialDecision,
    specialDecisionBadgeHtml,
    getProductRemaining,
    resizeImageFile,
    dataUrlBytes,
    cooldownSecondsLeft,
    startCooldown,
  };
})();
