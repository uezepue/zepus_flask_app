// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: './src',
  base: '/',  // ✅ leave this as-is for client app served at root
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: '../static',  // ✅ Correct: places output into client_frontend/static
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html'),
    },
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
