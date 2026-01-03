# khương.vn

[![Website](https://img.shields.io/badge/Website-khương.vn-blue?style=flat-square&logo=google-chrome)](https://khương.vn)
[![GitHub](https://img.shields.io/badge/GitHub-lamngockhuong-black?style=flat-square&logo=github)](https://github.com/lamngockhuong)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-lamngockhuong-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/lamngockhuong)

Personal identity landing page with random themes, short link redirects, and mini apps.

## Features

- **9 Random Themes**: Terminal, Brutalist, Gradient, Glass, Neobrutalism, Retro, Minimal, Cyberpunk, Paper
- **Short Links**: `khương.vn/github` → redirects to GitHub profile
- **Mini Apps**: Collection of useful tools at `/apps`
- **JSON Config**: Easy customization without touching code
- **Auto Deploy**: GitHub Actions → Cloudflare Pages

## Tech Stack

- **Build**: Vite 7.3.0 + TypeScript 5.9.3
- **Hosting**: Cloudflare Pages (static + Functions)
- **CI/CD**: GitHub Actions
- **Deploy CLI**: Wrangler 4.54.0

## Quick Start

```bash
# Install dependencies
pnpm install

# Development
pnpm dev           # Vite dev server (hot reload)
pnpm dev:pages     # Cloudflare Pages local (with redirects)

# Build & Deploy
pnpm build         # Sitemap + TypeScript + Vite build
pnpm deploy        # Build + deploy to Cloudflare Pages

# Code Quality
pnpm lint          # Biome lint check
pnpm format        # Biome format (auto-fix)
pnpm check         # Biome lint + format (auto-fix)
pnpm typecheck     # TypeScript type check
```

## Configuration

### Site Config (`config.json`)

```json
{
  "name": "Khương",
  "role": "Anh thợ code",
  "avatar": { "type": "letter", "value": "K" },
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
  "analytics": { "goatcounter": "khuongvn" },
  "themes": {
    "enabled": ["terminal", "brutalist", "gradient", "glass", "neobrutalism", "retro", "minimal", "cyberpunk", "paper"],
    "overrides": {}
  },
  "customCSS": ""
}
```

### Short Links (`functions/redirects.ts`)

```typescript
export const redirects: Record<string, string> = {
  github: 'https://github.com/lamngockhuong',
  gh: 'https://github.com/lamngockhuong',
  linkedin: 'https://linkedin.com/in/lamngockhuong',
  twitter: 'https://x.com/lamngockhuong',
  email: 'mailto:hi@khuong.dev',
  blog: 'https://dev.ngockhuong.com',
  cv: 'https://cv.ngockhuong.com',
  // Add more...
}
```

**Usage** (both work):
- Path: `https://khương.vn/github` → 301 redirect to GitHub
- Subdomain: `https://github.khương.vn` → 301 redirect to GitHub

## Mini Apps

Apps available at `khương.vn/apps/`:

| App | Description | Path |
|-----|-------------|------|
| Vòng quay may mắn | Random wheel spinner with customizable segments | `/apps/lucky-wheel/` |

### Adding New Apps

1. Create app directory: `src/apps/{app-name}/`
2. Add entry files: `index.html`, `main.ts`, `styles.css`
3. Register in `src/apps/apps.json`
4. Add input to `vite.config.ts` rollupOptions

## Deployment

### Setup Cloudflare Pages

1. **Create API Token**:
   - [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) → Create Token
   - Use "Edit Cloudflare Workers" template (includes Pages)

2. **Get Account ID**:
   - Cloudflare Dashboard → Any page → Right sidebar shows Account ID

3. **Add GitHub Secrets**:
   - Repo → Settings → Secrets → Actions
   - Add `CLOUDFLARE_API_TOKEN` (from step 1)
   - Add `CLOUDFLARE_ACCOUNT_ID` (from step 2)

4. **First Deploy** (creates project):

   ```bash
   pnpm deploy
   ```

5. **Configure Custom Domain**:
   - Cloudflare Dashboard → Workers & Pages → khuongvn
   - Custom domains → Add: `khương.vn`
   - For subdomain redirects: DNS → Add `*` CNAME record → `khương.vn` (Proxied)

### How It Works

```bash
Request to khương.vn/github OR github.khương.vn
         ↓
Cloudflare Pages
         ↓
functions/_middleware.ts
         ↓
Check subdomain → if match, 301 redirect
Check path → if match, 301 redirect
No match? → Serve static from dist/
```

## Project Structure

```bash
├── src/
│   ├── index.html          # Identity page template
│   ├── main.ts             # Identity entry, theme logic
│   ├── config.ts           # Config types
│   ├── themes.ts           # Theme renderers
│   ├── icons.ts            # SVG icons
│   ├── styles.css          # Identity theme styles
│   ├── shared/
│   │   └── theme.css       # Common CSS variables
│   └── apps/
│       ├── index.html      # Apps listing page
│       ├── main.ts         # Apps listing entry
│       ├── styles.css      # Apps listing styles
│       ├── apps.json       # Apps configuration
│       └── lucky-wheel/    # Lucky wheel app
│           ├── index.html
│           ├── main.ts
│           ├── wheel.ts
│           └── styles.css
├── functions/
│   ├── _middleware.ts      # Redirect handler
│   └── redirects.ts        # Redirect mappings
├── public/                 # Static assets (favicons, profile.png)
├── config.json             # Site configuration
├── wrangler.toml           # Cloudflare Pages config
└── dist/                   # Build output
```

## License

[Apache-2.0](LICENSE)

---

Made with code by [Khương](https://khương.vn)
