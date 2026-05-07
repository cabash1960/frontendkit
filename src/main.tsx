import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { BrowserRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <HashRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </HashRouter>
  </HelmetProvider>,
);
