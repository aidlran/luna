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
};

export default config;
