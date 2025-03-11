import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: "remoteApp",
      filename: "remoteEntry.js",
      exposes: {
        "./WeatherWidget": "./src/components/WeatherWidget.vue", // Ekspos komponen
      },
      shared: ["vue"],
    }),
  ],
  server: {
    port: 5174,
  },
  build: {
    target: "esnext",
    modulePreload: false,
    cssCodeSplit: false,
  },
});
