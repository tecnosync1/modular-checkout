import {
  NAME_PAYMENT_FIELDS_COOKIE,
  PAYMENT_METHODS,
  SITE_PATH_HOME,
  getFieldsFromCookie,
  modal,
  redirectTo,
} from "./util.js";
import { createReservation } from "../service/api.service.js";

document.addEventListener("DOMContentLoaded", function () {
  const parsedState = getFieldsFromCookie(NAME_PAYMENT_FIELDS_COOKIE);
  if (!Object.keys(parsedState).length) redirectTo(SITE_PATH_HOME, { replace: true });

  const btnCash = document.getElementById("btn-cash");
  const msgElement = document.querySelector("#btn-cash span");
  const idleElement = document.querySelector('div[data-background="idle"]');

  btnCash.addEventListener("click", async function (ev) {
    ev.preventDefault();

    idleElement.setAttribute("data-background", "loading");
    btnCash.setAttribute("disabled", true);
    msgElement.style.textTransform = "capitalize";
    msgElement.textContent = "Loading...";

    try {
      const data = await createReservation({
        ...parsedState,
        payment_method: PAYMENT_METHODS.Cash,
        transaction_id: "",
      });
      if (data.success) {
        idleElement.setAttribute("data-background", "idle");
        btnCash.removeAttribute("disabled");
        msgElement.style.textTransform = "uppercase";
        msgElement.textContent = "Pay cash";
        modal({
          title: "Booking successfully!",
          message: "your reservation was successful.",
          variant: "success",
          done: function () {
            redirectTo({ pathname: SITE_PATH_HOME, replace: true });
          },
          close: function () {
            redirectTo({ pathname: SITE_PATH_HOME, replace: true });
          },
        });
      }
    } catch (err) {
      idleElement.setAttribute("data-background", "idle");
      btnCash.removeAttribute("disabled");
      msgElement.style.textTransform = "uppercase";
      msgElement.textContent = "Pay cash";
      modal({
        title: "Oops! Something went wrong",
        message: "Try again later.",
        variant: "error",
        close: function () {
          redirectTo({ pathname: SITE_PATH_HOME, replace: true });
        },
      });
    }
  });
});
