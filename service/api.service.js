import { HTTPRequest } from "../config/http.config.js";

// Stripe
export async function createCheckoutIntent(total = 0) {
  const { clientSecret } = await HTTPRequest.prototype.post("/stripe/create-checkout-intent", { price: total });
  return clientSecret;
}

// Paypal
export function get_client_token() {
  return new Promise(async (resolve, reject) => {
    try {
      const { client_token } = await HTTPRequest.prototype.post("/paypal/get_client_token");
      resolve(client_token);
    } catch (err) {
      reject(err);
    }
  });
}

export async function createOrderPaypal(data = {}) {
  return await await HTTPRequest.prototype.post("/paypal", data);
}

export async function onApprovePaypal(orderId = "", data = {}) {
  return await await HTTPRequest.prototype.post(`/paypal/${orderId}/capture`, data);
}

// Google
export async function validateCaptcha(token = "") {
  const data = await HTTPRequest.prototype.post("/google/recaptcha", { captchaToken: token });
  return data.success;
}

// Server
export async function getAgentByCode(code = "") {
  return await HTTPRequest.prototype.get(`/agent/${code}`);
}

export async function createAgent(payload = {}) {
  const data = {
    company_name: payload.company_name,
    manager_name: payload.manager_name,
    company_email: payload.company_email,
    manager_phone: payload.manager_phone,
    agency_url: payload.agency_url,
    iata_stanumber_other: payload.iata_stanumber_other,
    user_full_name: payload.user_full_name,
    user_email: payload.user_email,
    user_phone: payload.user_phone,
    role: payload.role,
  };

  return await HTTPRequest.prototype.post("/agent", data);
}

export async function createReservation(params) {
  return await HTTPRequest.prototype.post("/reservation", params);
}
