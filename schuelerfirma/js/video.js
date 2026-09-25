/* Video-Modal für die Abholungs-Anleitung. Wird über Buttons mit
 * [data-video-trigger] geöffnet und zeigt das Video in einem
 * kompakten, zentrierten Fenster statt auf der ganzen Seite. */

(function () {
  function injectModal() {
    if (document.getElementById("video-modal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="modal-backdrop hidden" id="video-modal">
        <div class="modal modal-video">
          <button type="button" class="modal-close" id="video-modal-close">&times;</button>
          <h3 style="margin-bottom:12px;">So läuft die Abholung ab</h3>
          <video id="pickup-video" controls playsinline preload="metadata" style="width:100%; border-radius:10px; background:#000;">
            <source src="video/abholung.mp4" type="video/mp4">
            <source src="video/abholung.webm" type="video/webm">
            Dein Browser kann dieses Video leider nicht abspielen.
          </video>
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
      modal.classList.remove("hidden");
    }
    function closeVideo() {
      modal.classList.add("hidden");
      video.pause();
      video.currentTime = 0;
    }

    document.querySelectorAll("[data-video-trigger]").forEach((btn) => {
      btn.addEventListener("click", openVideo);
    });

    closeBtn.addEventListener("click", closeVideo);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeVideo();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) closeVideo();
    });
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
