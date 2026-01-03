import "./styles.css";
import { config } from "./config";
import { themeNames, themes } from "./themes";

// Get enabled themes from config
const enabledThemes = config.themes.enabled;

// Render all theme contents to container
function renderThemes(): void {
  const container = document.querySelector(".container");
  if (!container) return;

  enabledThemes.forEach((themeName) => {
    if (themes[themeName]) {
      container.innerHTML += themes[themeName]();
    }
  });
}

// Set active theme
function setTheme(theme: string): void {
  document.body.className = `theme-${theme}`;
  const indicator = document.querySelector(".theme-indicator");
  if (indicator) {
    indicator.textContent = themeNames[theme] || theme;
  }
  localStorage.setItem("lastTheme", theme);
}

// Get random theme excluding a specific one
function getRandomTheme(exclude?: string): string {
  const available = enabledThemes.filter((t) => t !== exclude);
  return available[Math.floor(Math.random() * available.length)];
}

// Initialize
function init(): void {
  renderThemes();

  // Set initial random theme (different from last visit)
  const lastTheme = localStorage.getItem("lastTheme");
  const initialTheme =
    lastTheme && enabledThemes.includes(lastTheme)
      ? getRandomTheme(lastTheme)
      : enabledThemes[Math.floor(Math.random() * enabledThemes.length)];
  setTheme(initialTheme);

  // Click indicator to switch theme
  const indicator = document.querySelector(".theme-indicator");
  indicator?.addEventListener("click", () => {
    const current = document.body.className.replace("theme-", "");
    setTheme(getRandomTheme(current));
  });

  // Inject custom CSS if provided
  if (config.customCSS) {
    const style = document.createElement("style");
    style.textContent = config.customCSS;
    document.head.appendChild(style);
  }
}

// Run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
