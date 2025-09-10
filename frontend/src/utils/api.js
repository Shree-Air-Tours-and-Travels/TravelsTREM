// frontend/src/utils/api.js
import axios from "axios";

function normalizeBase(raw) {
    if (!raw) return raw;
    if (/^https?:\/\//i.test(raw)) return raw.replace(/\/$/, "");
    return `https://${raw}`.replace(/\/$/, "");
}

// Use REACT_APP_API_URL if provided, otherwise:
// - dev → fallback to localhost
// - prod → fallback to relative "" (same origin)
let RAW_BASE = process.env.REACT_APP_API_URL;
if (!RAW_BASE) {
    RAW_BASE = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";
}

const BASE = normalizeBase(RAW_BASE) ?? "";
const baseURL = (`${BASE}/api`).replace(/([^:]\/)\/+/g, "$1");

console.log("API baseURL (built):", baseURL);

const api = axios.create({
    baseURL,
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
        } catch {
            // ignore
        }
        return config;
    },
    (err) => Promise.reject(err)
);

export default api;
