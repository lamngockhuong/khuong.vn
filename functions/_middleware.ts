import { redirects } from './redirects'

/**
 * Cloudflare Pages Middleware
 * Handles short link redirects before serving static files
 */
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url)
  const path = url.pathname.slice(1).toLowerCase() // Remove leading slash

  // Check if path matches a redirect
  const destination = redirects[path]
  if (destination) {
    return Response.redirect(destination, 301)
  }

  // No redirect - continue to static files
  return context.next()
}
