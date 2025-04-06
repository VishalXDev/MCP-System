// src/config/googleMapsConfig.ts

// Load the Google Maps API key from environment variables
export const GOOGLE_MAPS_API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "YOUR_GOOGLE_MAPS_API_KEY";

// Optional: Log warning if the key is missing in development
if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && import.meta.env.DEV) {
  console.warn("⚠️ GOOGLE_MAPS_API_KEY is not set in your .env file.");
}
