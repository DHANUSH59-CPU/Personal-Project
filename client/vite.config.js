import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: React core (shared across all pages)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Vendor: Redux + RTK Query (shared across data-fetching pages)
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // Vendor: Other libs
          'vendor-libs': ['react-hot-toast', 'react-icons'],
        },
      },
    },
    // Target modern browsers for smaller output
    target: 'es2020',
  },
});
