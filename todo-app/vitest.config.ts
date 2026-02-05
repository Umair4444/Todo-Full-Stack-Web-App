/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    reporters: ['verbose'],
    coverage: {
      provider: 'istanbul',
      enabled: true,
      reportsDirectory: './tests/coverage',
      reporter: ['text', 'json', 'html'],
    },
  },
});