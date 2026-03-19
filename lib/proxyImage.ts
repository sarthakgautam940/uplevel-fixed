/**
 * Route all external palmettopoolsinc.com images through the Next.js
 * server-side proxy to bypass CORS / hotlink-protection on the
 * WordPress origin server.
 */
export function proxyImage(originalUrl: string): string {
  if (!originalUrl) return "";
  return `/api/image?url=${encodeURIComponent(originalUrl)}`;
}
