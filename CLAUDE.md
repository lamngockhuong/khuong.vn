# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev           # Vite dev server with hot reload
pnpm dev:pages     # Full Cloudflare Pages local (build + wrangler, tests redirects)
pnpm build         # TypeScript check + Vite production build
pnpm deploy        # Build + deploy to Cloudflare Pages
```

## Architecture

**Multi-page Vite app** with Cloudflare Pages hosting:

- **Identity page** (`/`) - Random theme on each visit from 5 styles (Terminal, Brutalist, Gradient, Glass, Neobrutalism). Theme logic in `src/main.ts`, renderers in `src/themes.ts`.

- **Mini apps** (`/apps/*`) - Standalone tools. Each app is a separate Vite entry point. Registry in `src/apps/apps.json`.

- **Short link redirects** - Cloudflare Pages Functions middleware (`functions/_middleware.ts`) intercepts requests before static files. Mappings in `functions/redirects.ts`.

## Key Patterns

**Config-driven**: Site data lives in `config.json`. Vite's `html-transform` plugin replaces `%VITE_*%` placeholders in `src/index.html` at build time.

**Adding new apps**: Create `src/apps/{name}/` with `index.html`, `main.ts`, add to `rollupOptions.input` in `vite.config.ts`, register in `src/apps/apps.json`.

**Adding redirects**: Add entry to `functions/redirects.ts`. Format: `shortpath: 'https://destination.url'`

**Shared styles**: CSS variables in `src/shared/theme.css` for consistent theming across apps.
