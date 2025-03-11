import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: {
        remoteApp: 'http://localhost:3000/remote-app/assets/remoteEntry.js',
      },
      shared: ['vue'],
    }),
  ],
  server: {
    port: 3000,
    cors: true,
    proxy: {
      '/remote-app/assets': { // Proxy semua aset
        target: 'http://localhost:5174',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/remote-app/, ''),
      },
    },
  },
  build: {
    target: 'esnext',
  },
});