// admin_frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',  // ✅ Use the actual root of admin_frontend
  base: '/admin/',  // ✅ Required for correct routing under /admin
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'static',  // ✅ Outputs to admin_frontend/static
    emptyOutDir: true,
  },
  server: {
    port: 5174,
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
