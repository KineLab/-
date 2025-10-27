import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: './js/svelte/index.js',
      name: 'LearningApp',
      formats: ['iife'],
      fileName: () => 'learning.js'
    },
    outDir: '../priv/static/assets/js',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'learning.js',
        assetFileNames: 'learning[extname]',
        extend: true,
        globals: {
          LearningApp: 'LearningApp'
        }
      }
    }
  }
});
