import { resolve } from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development', // Enable sourcemaps for development
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        sourcemapExcludeSources: process.env.NODE_ENV !== 'development', // Strip TypeScript signatures in production
      },
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        // content: resolve(__dirname, 'src/content.ts'),
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
