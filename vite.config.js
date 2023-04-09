import { sveltekit } from '@sveltejs/kit/vite';
import { searchForWorkspaceRoot } from 'vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  server: {
    fs: {
      // Needed for monorepo linking
      allow: [searchForWorkspaceRoot(process.cwd()), '../..'],
    },
  },
  worker: {
    plugins: [
      // TODO: remove once vite 4.3 is out
      {
        name: 'remove-manifest',
        configResolved(c) {
          const manifestPlugin = c.worker.plugins.findIndex((p) => p.name === 'vite:manifest');
          c.worker.plugins.splice(manifestPlugin, 1);
          const ssrManifestPlugin = c.worker.plugins.findIndex((p) => p.name === 'vite:ssr-manifest');
          c.plugins.splice(ssrManifestPlugin, 1);
        },
      },
    ],
  },
};

export default config;
