(function () {
  const REVIEW_COOLDOWN_S = 60;

  function starString(n) {
    n = Math.max(0, Math.min(5, Number(n) || 0));
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  function renderReviews() {
    const list = SF.getReviews();
    const el = document.getElementById("review-list");
    if (list.length === 0) {
      el.innerHTML = `<p>Noch keine Bewertungen &ndash; sei die/der Erste!</p>`;
      return;
    }
    el.innerHTML = list
      .map((r) => {
        const rating = Math.max(0, Math.min(5, Number(r.rating) || 0));
        return `
      <article class="review-card">
        <div class="review-head">
          <h3 class="review-name">${SF.escapeHtml(r.name || "Anonym")}</h3>
          <span class="review-date">${SF.formatDate(r.date, true)}</span>
        </div>
        ${
          rating
            ? `<div class="stars-display" role="img" aria-label="${rating} von 5 Sternen">${starString(rating)}</div>`
            : ""
        }
        <p>${SF.escapeHtml(r.comment)}</p>
      </article>`;
      })
      .join("");
  }

  function setup() {
    renderReviews();
    const form = document.getElementById("review-form");
    const msg = document.getElementById("review-message");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = SF.clampText(document.getElementById("rv-name").value, 40);
      const comment = SF.clampText(document.getElementById("rv-comment").value, 1000);
      const ratingInput = form.querySelector('input[name="rv-rating"]:checked');
      const rating = ratingInput ? parseInt(ratingInput.value, 10) : 0;

      if (comment.length < 3) {
        SFUI.showMessage(msg, "Bitte schreib ein paar Worte zu deinem Feedback.", "error");
        return;
      }
      const wait = SF.cooldownSecondsLeft("review", REVIEW_COOLDOWN_S);
      if (wait > 0) {
        SFUI.showMessage(msg, `Danke! Bitte warte noch ${wait} Sekunden, bevor du die nächste Bewertung abgibst.`, "error");
        return;
      }

      const saved = SF.addReview({
        name: name || "Anonym",
        rating,
        comment,
      });
      if (!saved) {
        SFUI.showMessage(msg, "Dein Feedback konnte nicht gespeichert werden (Browser-Speicher voll oder gesperrt).", "error");
        return;
      }
      SF.startCooldown("review");

      form.reset();
      SFUI.showMessage(msg, "Danke für dein Feedback!", "success");
      renderReviews();
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
