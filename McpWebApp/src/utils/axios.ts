// src/utils/axios.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default API;
