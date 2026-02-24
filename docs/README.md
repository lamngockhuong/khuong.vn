# Documentation Index: khương.vn

Welcome to the khương.vn documentation! This directory contains comprehensive guides for understanding, developing, and maintaining the project.

## Documentation Files

### 1. [Project Overview & PDR](./project-overview-pdr.md)

**Start here if you're new to the project**

- Executive summary and project goals
- Key features (themes, redirects, mini-apps)
- Functional and non-functional requirements
- Success metrics and roadmap
- **Read time**: 10-15 minutes

### 2. [Codebase Summary](./codebase-summary.md)

**Understanding the code structure**

- Directory tree and file organization
- Module purposes and responsibilities
- Key files overview (config, main, themes, etc.)
- Build output structure
- Extension points for new features
- **Read time**: 15-20 minutes

### 3. [Code Standards](./code-standards.md)

**Guidelines for consistent development**

- TypeScript conventions (naming, imports, types)
- CSS/styling standards (variables, classes, responsive)
- Configuration file formats
- HTML and component patterns
- Performance and accessibility standards
- **Read time**: 20-30 minutes

### 4. [System Architecture](./system-architecture.md)

**How everything works together**

- High-level architecture diagrams
- Build pipeline flow
- Runtime execution flow
- Data flow diagrams
- Component interactions
- Deployment pipeline
- Performance characteristics
- Security considerations
- **Read time**: 20-25 minutes

## Quick Navigation

### I want to

**Understand what this project does**
→ Read [Project Overview & PDR](./project-overview-pdr.md)

**Find where a specific feature is implemented**
→ Check [Codebase Summary](./codebase-summary.md) directory tree

**Add a new theme**
→ See "Add New Theme" in [Code Standards](./code-standards.md) → Edit `src/themes.ts`

**Add a short link redirect**
→ See "Add Short Link" in [Code Standards](./code-standards.md) → Edit `functions/redirects.ts`

**Create a new mini-app**
→ See "Add Mini-App" in [Code Standards](./code-standards.md) + [Codebase Summary](./codebase-summary.md)

**Understand the build process**
→ Read "Build Architecture" in [System Architecture](./system-architecture.md)

**Deploy changes to production**
→ Read "Deployment Pipeline" in [System Architecture](./system-architecture.md)

**Debug a theme rendering issue**
→ Check [System Architecture](./system-architecture.md) → "Runtime Architecture - Identity Page"

**Learn CSS naming conventions**
→ Read "CSS/Styling Conventions" in [Code Standards](./code-standards.md)

**See what files are in src/ and why**
→ Check [Codebase Summary](./codebase-summary.md) → "Directory Structure"

## Development Quick Start

```bash
# Install dependencies (uses pnpm@10.7.1)
pnpm install

# Development with hot reload (Vite 7.3.0)
pnpm dev

# Local development with Cloudflare Pages Functions (Wrangler 4.54.0)
pnpm dev:pages

# Build for production (TypeScript 5.9.3 + Vite)
pnpm build

# Deploy to Cloudflare Pages
pnpm deploy
```

## Key Concepts

### Themes

- **What**: 5 visual designs (Terminal, Brutalist, Gradient, Glass, Neobrutalism)
- **How**: HTML factories in `src/themes.ts` + CSS classes in `src/styles.css`
- **Random**: Different theme selected on each page load
- **Persistent**: localStorage remembers last theme to avoid repeat

### Short Links

- **What**: URLs like `khương.vn/github` that redirect to destination
- **How**: Cloudflare Pages Functions intercept requests, check `functions/redirects.ts`
- **Status Code**: 301 (Permanent Redirect)
- **Customization**: Edit `functions/redirects.ts` to add/remove

### Mini Apps

- **Framework**: Vite multi-page build (separate entry points)
- **Currently**: Lucky Wheel spinner with canvas animation
- **Extensible**: Add new apps by creating `src/apps/{app-name}/` directory
- **Registry**: List apps in `src/apps/apps.json`

### Configuration

- **File**: `config.json` (consumed at build time)
- **Content**: Site name, role, links, SEO, analytics, theme list
- **Zero Code Changes**: Customize site purely through JSON

### Lucky Wheel

- **Type**: Canvas-based pie wheel
- **Animation**: 4-second spin with ease-out-cubic easing
- **Segments**: 6 default Vietnamese labels, customizable
- **Storage**: Custom segments saved to localStorage

## File Organization Patterns

### Adding Features

```bash
New Feature
  ├─ TypeScript: src/{location}.ts
  ├─ Styling: src/styles.css (or src/apps/{name}/styles.css)
  ├─ HTML: Modified index.html or new page
  ├─ Config: Update config.json if needed
  └─ Test: Manual testing checklist in Code Standards
```

### Configuration Priority

```bash
Default (hardcoded) → config.json (build-time) → localStorage (runtime)
```

## Performance Targets

| Metric                 | Target  | Current               |
| ---------------------- | ------- | --------------------- |
| Page Load              | < 100ms | Edge cached           |
| Theme Switch           | Instant | < 5ms (localStorage)  |
| Wheel Animation        | 60 FPS  | requestAnimationFrame |
| Bundle Size (per page) | < 50KB  | ~20-30KB minified     |
| Build Time             | < 5s    | Varies (Vite 7.3.0)   |

## Architecture Layers

```bash
UI Layer (HTML + CSS)
  ├─ index.html (themes)
  ├─ apps/index.html (listing)
  └─ lucky-wheel/index.html (wheel)

Logic Layer (TypeScript)
  ├─ main.ts (theme selection)
  ├─ apps/main.ts (listing)
  ├─ wheel.ts (canvas rendering)
  └─ _middleware.ts (redirects)

Configuration Layer (JSON)
  ├─ config.json (site metadata)
  ├─ apps.json (app registry)
  └─ redirects.ts (short links)

Infrastructure Layer
  ├─ Cloudflare Pages (static hosting)
  ├─ Cloudflare Functions (redirects)
  └─ GitHub Actions (CI/CD)
```

## Common Tasks

### Update Site Name

1. Edit `config.json` → `name` field
2. Run `pnpm build`
3. All 9 themes automatically update

### Add a New Theme

1. Create renderer function in `src/themes.ts`
2. Add CSS classes in `src/styles.css`
3. Add theme name to `config.json` → `themes.enabled`
4. Test all theme switching

### Fix a Redirect

1. Find wrong entry in `functions/redirects.ts`
2. Update URL
3. Run `pnpm deploy` (rebuild + deploy)

### Deploy Changes

1. Commit to git: `git commit -m "description"`
2. Push to main: `git push`
3. CI/CD automatically deploys via `pnpm deploy`

## Testing Checklist

- [ ] All 9 themes render correctly
- [ ] Theme switching works (click indicator)
- [ ] Theme persists across page reload
- [ ] Short links redirect with 301 status
- [ ] Lucky Wheel animates smoothly
- [ ] Wheel announces winning segment
- [ ] Responsive on mobile (320px+)
- [ ] Touch events work on mobile
- [ ] localStorage works (theme & wheel)
- [ ] No console errors

## Related Documentation

- **Root README**: For users and overview
- **config.json**: Schema and defaults
- **package.json**: Dependencies and scripts
- **.github/workflows**: CI/CD automation
- **wrangler.toml**: Cloudflare Pages config

## Contributing Guidelines

1. Read the relevant section in [Code Standards](./code-standards.md)
2. Make changes following the conventions
3. Test thoroughly (see Testing Checklist)
4. Update documentation if needed
5. Commit with clear message: "type: description"

## Support & Questions

For issues or questions:

- Check the relevant documentation file above
- Review [Codebase Summary](./codebase-summary.md) for file locations
- See [System Architecture](./system-architecture.md) for how components interact

---

**Last Updated**: January 2, 2026
**Maintained by**: Development Team
