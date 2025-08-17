// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "/home/project";
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
            // src: "/thumbnail.png",
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
        // "apple-touch-icon.png",
        // "apple-splash-640x1136.png",
        // "apple-splash-750x1334.png",
        // "apple-splash-828x1792.png",
        // "apple-splash-1125x2436.png",
        // "apple-splash-1242x2208.png",
        // "apple-splash-1242x2688.png",
        // "apple-splash-1536x2048.png",
        // "apple-splash-1668x2224.png",
        // "apple-splash-1668x2388.png",
        // "apple-splash-2048x2732.png",
        "nexa-logo.jpg"
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
                maxAgeSeconds: 60 * 60 * 24 * 30
                // 30 Days
              }
            }
          }
        ]
      }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1wd2FcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXG4gICAgICBkZXZPcHRpb25zOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogXCJOZXhhIEVzcG9ydHNcIixcbiAgICAgICAgc2hvcnRfbmFtZTogXCJOZXhhX0VzcG9ydHNcIixcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJOZXhhIGlzIGEgY29tcGV0aXRpdmUgY2xhbi1iYXNlZCBlc3BvcnRzIHBsYXRmb3JtIHRoYXQgZW1wb3dlcnMgZ2FtZXJzIHRvIGpvaW4sIG1hbmFnZSwgYW5kIGRvbWluYXRlIGluIHRvdXJuYW1lbnRzLiBUcmFjayBwcm9ncmVzcywgYnVpbGQgc3F1YWRzLCBhbmQgcmlzZSB0aHJvdWdoIHRoZSByYW5rcyBpbiBhbiBpbW1lcnNpdmUsIG1vYmlsZS1yZWFkeSBleHBlcmllbmNlLlwiLFxuICAgICAgICBzdGFydF91cmw6IFwiL2Rhc2hib2FyZFwiLFxuICAgICAgICBzY29wZTogXCIvXCIsXG4gICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiMwZjBmMGZcIixcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiIzE4MTgxYlwiLFxuICAgICAgICBvcmllbnRhdGlvbjogXCJwb3J0cmFpdFwiLFxuICAgICAgICBsYW5nOiBcImVuXCIsXG4gICAgICAgIGljb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TbWFsbFRpbGUuc2NhbGUtMTAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzF4NzFcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU21hbGxUaWxlLnNjYWxlLTEyNS5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjg5eDg5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NtYWxsVGlsZS5zY2FsZS0xNTAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMDd4MTA3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NtYWxsVGlsZS5zY2FsZS0yMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNDJ4MTQyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NtYWxsVGlsZS5zY2FsZS00MDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyODR4Mjg0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTE1MHgxNTBMb2dvLnNjYWxlLTEwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE1MHgxNTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlMTUweDE1MExvZ28uc2NhbGUtMTI1LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTg4eDE4OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmUxNTB4MTUwTG9nby5zY2FsZS0xNTAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyMjV4MjI1XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTE1MHgxNTBMb2dvLnNjYWxlLTIwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMwMHgzMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlMTUweDE1MExvZ28uc2NhbGUtNDAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjAweDYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9XaWRlMzEweDE1MExvZ28uc2NhbGUtMTAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzEweDE1MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9XaWRlMzEweDE1MExvZ28uc2NhbGUtMTI1LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzg4eDE4OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9XaWRlMzEweDE1MExvZ28uc2NhbGUtMTUwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDY1eDIyNVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9XaWRlMzEweDE1MExvZ28uc2NhbGUtMjAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjIweDMwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9XaWRlMzEweDE1MExvZ28uc2NhbGUtNDAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTI0MHg2MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvTGFyZ2VUaWxlLnNjYWxlLTEwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMxMHgzMTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvTGFyZ2VUaWxlLnNjYWxlLTEyNS5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjM4OHgzODhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvTGFyZ2VUaWxlLnNjYWxlLTE1MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ2NXg0NjVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvTGFyZ2VUaWxlLnNjYWxlLTIwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYyMHg2MjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvTGFyZ2VUaWxlLnNjYWxlLTQwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEyNDB4MTI0MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uc2NhbGUtMTAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDR4NDRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnNjYWxlLTEyNS5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjU1eDU1XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5zY2FsZS0xNTAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2Nng2NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uc2NhbGUtMjAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiODh4ODhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnNjYWxlLTQwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE3NngxNzZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3RvcmVMb2dvLnNjYWxlLTEwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUweDUwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1N0b3JlTG9nby5zY2FsZS0xMjUucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2M3g2M1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TdG9yZUxvZ28uc2NhbGUtMTUwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzV4NzVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3RvcmVMb2dvLnNjYWxlLTIwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEwMHgxMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3RvcmVMb2dvLnNjYWxlLTQwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjIwMHgyMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3BsYXNoU2NyZWVuLnNjYWxlLTEwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYyMHgzMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3BsYXNoU2NyZWVuLnNjYWxlLTEyNS5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjc3NXgzNzVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3BsYXNoU2NyZWVuLnNjYWxlLTE1MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjkzMHg0NTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3BsYXNoU2NyZWVuLnNjYWxlLTIwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEyNDB4NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NwbGFzaFNjcmVlbi5zY2FsZS00MDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyNDgweDEyMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNngxNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0yMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjIweDIwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTI0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjR4MjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMzAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMHgzMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0zMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMyeDMyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTM2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzZ4MzZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtNDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0MHg0MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS00NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ0eDQ0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTQ4LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDh4NDhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtNjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2MHg2MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS02NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjY0eDY0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTcyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzJ4NzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtODAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI4MHg4MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS05Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjk2eDk2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTI1Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI1NngyNTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0xNi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE2eDE2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyMHgyMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTI0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjR4MjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0zMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMweDMwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMngzMlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTM2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzZ4MzZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS00MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQweDQwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtNDQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0NHg0NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTQ4LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDh4NDhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS02MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYweDYwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtNjQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2NHg2NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTcyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzJ4NzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS04MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjgweDgwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtOTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI5Nng5NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTI1Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI1NngyNTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTE2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTZ4MTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTIwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjB4MjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTI0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjR4MjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTMwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzB4MzBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTMyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzJ4MzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTM2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzZ4MzZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTQwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDB4NDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTQ0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDR4NDRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTQ4LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDh4NDhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTYwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjB4NjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTY0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjR4NjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTcyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzJ4NzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTgwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiODB4ODBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTk2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiOTZ4OTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tbGlnaHR1bnBsYXRlZF90YXJnZXRzaXplLTI1Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI1NngyNTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJhbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTUxMi01MTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1MTJ4NTEyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi0xOTItMTkyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImFuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tMTQ0LTE0NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE0NHgxNDRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJhbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTk2LTk2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiOTZ4OTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJhbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTcyLTcyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzJ4NzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJhbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTQ4LTQ4LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDh4NDhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNngxNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8yMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjIweDIwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzI5LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjl4MjlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMngzMlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy80MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQweDQwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzUwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTB4NTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNTcucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1N3g1N1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy81OC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjU4eDU4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzYwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjB4NjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNjQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2NHg2NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy83Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjcyeDcyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzc2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNzZ4NzZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvODAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI4MHg4MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy84Ny5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjg3eDg3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzEwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEwMHgxMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTE0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTE0eDExNFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xMjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMjB4MTIwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzEyOC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEyOHgxMjhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTQ0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTQ0eDE0NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xNTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNTJ4MTUyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzE2Ny5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE2N3gxNjdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTgwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTgweDE4MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xOTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzI1Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI1NngyNTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNTEyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xMDI0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTAyNHgxMDI0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgc2NyZWVuc2hvdHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBzcmM6IFwiL3RodW1ibmFpbC5wbmdcIixcbiAgICAgICAgICAgIHNyYzogXCIvbmV4YS1sb2dvLmpwZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjQweDExMzZcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICBsYWJlbDogXCJDbGFuIGRhc2hib2FyZFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIi90aHVtYm5haWwucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2NDB4MTEzNlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIixcbiAgICAgICAgICAgIGxhYmVsOiBcIlBsYXllciBzdGF0cyBhbmQgcGVyZm9ybWFuY2VcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcbiAgICAgICAgXCJmYXZpY29uLmljb1wiLFxuICAgICAgICBcInJvYm90cy50eHRcIixcbiAgICAgICAgLy8gXCJhcHBsZS10b3VjaC1pY29uLnBuZ1wiLFxuICAgICAgICAvLyBcImFwcGxlLXNwbGFzaC02NDB4MTEzNi5wbmdcIixcbiAgICAgICAgLy8gXCJhcHBsZS1zcGxhc2gtNzUweDEzMzQucG5nXCIsXG4gICAgICAgIC8vIFwiYXBwbGUtc3BsYXNoLTgyOHgxNzkyLnBuZ1wiLFxuICAgICAgICAvLyBcImFwcGxlLXNwbGFzaC0xMTI1eDI0MzYucG5nXCIsXG4gICAgICAgIC8vIFwiYXBwbGUtc3BsYXNoLTEyNDJ4MjIwOC5wbmdcIixcbiAgICAgICAgLy8gXCJhcHBsZS1zcGxhc2gtMTI0MngyNjg4LnBuZ1wiLFxuICAgICAgICAvLyBcImFwcGxlLXNwbGFzaC0xNTM2eDIwNDgucG5nXCIsXG4gICAgICAgIC8vIFwiYXBwbGUtc3BsYXNoLTE2Njh4MjIyNC5wbmdcIixcbiAgICAgICAgLy8gXCJhcHBsZS1zcGxhc2gtMTY2OHgyMzg4LnBuZ1wiLFxuICAgICAgICAvLyBcImFwcGxlLXNwbGFzaC0yMDQ4eDI3MzIucG5nXCIsXG4gICAgICAgIFwibmV4YS1sb2dvLmpwZ1wiLFxuICAgICAgXSxcbiAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcLy4qXFwuKHBuZ3xqcGd8anBlZ3xzdmd8Z2lmfHdlYnApJC8sXG4gICAgICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcImltYWdlc1wiLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgbWF4RW50cmllczogMTAwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDMwLCAvLyAzMCBEYXlzXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pLFxuICBdLmZpbHRlcihCb29sZWFuKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBQ2hDLFNBQVMsZUFBZTtBQUp4QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUMxQyxRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxZQUFZO0FBQUEsUUFDVixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFDRTtBQUFBLFFBQ0YsV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1Qsa0JBQWtCO0FBQUEsUUFDbEIsYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2IsTUFBTTtBQUFBLFFBQ04sT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLFFBQ0EsYUFBYTtBQUFBLFVBQ1g7QUFBQTtBQUFBLFlBRUUsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsWUFDTixPQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFZQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQLGdCQUFnQjtBQUFBLFVBQ2Q7QUFBQSxZQUNFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxjQUNYLFlBQVk7QUFBQSxnQkFDVixZQUFZO0FBQUEsZ0JBQ1osZUFBZSxLQUFLLEtBQUssS0FBSztBQUFBO0FBQUEsY0FDaEM7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSCxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
