import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Optional: Ensure global styles or Tailwind are included

// Get the root DOM node
const rootElement = document.getElementById("root");

if (!rootElement) {
  // Fallback UI and hard error in case the #root is missing
  document.body.innerHTML = "<h1>🚨 App failed to load. Root element not found.</h1>";
  throw new Error("❌ Root element not found in index.html");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
