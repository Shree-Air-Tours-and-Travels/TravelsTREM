// frontend/src/utils/api.js
import axios from "axios";

function normalizeBase(raw) {
    if (!raw) return "http://localhost:5000";
    if (/^https?:\/\//i.test(raw)) return raw.replace(/\/$/, "");
    return `https://${raw}`;
}

const RAW_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const BASE = normalizeBase(RAW_BASE);

// Build baseURL but preserve the "://" in the protocol
const baseURL = `${BASE}/api`.replace(/([^:]\/)\/+/g, "$1");
// this collapses duplicate slashes except the "://"

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
        } catch (err) {
            // ignore
        }
        return config;
    },
    (err) => Promise.reject(err)
);

export default api;
