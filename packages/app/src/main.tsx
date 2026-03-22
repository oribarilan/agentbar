import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Settings from "./components/Settings";
import { getConfig } from "./lib/commands";
import { applyFontSize, applyTheme } from "./lib/applyTheme";
import "./styles/global.css";
import "./styles/themes.css";

const page = new URLSearchParams(window.location.search).get("page");

getConfig()
  .then((cfg) => {
    applyFontSize(cfg.appearance.font_size);
    applyTheme(cfg.appearance.theme);
  })
  .catch(() => {
    // use CSS default
  });

const root = document.getElementById("root");
if (root === null) {
  throw new Error("Unable to mount app: #root not found");
}

createRoot(root).render(
  <StrictMode>{page === "settings" ? <Settings /> : <App />}</StrictMode>,
);
