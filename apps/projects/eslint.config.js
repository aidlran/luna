import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  eslint.configs.recommended,
  ...ts.configs.strict,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    ignores: [
      '.svelte-kit/',
      'build/',
      'dist/',
      'lib/',
      'src-tauri/gen/schemas/',
      'src-tauri/target/',
    ],
  },
  {
    rules: {
      'no-console': 'error',
    },
  },
);
