import axios from "axios";

// Optional: Move this to `auth.ts` if centralizing the token logic
const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Create Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api", // Use env variable for backend URL
  withCredentials: true, // Allow cookies if needed (useful for sessions)
  headers: {
    "Content-Type": "application/json", // Default Content-Type for requests
  },
});

// Request interceptor to attach token to headers
API.interceptors.request.use((config) => {
  const token = getAuthToken(); // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attach token as Bearer token in Authorization header
  }
  return config; // Return the updated config for the request
}, (error) => {
  return Promise.reject(error); // Reject the request if there is an error with the interceptor
});

export default API;
