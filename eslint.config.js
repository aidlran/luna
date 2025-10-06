import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import solid from 'eslint-plugin-solid/configs/typescript';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  ...ts.configs.strict,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    languageOptions: {
      parser: ts.parser,
    },
  },
  {
    ignores: [
      '**/.output/',
      '**/.vinxi/',
      '**/build/',
      '**/coverage/',
      '**/dist/',
      '**/src-tauri/gen/schemas/',
      '**/src-tauri/target/',
      '**/static/',
      'lib/astrobase',
    ],
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-console': 'error',
    },
  },
);
