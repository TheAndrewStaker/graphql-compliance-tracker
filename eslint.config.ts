import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import baseConfig from './config/eslint/index.ts';

export default defineConfig(
  ...baseConfig,

  // ── Server typed rules ─────────────────────────────────────────────
  {
    files: ['server/src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './server/tsconfig.lint.json',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'error',

      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    },
  },

  // ── Client typed + React rules ─────────────────────────────────────
  {
    files: ['client/src/**/*.{ts,tsx}'],
    extends: [react.configs.flat.recommended, reactHooks.configs.flat['recommended-latest']],
    languageOptions: {
      parserOptions: {
        project: './client/tsconfig.json',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'error',

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unstable-nested-components': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/no-array-index-key': 'warn',
    },
  },

  // ── React components (.tsx) ────────────────────────────────────────
  {
    files: ['client/src/**/*.tsx'],
    rules: {
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],

      'func-style': 'off',
    },
  },

  // ── Client non-component TS ────────────────────────────────────────
  {
    files: ['client/src/**/*.ts'],
    rules: {
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    },
  },

  // ── Config files (not type-checked) ─────────────────────────────────
  {
    files: ['**/*.config.{js,cjs,mjs,ts}', '**/jest.config.{js,cjs,mjs,ts}'],
    rules: {
      'no-console': 'off',
      'func-style': 'off',
    },
  },

  // ── Prettier compatibility (must be last) ───────────────────────────
  eslintConfigPrettier,
);
