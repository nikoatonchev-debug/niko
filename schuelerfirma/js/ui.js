/* Gemeinsame UI-Helfer: barrierefreie Dialoge (Fokus, Escape, Tab bleibt
 * im Fenster), Meldungen für Screenreader und Icons per data-icon. */

const SFUI = (function () {
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';
  const stack = [];

  function visibleFocusables(root) {
    return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement
    );
  }

  // opts.onEscape: Funktion, die beim Drücken von Escape aufgerufen wird
  // (z. B. die Schließen-Funktion des Moduls). Ohne onEscape bleibt das
  // Fenster bei Escape offen.
  function openDialog(backdrop, opts) {
    opts = opts || {};
    const existing = stack.find((e) => e.backdrop === backdrop);
    if (existing) {
      existing.opts = opts;
    } else {
      stack.push({ backdrop, opener: document.activeElement, opts });
    }
    backdrop.classList.remove("hidden");
    document.body.classList.add("modal-open");
    const dialog = backdrop.querySelector(".modal") || backdrop;
    const target =
      (opts.initialFocus && backdrop.querySelector(opts.initialFocus)) ||
      visibleFocusables(dialog).find((el) => !el.classList.contains("modal-close")) ||
      dialog;
    if (target === dialog && !dialog.hasAttribute("tabindex")) dialog.setAttribute("tabindex", "-1");
    target.focus();
  }

  function closeDialog(backdrop) {
    backdrop.classList.add("hidden");
    const idx = stack.findIndex((e) => e.backdrop === backdrop);
    if (idx === -1) return;
    const entry = stack.splice(idx, 1)[0];
    if (stack.length === 0) document.body.classList.remove("modal-open");
    if (entry.opener && document.contains(entry.opener) && typeof entry.opener.focus === "function") {
      entry.opener.focus();
    }
  }

  document.addEventListener("keydown", (e) => {
    const top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === "Escape") {
      if (top.opts.onEscape) {
        e.preventDefault();
        top.opts.onEscape();
      }
      return;
    }
    if (e.key !== "Tab") return;
    const dialog = top.backdrop.querySelector(".modal") || top.backdrop;
    const items = visibleFocusables(dialog);
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      e.preventDefault();
      first.focus();
    }
  });

  // Zeigt eine Meldung so an, dass Screenreader sie auch vorlesen.
  function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = "form-message " + (type || "success");
    el.setAttribute("role", type === "error" ? "alert" : "status");
    el.classList.remove("hidden");
  }
  function hideMessage(el) {
    if (el) el.classList.add("hidden");
  }

  function fillIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach((el) => {
      const name = el.getAttribute("data-icon");
      const icon = SFIcons[name];
      if (typeof icon === "function") el.innerHTML = icon(el.getAttribute("data-icon-color"));
      else if (icon) el.innerHTML = icon;
    });
  }

  document.addEventListener("DOMContentLoaded", () => fillIcons());

  return { openDialog, closeDialog, showMessage, hideMessage, fillIcons };
})();
