import { redirects } from "./redirects";

// Base domains (IDN and punycode versions)
const BASE_DOMAINS = ["khương.vn", "xn--khng-mgb3g.vn"];

/**
 * Extract subdomain from hostname
 * e.g., "github.khương.vn" → "github", "khương.vn" → null
 */
function getSubdomain(hostname: string): string | null {
  const lowerHost = hostname.toLowerCase();
  for (const base of BASE_DOMAINS) {
    if (lowerHost === base || lowerHost === `www.${base}`) {
      return null; // Main domain, no subdomain
    }
    if (lowerHost.endsWith(`.${base}`)) {
      return lowerHost.slice(0, -(base.length + 1)); // Remove ".base"
    }
  }
  return null;
}

/**
 * Cloudflare Pages Middleware
 * Handles short link redirects via subdomain or path
 * Examples:
 *   - github.khương.vn → https://github.com/lamngockhuong
 *   - khương.vn/github → https://github.com/lamngockhuong
 */
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // Check subdomain first (e.g., github.khương.vn)
  const subdomain = getSubdomain(url.hostname);
  if (subdomain && redirects[subdomain]) {
    return Response.redirect(redirects[subdomain], 301);
  }

  // Fall back to path-based redirect (e.g., khương.vn/github)
  const path = url.pathname.slice(1).toLowerCase();
  if (path && redirects[path]) {
    return Response.redirect(redirects[path], 301);
  }

  // No redirect - continue to static files
  return context.next();
};
