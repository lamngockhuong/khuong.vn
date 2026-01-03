# Code Standards: khương.vn

## Overview

This document defines coding conventions, patterns, and best practices for the khương.vn project. All contributors should follow these standards for consistency and maintainability.

## TypeScript Conventions

### File Naming

- **Modules**: camelCase (e.g., `main.ts`, `themes.ts`, `wheel.ts`)
- **Classes**: PascalCase (e.g., `LuckyWheel`)
- **Interfaces**: PascalCase (e.g., `Link`, `Config`, `Segment`)
- **Enums**: PascalCase with SCREAMING_SNAKE_CASE values

### Exports

```typescript
// Default exports for single primary export per file
export default function renderTheme() { }

// Named exports for utilities/helpers
export function getRandomTheme() { }
export const themes: Record<string, () => string> = { }

// Type exports
export interface Config { }
export type ThemeOptions = { }
```

### Import Organization

Order imports in this sequence:

1. External libraries (if any)
2. Local modules (relative imports)
3. Style imports (CSS files last)

```typescript
import { config } from './config'        // Local modules first
import { themes } from './themes'
import './styles.css'                    // Styles last
```

### Type Annotations

- Always annotate function parameters and return types
- Use explicit types instead of `any`
- Use union types for options: `type Theme = 'terminal' | 'brutalist' | 'gradient'`

```typescript
// Good
function setTheme(theme: string): void {
  document.body.className = `theme-${theme}`
}

// Avoid
function setTheme(theme) {
  // ...
}
```

### DOM Querying

- Use `querySelector` for single elements
- Use `querySelectorAll` for multiple elements
- Always null-check results

```typescript
// Good
const container = document.querySelector('.container')
if (!container) return

// Avoid
document.querySelector('.container').innerHTML = '...' // May crash if not found
```

### Event Listeners

- Attach listeners in initialization functions
- Use arrow functions to preserve `this` context
- Remove listeners if component unmounts (not applicable here - single-page)

```typescript
const button = document.querySelector('.spin-button')
button?.addEventListener('click', () => {
  wheel.spin()
})
```

### Error Handling

- Use try-catch for Canvas API operations
- Throw descriptive errors for development

```typescript
const ctx = canvas.getContext('2d')
if (!ctx) throw new Error('Canvas 2D context not supported')
```

### localStorage Usage

- Use consistent key naming with scope prefix
- Parse/stringify carefully

```typescript
// Good - prefixed key
localStorage.setItem('theme:selected', 'terminal')
const theme = localStorage.getItem('theme:selected')

// Wheel segments
const segments = JSON.parse(localStorage.getItem('wheel:segments') || '[]')
```

### Comments

- Comment "why" not "what" - code should be self-documenting
- Use JSDoc for public functions

```typescript
// Good - explains intent
// Avoid last theme to ensure visual variety on next visit
const lastTheme = localStorage.getItem('lastTheme')

/**
 * Spin the wheel and animate rotation
 * @returns void
 */
function spin(): void {
  // ...
}

// Avoid - obvious from code
const x = 5 // set x to 5
```

## CSS/Styling Conventions

### File Organization

- **`styles.css`**: Page-specific styles (layouts, components, animations)
- **`shared/theme.css`**: Shared variables, utilities, and theme base

### CSS Variables

- Define in `shared/theme.css` for reuse
- Use descriptive names with semantic prefixes
- Follow kebab-case convention

```css
/* Good - semantic naming */
:root {
  --color-primary: #1a1a1a;
  --color-accent: #4ecdc4;
  --color-text: #fff;
  --color-bg: #0d0d0d;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;

  --font-family-sans: 'Inter', sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
}
```

### Class Naming (BEM-inspired)

- Use descriptive kebab-case class names
- For theme-specific styles: `.theme-{name}-{component}`
- Block: `.terminal-box`, Modifier: `.terminal-box.active`

```css
/* Block - main component */
.terminal-content {
  padding: var(--spacing-lg);
}

/* Element - part of block */
.terminal-content .terminal-box {
  border: 1px solid #333;
}

/* Theme-scoped class */
body.theme-terminal .terminal-content {
  display: block;
}

body.theme-gradient .gradient-content {
  display: block;
}
```

### Theme Visibility

- Each theme uses a display pattern toggled by body class
- All themes exist in DOM but hidden via `display: none`

```css
/* Hide all content by default */
.terminal-content,
.brutalist-content,
.gradient-content,
.glass-content,
.neobrutalism-content {
  display: none;
}

/* Show only active theme */
body.theme-terminal .terminal-content { display: block; }
body.theme-brutalist .brutalist-content { display: block; }
body.theme-gradient .gradient-content { display: block; }
body.theme-glass .glass-content { display: block; }
body.theme-neobrutalism .neobrutalism-content { display: block; }
```

### Responsive Design

- Mobile-first approach
- Use CSS media queries for breakpoints

```css
/* Mobile first */
.container {
  width: 100%;
  padding: var(--spacing-md);
}

/* Tablet and up */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}
```

### Animations

- Use CSS transitions for simple state changes
- Use `@keyframes` for complex animations
- Prefer transform and opacity for performance

```css
/* Good - GPU-accelerated properties */
.theme-indicator {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}

.theme-indicator:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

/* Avoid - non-GPU properties */
.element {
  transition: left 0.2s; /* Causes reflow */
}
```

### Units

- Use `rem` for font sizes and spacing (scales with root font-size)
- Use `px` for borders and precise measurements
- Use `%` or viewport units for layouts

```css
/* Good */
.card {
  padding: 1rem;           /* rem for scalability */
  border: 1px solid #333;  /* px for precision */
  width: 100%;            /* % for fluidity */
}

/* Avoid */
.card {
  padding: 16px;          /* px instead of rem */
  font-size: 14px;        /* px instead of rem */
}
```

## Configuration Standards

### config.json Structure

- Keys use camelCase
- URLs are absolute (https://) or relative (/path)
- Arrays and objects follow JSON conventions

```json
{
  "name": "Khương",
  "role": "Anh thợ code",
  "avatar": {
    "type": "letter",
    "value": "K"
  },
  "links": [
    { "label": "Site", "url": "https://khuong.dev", "icon": "globe" },
    { "label": "GitHub", "url": "https://github.com/lamngockhuong", "icon": "github" },
    { "label": "LinkedIn", "url": "https://linkedin.com/in/lamngockhuong", "icon": "linkedin" },
    { "label": "Email", "url": "mailto:hi@khuong.dev", "icon": "email" },
    { "label": "Apps", "url": "/apps/", "icon": "apps" }
  ],
  "seo": {
    "title": "Khương - Anh thợ code",
    "description": "Anh thợ code",
    "canonical": "https://khương.vn",
    "ogImage": "https://khương.vn/profile.png"
  },
  "analytics": {
    "goatcounter": "khuongvn"
  },
  "themes": {
    "enabled": ["terminal", "brutalist", "gradient", "glass", "neobrutalism"],
    "overrides": {}
  },
  "customCSS": ""
}
```

### Redirect Mapping Format

```typescript
export const redirects: Record<string, string> = {
  github: 'https://github.com/lamngockhuong',
  gh: 'https://github.com/lamngockhuong',  // Aliases supported
  linkedin: 'https://linkedin.com/in/lamngockhuong',
}
```

## HTML Standards

### Template Conventions

- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Use data attributes for JS hooks

```html
<!-- Good -->
<nav class="links">
  <a href="https://github.com" aria-label="GitHub Profile">
    <svg><!-- icon --></svg>
  </a>
</nav>

<!-- Avoid -->
<div onclick="navigate()">
  Click me
</div>
```

### SEO Placeholders

Build process replaces these in `index.html`:

- `%VITE_TITLE%` → config.seo.title
- `%VITE_DESCRIPTION%` → config.seo.description
- `%VITE_NAME%` → config.name
- `%VITE_CANONICAL%` → config.seo.canonical
- `%VITE_OG_IMAGE%` → config.seo.ogImage
- `%VITE_ANALYTICS%` → GoatCounter script (if configured)

## Component Patterns

### Theme Renderer Pattern

```typescript
export const themes: Record<string, () => string> = {
  terminal: () => `
    <div class="terminal-content">
      <!-- theme-specific HTML -->
    </div>
  `,
}
```

### Canvas Component Pattern

```typescript
export class CanvasComponent {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2D context not available')
    this.ctx = ctx
  }

  private setupCanvas(): void {
    // Size, DPR handling, etc.
  }

  private draw(): void {
    // Rendering logic
  }

  public resize(): void {
    // Responsive handling
  }
}
```

## Performance Best Practices

### Bundle Size

- Keep main.ts focused on initialization
- Use string templates instead of DOM builders
- Lazy load heavy assets (not applicable to current mini-apps)

### Rendering Performance

- Use `display: none` instead of removing from DOM
- Batch DOM updates
- Use `requestAnimationFrame` for animations

### Deployment

- Always minify CSS and JavaScript
- Use content hashing in asset names (Vite default)
- Compress images in public/ folder

## Accessibility Standards

### WCAG AA Compliance

- Ensure text contrast ≥ 4.5:1 for normal text
- Provide alt text for images
- Use semantic HTML
- Support keyboard navigation

### Keyboard Navigation

```typescript
// Good - supporting Enter/Space for buttons
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction()
  }
})
```

### Screen Readers

- Use `aria-label` for icon-only links
- Use `role` attributes appropriately
- Provide text alternatives for visual content

```html
<a href="#" aria-label="GitHub Profile">
  <svg><!-- icon --></svg>
</a>
```

## Testing Notes

- No test framework currently configured
- Manual testing checklist:
  - All 9 themes render and switch correctly
  - Short links redirect with 301 status
  - Lucky Wheel animates smoothly and announces result
  - localStorage persists theme preference
  - Responsive design works on 320px+ width
  - Mobile touch/click events work

## Git Commit Standards

- Use present tense: "add feature" not "added feature"
- Reference issue numbers: "fix: resolve wheel animation #42"
- Keep commits atomic and focused

```
feat: add new theme
fix: resolve redirect loop
refactor: simplify theme selection
docs: update configuration guide
```

## Documentation Standards

- Keep code self-documenting with clear names
- Add JSDoc comments for exported functions
- Update relevant `.md` files when changing features
- Include examples in documentation
