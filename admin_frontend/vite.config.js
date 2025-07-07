import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // 👈 Ensures it reads from root (where index.html lives)
  base: '',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'static',        // Output goes to admin_frontend/static
    emptyOutDir: true,
  },
  server: {
    port: 5174,              // ⬅️ Use a different dev port from client to avoid conflict
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
