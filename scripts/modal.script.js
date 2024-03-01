import { redirectTo } from "./util.js";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelectorAll('button[data-btn="true"]');

  const elModal = document.querySelector(".modal");
  elModal.addEventListener("click", (ev) => {
    elModal.setAttribute("data-open", false);
    document.body.style.overflow = "auto";
    redirectTo({ pathname: "/", replace: true });
  });

  button?.forEach(function (trigger) {
    trigger.addEventListener("click", (ev) => {
      ev.preventDefault();

      const modal = document.querySelector('.modal[data-modal="true"]');
      modal.setAttribute("data-open", true);
      document.body.style.overflow = "hidden";
      const exits = document.querySelectorAll(".modal-exit");
      exits.forEach(function (exit) {
        exit.addEventListener("click", (ev) => {
          modal.setAttribute("data-open", false);
          document.body.style.overflow = "auto";
          redirectTo({ pathname: "/", replace: true });
        });
      });
    });
  });
});
