import api from "./api";

/**
 * fetchData
 * - Backwards compatible: if you pass just `endpoint` it does a GET like before.
 * - New: pass a second `options` arg: { method, body, headers, params }
 *
 * Examples:
 *  fetchData("/form.json?form=contact-agent"); // GET
 *  fetchData("/submit.json?form=contact-agent", { method: "POST", body: payload });
 */
export const fetchData = async (endpoint, options = {}) => {
    const { method = "GET", body = null, headers = {}, params = {} } = options;

    try {
        let res;

        if (method.toUpperCase() === "GET") {
            // preserve old behavior
            res = await api.get(endpoint, { params, headers });
        } else if (method.toUpperCase() === "POST") {
            res = await api.post(endpoint, body, { params, headers });
        } else if (method.toUpperCase() === "PUT") {
            res = await api.put(endpoint, body, { params, headers });
        } else if (method.toUpperCase() === "PATCH") {
            res = await api.patch(endpoint, body, { params, headers });
        } else if (method.toUpperCase() === "DELETE") {
            // axios delete supports data in config in modern versions
            res = await api.delete(endpoint, { data: body, params, headers });
        } else {
            // fallback: try a generic request if your api helper exposes it
            if (api.request) {
                res = await api.request({
                    url: endpoint,
                    method,
                    data: body,
                    params,
                    headers,
                });
            } else {
                throw new Error(`Unsupported method: ${method}`);
            }
        }

        const { status, message, componentData } = res?.data || {};

        if (status === "success") {
            return { status, message, componentData };
        }

        // backend responded but not success
        return {
            status: "error",
            message: message || "Something went wrong",
            componentData: {
                title: "",
                description: "",
                data: [],
                structure: {},
                config: {},
            },
        };
    } catch (err) {
        return {
            status: "error",
            message: err?.response?.data?.message || err.message || "Network error",
            componentData: {
                title: "",
                description: "",
                data: [],
                structure: {},
                config: {},
            },
        };
    }
};

export default fetchData;
