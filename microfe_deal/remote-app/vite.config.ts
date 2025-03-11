import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './WeatherWidget': './src/components/WeatherWidget.vue',
      },
      shared: ['vue'],
      // Tambahkan ini untuk debugging
      vite: {
        configureServer(server) {
          console.log('Federation plugin is active!');
          server.middlewares.use((req, res, next) => {
            if (req.url === '/remoteEntry.js') {
              console.log('Request for /remoteEntry.js detected!');
            }
            next();
          });
        },
      },
    })  ],
  server: {
    port: 5174,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    cssCodeSplit: false,
  },
});