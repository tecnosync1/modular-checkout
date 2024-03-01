import { createOrderPaypal, createReservation, get_client_token, onApprovePaypal } from "../service/api.service.js";
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_CURRENCY,
  PAYPAL_INTENT,
  PAYPAL_SDK_URL,
  modal,
  getFieldsFromCookie,
  NAME_PAYMENT_FIELDS_COOKIE,
  PAYMENT_METHODS,
  NAME_FORM_SEARCH_COOKIE,
  redirectTo,
  SITE_PATH_HOME,
  script_to_head,
} from "./util.js";

(function () {
  const searchToken = Cookies.get(NAME_PAYMENT_FIELDS_COOKIE);
  if (!searchToken) redirectTo(SITE_PATH_HOME, { replace: true });

  const parsedState = getFieldsFromCookie(NAME_PAYMENT_FIELDS_COOKIE);
  if (!Object.keys(parsedState).length) redirectTo(SITE_PATH_HOME, { replace: true });

  const paypalSpinner = document.getElementById("paypal-spinner");
  paypalSpinner.classList.remove("hidden");

  get_client_token()
    .then((clientToken) => {
      return script_to_head({
        src:
          PAYPAL_SDK_URL +
          "?client-id=" +
          PAYPAL_CLIENT_ID +
          "&components=buttons" +
          // '&enable-funding=paylater' +
          "&disable-funding=venmo,paylater,card" +
          "&intent=" +
          PAYPAL_INTENT +
          "&currency=" +
          PAYPAL_CURRENCY +
          "&locale=en_US",
        // '&buyer-country=en_US', // mode sandbox
        "data-client-token": clientToken,
        "data-sdk-integration-source": "integrationbuilder_ac",
      });
      //https://developer.paypal.com/sdk/js/configuration/#link-configureandcustomizeyourintegration
    })
    .then(() => {
      paypalSpinner.classList.add("hidden");

      const paypal_buttons = window.paypal?.Buttons({
        style: {
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "pay",
        },
        // onInit(data, actions) {
        //   if (!INITIAL_FORM_VALUES.terms) {
        //     actions.disable();
        //   } else {
        //     actions.enable();
        //   }
        //   // actions.disable();
        //   actionStatus = actions;
        // },
        // onClick() {
        //   const isValid = validatorBookingFields(INITIAL_PAYMENT_STATE, INITIAL_PAYMENT_STATE.type_transfer);
        //   console.log({ isValid });
        //   if (!isValid) {
        //     actionStatus.disable();
        //   } else {
        //     actionStatus.enable();
        //   }

        //   if (!INITIAL_FORM_VALUES.terms) {
        //     insertMessage({ type: "terms", message: "You must accept Terms and Conditions and Privacy" });
        //     actionStatus.disable();
        //   } else {
        //     actionStatus.enable();
        //   }

        //   termsElement.addEventListener(
        //     "change",
        //     ({ target }) => {
        //       if (!target.checked) {
        //         insertMessage({ type: "terms", message: "You must accept Terms and Conditions and Privacy" });
        //         return actionStatus.disable();
        //       } else {
        //         insertMessage({ type: "terms", isShow: false });
        //         actionStatus.enable();
        //       }
        //     },
        //     false
        //   );
        // },
        createOrder: async function (_, actions) {
          return await createOrderCallback(actions, {
            name: parsedState.type_service,
            total: parsedState.total,
          });
        },
        onApprove: async function (data, actions) {
          const order = await onApproveCallback(data, actions);
          await createReservation({
            ...parsedState,
            payment_method: PAYMENT_METHODS.PayPal,
            transaction_id: order.transactionId,
            total: order.total,
          });
          Cookies?.remove(NAME_PAYMENT_FIELDS_COOKIE);
          Cookies?.remove(NAME_FORM_SEARCH_COOKIE);
          modal({
            title: "Payment successfully!",
            message: "your reservation was successful.",
            variant: "success",
            done: function () {
              redirectTo({ pathname: SITE_PATH_HOME, replace: true });
            },
            close: function () {
              redirectTo({ pathname: SITE_PATH_HOME, replace: true });
            },
          });
        },
        onCancel: function (data) {
          modal({
            title: "Payment cancelled!",
            message: "Your payment was not successful.",
            variant: "warning",
          });
        },
        onError(err) {
          // For example, redirect to a specific error page
          modal({
            title: "Oops! Something went wrong",
            message: "Try again later.",
            variant: "error",
            close: function () {
              redirectTo({ pathname: SITE_PATH_HOME, replace: true });
            },
          });
          Cookies?.remove(NAME_PAYMENT_FIELDS_COOKIE);
          Cookies?.remove(NAME_FORM_SEARCH_COOKIE);
        },
      });

      paypal_buttons.render("#paypal-button-container");
    })
    .catch((err) => {
      console.error(err);
    });
})();

const CREATE_ORDER_CALLBACK_PARAMS = {
  name: "",
  total: 0,
};
export async function createOrderCallback(actions, params = CREATE_ORDER_CALLBACK_PARAMS) {
  try {
    const details = await createOrderPaypal({
      name: params.name,
      total: params.total,
    });

    const errorDetail = Array.isArray(details.details) && details.details[0];
    if (errorDetail && errorDetail.issue === "INSTRUMENT_DECLINED") {
      return actions.restart();
    }

    if (errorDetail || details.name === "INTERNAL_SERVER_ERROR") {
      modal({
        title: "Oops! Something went wrong",
        message: "Try again later.",
        variant: "error",
        close: function () {
          redirectTo({ pathname: SITE_PATH_HOME, replace: true });
        },
      });
    }
    return details.id;
  } catch (err) {
    modal({
      title: "Oops! Something went wrong",
      message: "Try again later.",
      variant: "error",
      close: function () {
        redirectTo({ pathname: SITE_PATH_HOME, replace: true });
      },
    });
  }
}

export async function onApproveCallback(data, actions) {
  try {
    const details = await onApprovePaypal(data.orderID);

    const errorDetail = Array.isArray(details.details) && details.details[0];
    if (errorDetail && errorDetail.issue === "INSTRUMENT_DECLINED") {
      return actions.restart();
    }
    if (errorDetail) {
      modal({
        title: "Oops! Something went wrong",
        message: "Try again later.",
        variant: "error",
        close: function () {
          redirectTo({ pathname: SITE_PATH_HOME, replace: true });
        },
      });
    }

    // total => transaction.amount
    // "amount": {
    //   "currency_code": "USD",
    //   "value": "100.00"
    //  },
    const transaction = details.purchase_units[0].payments.captures[0];
    return { transactionId: transaction.id, total: transaction.amount?.value };
  } catch (err) {
    modal({
      title: "Oops! Something went wrong",
      message: "Try again later.",
      variant: "error",
      close: function () {
        redirectTo({ pathname: SITE_PATH_HOME, replace: true });
      },
    });
  }
}
