import axios from "axios";
import api from "../utils/api";

// const API_URL = "http://localhost:5000/api/auth";

export const getProfile = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  return api.get(`/auth/profile`, config);
};