import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Troviamo l'elemento nel DOM
const container = document.getElementById("root");

// Verifichiamo che l'elemento esista (buona pratica per TypeScript)
if (!container) {
  throw new Error("Failed to find the root element");
}

// Creiamo la root di React
const root = createRoot(container);


root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);