import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@core': fromRoot('./src/app/core'),
      '@domain': fromRoot('./src/app/domain'),
      '@features': fromRoot('./src/app/features'),
      '@shared': fromRoot('./src/app/shared'),
    },
  },
  test: { include: ['src/**/*.spec.ts'], globals: true, environment: 'jsdom', setupFiles: ['./src/test-setup.ts'] },
});
