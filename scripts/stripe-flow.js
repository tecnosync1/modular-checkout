import { createCheckoutIntent } from "../service/api.service.js";
import {
  modal,
  redirectTo,
  NAME_PAYMENT_FIELDS_COOKIE,
  getFieldsFromCookie,
  STRIPE_PUBLIC_KEY,
  setLoadingSpinner,
  SITE_URL,
  NAME_FORM_SEARCH_COOKIE,
  SITE_PATH_HOME,
} from "./util.js";

// Fetches a payment intent and captures the client secret
(async function () {
  const parsedState = getFieldsFromCookie(NAME_FORM_SEARCH_COOKIE);
  if (!Object.keys(parsedState).length) return;
  const payload = await initializeStripeCheckout();

  const formElement = document.getElementById("stripe-form");
  formElement.addEventListener("submit", stripeSubmit);
  const idleElement = document.querySelector('div[data-background="idle"]');

  async function stripeSubmit(ev) {
    ev.preventDefault();

    setLoadingSpinner(true);
    idleElement.setAttribute("data-background", "loading");

    const { error } = await payload.stripe.confirmPayment({
      elements: payload.elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: SITE_URL,
        payment_method_data: {
          billing_details: {
            name: payload.state.full_name,
            email: payload.state.email,
          },
        },
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      Cookies?.remove(NAME_PAYMENT_FIELDS_COOKIE);
      Cookies?.remove(NAME_FORM_SEARCH_COOKIE);
      modal({
        title: "Oops! Something went wrong",
        message: error.message,
        variant: "error",
      });
    } else {
      Cookies?.remove(NAME_PAYMENT_FIELDS_COOKIE);
      Cookies?.remove(NAME_FORM_SEARCH_COOKIE);
      modal({
        title: "Oops! Something went wrong",
        message: "An unexpected error occurred.",
        variant: "error",
      });
    }
    setLoadingSpinner(false);
    idleElement.setAttribute("data-background", "idle");
  }
})();

async function initializeStripeCheckout() {
  const searchToken = Cookies.get(NAME_PAYMENT_FIELDS_COOKIE);
  if (!searchToken) redirectTo(SITE_PATH_HOME, { replace: true });

  const parsedState = getFieldsFromCookie(NAME_PAYMENT_FIELDS_COOKIE);
  if (!Object.keys(parsedState).length) redirectTo(SITE_PATH_HOME, { replace: true });

  let flowElements;

  const stripe = window.Stripe(STRIPE_PUBLIC_KEY);

  const formElement = document.querySelector("div[data-type='payment-form']");
  const sectionElement = document.getElementById("stripe-section");

  const loaderCard = document.getElementById("loader-card");
  loaderCard.classList.remove("hidden");

  try {
    const clientSecret = await createCheckoutIntent(parsedState.total);

    // flow
    const appearance = {
      theme: "flat",
    };
    flowElements = stripe.elements({ appearance, clientSecret });

    const paymentElementOptions = {
      layout: {
        type: "tabs", // accordion
        defaultCollapsed: false,
        // radios: true,
        // spacedAccordionItems: true,
      },
    };

    const paymentElement = flowElements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");

    loaderCard.classList.add("hidden");
    formElement.classList.remove("hidden");
    sectionElement.classList.remove("hidden");

    return { stripe, elements: flowElements, state: parsedState };
  } catch (err) {
    modal({
      title: "Oops! Something went wrong",
      message: "An unexpected error occurred.",
      variant: "error",
      close: function () {
        redirectTo({ pathname: SITE_PATH_HOME, replace: true });
      },
    });
  }
}
