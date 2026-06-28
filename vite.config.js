import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/',

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
      }
    },
    cssMinify: true,
    assetsDir: 'assets',
  },
})
