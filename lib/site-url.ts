/**
 * Canonical site URL for metadata, sitemap, and JSON-LD.
 */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  if (url) return url.replace(/\/$/, '')
  return 'http://localhost:3000'
}
