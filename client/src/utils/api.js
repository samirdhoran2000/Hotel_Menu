import { API_BASE_URL, getStoredAuth } from "./config";

const buildHeaders = (auth = true) => {
  const headers = { "Content-Type": "application/json" };
  const stored = getStoredAuth();
  if (auth && stored?.token) {
    headers.Authorization = `Bearer ${stored.token}`;
  }
  return headers;
};

export const apiGet = async (path, auth = false) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: buildHeaders(auth),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const apiSend = async (path, method, body, auth = false) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(auth),
    body: JSON.stringify(body || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};
