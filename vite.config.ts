
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Set server port to 8080 as required
  server: {
    port: 8080,
    strictPort: true,
    host: true, // listen on all addresses
    open: true, // auto-open browser window
    hmr: {
      // Ensure HMR works with fallback mechanisms
      clientPort: 8080,
      overlay: true,
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  // Add optimizeDeps to ensure vite properly processes dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [],
  },
  // Add error handling for more descriptive build errors
  logLevel: 'info',
}))
