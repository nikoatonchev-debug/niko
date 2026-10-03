(function () {
  const esc = (s) => SF.escapeHtml(s);

  function starString(n) {
    n = Math.max(0, Math.min(5, Number(n) || 0));
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  async function renderReviews() {
    const el = document.getElementById("review-list");
    let list;
    try {
      list = await SFDB.getReviews();
    } catch (e) {
      el.innerHTML = `<p class="form-message error" role="alert">${esc(SFDB.errorMessage(e))}</p>`;
      return [];
    }
    if (list.length === 0) {
      el.innerHTML = `<p>Noch keine Bewertungen &ndash; sei die/der Erste!</p>`;
      return list;
    }
    el.innerHTML = list
      .map((r) => {
        const rating = Math.max(0, Math.min(5, Number(r.rating) || 0));
        return `
      <article class="review-card">
        <div class="review-head">
          <h3 class="review-name">${esc(r.name || "Anonym")}</h3>
          <span class="review-date">${SF.formatDate(r.date, true)}</span>
        </div>
        ${
          rating
            ? `<div class="stars-display" role="img" aria-label="${rating} von 5 Sternen">${starString(rating)}</div>`
            : ""
        }
        <p>${esc(r.comment)}</p>
      </article>`;
      })
      .join("");
    return list;
  }

  async function setup() {
    const form = document.getElementById("review-form");
    const msg = document.getElementById("review-message");
    const loginHint = document.getElementById("review-login-hint");
    const deleteBtn = document.getElementById("review-delete-btn");
    const submitBtn = form.querySelector("button[type=submit]");
    let myReview = null;

    async function refresh() {
      const list = await renderReviews();
      const user = SFDB.currentUser();
      const signedIn = !!(user && user.emailVerified);
      form.classList.toggle("hidden", !signedIn);
      loginHint.classList.toggle("hidden", signedIn);
      myReview = signedIn ? list.find((r) => r.userId === user.uid || r.id === user.uid) || null : null;
      deleteBtn.classList.toggle("hidden", !myReview);
      submitBtn.textContent = myReview ? "Bewertung ändern" : "Feedback senden";
      if (myReview && !form.dataset.prefilled) {
        document.getElementById("rv-name").value = myReview.name === "Anonym" ? "" : myReview.name || "";
        document.getElementById("rv-comment").value = myReview.comment || "";
        const radio = form.querySelector(`input[name="rv-rating"][value="${Number(myReview.rating) || 3}"]`);
        if (radio) radio.checked = true;
        form.dataset.prefilled = "1";
      }
    }

    document.getElementById("review-login-btn").addEventListener("click", () => SFAuth.requireLogin(refresh));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = SF.clampText(document.getElementById("rv-name").value, 40);
      const comment = SF.clampText(document.getElementById("rv-comment").value, 1000);
      const ratingInput = form.querySelector('input[name="rv-rating"]:checked');
      const rating = ratingInput ? parseInt(ratingInput.value, 10) : 0;

      if (comment.length < 3) {
        SFUI.showMessage(msg, "Bitte schreib ein paar Worte zu deinem Feedback.", "error");
        return;
      }
      submitBtn.disabled = true;
      try {
        await SFDB.saveMyReview({ name: name || "Anonym", rating, comment });
        SFUI.showMessage(msg, myReview ? "Deine Bewertung wurde geändert. Danke!" : "Danke für dein Feedback!", "success");
        await refresh();
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      } finally {
        submitBtn.disabled = false;
      }
    });

    deleteBtn.addEventListener("click", async () => {
      const user = SFDB.currentUser();
      if (!user || !confirm("Deine Bewertung wirklich löschen?")) return;
      try {
        await SFDB.deleteReview(user.uid);
        form.reset();
        delete form.dataset.prefilled;
        SFUI.showMessage(msg, "Deine Bewertung wurde gelöscht.", "success");
        await refresh();
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
      }
    });

    document.getElementById("review-list").innerHTML = `<p class="hint">Bewertungen werden geladen …</p>`;
    await SFDB.ready;
    await refresh();
    SFDB.onAuthChange(() => {
      delete form.dataset.prefilled;
      refresh();
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
