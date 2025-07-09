// client_frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',  // ✅ Use project root, not ./src
  base: '/',  // ✅ Serve at root
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'static',  // ✅ Output folder for Flask to serve
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5055',
      '/socket.io': {
        target: 'http://localhost:5055',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
