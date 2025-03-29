import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const getProfile = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  return axios.get(`${API_URL}/profile`, config);
};