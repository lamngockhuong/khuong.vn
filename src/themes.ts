import { config, type Link } from "./config";
import { icons } from "./icons";

// Theme names for display
export const themeNames: Record<string, string> = {
  terminal: "Terminal",
  brutalist: "Brutalist",
  gradient: "Gradient",
  glass: "Glass",
  neobrutalism: "Neobrutalism",
};

// Generate link HTML for text-based themes (terminal, brutalist, neobrutalism)
function renderTextLink(link: Link, lowercase = false): string {
  const label = lowercase ? link.label.toLowerCase() : link.label;
  const isEmail = link.url.startsWith("mailto:");
  const target = isEmail ? "" : ' target="_blank" rel="noopener"';
  return `<a href="${link.url}"${target}>${label}</a>`;
}

// Generate link HTML for icon-based themes (gradient, glass)
function renderIconLink(link: Link): string {
  const isEmail = link.url.startsWith("mailto:");
  const target = isEmail ? "" : ' target="_blank" rel="noopener"';
  return `<a href="${link.url}"${target} aria-label="${link.label}">${icons[link.icon]}</a>`;
}

// Theme renderers - each returns the HTML content for that theme
export const themes: Record<string, () => string> = {
  terminal: () => `
    <div class="terminal-content">
      <div class="terminal-box">
        <div><span class="prompt">&gt; </span><h1 class="t-name">${config.name.toLowerCase()}</h1><span class="cursor"></span></div>
        <p class="t-role">${config.role.toLowerCase()}</p>
        <nav class="t-links">
          ${config.links.map((l) => renderTextLink(l, true)).join("\n          ")}
        </nav>
      </div>
    </div>
  `,

  brutalist: () => `
    <div class="brutalist-content">
      <h1 class="b-name">${config.name}</h1>
      <div class="b-divider"></div>
      <p class="b-role">${config.role}</p>
      <nav class="b-links">
        ${config.links
          .map(
            (l, i) =>
              (i > 0 ? '<span class="sep">/</span>\n        ' : "") +
              renderTextLink(l),
          )
          .join("\n        ")}
      </nav>
    </div>
  `,

  gradient: () => `
    <div class="gradient-content">
      <h1 class="g-name">${config.name}</h1>
      <p class="g-role">${config.role}</p>
      <nav class="g-links">
        ${config.links.map((l) => renderIconLink(l)).join("\n        ")}
      </nav>
    </div>
  `,

  glass: () => `
    <div class="glass-content">
      <div class="gl-card">
        <div class="gl-avatar">${config.avatar.type === "letter" ? config.avatar.value : `<img src="${config.avatar.value}" alt="${config.name}">`}</div>
        <h1 class="gl-name">${config.name}</h1>
        <p class="gl-role">${config.role}</p>
        <nav class="gl-links">
          ${config.links.map((l) => renderIconLink(l)).join("\n          ")}
        </nav>
      </div>
    </div>
  `,

  neobrutalism: () => `
    <div class="neobrutalism-content">
      <div class="nb-card">
        <h1 class="nb-name">${config.name}</h1>
        <div class="nb-divider"></div>
        <p class="nb-role">${config.role}</p>
        <nav class="nb-links">
          ${config.links.map((l) => renderTextLink(l)).join("\n          ")}
        </nav>
      </div>
    </div>
  `,
};
