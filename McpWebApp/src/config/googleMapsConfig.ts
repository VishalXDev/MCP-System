// src/config/googleMapsConfig.ts

// It's best practice to load API keys from environment variables.
export const GOOGLE_MAPS_API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY";
