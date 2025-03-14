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
      shared: {
        react: { requiredVersion: '^18.2.0', singleton: true },
        'react-dom': { requiredVersion: '^18.2.0', singleton: true },
        axios: { requiredVersion: '^1.6.0', singleton: true },
      },
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