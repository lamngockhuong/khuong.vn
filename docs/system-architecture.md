# System Architecture: khương.vn

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER BROWSER                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CLOUDFLARE PAGES EDGE                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Request Handler (_middleware.ts)                        │  │
│  │  Check: Is path in redirects.ts?                         │  │
│  │  ├─ YES → Return 301 redirect                            │  │
│  │  └─ NO → Serve static file from dist/                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                     ┌────────┴────────┐
                     ▼                 ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  STATIC ASSETS   │  │  HTTP REDIRECT   │
        │   (dist/)        │  │  301 Permanent   │
        │                  │  │                  │
        │ - index.html     │  │ - github         │
        │ - apps/...       │  │ - linkedin       │
        │ - assets/...     │  │ - twitter        │
        │                  │  │ - cv, blog, etc  │
        └──────────────────┘  └──────────────────┘
```

## Build Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT                                  │
│  src/                                                            │
│  ├── index.html ─┐                                               │
│  ├── main.ts ────┼──────► TypeScript Compiler (tsc)             │
│  ├── themes.ts ──┤       (Type checking)                         │
│  ├── config.ts ──┤                                               │
│  ├── icons.ts ───┤                                               │
│  ├── config.json─┤                                               │
│  └── styles.css ─┤                                               │
│                  │                                               │
│  src/apps/       ├──────► Vite Bundler & Build                  │
│  ├── index.html ─┤       - Multi-page config                    │
│  ├── main.ts ────┤       - HTML transform plugin                │
│  ├── apps.json ──┤       - CSS minimization                     │
│  └── styles.css ─┤       - Asset hashing                        │
│                  │                                               │
│  src/apps/lucky-wheel/───┐                                       │
│  ├── index.html  ────────┤                                       │
│  ├── main.ts     ────────┤                                       │
│  ├── wheel.ts    ────────┤                                       │
│  └── styles.css  ────────┘                                       │
│                                                                   │
│  functions/                                                       │
│  ├── _middleware.ts ─┐                                            │
│  └── redirects.ts ───┼──► TypeScript → JavaScript (Wrangler)    │
│                      │    (Workers runtime transpilation)        │
│  config.json ────────┘                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BUILD OUTPUT (dist/)                          │
│  ├── index.html                 (Identity page)                  │
│  ├── apps/index.html            (Apps listing)                   │
│  ├── apps/lucky-wheel/index.html (Wheel app)                     │
│  └── assets/                                                     │
│      ├── main-{hash}.js         (Identity logic)                 │
│      ├── apps-{hash}.js         (Apps listing logic)             │
│      ├── luckyWheel-{hash}.js    (Wheel logic)                    │
│      ├── main-{hash}.css        (Identity styles)                │
│      ├── apps-{hash}.css        (Apps listing styles)            │
│      ├── luckyWheel-{hash}.css   (Wheel styles)                   │
│      ├── theme-{hash}.css       (Shared theme vars)              │
│      └── modulepreload-polyfill.js                               │
│                                                                   │
│  functions/                                                      │
│  ├── _middleware.ts             (Compiled JS)                    │
│  └── redirects.ts               (Compiled JS)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              CLOUDFLARE PAGES DEPLOYMENT                         │
│  wrangler pages deploy dist/                                    │
│  ↓                                                               │
│  Cloudflare builds & deploys static assets to edge              │
└─────────────────────────────────────────────────────────────────┘
```

## Runtime Architecture

### Identity Page (index.html)

```
Page Load
   ↓
HTML: <script src="main-{hash}.js">
   ↓
main.ts execution:
   ├─ Import config, themes, styles
   ├─ Check localStorage for lastTheme
   ├─ renderThemes() - insert all 5 theme HTML to .container
   ├─ setTheme() - activate random theme (avoid last)
   ├─ Attach click listener to .theme-indicator
   ├─ Inject custom CSS if config.customCSS is set
   └─ Ready for user interaction
   ↓
User clicks .theme-indicator
   ↓
   ├─ Get current theme from body.className
   ├─ Get random different theme
   ├─ setTheme() - update body class, localStorage
   ├─ CSS: Hide all themes, show selected theme
   └─ localStorage: Save 'lastTheme' for next visit
```

### Apps Listing Page (apps/index.html)

```
Page Load
   ↓
HTML: <script src="apps-{hash}.js">
   ↓
apps/main.ts execution:
   ├─ Fetch apps.json data (hardcoded in build)
   ├─ Loop through apps array
   ├─ Generate card HTML for each:
   │  ├─ App icon emoji
   │  ├─ App name
   │  ├─ Description
   │  └─ Link to app path
   ├─ Insert cards into .apps-grid
   └─ Ready for user navigation
   ↓
User clicks app card
   ↓
   └─ Navigate to /apps/{app-id}/
```

### Lucky Wheel App (apps/lucky-wheel/index.html)

```
Page Load
   ↓
HTML: <canvas id="wheel-canvas">
      <button id="spin-btn">Spin</button>
   ↓
lucky-wheel/main.ts execution:
   ├─ Get canvas element
   ├─ Create LuckyWheel instance:
   │  ├─ Setup canvas (size, DPR)
   │  ├─ Load segments from localStorage (or default)
   │  └─ Initial draw()
   ├─ Attach click listener to spin button
   ├─ Set result callback (display modal)
   └─ Attach window resize listener
   ↓
User clicks spin button
   ↓
wheel.spin() animation loop:
   ├─ Check if already spinning (prevent double-spin)
   ├─ Start requestAnimationFrame loop
   ├─ Duration: 4 seconds
   ├─ Animation: ease-out-cubic easing
   ├─ Rotation: 5+ full revolutions + random
   ├─ Each frame: draw() with updated rotation
   ├─ On complete:
   │  ├─ Calculate winning segment
   │  ├─ Call onResult callback
   │  └─ Display result to user
   └─ User can spin again
   ↓
User can customize segments
   ├─ Input new segment labels
   ├─ Call wheel.setSegments()
   ├─ Save to localStorage
   └─ Persist for next visit
```

## Data Flow

### Theme Selection & Persistence

```
config.json (build-time)
   ├─ themes.enabled = ["terminal", "brutalist", "gradient", "glass", "neobrutalism"]
   ↓
vite.config.ts (html-transform plugin)
   └─ Injects config values into index.html
   ↓
main.ts (runtime)
   ├─ Read enabledThemes from config
   ├─ Read lastTheme from localStorage (if exists)
   ├─ Select random theme (different from last)
   ├─ Render all themes HTML
   ├─ Show selected theme via body.theme-{name} class
   ├─ Save selected to localStorage.lastTheme
   └─ On theme switch: repeat above
```

### Short Link Redirect Flow

```
User Request: https://khương.vn/github
   ↓
Cloudflare Pages
   ↓
functions/_middleware.ts
   ├─ Extract pathname: "github"
   ├─ Check redirects["github"]
   ├─ Found: "https://github.com/lamngockhuong"
   └─ Return 301 Permanent Redirect
   ↓
User Browser
   └─ Navigate to https://github.com/lamngockhuong
```

### SEO Metadata Injection

```
config.json
   ├─ seo.title
   ├─ seo.description
   ├─ seo.canonical
   ├─ seo.ogImage
   ├─ name
   └─ analytics.goatcounter
   ↓
vite.config.ts (html-transform plugin)
   ├─ Reads index.html
   ├─ Replaces %VITE_TITLE% with config.seo.title
   ├─ Replaces %VITE_DESCRIPTION% with config.seo.description
   ├─ Replaces %VITE_CANONICAL% with config.seo.canonical
   ├─ Replaces %VITE_OG_IMAGE% with config.seo.ogImage
   ├─ Replaces %VITE_NAME% with config.name
   ├─ Generates analytics script if goatcounter configured
   ├─ Replaces %VITE_ANALYTICS% with script tag
   └─ Writes final HTML
   ↓
dist/index.html (final)
   └─ Contains resolved SEO meta tags
```

## Component Interactions

```
┌─────────────────────┐
│   config.json       │
└─────────────────────┘
         │
         │ (build-time)
         ↓
┌─────────────────────┐         ┌──────────────────┐
│  config.ts          │────────→│  themes.ts       │
└─────────────────────┘         └──────────────────┘
         │                            │
         │                            │
         ↓                            ↓
┌─────────────────────┐         ┌──────────────────┐
│  main.ts            │────────→│  styles.css      │
└─────────────────────┘         │ (theme-specific) │
         │                       └──────────────────┘
         │                            │
         │                            │
         ↓                            ↓
┌─────────────────────┐         ┌──────────────────┐
│  index.html         │←────────│  icons.ts        │
└─────────────────────┘         └──────────────────┘

┌─────────────────────┐
│  apps.json          │
└─────────────────────┘
         │
         ↓
┌─────────────────────┐
│  apps/main.ts       │
└─────────────────────┘
         │
         ↓
┌─────────────────────┐
│  apps/index.html    │
└─────────────────────┘

┌─────────────────────┐
│  wheel.ts           │
└─────────────────────┘
         │
         ↓
┌─────────────────────┐
│ lucky-wheel/main.ts │
└─────────────────────┘
         │
         ↓
┌─────────────────────┐
│ lucky-wheel/        │
│ index.html          │
└─────────────────────┘

┌─────────────────────┐
│  redirects.ts       │
└─────────────────────┘
         │
         ↓
┌─────────────────────┐
│ _middleware.ts      │
└─────────────────────┘
         │
         ↓
┌─────────────────────┐
│ Cloudflare Pages    │
└─────────────────────┘
```

## Deployment Pipeline

```
Developer
   │
   ├─ Commit to main branch
   │
   ↓
GitHub Repository
   │
   ├─ Trigger GitHub Actions workflow
   │
   ↓
CI/CD Pipeline
   ├─ Checkout code
   ├─ Install dependencies (pnpm)
   ├─ Type check (tsc)
   ├─ Build project (vite build)
   ├─ Test build output
   │
   ↓
Cloudflare Pages
   ├─ Receive build artifacts (dist/)
   ├─ Deploy to edge locations
   ├─ Serve static from cache
   ├─ Process redirects via _middleware.ts
   │
   ↓
https://khương.vn
   └─ User gets cached response from nearest edge
```

## Performance Characteristics

### Asset Loading

| Asset Type | Size | Cached | TTL |
|-----------|------|--------|-----|
| index.html | ~2KB | No | 0 (revalidate) |
| app-*.js | ~20KB | Yes | 365 days |
| app-*.css | ~5KB | Yes | 365 days |
| /apps/index.html | ~2KB | No | 0 |
| /apps/lucky-wheel/ | ~3KB | No | 0 |
| Theme CSS | ~8KB | Yes | 365 days |

### Redirect Performance
- **Time to Redirect**: < 1ms (memory lookup)
- **Network**: Cloudflare edge (varies by location)
- **Cache**: N/A (always 301, not cached)

### Theme Switching
- **Operation**: DOM class toggle + localStorage write
- **Time**: < 5ms (synchronous)
- **Visual**: Instant (CSS cascade applies immediately)

### Lucky Wheel Animation
- **Frame Rate**: 60 FPS (requestAnimationFrame)
- **Duration**: 4 seconds
- **GPU**: Yes (transform via rotation)
- **Battery Impact**: Low (canvas batched redraws)

## Security Considerations

### Input Handling
- **config.json**: Consumed at build time (trusted source)
- **localStorage**: User-controlled, no security risk (theme preference)
- **User Input**: Lucky Wheel segments are local-only, no network exposure

### URL Redirects
- **Validation**: Explicit whitelist in `redirects.ts`
- **Protocol**: All redirects are https:// or mailto:
- **No**: User input in redirect target

### Content Security
- **No**: External scripts (except GoatCounter if configured)
- **No**: eval() or dynamic code execution
- **Inline**: SVG icons hardcoded (safe)
- **HTML**: All generated via string templates (no XSS vectors)

### Cloudflare Security
- **DDoS Protection**: Via Cloudflare infrastructure
- **HTTPS**: Automatic via Cloudflare Pages
- **Custom Domain**: khương.vn with TLS certificate

## Scalability

### Horizontal
- **Static Hosting**: No database/compute constraints
- **Edge Caching**: Cloudflare distributes to 200+ edge locations
- **Unlimited Concurrent**: Static files auto-scale

### Vertical
- **Bundle Size**: Currently ~50KB, can add more themes/apps
- **Page Count**: Multi-page build supports unlimited pages
- **Redirect Limit**: Redirect object can support 1000+ entries

### Data Limits
- **localStorage**: ~10MB per domain (browser-dependent)
- **config.json**: ~100KB practical limit (before build slowdown)
- **apps.json**: ~1000 apps before performance concern

## Monitoring & Observability

### Analytics
- **Provider**: GoatCounter (if configured)
- **Data**: Page views, referrers, session duration
- **Privacy**: No tracking cookies, no user identification

### Errors
- **Browser Console**: Errors logged for development
- **Canvas Context**: Error thrown if 2D context unavailable
- **localStorage**: Gracefully degraded if unavailable

### No**: Structured logging (static site limitation)
- **No**: Error aggregation service (would require backend)
- **No**: Performance monitoring (built-in browser performance API available)

## Future Architecture Considerations

### Database Integration
- **When**: If admin dashboard needed for redirect management
- **Option**: Cloudflare D1 (SQLite edge)
- **Impact**: Would require backend API endpoints

### Asset Serving
- **Current**: Static from Cloudflare
- **Future**: R2 (Cloudflare object storage) for large assets
- **Impact**: CDN-independent blob storage

### Image Optimization
- **Current**: Manual (public/ folder)
- **Future**: Cloudflare Image Resizing API
- **Impact**: Automatic format conversion & caching

### Database Redirects
- **Current**: Static file redirects.ts
- **Future**: Dynamic redirect management UI
- **Impact**: Real-time redirect updates without rebuild
