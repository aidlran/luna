/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/stylistic',
    'plugin:svelte/recommended',
    'plugin:svelte/prettier',
    'plugin:deprecation/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: { parser: '@typescript-eslint/parser' },
    },
  ],
  ignorePatterns: ['/android', '/build', '/lib', 'svelte.config.js'],
  rules: {
    'deprecation/deprecation': 'warn',
    'no-console': 'error',
    'svelte/valid-compile': 'off', // TODO: await https://github.com/sveltejs/eslint-plugin-svelte/issues/652
  },
};
