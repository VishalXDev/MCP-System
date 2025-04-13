import axios from "axios";

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // Make sure you're using Vite env format
  withCredentials: true, // Send cookies if needed for auth
});

// You can set default headers or interceptors here if needed
// Example: attach token if stored in localStorage/sessionStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
