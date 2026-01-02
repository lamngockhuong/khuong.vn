# Project Overview & PDR: khương.vn

## Executive Summary

**khương.vn** is a personal identity landing page featuring dynamic theme selection, short link redirects, and an extensible mini-apps framework. The project demonstrates modern web practices with Vite + TypeScript build tooling, serverless functions on Cloudflare Pages, and automated CI/CD deployment.

## Project Goals

1. **Create a memorable personal brand landing page** with visual variety through randomized themes
2. **Provide a short link service** for easy sharing of key profiles and resources
3. **Build an extensible mini-apps platform** for interactive tools and utilities
4. **Maintain high performance** with static hosting and zero-framework overhead
5. **Ensure easy customization** through JSON configuration files

## Target Users

- **Primary**: Developer/personal brand owner (Khương) - needs easy profile customization
- **Secondary**: Visitors to khương.vn - need quick access to social profiles
- **Tertiary**: Future content creators - mini-apps framework extensibility

## Key Features

### 1. Dynamic Theme System (5 Themes)
- **Terminal**: Retro CLI aesthetic with cursor animation
- **Brutalist**: Minimalist design with dividers and separators
- **Gradient**: Modern gradient background with icon links
- **Glass**: Glassmorphism card design with avatar
- **Neobrutalism**: Bold borders and dark aesthetic

**Behavior**: Random theme on each visit, excludes recently-shown theme, persists via localStorage

### 2. Short Link Redirects
- **Service**: HTTP 301 permanent redirects via Cloudflare Pages Functions
- **Coverage**: 17 shortcuts (github, linkedin, twitter, blog, cv, etc.)
- **Customizable**: Easy to add/remove via `functions/redirects.ts`
- **Apps Link**: Primary nav includes link to `/apps/` (icon: apps, via config.json)

### 3. Mini Apps Framework
- **Current**: Lucky Wheel - interactive canvas-based pie wheel spinner
- **Extensible**: Multi-page Vite build supports unlimited apps
- **Architecture**: Each app is self-contained (HTML, TS, CSS)

### 4. Configuration-Driven Design
- **Main Config**: `config.json` - site metadata, SEO, theme settings, analytics
- **Apps Registry**: `src/apps/apps.json` - app catalog for listing page
- **No Code Changes Needed**: Update content purely through JSON

### 5. Analytics Integration
- **Provider**: GoatCounter (privacy-focused alternative to Google Analytics)
- **Configurable**: Via `config.json` analytics field
- **Script Injection**: Auto-included at build time via Vite plugin

## Requirements

### Functional Requirements

| Requirement | Description | Status |
|------------|-------------|--------|
| FR-1 | Display identity landing page with theme support | Implemented |
| FR-2 | Randomly select theme on page load | Implemented |
| FR-3 | Allow theme switching via indicator click | Implemented |
| FR-4 | Persist theme preference in localStorage | Implemented |
| FR-5 | Handle short link redirects | Implemented |
| FR-6 | Display apps listing with cards | Implemented |
| FR-7 | Provide Lucky Wheel mini-app | Implemented |
| FR-8 | Support custom CSS injection via config | Implemented |
| FR-9 | Generate SEO meta tags from config | Implemented |
| FR-10 | Inject analytics script conditionally | Implemented |

### Non-Functional Requirements

| Requirement | Description | Target |
|------------|-------------|--------|
| NFR-1 | Page load performance | < 100ms (static) |
| NFR-2 | Theme switching responsiveness | Instant (localStorage) |
| NFR-3 | Canvas animation smoothness | 60 FPS |
| NFR-4 | Build time | < 5 seconds |
| NFR-5 | Bundle size | < 50KB minified per page |
| NFR-6 | Mobile responsiveness | 320px+ width |
| NFR-7 | Browser support | Modern browsers (ES2020+) |
| NFR-8 | Deployment reliability | 99.9% uptime (Cloudflare) |

## Technical Constraints

1. **No Runtime Frameworks**: Vanilla TypeScript/DOM for minimal overhead
2. **Static Hosting**: Cloudflare Pages (no compute for static assets)
3. **Client-Side Only**: No database or backend API (except redirects)
4. **Config at Build Time**: `config.json` consumed during Vite build
5. **Canvas-Based Animations**: Lucky Wheel uses Canvas 2D API, no WebGL

## Success Metrics

### Quantitative
- **Page Load Time**: < 100ms (Cloudflare edge)
- **Redirect Success Rate**: 100% for configured short links
- **Theme Rendering**: All 5 themes display correctly on target devices
- **Accessibility**: WCAG AA compliance for identity + apps pages

### Qualitative
- Clean, maintainable TypeScript codebase
- Easy JSON configuration for site customization
- Extensible architecture for new apps
- Professional visual presentation of brand

## Architectural Decisions

1. **Multi-Page Vite Build**: Separate entries for identity, apps listing, lucky wheel
   - Rationale: Apps are independent, reduces main page bundle size

2. **HTML String Templates**: Theme renderers use string concatenation
   - Rationale: No JSX/framework needed, string templates are lightweight

3. **Canvas API for Lucky Wheel**: Instead of SVG or DOM elements
   - Rationale: Better performance for complex shape rendering and rotation

4. **localStorage for Theme Persistence**: Client-side only
   - Rationale: Fast, no API calls, works offline

5. **Cloudflare Pages Functions**: For redirect middleware
   - Rationale: Zero-cost, decouples redirects from static hosting

## Version History

- **v1.0.0** (Current): Initial launch with 5 themes, short links, Lucky Wheel app

## Roadmap (Future Enhancements)

- [ ] Dark mode toggle independent of themes
- [ ] Admin dashboard for redirect management
- [ ] Analytics dashboard integration
- [ ] More mini-apps (e.g., Dice roller, URL shortener, QR generator)
- [ ] Theme customization UI
- [ ] Internationalization (i18n) support
- [ ] PWA capabilities (service worker)

## Deployment

- **Hosting**: Cloudflare Pages
- **Domain**: https://khương.vn (with internationalized domain)
- **CI/CD**: GitHub Actions → Cloudflare Pages
- **Custom Domain**: Configured in Cloudflare dashboard

## Documentation Structure

```
docs/
├── project-overview-pdr.md     # This file - overview & requirements
├── codebase-summary.md          # File structure & module purposes
├── code-standards.md            # TypeScript, CSS, naming conventions
├── system-architecture.md       # High-level architecture & data flow
└── README.md                    # Navigation & quick reference
```

## Related Files

- **Root README**: `/Users/lamngockhuong/develop/projects/lamngockhuong/khuong.vn/README.md`
- **Configuration**: `/Users/lamngockhuong/develop/projects/lamngockhuong/khuong.vn/config.json`
- **Package Management**: `/Users/lamngockhuong/develop/projects/lamngockhuong/khuong.vn/package.json`
