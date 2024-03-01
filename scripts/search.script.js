import { INITIAL_AIRPORTS_PUNTA_CANA } from "../data/airports.punta-cana.js";
import { INITIAL_AIRPORTS_SANTO_ROMANA } from "../data/airports.santo-romana.js";
import { getAgentByCode } from "../service/api.service.js";
import { checkStripeFlowStatus } from "./stripe-status.script.js";
import {
  AIRPORT_LA_ROMANA,
  AIRPORT_PUNTA_CANA,
  AIRPORT_SANTO_DOMINGO,
  CHOICES_OPTION,
  DOM_EVENTS,
  INITIAL_FORM_VALUES,
  MAXIMUM_NUMBER_OF_PAX,
  NAME_FORM_SEARCH_COOKIE,
  SITE_PATH_BOOKING,
  SUMMARY_BUS,
  SUMMARY_GENERIC,
  SUMMARY_LUX,
  TYPE_TRANSFERS,
  escapeHTML,
  imageElevenToSixteen,
  imageOneToSix,
  imageOneToSixLux,
  imageSevenToTen,
  imageSeventeenToTwentyTwo,
  imageTwentyTwoToMore,
  insertMessage,
  redirectTo,
  setFieldsToCookie,
} from "./util.js";

document.addEventListener("DOMContentLoaded", async () => {
  Cookies.remove(NAME_FORM_SEARCH_COOKIE);

  // Elements
  const boxFormElement = document.getElementById("form-transfer");
  const originElement = document.getElementById("choices-origin");
  const destinationElement = document.getElementById("choices-destination");
  const travelAgentCode = document.getElementById("travel-agent");
  const amountPaxElement = document.getElementById("choices-amount-pax");

  const sectionItemsElements = document.getElementById("section__items");
  const boxItemsElements = document.getElementById("transport-items");

  const searchBtn = document.getElementById("search-btn");

  document.querySelectorAll("input[name='type-transfer']").forEach((input) => {
    input.addEventListener("change", ({ target }) => {
      Object.assign(INITIAL_FORM_VALUES, { typeTransfer: target.value });
    });
  });

  // Origin
  const choicesOrigin = new Choices(originElement, CHOICES_OPTION);
  choicesOrigin.setChoices([...INITIAL_AIRPORTS_PUNTA_CANA], "value", "label", true);
  // Destination
  const choicesDestination = new Choices(destinationElement, CHOICES_OPTION);

  // state of destination list
  function destinationState() {
    if (!INITIAL_FORM_VALUES.originId) {
      return INITIAL_AIRPORTS_PUNTA_CANA;
    }
    const selected = INITIAL_AIRPORTS_PUNTA_CANA.filter((airport) => {
      return INITIAL_FORM_VALUES.originId === airport.value;
    })[0];

    if (selected.type?.length && selected.airport === "punta-cana") {
      return INITIAL_AIRPORTS_PUNTA_CANA.filter((item) => !item.type && !item.label.includes("AIRPORTS"));
    }
    if (selected.type?.length && (selected.airport === "santo-domingo" || selected.airport === "la-romana")) {
      return INITIAL_AIRPORTS_SANTO_ROMANA.filter((item) => !item.type && !item.label.includes("AIRPORTS"));
    }
    return INITIAL_AIRPORTS_PUNTA_CANA.filter((airport) => airport.label.includes("AIRPORTS") || airport.type?.length);
  }

  // get services
  function getAllTransfer() {
    const reference = {};

    // origin
    if (INITIAL_FORM_VALUES.origin === AIRPORT_PUNTA_CANA) {
      const service = INITIAL_AIRPORTS_PUNTA_CANA.filter(
        (airport) => airport.label === INITIAL_FORM_VALUES.destination
      )[0];
      Object.assign(reference, service);
    }

    if (INITIAL_FORM_VALUES.origin === AIRPORT_SANTO_DOMINGO) {
      const service = INITIAL_AIRPORTS_SANTO_ROMANA.filter(
        (airport) => airport.label === INITIAL_FORM_VALUES.destination
      )[0];
      Object.assign(reference, service);
    }

    if (INITIAL_FORM_VALUES.origin === AIRPORT_LA_ROMANA) {
      const service = INITIAL_AIRPORTS_SANTO_ROMANA.filter(
        (airport) => airport.label === INITIAL_FORM_VALUES.destination
      )[0];
      Object.assign(reference, service);
    }

    // destination
    if (INITIAL_FORM_VALUES.destination === AIRPORT_PUNTA_CANA) {
      const service = INITIAL_AIRPORTS_PUNTA_CANA.filter((airport) => airport.label === INITIAL_FORM_VALUES.origin)[0];
      Object.assign(reference, service);
    }

    if (INITIAL_FORM_VALUES.destination === AIRPORT_SANTO_DOMINGO) {
      const service = INITIAL_AIRPORTS_SANTO_ROMANA.filter(
        (airport) => airport.label === INITIAL_FORM_VALUES.origin
      )[0];
      Object.assign(reference, service);
    }

    if (INITIAL_FORM_VALUES.destination === AIRPORT_LA_ROMANA) {
      const service = INITIAL_AIRPORTS_SANTO_ROMANA.filter(
        (airport) => airport.label === INITIAL_FORM_VALUES.origin
      )[0];
      Object.assign(reference, service);
    }

    const pricePerPax = 8;
    const maxPaxLuxury = 6;
    const vanPrice = +reference.vanPrice || 0;
    const countPax = +INITIAL_FORM_VALUES.amountOfPax || 0;

    const countAdditional = Math.abs((maxPaxLuxury - countPax) * pricePerPax);
    const finalPrice = Math.abs(vanPrice + countAdditional);

    if (countPax > 6) {
      const getImage =
        countPax >= 7 === countPax <= 10
          ? imageSevenToTen
          : countPax >= 11 === countPax <= 16
          ? imageElevenToSixteen
          : countPax >= 17 === countPax <= 22
          ? imageSeventeenToTwentyTwo
          : imageTwentyTwoToMore;

      const getSummary = countPax >= 7 === countPax <= 22 ? SUMMARY_GENERIC : SUMMARY_BUS;
      const getType = countPax >= 23 === countPax <= 54 ? "Private Airport Group" : "Private Airport Transfer";

      return [
        {
          type: getType,
          image: getImage,
          transfer: "VIP Transfer",
          origin: INITIAL_FORM_VALUES.origin || "",
          destination: INITIAL_FORM_VALUES.destination,
          amountOfPax: countPax.toString(),
          summary: getSummary,
          price:
            INITIAL_FORM_VALUES.typeTransfer === TYPE_TRANSFERS.RoundTrip
              ? Math.abs(finalPrice * 2).toString()
              : finalPrice.toString(),
        },
      ];
    }

    if (countPax <= 6) {
      const priceVIP =
        INITIAL_FORM_VALUES.typeTransfer === TYPE_TRANSFERS.RoundTrip
          ? Math.abs(+reference?.vanPrice * 2).toString()
          : reference.vanPrice;

      const data = {
        type: "Private Airport Transfer",
        image: imageOneToSix,
        transfer: "VIP Transfer",
        origin: INITIAL_FORM_VALUES.origin || "",
        destination: INITIAL_FORM_VALUES.destination,
        amountOfPax: countPax.toString(),
        summary: SUMMARY_GENERIC,
        price: priceVIP,
      };

      const priceLuxury =
        INITIAL_FORM_VALUES.typeTransfer === TYPE_TRANSFERS.RoundTrip
          ? Math.abs(+reference?.luxuryPrice * 2).toString()
          : reference.luxuryPrice;

      const item = [
        {
          type: "Private Luxury Transfer",
          image: imageOneToSixLux,
          transfer: "Luxury Transfer",
          origin: INITIAL_FORM_VALUES.origin || "",
          destination: INITIAL_FORM_VALUES.destination,
          amountOfPax: countPax.toString(),
          summary: SUMMARY_LUX,
          price: priceLuxury,
        },
      ];

      return reference.luxuryPrice?.length && typeof reference.luxuryPrice === "string" ? item.concat(data) : [data];
    }

    return [];
  }

  // Amount of Pax
  const amountItems = [...new Array(MAXIMUM_NUMBER_OF_PAX)].map((_, idx) => ({
    value: (idx + 1).toString(),
    label: (idx + 1).toString(),
  }));

  const amountOfPax = new Choices(amountPaxElement, {
    ...CHOICES_OPTION,
    searchEnabled: false,
  });
  amountOfPax.setChoices([...amountItems], "value", "label", true);

  // check status
  await checkStripeFlowStatus();

  // Events
  DOM_EVENTS.forEach((event) => {
    originElement.addEventListener(
      event,
      (ev) => {
        const getOrigin = choicesOrigin.getValue();
        if (!getOrigin.label.length) {
          insertMessage({ type: "choices-origin", message: "From is required" });
          Object.assign(INITIAL_FORM_VALUES, {
            origin: "",
            originId: "",
          });
          return;
        }
        insertMessage({ type: "choices-origin", isShow: false });
        Object.assign(INITIAL_FORM_VALUES, {
          origin: getOrigin.label,
          originId: getOrigin.value,
        });
      },
      false
    );

    originElement.addEventListener(event, () => {
      choicesDestination.enable();
      choicesDestination.removeActiveItemsByValue(INITIAL_FORM_VALUES.destinationId);
      choicesDestination.setChoices([...destinationState()], "value", "label", "placeholder", true);
    });

    destinationElement.addEventListener(
      event,
      () => {
        const getDestination = choicesDestination.getValue();
        if (!getDestination.label.length) {
          Object.assign(INITIAL_FORM_VALUES, {
            destination: "",
            destinationId: "",
          });
          insertMessage({ type: "choices-destination", message: "To is required" });
          return;
        }
        insertMessage({ type: "choices-destination", isShow: false });
        Object.assign(INITIAL_FORM_VALUES, {
          destination: getDestination.label,
          destinationId: getDestination.value,
        });
      },
      false
    );

    amountPaxElement.addEventListener(
      event,
      () => {
        const getAmountOfPax = amountOfPax.getValue(true);
        if (!Number(getAmountOfPax)) {
          Object.assign(INITIAL_FORM_VALUES, { amountOfPax: 0 });
          insertMessage({ type: "choices-amount-pax", message: "Amount of pax is required" });
          return;
        }
        insertMessage({ type: "choices-amount-pax", isShow: false });
        Object.assign(INITIAL_FORM_VALUES, { amountOfPax: Number(getAmountOfPax) });
      },
      false
    );
  });

  let timer;
  const waitTime = 1000;

  // Code Agent
  travelAgentCode.addEventListener("input", ({ target }) => {
    const agent = escapeHTML(String(target.value).trim());
    const suggestion = document.querySelector('.suggestion[data-type="travel-agent"]');

    if (!agent?.length) {
      insertMessage({ type: "travel-agent", isShow: false });
      insertMessage({ type: "travel-agent", isShow: false, alert: "success" });
      suggestion.style.display = "block";
      searchBtn.removeAttribute("disabled");
      Object.assign(INITIAL_FORM_VALUES, { travelAgent: "" });
    }

    if (agent?.length > 3) {
      searchBtn.setAttribute("disabled", true);

      clearTimeout(timer);
      timer = setTimeout(() => {
        (async () => {
          const data = await getAgentByCode(agent);
          if (data.statusCode === 400 && data.error) {
            suggestion.style.display = "none";
            insertMessage({ type: "travel-agent", message: data.message });
            insertMessage({ type: "travel-agent", isShow: false, alert: "success" });
            searchBtn.setAttribute("disabled", true);
            return;
          }
          Object.assign(INITIAL_FORM_VALUES, { travelAgent: data.agent_code });
          suggestion.style.display = "none";
          searchBtn.removeAttribute("disabled");
          insertMessage({ type: "travel-agent", isShow: false });
          insertMessage({ type: "travel-agent", message: "Valid agent code ✓", alert: "success" });
        })();
      }, waitTime);
    }
  });

  // submit
  boxFormElement.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (
      !INITIAL_FORM_VALUES.destination.length ||
      !INITIAL_FORM_VALUES.destination.length ||
      !Number(INITIAL_FORM_VALUES.amountOfPax)
    ) {
      return;
    }
    // clean child
    boxItemsElements.replaceChildren();
    Object.assign(INITIAL_FORM_VALUES, { items: getAllTransfer() });

    const childItems = INITIAL_FORM_VALUES.items.map(
      (item, idx) => `
					<article class="service box__item" tabindex="-1" data-item="transport" data-position="${idx}">
						<div class="container_SUV">
							<div class="box__img">
								<img src="${item.image}" alt="image car ${item.type}" />
							</div>
						</div>
						<div class="texts">
							<h4 class="heading_4">${item.type}</h4>
							<h3 class="price__room">$<span class="transport__price">${item.price}</span>USD</h3>
						</div>
						<div class="hidden_content" data-item="content">
							<p>
							 	${item.summary}
							 	<br />
							 	<br />						
								 <span>*Photos for illustration purposes only; <br/> actual vehicle may vary.</span>
								 <br />
								 <br />
								 <button type="button" id="item-transport" data-position="${idx}" class="button_highlight">
                  <span>Select</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 12H20M20 12L16 8M20 12L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                 </button>
							</p>
						</div>
					</article>`
    );

    boxItemsElements.innerHTML = childItems.join(" ");

    sectionItemsElements.style = "block";
    const y = sectionItemsElements.getBoundingClientRect().top + window.scrollY;
    window.scroll({
      top: y,
      behavior: "smooth",
    });

    // select
    const btnItem = document.querySelectorAll("#item-transport");
    btnItem?.forEach((item) => {
      item?.addEventListener("click", (ev) => {
        const getPosition = item.getAttribute("data-position");
        const payload = {
          ...INITIAL_FORM_VALUES.items[getPosition],
          typeTransfer: INITIAL_FORM_VALUES.typeTransfer,
          travelAgent: INITIAL_FORM_VALUES.travelAgent,
        };

        setFieldsToCookie(NAME_FORM_SEARCH_COOKIE, payload);
        redirectTo({ pathname: SITE_PATH_BOOKING, replace: true });
      });
    });
    // end
  });
});
