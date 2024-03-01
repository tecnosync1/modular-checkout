import { createReservation } from "../service/api.service.js";
import {
  NAME_PAYMENT_FIELDS_COOKIE,
  PAYMENT_METHODS,
  SITE_PATH_HOME,
  STRIPE_PUBLIC_KEY,
  getFieldsFromCookie,
  modal,
  redirectTo,
} from "./util.js";

// Fetches the payment intent status after payment submission
export async function checkStripeFlowStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
  if (!clientSecret) return;

  const stripe = window.Stripe(STRIPE_PUBLIC_KEY);
  if (!stripe) return;

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  const fieldState = getFieldsFromCookie(NAME_PAYMENT_FIELDS_COOKIE);
  switch (paymentIntent.status.trim()) {
    case "succeeded":
      await createReservation({
        ...fieldState,
        payment_method: PAYMENT_METHODS.Stripe,
        transaction_id: paymentIntent.id,
        total: paymentIntent.amount,
      });
      Cookies?.remove(NAME_PAYMENT_FIELDS_COOKIE);
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
      return;
    case "processing":
      modal({
        title: "Processing payment!",
        message: "Your payment is processing.",
        variant: "warning",
        done: function () {
          redirectTo({ reload: true });
        },
        close: function () {
          redirectTo({ pathname: SITE_PATH_HOME, replace: true });
        },
      });
      return;
    case "requires_payment_method":
      Cookies?.remove(NAME_PAYMENT_FIELDS_COOKIE);
      modal({
        title: "Requires payment method!",
        message: "Your payment was not successful, please try again.",
        variant: "warning",
        close: function () {
          redirectTo({ pathname: SITE_PATH_HOME, replace: true });
        },
      });
      return;
    default:
      Cookies?.remove(NAME_PAYMENT_FIELDS_COOKIE);
      modal({
        title: "Oops! Something went wrong",
        message: "Try again later.",
        variant: "error",
        close: function () {
          redirectTo({ pathname: SITE_PATH_HOME, replace: true });
        },
      });
      return;
  }
}
