import { INITIAL_AIRLINES_DATA } from "../data/airline.js";

export const NAME_PAYMENT_FIELDS_COOKIE = "NAME_PAYMENT_FIELDS_COOKIE";
export const NAME_FORM_SEARCH_COOKIE = "NAME_FORM_SEARCH_COOKIE";

// Server API
// prod
export const API_URL = "https://eureka-airport-transfers-server.onrender.com";
// dev
// export const API_URL = "http://localhost:8080";
export const GLOBAL_PREFIX = "/api/v1";

// Payment and redirects production
// --- production
// export const SITE_URL = "https://eurekaairporttransfers.com/";
// export const SITE_PATH_HOME = "/";
// export const SITE_PATH_BOOKING = "/Booking.html";
// export const SITE_PATH_THANK_YOU = "/Thanks-you.html";
// --- testing ---
export const SITE_URL = "http://127.0.0.1:5500";
export const SITE_PATH_HOME = "/";
export const SITE_PATH_BOOKING = "/Booking.html";
export const SITE_PATH_THANK_YOU = "/Thanks-you.html";

// Airport available
export const AIRPORT_PUNTA_CANA = "Punta Cana International Airport";
export const AIRPORT_SANTO_DOMINGO = "Santo Domingo Intl. Airport";
export const AIRPORT_LA_ROMANA = "La Romana Intl. Airport";
export const MAXIMUM_NUMBER_OF_PAX = 54;

// Paypal
// prod
// export const PAYPAL_CLIENT_ID = "";
// dev
export const PAYPAL_CLIENT_ID = "AYfIGJsPj98xoO1tlVTGe_QEzIcr7JjRoqRBfSHDeh_k-mPZo3puG2t6KW5RLVe3Oji1jGXSpN5smwOC";
export const PAYPAL_SDK_URL = "https://www.paypal.com/sdk/js";
export const PAYPAL_CURRENCY = "USD";
export const PAYPAL_INTENT = "capture";

// Re-Captcha v3
// prod
// export const RECAPTCHA_SITE_KEY = "";
// dev
export const RECAPTCHA_SITE_KEY = "6LfudxMpAAAAAPO69qoWbC5Wg1iODmA_QjIJcleP";
export const RE_CAPTCHA_SDK_URL = "https://www.google.com/recaptcha/api.js?render=";

// Stripe
// prod
// export const STRIPE_PUBLIC_KEY = "";
// testing
export const STRIPE_PUBLIC_KEY =
  "pk_test_51O1TE9Ih5G94EILDNfSszy3jAZ7ECbFOo8nXt3fcGfaAvQEkxgBnYDGzzYioKTVJ6CQyls538z0zuXQdVqxSPvWO00didDRdgD";

export const DOM_EVENTS = ["change", "input", "blur"];

// Summary service
export const SUMMARY_LUX =
  "This is a reliable non stop private luxury airport transfer. Book now for punctual and comfortable rides to and from airports and Enjoy the comfort of a chauffeured ride, where every detail's crafted for your ease.";
export const SUMMARY_BUS =
  "Explore and enjoy your journey together with our Premium Group Transfer. This is an exclusive, nonstop, door-to-door service tailored just for you.";
export const SUMMARY_GENERIC =
  "This is a reliable non stop private airport transfer service for a seamless travel expricine. Book now for puntual and comforable rides to and from the airports.";

// Image reference
// 1-6 VIP
export const imageOneToSix = "https://luxshuttles.com/assets-v2/images/Van-transfer.webp";
// 1-6 Luxury
export const imageOneToSixLux = "https://luxshuttles.com/assets-v2/images/Sub-Lux.webp";
// 7-10
export const imageSevenToTen = "https://luxshuttles.com/assets-v2/images/Image%20Toyota%20Hiace%20-%20color.webp";
// 11-16
export const imageElevenToSixteen = "https://luxshuttles.com/assets-v2/images/Image%20Hyundai%20H350%20-%20color.webp";
// 17-22
export const imageSeventeenToTwentyTwo =
  "https://luxshuttles.com/assets-v2/images/Image%20Toyota%20Coaster%20-%20Color.webp";
// 23-54
export const imageTwentyTwoToMore = "https://luxshuttles.com/assets-v2/images/Bus-group.webp";

// --- Travel Page ------
export const INITIAL_AGENCY_FORM_STATE = {
  agencyName: "",
  managerFullName: "",
  email: "",
  phone: "",
  url: "",
  code: "",
  role: "commission",
};
export const INITIAL_AGENT_FORM_STATE = {
  fullName: "",
  email: "",
  phone: "",
  role: "agent",
};
// ----

const INITIAL_MODAL_PARAMS = {
  title: "Good job!",
  message: "You clicked the button!",
  variant: "success",
  done: () => {},
  close: () => {},
};

// types
export const TYPE_TRANSFERS = {
  One: "one-way",
  RoundTrip: "round-trip",
};
export const PAYMENT_METHODS = {
  Stripe: "stripe",
  PayPal: "paypal",
  Cash: "cash",
};

export const INITIAL_PAYMENT_STATE = {
  transaction_id: "",
  from: "",
  to: "",
  payment_method: "",
  type_service: "",
  type_transfer: "one_way",
  arrival_date: "",
  arrival_time: "",
  return_date: "",
  return_time: "",
  airport: "",
  flight_number: "",
  airport_return: "",
  flight_number_return: "",
  amount_pax: 0,
  approx_luggage: 0,
  remark: "",
  email: "",
  full_name: "",
  agent_code: "",
  phone: "",
  total: 0,
};

const bookingValidator = [
  { id: "arrival_date", mode: "one_way", message: "Arrival date is required" },
  { id: "arrival_time", mode: "one_way", message: "Arrival time is required" },
  { id: "return_date", mode: "round_trip", message: "Return date is required" },
  { id: "return_time", mode: "round_trip", message: "Return time is required" },
  { id: "airport", mode: "one_way", message: "Airline is required" },
  { id: "flight_number", mode: "one_way", message: "Flight number is required" },
  { id: "airport_return", mode: "round_trip", message: "Airline return is required" },
  { id: "flight_number_return", mode: "round_trip", message: "Flight number return is required" },
  { id: "email", mode: "one_way", message: "Email is required" },
  { id: "full_name", mode: "one_way", message: "Full-name is required" },
  { id: "phone", mode: "one_way", message: "Phone is required" },
];

export function validatorBookingFields(params = {}, mode = "") {
  const fields = Object.keys(params);
  if (!fields.length) return;

  const items = bookingValidator.filter((el) => !params[el.id].length);

  if (mode === "one_way") {
    const messages = items.filter((el) => el.mode === "one_way");
    messages.forEach((el) => {
      insertMessage({ type: el.id.replaceAll("_", "-"), message: el.message });
    });
    return !messages.length;
  }
  if (mode === "round_trip") {
    items.forEach((el) => {
      insertMessage({ type: el.id.replaceAll("_", "-"), message: el.message });
    });
    return !items.length;
  }

  return true;
}

// ------ Booking page ------
export const INITIAL_FORM_VALUES = {
  origin: "",
  originId: "",
  destination: "",
  destinationId: "",
  amountOfPax: 0,
  travelAgent: "",
  typeTransfer: TYPE_TRANSFERS.One,
  nameImage: "image car suburban for Lux-Shuttles",
  items: [],
  terms: false,
};

export function modal(params = INITIAL_MODAL_PARAMS) {
  // success | error | warning | info | question
  Swal.fire({
    title: params.title,
    text: params.message,
    icon: params.variant,
    confirmButtonText: "Done",
    denyButtonText: "Ok",
    showCloseButton: true,
    showConfirmButton: params.variant === "success",
    showDenyButton: params.variant !== "success",
    confirmButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      params.done && params.done();
    } else if (result.isDenied || result.isDismissed) {
      params.close && params.close();
    }
  });
}

// Show a spinner on payment submission
export function setLoadingSpinner(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#btn-payment-submit").disabled = true;
    document.querySelector("#custom-spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#btn-payment-submit").disabled = false;
    document.querySelector("#custom-spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

export function redirectTo(options = {}) {
  const { pathname = "", replace = false, reload = false } = options;
  if (!window) return;
  const currentURL = window.location.origin;
  if (!currentURL) return;
  if (replace) {
    return window.location.replace(currentURL.concat(pathname));
  }
  if (reload) {
    return window.location.reload();
  }
  window.location.href = currentURL.concat(pathname);
  return;
}

// cookie config
export const COOKIE_CONFIG = {
  path: "/",
  secure: true,
  sameSite: "lax",
  // HttpOnly: true,
};

// From https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem.
export function bytesToBase64Encode(bytes) {
  const validUTF16String = new TextEncoder().encode(bytes);
  const binString = String.fromCodePoint(...validUTF16String);
  return btoa(binString);
}

// From https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem.
export function base64ToBytesDecode(base64) {
  const binString = atob(base64);
  const encode = Uint8Array.from(binString, (m) => m.codePointAt(0));
  return new TextDecoder().decode(encode);
}

export function getFieldsFromCookie(cookieName = "") {
  const encode = Cookies.get(cookieName);
  const decode = base64ToBytesDecode(encode);
  return JSON.parse(decode) || {};
}

export function setFieldsToCookie(cookieName = "", payload = {}) {
  const encode = bytesToBase64Encode(JSON.stringify(payload));
  return Cookies.set(cookieName, encode, COOKIE_CONFIG) || "";
}

export function validateEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

export function escapeHTML(str = "") {
  return str.replace(/[&<>"'\/]/g, function (char) {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "/":
        return "&#39;";
      case "/":
        return "&#x2F;";
      default:
        return String(char);
    }
  });
}

// initial choices option
export const CHOICES_OPTION = {
  items: [],
  choices: [],
  allowHTML: false,
  searchFields: ["label"],
  shouldSort: false,
  placeholder: true,
  noResultsText: "No results found",
  noChoicesText: "Information not available",
  itemSelectText: "", // 'Press to select'
  searchPlaceholderValue: "Search",
  classNames: {
    containerOuter: "choices",
    containerInner: "choices-autocomplete__input", // choices__inner
    input: "choices__input",
    inputCloned: "choices__input--cloned", // choices__input--cloned
    list: "choices__list",
    // listItems: 'choices__list--multiple',
    // listSingle: 'choices__list--single',
    listDropdown: "choices-autocomplete__results", // choices__list--dropdown
    // item: 'choices__item',
    // itemSelectable: 'choices__item--selectable',
    itemDisabled: "choices__item--disabled", // itemDisabled
    itemChoice: "choices-autocomplete-item", // choices__item--choice
    // placeholder: 'choices__placeholder',
    // group: 'choices__group',
    // groupHeading: 'choices__heading',
    // button: 'choices__button',
    activeState: "is-active",
    focusState: "is-focused",
    // openState: 'is-open',
    disabledState: "is-disabled",
    highlightedState: "is-highlighted",
    selectedState: "is-selected",
    // flippedState: 'is-flipped',
    // loadingState: 'is-loading',
    // noResults: 'has-no-results',
    // noChoices: 'has-no-choices',
  },
};

export const AIRLINE_STATE = INITIAL_AIRLINES_DATA.map((el) => ({
  label: el.value.concat(el.code?.length ? ` (${el.code})` : ""),
  value: el.value.toLowerCase().replace(" ", "-"),
}));

export const INTL_TEL_INPUT_CONFIG = {
  initialCountry: "US",
  separateDialCode: true,
  formatOnDisplay: true,
  nationalMode: false,
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.0.3/js/utils.js",
  preferredCountries: [],
  excludeCountries: [],
};

export function insertMessage(data) {
  const { type = "", message = "", isShow = true, delay = 0, alert = "error" } = data;

  let boxMessage;

  if (alert === "error") {
    boxMessage = document.querySelector(`.error-message[data-type="${type}"]`);
  }
  if (alert === "success") {
    boxMessage = document.querySelector(`.success-message[data-type="${type}"]`);
  }

  if (!boxMessage) return;
  if (isShow) {
    boxMessage.style.display = "block";
    boxMessage.textContent = message;
  }
  if (!isShow) {
    boxMessage.textContent = "";
    boxMessage.style.display = "none";
  }

  if (delay > 0) {
    setTimeout(() => {
      boxMessage.textContent = "";
      boxMessage.style.display = "none";
    }, delay);
  }
}

// suspense
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// timer
export const END_TIME_BOOKING = 600000; // 10min
export const END_TIME_CHECKOUT = 180000; // 3min
export const END_TIME_MESSAGE = 10000; // 10s

// timer
export function idleRedirect({ timer, callback, onVisible, onHidden }) {
  let time;
  let timeVisible = false;
  let timeHidden;
  let isVisible = true;

  // window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onmousedown = resetTimer; // catches touchscreen presses as well
  window.ontouchstart = resetTimer; // catches touchscreen swipes as well
  window.ontouchmove = resetTimer; // required by some devices
  window.onclick = resetTimer; // catches touchpad clicks as well
  window.onkeydown = resetTimer;
  window.addEventListener("scroll", resetTimer, true); // improved; see comments
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      isVisible = false;
      clearTimeout(timeHidden);
      timeHidden = setTimeout(() => {
        onVisible?.();
        timeVisible = true;
      }, timer); // time is in milliseconds
    } else {
      clearTimeout(timeHidden);
      clearTimeout(time);
      if (timeVisible) {
        onHidden?.();
      }
    }
  });

  function resetTimer() {
    if (!isVisible) return;
    clearTimeout(time);
    time = setTimeout(callback, timer); // time is in milliseconds
  }
}

export const REGEX_URL = new RegExp(
  "^(https?:\\/\\/)" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$", // fragment locator
  "i"
);

// validate URL
export function isValidURL(url = "") {
  return REGEX_URL.test(String(url));
}

export function script_to_head(attributes_object) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    for (const name of Object.keys(attributes_object)) {
      script.setAttribute(name, attributes_object[name]);
    }
    document.head.appendChild(script);
    script.addEventListener("load", resolve);
    script.addEventListener("error", reject);
  });
}
