// frontend/src/utils/api.js
import axios from "axios";

function normalizeBase(raw) {
  if (!raw) return "http://localhost:5000";
  // if already includes http(s) keep it, else prepend https://
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/$/, "");
  return `https://${raw}`; // assume https if scheme missing
}

const RAW_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const BASE = normalizeBase(RAW_BASE);

// If backend mounts routes under /api, keep it here. Else remove /api suffix.
const api = axios.create({
  baseURL: `${BASE}/api`.replace(/\/+/g, "/"), // ensure single slashes
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo?.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (err) {
      // ignore
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default api;
