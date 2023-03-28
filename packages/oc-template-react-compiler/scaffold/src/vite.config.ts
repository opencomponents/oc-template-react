import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-ignore Missing test property
  test: {
    environment: 'jsdom'
  }
});
