// vite.config.ts
import { defineConfig } from "file:///home/codegallantx/dev/web/nexa-elite-nexus/node_modules/vite/dist/node/index.js";
import react from "file:///home/codegallantx/dev/web/nexa-elite-nexus/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { componentTagger } from "file:///home/codegallantx/dev/web/nexa-elite-nexus/node_modules/lovable-tagger/dist/index.js";
import { VitePWA } from "file:///home/codegallantx/dev/web/nexa-elite-nexus/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "/home/codegallantx/dev/web/nexa-elite-nexus";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // 3MB limit
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
                // 30 Days
              }
            }
          }
        ]
      },
      manifest: {
        name: "Nexa Esports",
        short_name: "Nexa_Esports",
        description: "Nexa is a competitive clan-based esports platform that empowers gamers to join, manage, and dominate in tournaments. Track progress, build squads, and rise through the ranks in an immersive, mobile-ready experience.",
        start_url: "/dashboard",
        scope: "/",
        display: "standalone",
        background_color: "#0f0f0f",
        theme_color: "#18181b",
        orientation: "portrait",
        lang: "en",
        icons: [
          {
            src: "windows11/SmallTile.scale-100.png",
            sizes: "71x71"
          },
          {
            src: "windows11/SmallTile.scale-125.png",
            sizes: "89x89"
          },
          {
            src: "windows11/SmallTile.scale-150.png",
            sizes: "107x107"
          },
          {
            src: "windows11/SmallTile.scale-200.png",
            sizes: "142x142"
          },
          {
            src: "windows11/SmallTile.scale-400.png",
            sizes: "284x284"
          },
          {
            src: "windows11/Square150x150Logo.scale-100.png",
            sizes: "150x150"
          },
          {
            src: "windows11/Square150x150Logo.scale-125.png",
            sizes: "188x188"
          },
          {
            src: "windows11/Square150x150Logo.scale-150.png",
            sizes: "225x225"
          },
          {
            src: "windows11/Square150x150Logo.scale-200.png",
            sizes: "300x300"
          },
          {
            src: "windows11/Square150x150Logo.scale-400.png",
            sizes: "600x600"
          },
          {
            src: "windows11/Wide310x150Logo.scale-100.png",
            sizes: "310x150"
          },
          {
            src: "windows11/Wide310x150Logo.scale-125.png",
            sizes: "388x188"
          },
          {
            src: "windows11/Wide310x150Logo.scale-150.png",
            sizes: "465x225"
          },
          {
            src: "windows11/Wide310x150Logo.scale-200.png",
            sizes: "620x300"
          },
          {
            src: "windows11/Wide310x150Logo.scale-400.png",
            sizes: "1240x600"
          },
          {
            src: "windows11/LargeTile.scale-100.png",
            sizes: "310x310"
          },
          {
            src: "windows11/LargeTile.scale-125.png",
            sizes: "388x388"
          },
          {
            src: "windows11/LargeTile.scale-150.png",
            sizes: "465x465"
          },
          {
            src: "windows11/LargeTile.scale-200.png",
            sizes: "620x620"
          },
          {
            src: "windows11/LargeTile.scale-400.png",
            sizes: "1240x1240"
          },
          {
            src: "windows11/Square44x44Logo.scale-100.png",
            sizes: "44x44"
          },
          {
            src: "windows11/Square44x44Logo.scale-125.png",
            sizes: "55x55"
          },
          {
            src: "windows11/Square44x44Logo.scale-150.png",
            sizes: "66x66"
          },
          {
            src: "windows11/Square44x44Logo.scale-200.png",
            sizes: "88x88"
          },
          {
            src: "windows11/Square44x44Logo.scale-400.png",
            sizes: "176x176"
          },
          {
            src: "windows11/StoreLogo.scale-100.png",
            sizes: "50x50"
          },
          {
            src: "windows11/StoreLogo.scale-125.png",
            sizes: "63x63"
          },
          {
            src: "windows11/StoreLogo.scale-150.png",
            sizes: "75x75"
          },
          {
            src: "windows11/StoreLogo.scale-200.png",
            sizes: "100x100"
          },
          {
            src: "windows11/StoreLogo.scale-400.png",
            sizes: "200x200"
          },
          {
            src: "windows11/SplashScreen.scale-100.png",
            sizes: "620x300"
          },
          {
            src: "windows11/SplashScreen.scale-125.png",
            sizes: "775x375"
          },
          {
            src: "windows11/SplashScreen.scale-150.png",
            sizes: "930x450"
          },
          {
            src: "windows11/SplashScreen.scale-200.png",
            sizes: "1240x600"
          },
          {
            src: "windows11/SplashScreen.scale-400.png",
            sizes: "2480x1200"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-16.png",
            sizes: "16x16"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-20.png",
            sizes: "20x20"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-24.png",
            sizes: "24x24"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-30.png",
            sizes: "30x30"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-32.png",
            sizes: "32x32"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-36.png",
            sizes: "36x36"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-40.png",
            sizes: "40x40"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-44.png",
            sizes: "44x44"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-48.png",
            sizes: "48x48"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-60.png",
            sizes: "60x60"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-64.png",
            sizes: "64x64"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-72.png",
            sizes: "72x72"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-80.png",
            sizes: "80x80"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-96.png",
            sizes: "96x96"
          },
          {
            src: "windows11/Square44x44Logo.targetsize-256.png",
            sizes: "256x256"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
            sizes: "16x16"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
            sizes: "20x20"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
            sizes: "24x24"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
            sizes: "30x30"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
            sizes: "32x32"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
            sizes: "36x36"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
            sizes: "40x40"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
            sizes: "44x44"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
            sizes: "48x48"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
            sizes: "60x60"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
            sizes: "64x64"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
            sizes: "72x72"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
            sizes: "80x80"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
            sizes: "96x96"
          },
          {
            src: "windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
            sizes: "256x256"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
            sizes: "16x16"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
            sizes: "20x20"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
            sizes: "24x24"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
            sizes: "30x30"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
            sizes: "32x32"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
            sizes: "36x36"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
            sizes: "40x40"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
            sizes: "44x44"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
            sizes: "48x48"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
            sizes: "60x60"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
            sizes: "64x64"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
            sizes: "72x72"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
            sizes: "80x80"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
            sizes: "96x96"
          },
          {
            src: "windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
            sizes: "256x256"
          },
          {
            src: "android/android-launchericon-512-512.png",
            sizes: "512x512"
          },
          {
            src: "android/android-launchericon-192-192.png",
            sizes: "192x192"
          },
          {
            src: "android/android-launchericon-144-144.png",
            sizes: "144x144"
          },
          {
            src: "android/android-launchericon-96-96.png",
            sizes: "96x96"
          },
          {
            src: "android/android-launchericon-72-72.png",
            sizes: "72x72"
          },
          {
            src: "android/android-launchericon-48-48.png",
            sizes: "48x48"
          },
          {
            src: "ios/16.png",
            sizes: "16x16"
          },
          {
            src: "ios/20.png",
            sizes: "20x20"
          },
          {
            src: "ios/29.png",
            sizes: "29x29"
          },
          {
            src: "ios/32.png",
            sizes: "32x32"
          },
          {
            src: "ios/40.png",
            sizes: "40x40"
          },
          {
            src: "ios/50.png",
            sizes: "50x50"
          },
          {
            src: "ios/57.png",
            sizes: "57x57"
          },
          {
            src: "ios/58.png",
            sizes: "58x58"
          },
          {
            src: "ios/60.png",
            sizes: "60x60"
          },
          {
            src: "ios/64.png",
            sizes: "64x64"
          },
          {
            src: "ios/72.png",
            sizes: "72x72"
          },
          {
            src: "ios/76.png",
            sizes: "76x76"
          },
          {
            src: "ios/80.png",
            sizes: "80x80"
          },
          {
            src: "ios/87.png",
            sizes: "87x87"
          },
          {
            src: "ios/100.png",
            sizes: "100x100"
          },
          {
            src: "ios/114.png",
            sizes: "114x114"
          },
          {
            src: "ios/120.png",
            sizes: "120x120"
          },
          {
            src: "ios/128.png",
            sizes: "128x128"
          },
          {
            src: "ios/144.png",
            sizes: "144x144"
          },
          {
            src: "ios/152.png",
            sizes: "152x152"
          },
          {
            src: "ios/167.png",
            sizes: "167x167"
          },
          {
            src: "ios/180.png",
            sizes: "180x180"
          },
          {
            src: "ios/192.png",
            sizes: "192x192"
          },
          {
            src: "ios/256.png",
            sizes: "256x256"
          },
          {
            src: "ios/512.png",
            sizes: "512x512"
          },
          {
            src: "ios/1024.png",
            sizes: "1024x1024"
          }
        ],
        screenshots: [
          {
            src: "/nexa-logo.jpg",
            sizes: "640x1136",
            type: "image/png",
            label: "Clan dashboard"
          },
          {
            src: "/thumbnail.png",
            sizes: "640x1136",
            type: "image/png",
            label: "Player stats and performance"
          }
        ]
      },
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "nexa-logo.jpg"
      ]
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9jb2RlZ2FsbGFudHgvZGV2L3dlYi9uZXhhLWVsaXRlLW5leHVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9jb2RlZ2FsbGFudHgvZGV2L3dlYi9uZXhhLWVsaXRlLW5leHVzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2NvZGVnYWxsYW50eC9kZXYvd2ViL25leGEtZWxpdGUtbmV4dXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXG4gICAgICBkZXZPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMyAqIDEwMjQgKiAxMDI0LCAvLyAzTUIgbGltaXRcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnfSddLFxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvLipcXC4ocG5nfGpwZ3xqcGVnfHN2Z3xnaWZ8d2VicCkkLyxcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwiaW1hZ2VzXCIsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMDAsXG4gICAgICAgICAgICAgICAgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzAsIC8vIDMwIERheXNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiBcIk5leGEgRXNwb3J0c1wiLFxuICAgICAgICBzaG9ydF9uYW1lOiBcIk5leGFfRXNwb3J0c1wiLFxuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIk5leGEgaXMgYSBjb21wZXRpdGl2ZSBjbGFuLWJhc2VkIGVzcG9ydHMgcGxhdGZvcm0gdGhhdCBlbXBvd2VycyBnYW1lcnMgdG8gam9pbiwgbWFuYWdlLCBhbmQgZG9taW5hdGUgaW4gdG91cm5hbWVudHMuIFRyYWNrIHByb2dyZXNzLCBidWlsZCBzcXVhZHMsIGFuZCByaXNlIHRocm91Z2ggdGhlIHJhbmtzIGluIGFuIGltbWVyc2l2ZSwgbW9iaWxlLXJlYWR5IGV4cGVyaWVuY2UuXCIsXG4gICAgICAgIHN0YXJ0X3VybDogXCIvZGFzaGJvYXJkXCIsXG4gICAgICAgIHNjb3BlOiBcIi9cIixcbiAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiIzBmMGYwZlwiLFxuICAgICAgICB0aGVtZV9jb2xvcjogXCIjMTgxODFiXCIsXG4gICAgICAgIG9yaWVudGF0aW9uOiBcInBvcnRyYWl0XCIsXG4gICAgICAgIGxhbmc6IFwiZW5cIixcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NtYWxsVGlsZS5zY2FsZS0xMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3MXg3MVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TbWFsbFRpbGUuc2NhbGUtMTI1LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiODl4ODlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU21hbGxUaWxlLnNjYWxlLTE1MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEwN3gxMDdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU21hbGxUaWxlLnNjYWxlLTIwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE0MngxNDJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU21hbGxUaWxlLnNjYWxlLTQwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI4NHgyODRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlMTUweDE1MExvZ28uc2NhbGUtMTAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTUweDE1MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmUxNTB4MTUwTG9nby5zY2FsZS0xMjUucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxODh4MTg4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTE1MHgxNTBMb2dvLnNjYWxlLTE1MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjIyNXgyMjVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlMTUweDE1MExvZ28uc2NhbGUtMjAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzAweDMwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmUxNTB4MTUwTG9nby5zY2FsZS00MDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2MDB4NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS0xMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMTB4MTUwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS0xMjUucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzODh4MTg4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS0xNTAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0NjV4MjI1XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS0yMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2MjB4MzAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1dpZGUzMTB4MTUwTG9nby5zY2FsZS00MDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMjQweDYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtMTAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzEweDMxMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtMTI1LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzg4eDM4OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtMTUwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDY1eDQ2NVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtMjAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjIweDYyMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9MYXJnZVRpbGUuc2NhbGUtNDAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTI0MHgxMjQwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5zY2FsZS0xMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0NHg0NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uc2NhbGUtMTI1LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTV4NTVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnNjYWxlLTE1MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjY2eDY2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5zY2FsZS0yMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI4OHg4OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uc2NhbGUtNDAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTc2eDE3NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TdG9yZUxvZ28uc2NhbGUtMTAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTB4NTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3RvcmVMb2dvLnNjYWxlLTEyNS5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYzeDYzXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1N0b3JlTG9nby5zY2FsZS0xNTAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3NXg3NVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TdG9yZUxvZ28uc2NhbGUtMjAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTAweDEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TdG9yZUxvZ28uc2NhbGUtNDAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjAweDIwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtMTAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjIweDMwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtMTI1LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzc1eDM3NVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtMTUwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiOTMweDQ1MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtMjAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTI0MHg2MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3BsYXNoU2NyZWVuLnNjYWxlLTQwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI0ODB4MTIwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0xNi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE2eDE2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTIwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjB4MjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMjQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyNHgyNFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0zMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMweDMwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTMyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzJ4MzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMzYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzNngzNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS00MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQweDQwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTQ0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDR4NDRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtNDgucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0OHg0OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS02MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYweDYwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTY0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjR4NjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtNzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3Mng3MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS04MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjgweDgwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTk2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiOTZ4OTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMjU2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjU2eDI1NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTE2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTZ4MTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0yMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjIweDIwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMjQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyNHgyNFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTMwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzB4MzBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0zMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMyeDMyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMzYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzNngzNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTQwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDB4NDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS00NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ0eDQ0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtNDgucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0OHg0OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTYwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjB4NjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS02NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjY0eDY0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtNzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3Mng3MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTgwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiODB4ODBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS05Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjk2eDk2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMjU2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjU2eDI1NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNngxNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyMHgyMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMjQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyNHgyNFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMzAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMHgzMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMngzMlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMzYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzNngzNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0MHg0MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNDQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0NHg0NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNDgucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0OHg0OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2MHg2MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNjQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2NHg2NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtNzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3Mng3MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtODAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI4MHg4MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtOTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI5Nng5NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS1saWdodHVucGxhdGVkX3RhcmdldHNpemUtMjU2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjU2eDI1NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImFuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tNTEyLTUxMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJhbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTE5Mi0xOTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi0xNDQtMTQ0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTQ0eDE0NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImFuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tOTYtOTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI5Nng5NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImFuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tNzItNzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3Mng3MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImFuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tNDgtNDgucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0OHg0OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xNi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE2eDE2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzIwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjB4MjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMjkucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyOXgyOVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8zMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMyeDMyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzQwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDB4NDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNTAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1MHg1MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy81Ny5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjU3eDU3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzU4LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTh4NThcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2MHg2MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy82NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjY0eDY0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzcyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzJ4NzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNzYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3Nng3NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy84MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjgweDgwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzg3LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiODd4ODdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTAweDEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xMTQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMTR4MTE0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzEyMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEyMHgxMjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTI4LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTI4eDEyOFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xNDQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNDR4MTQ0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzE1Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE1MngxNTJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTY3LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTY3eDE2N1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xODAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxODB4MTgwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzE5Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMjU2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjU2eDI1NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy81MTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzEwMjQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMDI0eDEwMjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBzY3JlZW5zaG90czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCIvbmV4YS1sb2dvLmpwZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjQweDExMzZcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICBsYWJlbDogXCJDbGFuIGRhc2hib2FyZFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIi90aHVtYm5haWwucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2NDB4MTEzNlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICAgIGxhYmVsOiBcIlBsYXllciBzdGF0cyBhbmQgcGVyZm9ybWFuY2VcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcbiAgICAgICAgXCJmYXZpY29uLmljb1wiLFxuICAgICAgICBcInJvYm90cy50eHRcIixcbiAgICAgICAgXCJuZXhhLWxvZ28uanBnXCIsXG4gICAgICBdLFxuICAgIH0pLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSkpOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVQsU0FBUyxvQkFBb0I7QUFDaFYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUNoQyxTQUFTLGVBQWU7QUFKeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsSUFDMUMsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsWUFBWTtBQUFBLFFBQ1YsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLCtCQUErQixJQUFJLE9BQU87QUFBQTtBQUFBLFFBQzFDLGNBQWMsQ0FBQyxnQ0FBZ0M7QUFBQSxRQUMvQyxnQkFBZ0I7QUFBQSxVQUNkO0FBQUEsWUFDRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUCxXQUFXO0FBQUEsY0FDWCxZQUFZO0FBQUEsZ0JBQ1YsWUFBWTtBQUFBLGdCQUNaLGVBQWUsS0FBSyxLQUFLLEtBQUs7QUFBQTtBQUFBLGNBQ2hDO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFDRTtBQUFBLFFBQ0YsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2IsTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsYUFBYTtBQUFBLFVBQ1g7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sT0FBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNILEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
