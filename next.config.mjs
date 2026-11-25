/** @type {import('next').NextConfig} */
const nextConfig = {
  // The reader became the front door; keep old résumé links working.
  async redirects() {
    return [{ source: "/profile", destination: "/", permanent: true }];
  },
  output: "export",
  // Folder-per-route in the export (/os/index.html) instead of flat files
  // (/os.html). Static hosts other than Vercel do not rewrite clean URLs to the
  // flat form, so every link on the reader — /os, /work/<slug>, /links — 404s
  // there. Vercel redirects the extensionless forms to the slashed ones.
  trailingSlash: true,
  images: { unoptimized: true },
  // Static export will fail on dynamic routes unless they opt into static behavior.
  // The OG image route is dynamic by default; mark it static so the export includes it.
  experimental: { optimizePackageImports: [] },
};
export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
