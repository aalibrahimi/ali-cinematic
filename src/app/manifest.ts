import type { MetadataRoute } from "next";

/**
 * PWA manifest — installable on iOS, macOS, Android, Chrome.
 *
 * Next.js App Router convention: this file at app/manifest.ts is
 * automatically served at /manifest.webmanifest. The browser sees it
 * via the auto-generated <link rel="manifest"> tag in <head>.
 *
 * Display mode "standalone" means: installed app opens in its own
 * window with no browser chrome. On iOS that requires `apple-touch-
 * icon` (handled via app/apple-icon.tsx) plus the apple-mobile-web-
 * app-capable meta tag (set in layout.tsx viewport).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ali Alibrahimi",
    short_name: "Ali",
    description:
      "Software designer and engineer. End-to-end builder of products and the systems that hold them up.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    orientation: "portrait-primary",
    categories: ["portfolio", "design", "engineering"],
    // Icons declared via app/icon.tsx + app/apple-icon.tsx — Next
    // generates entries for them automatically. Listing 192/512
    // here as backup for browsers that read the manifest before
    // the auto-generated <link>s.
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
