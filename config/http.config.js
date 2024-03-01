import { API_URL, GLOBAL_PREFIX } from "../scripts/util.js";

const HTTPRequestPayload = {
  headers: { "Content-Type": "application/json" },
  path: "/",
  body: {},
};

export class HTTPRequest {
  constructor() {}

  async get(path = HTTPRequestPayload.path) {
    const response = await fetch(`${API_URL}${GLOBAL_PREFIX}${path}`, {
      method: "GET",
      headers: HTTPRequestPayload.headers,
    });
    return await response.json();
  }

  async post(path = HTTPRequestPayload.path, body = HTTPRequestPayload.body) {
    const response = await fetch(`${API_URL}${GLOBAL_PREFIX}${path}`, {
      method: "POST",
      headers: HTTPRequestPayload.headers,
      body: JSON.stringify(body),
    });
    return await response.json();
  }
}
