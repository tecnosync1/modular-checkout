import {
  END_TIME_CHECKOUT,
  END_TIME_MESSAGE,
  NAME_PAYMENT_FIELDS_COOKIE,
  SITE_PATH_HOME,
  getFieldsFromCookie,
  idleRedirect,
  redirectTo,
  sleep,
} from "./util.js";

document.addEventListener("DOMContentLoaded", function (ev) {
  // data-id="price-description"
  const priceElement = document.querySelector('[data-id="price-description"]');
  const parsedState = getFieldsFromCookie(NAME_PAYMENT_FIELDS_COOKIE);
  if (!Object.keys(parsedState).length) return;

  priceElement.textContent = "$".concat(parsedState.total, "USD");

  const elModal = document.querySelector('.modal[data-modal="true"]');
  if (elModal) {
    idleRedirect({
      timer: END_TIME_CHECKOUT,
      callback: () => {
        elModal.setAttribute("data-open", true);
        sleep(END_TIME_MESSAGE).then(() => {
          elModal.setAttribute("data-open", false);
          redirectTo({ pathname: SITE_PATH_HOME, replace: true });
        });
      },
      onVisible: () => {
        elModal.setAttribute("data-open", true);
      },
      onHidden: () => {
        sleep(END_TIME_MESSAGE).then(() => {
          elModal.setAttribute("data-open", false);
          redirectTo({ pathname: SITE_PATH_HOME, replace: true });
        });
      },
    });
  }
});
