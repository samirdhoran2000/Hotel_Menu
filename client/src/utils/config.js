export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem("digitalMenuAuth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (auth) => {
  localStorage.setItem("digitalMenuAuth", JSON.stringify(auth));
};

export const clearStoredAuth = () => {
  localStorage.removeItem("digitalMenuAuth");
};
