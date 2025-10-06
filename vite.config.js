import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['lib/astrobase', ...configDefaults.exclude],
    testTimeout: 10000,
  },
});
