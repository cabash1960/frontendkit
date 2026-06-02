import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { HashRouter } from "react-router-dom";

// Check if the app is running as a browser extension
const isExtension =
  typeof (window as any).chrome !== "undefined" &&
  (window as any).chrome.runtime &&
  (window as any).chrome.runtime.id;

if (isExtension) {
  // Apply fixed dimensions only for the extension popup
  document.body.style.width = "400px";
  document.body.style.height = "550px";
  document.body.style.margin = "0";
  document.body.style.overflowX = "hidden";
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <HashRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </HashRouter>
  </HelmetProvider>,
);
