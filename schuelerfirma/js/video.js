/* Video-Modal für die Abholungs-Anleitung. Wird über Buttons mit
 * [data-video-trigger] geöffnet und zeigt das Video in einem
 * kompakten, zentrierten Fenster statt auf der ganzen Seite. */

(function () {
  function injectModal() {
    if (document.getElementById("video-modal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="modal-backdrop hidden" id="video-modal">
        <div class="modal modal-video" role="dialog" aria-modal="true" aria-labelledby="video-modal-title" aria-describedby="video-modal-caption">
          <button type="button" class="modal-close" id="video-modal-close" aria-label="Video schließen">&times;</button>
          <h2 class="modal-video-title h3" id="video-modal-title">So läuft die Abholung ab</h2>
          <video id="pickup-video" class="modal-video-el" controls playsinline preload="metadata">
            <source src="video/abholung.mp4" type="video/mp4">
            <source src="video/abholung.webm" type="video/webm">
            Dein Browser kann dieses Video leider nicht abspielen.
          </video>
          <p class="modal-video-caption" id="video-modal-caption">Bitte an dieser Tür klopfen.</p>
        </div>
      </div>
    `;
    document.body.appendChild(wrap.firstElementChild);
  }

  function setup() {
    injectModal();

    document.querySelectorAll(".icon-camera").forEach((el) => {
      el.innerHTML = SFIcons.camera;
    });

    const modal = document.getElementById("video-modal");
    const video = document.getElementById("pickup-video");
    const closeBtn = document.getElementById("video-modal-close");

    function openVideo() {
      SFUI.openDialog(modal, { onEscape: closeVideo, initialFocus: "#pickup-video" });
    }
    function closeVideo() {
      video.pause();
      video.currentTime = 0;
      SFUI.closeDialog(modal);
    }

    document.querySelectorAll("[data-video-trigger]").forEach((btn) => {
      btn.setAttribute("aria-haspopup", "dialog");
      btn.addEventListener("click", openVideo);
    });

    closeBtn.addEventListener("click", closeVideo);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeVideo();
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
