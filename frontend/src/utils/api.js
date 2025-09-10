// frontend/src/utils/api.js
import axios from "axios";

/**
 * normalizeBase:
 * - If raw provided and looks like protocol (http/https) -> remove trailing slash and return.
 * - If raw provided but no protocol -> assume https (for convenience).
 * - If not provided:
 *    - in development: default to http://localhost:5000
 *    - in production: prefer '' (relative path) so browser calls same origin (or require REACT_APP_API_URL)
 *
 * NOTE: In production we strongly recommend setting REACT_APP_API_URL during build (Netlify env).
 */

function normalizeBase(raw) {
  if (raw == null || raw === "") return raw; // allow caller to decide fallback
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/$/, "");
  return `https://${raw}`.replace(/\/$/, "");
}

// Decide RAW_BASE with safer production behavior
let RAW_BASE = process.env.REACT_APP_API_URL;

// If not provided, default differently based on NODE_ENV
if (!RAW_BASE) {
  if (process.env.NODE_ENV === "development") {
    RAW_BASE = "http://localhost:5000";
  } else {
    // production: default to empty string so requests go to the same origin:
    // if your frontend is served on Netlify and backend on Render, set REACT_APP_API_URL
    RAW_BASE = "";
  }
}

const BASE = normalizeBase(RAW_BASE) ?? "";

// Build baseURL but preserve the "://" in the protocol and collapse duplicate slashes
// If BASE is empty, baseURL becomes '/api' (relative)
const baseURL = (`${BASE}/api`).replace(/([^:]\/)\/+/g, "$1");

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach bearer token from localStorage (if present)
 */
api.interceptors.request.use(
  (cfg) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo?.token) {
        cfg.headers = cfg.headers || {};
        cfg.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (err) {
      // ignore parse errors
    }
    return cfg;
  },
  (err) => Promise.reject(err)
);

export default api;
