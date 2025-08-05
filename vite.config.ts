import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Nexa Esports",
        short_name: "Nexa",
        description:
          "Nexa is a competitive clan-based esports platform that empowers gamers to join, manage, and dominate in tournaments. Track progress, build squads, and rise through the ranks in an immersive, mobile-ready experience.",
        start_url: "/auth/login",
        scope: "/",
        display: "standalone",
        background_color: "#0f0f0f",
        theme_color: "#18181b",
        orientation: "portrait",
        lang: "en",
        icons: [
          {
            // src: "/icon-192.png",
            src: "/nexa-logo.jpg",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            // src: "/thumbnail.png",
            src: "/nexa-logo.jpg",
            sizes: "640x1136",
            type: "image/png",
            label: "Clan dashboard",
          },
          {
            src: "/thumbnail.png",
            sizes: "640x1136",
            type: "image/png",
            label: "Player stats and performance",
          },
        ],
      },
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
        "apple-splash-640x1136.png",
        "apple-splash-750x1334.png",
        "apple-splash-828x1792.png",
        "apple-splash-1125x2436.png",
        "apple-splash-1242x2208.png",
        "apple-splash-1242x2688.png",
        "apple-splash-1536x2048.png",
        "apple-splash-1668x2224.png",
        "apple-splash-1668x2388.png",
        "apple-splash-2048x2732.png",
      ],
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
