/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "motion", "lenis"],
  },
  images: {
    // Next 16+ requires explicit allowlisting of `quality` values
    // used in <Image quality={...} />. We bumped some to 90/95 for
    // case-study screenshots; default 75 stays for everything else.
    qualities: [75, 90, 95, 100],
  },
};

export default nextConfig;
