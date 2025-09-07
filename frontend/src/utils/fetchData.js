import api from "./api";

export const fetchData = async (endpoint) => {
  try {
    const res = await api.get(endpoint);
    const {status, message, componentData} = res?.data;

    if (status === "success") {
      return {
        status,
        message,
        componentData,
      };
    }

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
      message: err.message,
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
