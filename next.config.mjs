/** @type {import('next').NextConfig} */
const nextConfig = {
  // The reader became the front door; keep old résumé links working.
  async redirects() {
    return [{ source: "/profile", destination: "/", permanent: true }];
  },
};
export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
