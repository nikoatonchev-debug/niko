(function () {
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
      .map(
        (r) => `
      <div class="review-card">
        <div class="review-head">
          <span class="review-name">${SF.escapeHtml(r.name || "Anonym")}</span>
          <span class="review-date">${SF.formatDate(r.date, true)}</span>
        </div>
        ${r.rating ? `<div class="stars-display">${starString(r.rating)}</div>` : ""}
        <p>${SF.escapeHtml(r.comment)}</p>
      </div>`
      )
      .join("");
  }

  function setup() {
    renderReviews();
    const form = document.getElementById("review-form");
    const msg = document.getElementById("review-message");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("rv-name").value.trim();
      const comment = document.getElementById("rv-comment").value.trim();
      const ratingInput = form.querySelector('input[name="rv-rating"]:checked');
      const rating = ratingInput ? parseInt(ratingInput.value, 10) : 0;

      SF.addReview({
        name: name || "Anonym",
        rating,
        comment,
      });

      form.reset();
      msg.textContent = "Danke für dein Feedback!";
      msg.className = "form-message success";
      msg.classList.remove("hidden");
      renderReviews();
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
