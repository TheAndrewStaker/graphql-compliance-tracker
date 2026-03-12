import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import baseConfig from './config/eslint/index.ts';

// TODO fix ide errors

export default defineConfig([
  ...baseConfig,

  // ── Type-checked rules ──────────────────────────────────────────────────────
  // Require parserOptions.project, which is set per-package below.
  // no-misused-promises: attributes:false allows async JSX event handlers,
  // which is idiomatic in React (onClick={async () => { ... }}).
  {
    files: ['server/src/**/*.ts', 'client/src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },

  // ── Server ──────────────────────────────────────────────────────────────────
  {
    files: ['server/src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './server/tsconfig.lint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    },
  },

  // ── Client — all TS/TSX ─────────────────────────────────────────────────────
  {
    files: ['client/src/**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        project: './client/tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.flat['recommended-latest'].rules,

      // Not needed with the React 19 JSX transform.
      'react/react-in-jsx-scope': 'off',
      // TypeScript handles prop validation.
      'react/prop-types': 'off',

      'react/no-unstable-nested-components': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-no-useless-fragment': 'error',
      // Remove redundant curlies: prop={"value"} → prop="value"
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      // Boolean shorthand: show={true} → show
      'react/jsx-boolean-value': ['error', 'never'],
      // Warn (not error) — index keys are sometimes acceptable.
      'react/no-array-index-key': 'warn',
    },
  },

  // ── Client — components (.tsx) ───────────────────────────────────────────────
  // Named components use function declarations; anonymous use arrow functions.
  // func-style is not applied here — react/function-component-definition takes over.
  {
    files: ['client/src/**/*.tsx'],
    rules: {
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
    },
  },

  // ── Client — utilities and hooks (.ts only) ──────────────────────────────────
  {
    files: ['client/src/**/*.ts'],
    rules: {
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    },
  },
]);
