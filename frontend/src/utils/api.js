// frontend/src/utils/api.js
import axios from "axios";

// Use env var injected at build time (falls back to localhost for dev)
const BASE =
    (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, "")) ||
    "http://localhost:5000";

// If your backend mounts routes under /api, keep it in the baseURL.
// Otherwise, remove the /api suffix and call `/api/...` from your code consistently.
const api = axios.create({
    baseURL: `${BASE}/api`.replace(/\/+/g, "/"), // results like: https://travelstrem-test.onrender.com/api
    withCredentials: true,
});

// Optional: add request interceptor to attach token from localStorage
api.interceptors.request.use(
    (config) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (userInfo?.token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${userInfo.token}`;
            }
        } catch (err) {
            // ignore parse errors
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
