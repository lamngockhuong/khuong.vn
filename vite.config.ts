import { defineConfig } from 'vite'
import { resolve } from 'path'
import config from './config.json'

// Generate analytics script if configured
const analyticsScript = config.analytics.goatcounter
  ? `<script data-goatcounter="https://${config.analytics.goatcounter}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`
  : ''

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [
    // Replace placeholders with config values (only for main index)
    {
      name: 'html-transform',
      transformIndexHtml(html, ctx) {
        // Only transform main index.html with SEO placeholders
        if (ctx.filename.endsWith('src/index.html')) {
          return html
            .replace(/%VITE_TITLE%/g, config.seo.title)
            .replace(/%VITE_DESCRIPTION%/g, config.seo.description)
            .replace(/%VITE_NAME%/g, config.name)
            .replace(/%VITE_CANONICAL%/g, config.seo.canonical)
            .replace(/%VITE_OG_IMAGE%/g, config.seo.ogImage)
            .replace(/%VITE_ANALYTICS%/g, analyticsScript)
        }
        return html
      },
    },
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        apps: resolve(__dirname, 'src/apps/index.html'),
        luckyWheel: resolve(__dirname, 'src/apps/lucky-wheel/index.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})
