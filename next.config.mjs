/** @type {import('next').NextConfig} */
const nextConfig = {
  // The reader became the front door; keep old résumé links working.
  async redirects() {
    return [{ source: "/profile", destination: "/", permanent: true }];
  },
  output: "export",
  images: { unoptimized: true },
  // Static export will fail on dynamic routes unless they opt into static behavior.
  // The OG image route is dynamic by default; mark it static so the export includes it.
  experimental: { optimizePackageImports: [] },
};
export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
