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

  const EDIT_MS = 5 * 60 * 1000; // Bewertung kann 5 Minuten lang bearbeitet werden

  async function setup() {
    const form = document.getElementById("review-form");
    const msg = document.getElementById("review-message");
    const loginHint = document.getElementById("review-login-hint");
    const done = document.getElementById("review-done");
    const doneText = document.getElementById("review-done-text");
    const editBtn = document.getElementById("review-edit-btn");
    const cancelBtn = document.getElementById("review-cancel-edit");
    const submitBtn = form.querySelector("button[type=submit]");
    const thanks = document.getElementById("review-thanks");
    let myReview = null;
    let editing = false;
    let lockTimer = null;

    // Bis wann darf die eigene Bewertung noch bearbeitet werden? (null = gar nicht mehr)
    function editUntil() {
      if (!myReview || !myReview.date) return null;
      const until = new Date(myReview.date).getTime() + EDIT_MS;
      return SF.now().getTime() < until ? until : null;
    }

    function showState() {
      const user = SFDB.currentUser();
      const signedIn = !!(user && user.emailVerified);
      loginHint.classList.toggle("hidden", signedIn);
      clearTimeout(lockTimer);
      if (!signedIn) {
        form.classList.add("hidden");
        done.classList.add("hidden");
        return;
      }
      const until = editUntil();
      if (!myReview) editing = false;
      if (myReview && !until) editing = false;
      form.classList.toggle("hidden", !!myReview && !editing);
      done.classList.toggle("hidden", !myReview || editing);
      cancelBtn.classList.toggle("hidden", !editing);
      submitBtn.textContent = editing ? "Änderung speichern" : "Feedback senden";
      editBtn.classList.toggle("hidden", !until);
      if (myReview) {
        doneText.textContent = until
          ? `Du kannst sie noch bis ${new Date(until).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })} Uhr bearbeiten.`
          : "Pro Konto gibt es eine Bewertung. Vielen Dank für dein Feedback!";
      }
      // Wenn die 5 Minuten ablaufen, während die Seite offen ist: Knopf ausblenden
      if (until) lockTimer = setTimeout(showState, until - SF.now().getTime() + 500);
    }

    async function refresh() {
      const list = await renderReviews();
      const user = SFDB.currentUser();
      myReview = user && user.emailVerified ? list.find((r) => r.userId === user.uid || r.id === user.uid) || null : null;
      showState();
    }

    function fillForm(r) {
      document.getElementById("rv-name").value = r.name === "Anonym" ? "" : r.name || "";
      document.getElementById("rv-comment").value = r.comment || "";
      const radio = form.querySelector(`input[name="rv-rating"][value="${Number(r.rating) || 3}"]`);
      if (radio) radio.checked = true;
    }

    document.getElementById("review-login-btn").addEventListener("click", () => SFAuth.requireLogin(refresh));

    editBtn.addEventListener("click", () => {
      if (!editUntil()) return showState();
      editing = true;
      fillForm(myReview);
      SFUI.hideMessage(msg);
      showState();
      document.getElementById("rv-comment").focus();
    });
    cancelBtn.addEventListener("click", () => {
      editing = false;
      form.reset();
      SFUI.hideMessage(msg);
      showState();
      editBtn.focus();
    });
    document.getElementById("review-thanks-ok").addEventListener("click", () => {
      SFUI.closeDialog(thanks);
      (editBtn.classList.contains("hidden") ? done : editBtn).focus();
    });

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
      if (myReview && !editing) return showState(); // schon bewertet
      submitBtn.disabled = true;
      const wasEditing = editing;
      try {
        if (wasEditing) await SFDB.updateMyReview({ name: name || "Anonym", rating, comment });
        else await SFDB.saveMyReview({ name: name || "Anonym", rating, comment });
        editing = false;
        form.reset();
        SFUI.hideMessage(msg);
        await refresh();
        document.getElementById("review-thanks-title").textContent = wasEditing ? "Deine Änderung ist gespeichert!" : "Danke für deine Bewertung!";
        document.getElementById("review-thanks-hint").classList.toggle("hidden", wasEditing);
        SFUI.openDialog(thanks, { initialFocus: "#review-thanks-ok", onEscape: () => SFUI.closeDialog(thanks) });
      } catch (err) {
        SFUI.showMessage(msg, SFDB.errorMessage(err), "error");
        if (err && err.code === "sf/review-locked") {
          editing = false;
          form.reset();
          await refresh();
          doneText.textContent = "Die 5 Minuten zum Bearbeiten sind leider vorbei. Deine Bewertung bleibt so, wie sie ist.";
        }
      } finally {
        submitBtn.disabled = false;
      }
    });

    document.getElementById("review-list").innerHTML = `<p class="hint">Bewertungen werden geladen …</p>`;
    await SFDB.ready;
    await refresh();
    SF.timeReady.then(showState);
    SFDB.onAuthChange(() => {
      editing = false;
      form.reset();
      refresh();
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
