import {
  AIRLINE_STATE,
  CHOICES_OPTION,
  DOM_EVENTS,
  END_TIME_BOOKING,
  END_TIME_MESSAGE,
  INITIAL_FORM_VALUES,
  INITIAL_PAYMENT_STATE,
  INTL_TEL_INPUT_CONFIG,
  NAME_FORM_SEARCH_COOKIE,
  NAME_PAYMENT_FIELDS_COOKIE,
  SITE_PATH_HOME,
  SITE_PATH_THANK_YOU,
  TYPE_TRANSFERS,
  escapeHTML,
  getFieldsFromCookie,
  idleRedirect,
  insertMessage,
  redirectTo,
  setFieldsToCookie,
  sleep,
  validateEmail,
  validatorBookingFields,
} from "./util.js";

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.Cookies) redirectTo(SITE_PATH_HOME, { replace: true });
  const searchToken = Cookies.get(NAME_FORM_SEARCH_COOKIE);
  if (!searchToken) redirectTo(SITE_PATH_HOME, { replace: true });

  const parsedState = getFieldsFromCookie(NAME_FORM_SEARCH_COOKIE);
  if (!Object.keys(parsedState).length) redirectTo("/", { replace: true });

  Object.assign(INITIAL_PAYMENT_STATE, {
    type_transfer: parsedState?.typeTransfer.trim().replace("-", "_") || "",
    type_service: parsedState?.type.trim() || "",
    from: parsedState?.origin.trim() || "",
    to: parsedState?.destination.trim() || "",
    amount_pax: Number(parsedState?.amountOfPax.trim()) || 0,
    agent_code: parsedState.travelAgent?.trim() || "",
    total: Number(parsedState?.price.trim()) || 0,
  });

  // pop-up
  const elModal = document.querySelector('.modal[data-modal="true"]');
  if (elModal) {
    idleRedirect({
      timer: END_TIME_BOOKING,
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

  // Elements
  const elBookItemImage = document.getElementById("book-item-image");
  const elBookItemTransfer = document.getElementById("book-item-transfer");
  const elBookItemType = document.getElementById("book-item-type");
  const elBookItemPrice = document.getElementById("book-item-price");
  const priceElement = document.getElementById("price");
  const elBookOrigin = document.getElementById("book-origin");
  const elBookDestination = document.getElementById("book-destination");
  const elBookAmount = document.getElementById("book-amount");

  elBookItemImage.setAttribute("src", parsedState.image);
  elBookItemImage.setAttribute("alt", parsedState.type);
  elBookItemPrice.textContent = parsedState.price;
  priceElement.textContent = parsedState.price;
  elBookItemTransfer.textContent = parsedState.type;
  elBookItemType.textContent = parsedState.type;
  elBookOrigin.textContent = parsedState.origin;
  elBookDestination.textContent = parsedState.destination;
  elBookAmount.textContent = parsedState.amountOfPax;

  const airlineElement = document.getElementById("airport");
  const flightNumberElement = document.getElementById("flight-number");
  const arrivalDateElement = document.getElementById("arrival-date");
  const arrivalTimeElement = document.getElementById("arrival-time");

  // return
  const airlineReturnElement = document.getElementById("airport-return");
  const flightNumberReturnElement = document.getElementById("flight-number-return");
  const returnDateElement = document.getElementById("return-date");
  const returnTimeElement = document.getElementById("return-time");

  const luggageElement = document.getElementById("approx-luggage");
  const fullNameElement = document.getElementById("full-name");
  const emailElement = document.getElementById("email");
  const phoneElement = document.getElementById("phone");
  const remarksElement = document.getElementById("remark");
  const termsElement = document.getElementById("terms");

  const formElement = document.getElementById("booking-form");

  const isRoundTrip = parsedState.typeTransfer === TYPE_TRANSFERS.RoundTrip;

  if (isRoundTrip) {
    const elSubtitle = document.getElementById("subtitle-terms");
    elSubtitle.textContent = "Share your flights info";

    const boxTransfers = document.querySelectorAll('[data-book-type="round-trip"]');
    boxTransfers.forEach((transfer) => {
      transfer.style.display = "flex";
    });
  }

  // airline
  const choicesAirline = new Choices(airlineElement, CHOICES_OPTION);
  choicesAirline.setChoices([...AIRLINE_STATE], "value", "label", true);

  // airline return
  const choicesAirlineReturn = new Choices(airlineReturnElement, CHOICES_OPTION);
  choicesAirlineReturn.setChoices([...AIRLINE_STATE], "value", "label", true);

  // phone
  const phoneInstance = window?.intlTelInput(phoneElement, INTL_TEL_INPUT_CONFIG);

  // Events
  DOM_EVENTS.forEach((event) => {
    airlineElement.addEventListener(
      event,
      () => {
        const getAirline = choicesAirline.getValue();
        if (!getAirline.label?.length) {
          Object.assign(INITIAL_PAYMENT_STATE, { airport: "" });
          insertMessage({ type: "airport", message: "Airline is required" });
          return;
        }
        insertMessage({ type: "airport", isShow: false });
        Object.assign(INITIAL_PAYMENT_STATE, { airport: getAirline.label });
      },
      false
    );

    flightNumberElement.addEventListener(
      event,
      ({ target }) => {
        if (!String(target.value).length) {
          Object.assign(INITIAL_PAYMENT_STATE, { flight_number: "" });
          insertMessage({ type: "flight-number", message: "Flight number is required" });
          return;
        }
        insertMessage({ type: "flight-number", isShow: false });
        Object.assign(INITIAL_PAYMENT_STATE, { flight_number: String(target.value) });
      },
      false
    );

    arrivalDateElement.addEventListener(
      event,
      ({ target }) => {
        if (!String(target.value).length) {
          insertMessage({ type: "arrival-date", message: "Arrival date is required" });
          Object.assign(INITIAL_PAYMENT_STATE, { arrival_date: "" });
          return;
        }

        insertMessage({ type: "arrival-date", isShow: false });
        Object.assign(INITIAL_PAYMENT_STATE, { arrival_date: String(target.value) });
      },
      false
    );

    arrivalTimeElement.addEventListener(
      event,
      ({ target }) => {
        if (!String(target.value).length) {
          Object.assign(INITIAL_PAYMENT_STATE, { arrival_time: "" });
          insertMessage({ type: "arrival-time", message: "Arrival time is required" });
          return;
        }
        if (String(target.value) === "00:00") {
          Object.assign(INITIAL_PAYMENT_STATE, { arrival_time: "" });
          insertMessage({ type: "arrival-time", message: "Enter a valid time" });
          return;
        }
        insertMessage({ type: "arrival-time", isShow: false });
        Object.assign(INITIAL_PAYMENT_STATE, { arrival_time: String(target.value) });
      },
      false
    );

    // return
    airlineReturnElement.addEventListener(
      event,
      () => {
        const getAirlineReturn = choicesAirlineReturn.getValue();
        if (isRoundTrip && !getAirlineReturn.label?.length) {
          Object.assign(INITIAL_PAYMENT_STATE, { airport_return: "" });
          insertMessage({ type: "airport-return", message: "Airline return is required" });
          return;
        }
        insertMessage({ type: "airport-return", isShow: false });
        Object.assign(INITIAL_PAYMENT_STATE, { airport_return: getAirlineReturn.label });
      },
      false
    );

    flightNumberReturnElement.addEventListener(
      event,
      ({ target }) => {
        if (isRoundTrip && !String(target.value)?.length) {
          Object.assign(INITIAL_PAYMENT_STATE, { flight_number_return: "" });
          insertMessage({ type: "flight-number-return", message: "Flight number return is required" });
          return;
        }
        Object.assign(INITIAL_PAYMENT_STATE, { flight_number_return: String(target.value) });
        insertMessage({ type: "flight-number-return", isShow: false });
      },
      false
    );

    returnDateElement.addEventListener(
      event,
      ({ target }) => {
        if (isRoundTrip && !String(target.value).length) {
          Object.assign(INITIAL_PAYMENT_STATE, { return_date: "" });
          insertMessage({ type: "return-date", message: "Return date is required" });
          return;
        }
        Object.assign(INITIAL_PAYMENT_STATE, { return_date: String(target.value) });
        insertMessage({ type: "return-date", isShow: false });
      },
      false
    );

    returnTimeElement.addEventListener(
      event,
      ({ target }) => {
        if (isRoundTrip && !String(target.value).length) {
          Object.assign(INITIAL_PAYMENT_STATE, { return_time: "" });
          insertMessage({ type: "return-time", message: "Return time is required" });
          return;
        }
        Object.assign(INITIAL_PAYMENT_STATE, { return_time: String(target.value) });
        insertMessage({ type: "return-time", isShow: false });
      },
      false
    );

    // end

    fullNameElement.addEventListener(
      event,
      ({ target }) => {
        const fullName = escapeHTML(String(target.value));
        if (!fullName.length) {
          Object.assign(INITIAL_PAYMENT_STATE, { full_name: "" });
          insertMessage({ type: "full-name", message: "Full-name is required" });
          return;
        }
        insertMessage({ type: "full-name", isShow: false });
        Object.assign(INITIAL_PAYMENT_STATE, { full_name: fullName });
      },
      false
    );

    emailElement.addEventListener(
      event,
      ({ target }) => {
        const email = String(target.value).trim();
        if (!email?.length) {
          insertMessage({ type: "email", message: "E-mail is required" });
          Object.assign(INITIAL_PAYMENT_STATE, { email: "" });
          return;
        }

        const isValid = validateEmail(String(target.value));
        if (!isValid) {
          insertMessage({ type: "email", message: "Please enter a valid email" });
          Object.assign(INITIAL_PAYMENT_STATE, { email: "" });
          return;
        }

        if (isValid) {
          insertMessage({ type: "email", isShow: false });
          Object.assign(INITIAL_PAYMENT_STATE, { email: String(target.value) });
        }
      },
      false
    );

    phoneElement.addEventListener(
      event,
      (ev) => {
        const num = phoneInstance.getNumber();
        const isValid = phoneInstance.isValidNumber();
        if (!num?.length) {
          Object.assign(INITIAL_PAYMENT_STATE, { phone: "" });
          insertMessage({ type: "phone", message: "Phone number is required" });
          return;
        }

        if (!isValid) {
          Object.assign(INITIAL_PAYMENT_STATE, { phone: "" });
          insertMessage({ type: "phone", message: "Enter a valid phone number" });
          return;
        }
        insertMessage({ type: "phone", isShow: false });
        Object.assign(INITIAL_PAYMENT_STATE, { phone: String(num) });
      },
      false
    );

    luggageElement.addEventListener(
      event,
      ({ target }) => {
        if (Number(target.value) > 20) {
          Object.assign(INITIAL_PAYMENT_STATE, { approx_luggage: 0 });
          insertMessage({ type: "approx-luggage", message: "Maximum of 20" });
        } else {
          Object.assign(INITIAL_PAYMENT_STATE, { approx_luggage: Number(target.value) });
          insertMessage({ type: "approx-luggage", isShow: false });
        }
      },
      false
    );

    remarksElement.addEventListener(
      event,
      ({ target }) => {
        const remark = escapeHTML(String(target.value));
        if (remark.length) {
          Object.assign(INITIAL_PAYMENT_STATE, { remark });
        }
      },
      false
    );

    termsElement.addEventListener(
      event,
      ({ target }) => {
        if (!target.checked) {
          Object.assign(INITIAL_FORM_VALUES, { terms: false });
          insertMessage({ type: "terms", message: "You must accept Terms and Conditions and Privacy" });
          return;
        }
        insertMessage({ type: "terms", isShow: false });
        Object.assign(INITIAL_FORM_VALUES, { terms: true });
      },
      false
    );
  });

  formElement.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const isValid = validatorBookingFields(INITIAL_PAYMENT_STATE, INITIAL_PAYMENT_STATE.type_transfer);
    if (!isValid) return;

    if (!INITIAL_FORM_VALUES.terms) {
      insertMessage({ type: "terms", message: "You must accept Terms and Conditions and Privacy" });
      return;
    }

    setFieldsToCookie(NAME_PAYMENT_FIELDS_COOKIE, INITIAL_PAYMENT_STATE);
    redirectTo({ pathname: SITE_PATH_THANK_YOU, replace: true });
  });
});
