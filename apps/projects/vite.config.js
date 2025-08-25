import { sveltekit } from '@sveltejs/kit/vite';
import { searchForWorkspaceRoot } from 'vite';
import { defineConfig } from 'vitest/config';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [sveltekit()],

  // prevent from obscuring rust errors
  clearScreen: false,

  server: {
    fs: {
      allow: [
        // Needed for monorepo lib linking
        searchForWorkspaceRoot(process.cwd()),
      ],
    },
    // Tauri expects a fixed port, fail if that port is not available
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
