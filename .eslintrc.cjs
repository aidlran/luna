module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict',
    'plugin:@typescript-eslint/stylistic',
    'plugin:deprecation/recommended',
    'plugin:svelte/recommended',
    'plugin:svelte/prettier',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'deprecation'],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: { parser: '@typescript-eslint/parser' },
    },
  ],
  parserOptions: {
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
    sourceType: 'module',
    project: 'tsconfig.lint.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'deprecation/deprecation': 'warn',
    'no-console': 'error',
  },
};
