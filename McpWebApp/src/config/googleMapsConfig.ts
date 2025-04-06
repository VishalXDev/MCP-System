// src/config/googleMapsConfig.ts

// Type-safe load of the Google Maps API key from env
const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!key && import.meta.env.DEV) {
  console.warn("⚠️ GOOGLE_MAPS_API_KEY is not set in your .env file.");
}

export const GOOGLE_MAPS_API_KEY: string = key ?? "";
