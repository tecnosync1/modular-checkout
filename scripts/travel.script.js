import {
  DOM_EVENTS,
  INITIAL_AGENCY_FORM_STATE,
  INITIAL_AGENT_FORM_STATE,
  INTL_TEL_INPUT_CONFIG,
  RECAPTCHA_SITE_KEY,
  redirectTo,
} from "./util.js";
import { createAgent, validateCaptcha } from "../service/api.service.js";
import { escapeHTML, insertMessage, isValidURL, validateEmail } from "./util.js";

window.addEventListener("load", () => {
  // ReCaptcha
  window?.grecaptcha?.ready(function () {
    grecaptcha
      .execute(RECAPTCHA_SITE_KEY, { action: "submit" })
      .then(async function (token) {
        const isHuman = await validateCaptcha(token);
        if (!isHuman) {
          redirectTo("/", { replace: true });
        }
      })
      .catch((err) => {
        redirectTo("/", { replace: true });
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Form Agency
  // Elements
  const formAgency = document.getElementById("form-agency");
  const agencyName = document.getElementById("agency-name");
  const managerFullName = document.getElementById("manager-fullName");
  const agencyEmail = document.getElementById("agency-email");
  const agencyPhone = document.getElementById("agency-phone");
  const agencyURL = document.getElementById("agency-url");
  const agencyCode = document.getElementById("agency-code");
  const btnAgency = document.getElementById("btn-agency");

  const managerItiPhone = window?.intlTelInput(agencyPhone, INTL_TEL_INPUT_CONFIG);

  // Events
  DOM_EVENTS.forEach((event) => {
    agencyName.addEventListener(
      event,
      ({ target }) => {
        const agencyName = escapeHTML(String(target.value));
        if (!agencyName.length) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { agencyName: "" });
          insertMessage({ type: "agency-name", message: "Agent/Company name is required" });
          return;
        }
        Object.assign(INITIAL_AGENCY_FORM_STATE, { agencyName });
        insertMessage({ type: "agency-name", isShow: false });
      },
      false
    );

    managerFullName.addEventListener(
      event,
      ({ target }) => {
        const fullName = escapeHTML(String(target.value));
        if (!fullName.length) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { managerFullName: "" });
          insertMessage({ type: "manager-fullName", message: "Manager name is required" });
          return;
        }
        Object.assign(INITIAL_AGENCY_FORM_STATE, { managerFullName: fullName });
        insertMessage({ type: "manager-fullName", isShow: false });
      },
      false
    );

    agencyEmail.addEventListener(
      event,
      ({ target }) => {
        const email = String(target.value).trim();
        if (!email?.length) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { email: "" });
          insertMessage({ type: "agency-email", message: "E-mail is required" });
          return;
        }
        const isValid = validateEmail(email);
        if (!isValid) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { email: "" });
          insertMessage({ type: "agency-email", message: "Please enter a valid email" });
          return;
        }
        if (isValid) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { email });
          insertMessage({ type: "agency-email", isShow: false });
        }
      },
      false
    );

    agencyPhone.addEventListener(
      event,
      () => {
        const num = managerItiPhone.getNumber();
        const isValid = managerItiPhone.isValidNumber();
        if (!num?.length) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { phone: "" });
          insertMessage({ type: "agency-phone", message: "Manager phone is required" });
          return;
        }
        if (!isValid) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { phone: "" });
          insertMessage({ type: "agency-phone", message: "Enter a valid phone number" });
          return;
        }
        Object.assign(INITIAL_AGENCY_FORM_STATE, { phone: String(num) });
        insertMessage({ type: "agency-phone", isShow: false });
      },
      false
    );

    agencyURL.addEventListener(
      event,
      ({ target }) => {
        const website_url = String(target.value).trim();
        if (!website_url.length) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { url: "" });
          insertMessage({ type: "agency-url", message: "URL is required" });
          return;
        }
        if (!isValidURL(website_url)) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { url: "" });
          insertMessage({ type: "agency-url", message: "Enter a valid URL" });
          return;
        }
        if (isValidURL(website_url)) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { url: website_url });
          insertMessage({ type: "agency-url", isShow: false });
        }
      },
      false
    );

    agencyCode.addEventListener(
      event,
      ({ target }) => {
        const code = escapeHTML(String(target.value).trim());
        if (!code.length) {
          Object.assign(INITIAL_AGENCY_FORM_STATE, { code: "" });
          insertMessage({ type: "agency-code", message: "Code is required" });
          return;
        }
        Object.assign(INITIAL_AGENCY_FORM_STATE, { code });
        insertMessage({ type: "agency-code", isShow: false });
      },
      false
    );
  });

  formAgency.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    if (!INITIAL_AGENCY_FORM_STATE.agencyName.length) {
      insertMessage({ type: "agency-name", message: "Agent/Company name is required", delay: 4000 });
      return;
    }
    if (!INITIAL_AGENCY_FORM_STATE.managerFullName.length) {
      insertMessage({ type: "manager-fullName", message: "Manager name is required", delay: 4000 });
      return;
    }
    if (!INITIAL_AGENCY_FORM_STATE.email.length) {
      insertMessage({ type: "agency-email", message: "Email is required", delay: 4000 });
      return;
    }
    if (!INITIAL_AGENCY_FORM_STATE.phone.length) {
      insertMessage({ type: "agency-phone", message: "Manager phone is required", delay: 4000 });
      return;
    }
    if (!INITIAL_AGENCY_FORM_STATE.url.length) {
      insertMessage({ type: "agency-url", message: "URL is required", delay: 4000 });
      return;
    }
    if (!INITIAL_AGENCY_FORM_STATE.code.length) {
      insertMessage({ type: "agency-code", message: "Code is required", delay: 4000 });
      return;
    }

    btnAgency.textContent = "Sending...";
    btnAgency.setAttribute("disabled", true);

    const data = await createAgent({
      company_name: INITIAL_AGENCY_FORM_STATE.agencyName,
      manager_name: INITIAL_AGENCY_FORM_STATE.managerFullName,
      company_email: INITIAL_AGENCY_FORM_STATE.email,
      manager_phone: INITIAL_AGENCY_FORM_STATE.phone,
      agency_url: INITIAL_AGENCY_FORM_STATE.url,
      iata_stanumber_other: INITIAL_AGENCY_FORM_STATE.code,
      role: INITIAL_AGENCY_FORM_STATE.role,
    });
    if (data.statusCode === 400 && data.error) {
      btnAgency.textContent = "Send Requirement";
      btnAgency.removeAttribute("disabled");
      insertMessage({
        type: "travel-agency",
        message: "An error occurred. your message could not be sent.",
        alert: "error",
        delay: 4000,
      });
      return;
    }

    btnAgency.textContent = "Send Requirement";
    btnAgency.removeAttribute("disabled");
    insertMessage({
      type: "travel-agency",
      message: "Your registration was sent successfully ✓",
      alert: "success",
      delay: 5000,
    });
    formAgency.reset();
  });

  // Form Agent
  // Elements
  const formAgent = document.getElementById("form-agent");
  const agentFullName = document.getElementById("agent-fullName");
  const agentEmail = document.getElementById("agent-email");
  const agentPhone = document.getElementById("agent-phone");
  const btnAgent = document.getElementById("btn-agent");

  const agentTlPhone = window?.intlTelInput(agentPhone, INTL_TEL_INPUT_CONFIG);

  DOM_EVENTS.forEach((event) => {
    agentFullName.addEventListener(
      event,
      ({ target }) => {
        const agentFullName = escapeHTML(String(target.value));
        if (!agentFullName.length) {
          Object.assign(INITIAL_AGENT_FORM_STATE, { fullName: "" });
          insertMessage({ type: "agent-fullName", message: "Full name is required" });
          return;
        }
        Object.assign(INITIAL_AGENT_FORM_STATE, { fullName: agentFullName });
        insertMessage({ type: "agent-fullName", isShow: false });
      },
      false
    );

    agentEmail.addEventListener(
      event,
      ({ target }) => {
        const email = String(target.value).trim();
        if (!email?.length) {
          Object.assign(INITIAL_AGENT_FORM_STATE, { email: "" });
          insertMessage({ type: "agent-email", message: "E-mail is required" });
          return;
        }
        const isValid = validateEmail(String(target.value));
        if (!isValid) {
          Object.assign(INITIAL_AGENT_FORM_STATE, { email: "" });
          insertMessage({ type: "agent-email", message: "Please enter a valid email" });
          return;
        }
        if (isValid) {
          Object.assign(INITIAL_AGENT_FORM_STATE, { email: String(target.value) });
          insertMessage({ type: "agent-email", isShow: false });
        }
      },
      false
    );

    agentPhone.addEventListener(
      event,
      () => {
        const num = agentTlPhone.getNumber();
        const isValid = agentTlPhone.isValidNumber();
        if (!num?.length) {
          Object.assign(INITIAL_AGENT_FORM_STATE, { phone: "" });
          insertMessage({ type: "agent-phone", message: "Phone is required", delay: 4000 });
          return;
        }
        if (!isValid) {
          Object.assign(INITIAL_AGENT_FORM_STATE, { phone: "" });
          insertMessage({ type: "agent-phone", message: "Enter a valid phone number" });
          return;
        }
        Object.assign(INITIAL_AGENT_FORM_STATE, { phone: String(num) });
        insertMessage({ type: "agent-phone", isShow: false });
      },
      false
    );
  });

  // Submit
  formAgent.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    if (!INITIAL_AGENT_FORM_STATE.fullName.length) {
      insertMessage({ type: "agent-fullName", message: "Full name is required", delay: 4000 });
      return;
    }
    if (!INITIAL_AGENT_FORM_STATE.email.length) {
      insertMessage({ type: "agent-email", message: "E-mail is required", delay: 4000 });
      return;
    }
    if (!INITIAL_AGENT_FORM_STATE.phone.length) {
      insertMessage({ type: "agent-phone", message: "Phone is required", delay: 4000 });
      return;
    }

    btnAgent.textContent = "Sending...";
    btnAgent.setAttribute("disabled", true);
    const data = await createAgent({
      user_full_name: INITIAL_AGENT_FORM_STATE.fullName.toLocaleLowerCase(),
      user_email: INITIAL_AGENT_FORM_STATE.email,
      user_phone: INITIAL_AGENT_FORM_STATE.phone,
      role: INITIAL_AGENT_FORM_STATE.role,
    });

    if (data.statusCode === 400 && data.error) {
      btnAgent.textContent = "Send Requirement";
      btnAgent.removeAttribute("disabled");
      insertMessage({
        type: "travel-agent",
        message: "An error occurred. your message could not be sent.",
        alert: "error",
        delay: 4000,
      });
      return;
    }
    btnAgent.textContent = "Send Requirement";
    btnAgent.removeAttribute("disabled");
    insertMessage({
      type: "travel-agent",
      message: "Your registration was sent successfully ✓",
      alert: "success",
      delay: 5000,
    });

    formAgent.reset();
  });
});
