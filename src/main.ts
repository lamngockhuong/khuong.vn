import "./styles.css";
import { config } from "./config";
import { themeNames, themes } from "./themes";

// Get theme config
const enabledThemes = config.themes.enabled;
const defaultTheme = import.meta.env.VITE_DEFAULT_THEME || config.themes.defaultTheme || "terminal";
const randomTheme = config.themes.randomTheme !== false;

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

// Get theme from URL query param (?theme=minimal)
function getThemeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get("theme");
  return theme && enabledThemes.includes(theme) ? theme : null;
}

// Determine initial theme based on priority
function getInitialTheme(): string {
  const savedTheme = localStorage.getItem("lastTheme");

  // Priority 1: URL query param
  const urlTheme = getThemeFromUrl();
  if (urlTheme) return urlTheme;

  // Priority 2: Saved theme from last visit
  if (savedTheme && enabledThemes.includes(savedTheme)) {
    return savedTheme;
  }

  // Priority 3: If random disabled, use default
  if (!randomTheme) {
    return enabledThemes.includes(defaultTheme) ? defaultTheme : enabledThemes[0];
  }

  // Priority 4: Random theme
  return enabledThemes[Math.floor(Math.random() * enabledThemes.length)];
}

// Initialize
function init(): void {
  renderThemes();
  setTheme(getInitialTheme());

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
