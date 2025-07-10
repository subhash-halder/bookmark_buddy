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
    // watch: process.env.WATCH && watcherOptions,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        // content: resolve(__dirname, 'src/content.ts'),
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
