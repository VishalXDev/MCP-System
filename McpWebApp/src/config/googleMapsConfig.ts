// src/config/googleMapsConfig.ts

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!key) {
  if (import.meta.env.DEV) {
    console.warn("⚠️ GOOGLE_MAPS_API_KEY is not set in your .env file.");
  } else {
    throw new Error("❌ GOOGLE_MAPS_API_KEY is missing in production.");
  }
} else if (import.meta.env.DEV) {
  console.info("🗺️ Google Maps API Key loaded.");
}

export const GOOGLE_MAPS_API_KEY: string = key!;
