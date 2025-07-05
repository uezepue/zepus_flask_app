import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src',
  base: '/', // ensures assets work when hosted at domain root
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '../static', // this puts the build in client_frontend/static
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5055',
    },
  },
});
