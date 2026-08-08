import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Group third-party libraries into stable vendor chunks so they can be
        // cached separately and the per-page lazy chunks stay small.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router-dom') || id.includes('/react-router/')) return 'vendor-router';
            if (id.includes('/react/') || id.includes('/react-dom/')) return 'vendor-react';
            if (id.includes('zustand') || id.includes('axios') || id.includes('jwt-decode')) return 'vendor-data';
            if (id.includes('lucide-react') || id.includes('radix-ui') || id.includes('sonner')) return 'vendor-ui';
            if (id.includes('next-themes')) return 'vendor-theme';
            return 'vendor-misc';
          }
        },
      },
    },
  },
})
