import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Root element not found!");
} else {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App /> {/* ✅ AuthProvider is already inside App.tsx */}
      </BrowserRouter>
    </React.StrictMode>
  );
}
