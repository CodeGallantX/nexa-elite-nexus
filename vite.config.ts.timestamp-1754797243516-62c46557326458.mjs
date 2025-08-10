// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6IFwiTmV4YSBFc3BvcnRzXCIsXG4gICAgICAgIHNob3J0X25hbWU6IFwiTmV4YV9Fc3BvcnRzXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiTmV4YSBpcyBhIGNvbXBldGl0aXZlIGNsYW4tYmFzZWQgZXNwb3J0cyBwbGF0Zm9ybSB0aGF0IGVtcG93ZXJzIGdhbWVycyB0byBqb2luLCBtYW5hZ2UsIGFuZCBkb21pbmF0ZSBpbiB0b3VybmFtZW50cy4gVHJhY2sgcHJvZ3Jlc3MsIGJ1aWxkIHNxdWFkcywgYW5kIHJpc2UgdGhyb3VnaCB0aGUgcmFua3MgaW4gYW4gaW1tZXJzaXZlLCBtb2JpbGUtcmVhZHkgZXhwZXJpZW5jZS5cIixcbiAgICAgICAgc3RhcnRfdXJsOiBcIi9kYXNoYm9hcmRcIixcbiAgICAgICAgc2NvcGU6IFwiL1wiLFxuICAgICAgICBkaXNwbGF5OiBcInN0YW5kYWxvbmVcIixcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjMGYwZjBmXCIsXG4gICAgICAgIHRoZW1lX2NvbG9yOiBcIiMxODE4MWJcIixcbiAgICAgICAgb3JpZW50YXRpb246IFwicG9ydHJhaXRcIixcbiAgICAgICAgbGFuZzogXCJlblwiLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU21hbGxUaWxlLnNjYWxlLTEwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjcxeDcxXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NtYWxsVGlsZS5zY2FsZS0xMjUucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI4OXg4OVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TbWFsbFRpbGUuc2NhbGUtMTUwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTA3eDEwN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TbWFsbFRpbGUuc2NhbGUtMjAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTQyeDE0MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TbWFsbFRpbGUuc2NhbGUtNDAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjg0eDI4NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmUxNTB4MTUwTG9nby5zY2FsZS0xMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNTB4MTUwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTE1MHgxNTBMb2dvLnNjYWxlLTEyNS5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE4OHgxODhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlMTUweDE1MExvZ28uc2NhbGUtMTUwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjI1eDIyNVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmUxNTB4MTUwTG9nby5zY2FsZS0yMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMDB4MzAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTE1MHgxNTBMb2dvLnNjYWxlLTQwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYwMHg2MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvV2lkZTMxMHgxNTBMb2dvLnNjYWxlLTEwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMxMHgxNTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvV2lkZTMxMHgxNTBMb2dvLnNjYWxlLTEyNS5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjM4OHgxODhcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvV2lkZTMxMHgxNTBMb2dvLnNjYWxlLTE1MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ2NXgyMjVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvV2lkZTMxMHgxNTBMb2dvLnNjYWxlLTIwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYyMHgzMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvV2lkZTMxMHgxNTBMb2dvLnNjYWxlLTQwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEyNDB4NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL0xhcmdlVGlsZS5zY2FsZS0xMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMTB4MzEwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL0xhcmdlVGlsZS5zY2FsZS0xMjUucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzODh4Mzg4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL0xhcmdlVGlsZS5zY2FsZS0xNTAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0NjV4NDY1XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL0xhcmdlVGlsZS5zY2FsZS0yMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2MjB4NjIwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL0xhcmdlVGlsZS5zY2FsZS00MDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMjQweDEyNDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnNjYWxlLTEwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ0eDQ0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5zY2FsZS0xMjUucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1NXg1NVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uc2NhbGUtMTUwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjZ4NjZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnNjYWxlLTIwMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjg4eDg4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5zY2FsZS00MDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNzZ4MTc2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1N0b3JlTG9nby5zY2FsZS0xMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1MHg1MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TdG9yZUxvZ28uc2NhbGUtMTI1LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjN4NjNcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3RvcmVMb2dvLnNjYWxlLTE1MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjc1eDc1XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1N0b3JlTG9nby5zY2FsZS0yMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMDB4MTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1N0b3JlTG9nby5zY2FsZS00MDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyMDB4MjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NwbGFzaFNjcmVlbi5zY2FsZS0xMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2MjB4MzAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NwbGFzaFNjcmVlbi5zY2FsZS0xMjUucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3NzV4Mzc1XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NwbGFzaFNjcmVlbi5zY2FsZS0xNTAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI5MzB4NDUwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NwbGFzaFNjcmVlbi5zY2FsZS0yMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMjQweDYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcGxhc2hTY3JlZW4uc2NhbGUtNDAwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjQ4MHgxMjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTE2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTZ4MTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyMHgyMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0yNC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI0eDI0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTMwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzB4MzBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtMzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMngzMlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0zNi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjM2eDM2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTQwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDB4NDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtNDQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0NHg0NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS00OC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ4eDQ4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTYwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjB4NjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtNjQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2NHg2NFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS03Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjcyeDcyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby50YXJnZXRzaXplLTgwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiODB4ODBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLnRhcmdldHNpemUtOTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI5Nng5NlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28udGFyZ2V0c2l6ZS0yNTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyNTZ4MjU2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNngxNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTIwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjB4MjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0yNC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI0eDI0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtMzAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIzMHgzMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTMyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzJ4MzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0zNi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjM2eDM2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtNDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0MHg0MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTQ0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNDR4NDRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS00OC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ4eDQ4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtNjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI2MHg2MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTY0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjR4NjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS03Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjcyeDcyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLXVucGxhdGVkX3RhcmdldHNpemUtODAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI4MHg4MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIndpbmRvd3MxMS9TcXVhcmU0NHg0NExvZ28uYWx0Zm9ybS11bnBsYXRlZF90YXJnZXRzaXplLTk2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiOTZ4OTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJ3aW5kb3dzMTEvU3F1YXJlNDR4NDRMb2dvLmFsdGZvcm0tdW5wbGF0ZWRfdGFyZ2V0c2l6ZS0yNTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyNTZ4MjU2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS0xNi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE2eDE2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS0yMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjIweDIwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS0yNC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI0eDI0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS0zMC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMweDMwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS0zMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjMyeDMyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS0zNi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjM2eDM2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS00MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQweDQwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS00NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ0eDQ0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS00OC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ4eDQ4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS02MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYweDYwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS02NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjY0eDY0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS03Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjcyeDcyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS04MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjgweDgwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS05Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjk2eDk2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwid2luZG93czExL1NxdWFyZTQ0eDQ0TG9nby5hbHRmb3JtLWxpZ2h0dW5wbGF0ZWRfdGFyZ2V0c2l6ZS0yNTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyNTZ4MjU2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi01MTItNTEyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTEyeDUxMlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImFuZHJvaWQvYW5kcm9pZC1sYXVuY2hlcmljb24tMTkyLTE5Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE5MngxOTJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJhbmRyb2lkL2FuZHJvaWQtbGF1bmNoZXJpY29uLTE0NC0xNDQucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNDR4MTQ0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi05Ni05Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjk2eDk2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi03Mi03Mi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjcyeDcyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiYW5kcm9pZC9hbmRyb2lkLWxhdW5jaGVyaWNvbi00OC00OC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjQ4eDQ4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzE2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTZ4MTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMjAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyMHgyMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8yOS5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjI5eDI5XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzMyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMzJ4MzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI0MHg0MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy81MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUweDUwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzU3LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNTd4NTdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNTgucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI1OHg1OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy82MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjYweDYwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzY0LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjR4NjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvNzIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI3Mng3MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy83Ni5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjc2eDc2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzgwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiODB4ODBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvODcucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCI4N3g4N1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xMDAucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMDB4MTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzExNC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjExNHgxMTRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTIwLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTIweDEyMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xMjgucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxMjh4MTI4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzE0NC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE0NHgxNDRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTUyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTUyeDE1MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8xNjcucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxNjd4MTY3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzE4MC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjE4MHgxODBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTkyLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcImlvcy8yNTYucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIyNTZ4MjU2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiaW9zLzUxMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJpb3MvMTAyNC5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjEwMjR4MTAyNFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHNjcmVlbnNob3RzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gc3JjOiBcIi90aHVtYm5haWwucG5nXCIsXG4gICAgICAgICAgICBzcmM6IFwiL25leGEtbG9nby5qcGdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjY0MHgxMTM2XCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgICAgbGFiZWw6IFwiQ2xhbiBkYXNoYm9hcmRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCIvdGh1bWJuYWlsLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiNjQweDExMzZcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgICBsYWJlbDogXCJQbGF5ZXIgc3RhdHMgYW5kIHBlcmZvcm1hbmNlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbXG4gICAgICAgIFwiZmF2aWNvbi5pY29cIixcbiAgICAgICAgXCJyb2JvdHMudHh0XCIsXG4gICAgICAgIC8vIFwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIixcbiAgICAgICAgLy8gXCJhcHBsZS1zcGxhc2gtNjQweDExMzYucG5nXCIsXG4gICAgICAgIC8vIFwiYXBwbGUtc3BsYXNoLTc1MHgxMzM0LnBuZ1wiLFxuICAgICAgICAvLyBcImFwcGxlLXNwbGFzaC04Mjh4MTc5Mi5wbmdcIixcbiAgICAgICAgLy8gXCJhcHBsZS1zcGxhc2gtMTEyNXgyNDM2LnBuZ1wiLFxuICAgICAgICAvLyBcImFwcGxlLXNwbGFzaC0xMjQyeDIyMDgucG5nXCIsXG4gICAgICAgIC8vIFwiYXBwbGUtc3BsYXNoLTEyNDJ4MjY4OC5wbmdcIixcbiAgICAgICAgLy8gXCJhcHBsZS1zcGxhc2gtMTUzNngyMDQ4LnBuZ1wiLFxuICAgICAgICAvLyBcImFwcGxlLXNwbGFzaC0xNjY4eDIyMjQucG5nXCIsXG4gICAgICAgIC8vIFwiYXBwbGUtc3BsYXNoLTE2Njh4MjM4OC5wbmdcIixcbiAgICAgICAgLy8gXCJhcHBsZS1zcGxhc2gtMjA0OHgyNzMyLnBuZ1wiLFxuICAgICAgICBcIm5leGEtbG9nby5qcGdcIixcbiAgICAgIF0sXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC8uKlxcLihwbmd8anBnfGpwZWd8c3ZnfGdpZnx3ZWJwKSQvLFxuICAgICAgICAgICAgaGFuZGxlcjogXCJDYWNoZUZpcnN0XCIsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJpbWFnZXNcIixcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwMCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzMCwgLy8gMzAgRGF5c1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUNoQyxTQUFTLGVBQWU7QUFKeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsSUFDMUMsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsWUFBWTtBQUFBLFFBQ1YsU0FBUztBQUFBLE1BQ1g7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQ0U7QUFBQSxRQUNGLFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxRQUNQLFNBQVM7QUFBQSxRQUNULGtCQUFrQjtBQUFBLFFBQ2xCLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFVBQ1Q7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxRQUNBLGFBQWE7QUFBQSxVQUNYO0FBQUE7QUFBQSxZQUVFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxZQUNOLE9BQU87QUFBQSxVQUNUO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sT0FBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBWUE7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxnQkFBZ0I7QUFBQSxVQUNkO0FBQUEsWUFDRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUCxXQUFXO0FBQUEsY0FDWCxZQUFZO0FBQUEsZ0JBQ1YsWUFBWTtBQUFBLGdCQUNaLGVBQWUsS0FBSyxLQUFLLEtBQUs7QUFBQTtBQUFBLGNBQ2hDO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
