import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'hostApp',
      remotes: {
        remoteApp: 'http://localhost:3000/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'axios'],
    }),
  ],
  server: {
    port: 5173,
    cors: true,
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    minify: false,
  },
});