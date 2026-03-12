import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/__generated__/**',
      '**/coverage/**',
      'scripts/**',
    ],
  },

  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  {
    rules: {
      // ── Formatting sanity ───────────────────────────────────────────
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'eol-last': ['error', 'always'],

      // ── TypeScript shared rules (no type info required) ─────────────
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, classes: true, variables: true },
      ],

      // ── Quotes ──────────────────────────────────────────────────────
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-double'],

      // ── Core quality rules ──────────────────────────────────────────
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: [
            'acc',
            'accumulator',
            'e',
            'ctx',
            'req',
            'request',
            'res',
            'response',
            'staticContext',
          ],
        },
      ],

      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'object-shorthand': ['error', 'always'],
      'prefer-destructuring': ['error', { array: false, object: true }],
      'prefer-template': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'no-lonely-if': 'error',
      'prefer-arrow-callback': 'error',

      // Avoid conflict with no-confusing-void-expression
      'arrow-body-style': 'off',

      radix: 'error',
      curly: ['error', 'all'],
      'spaced-comment': ['error', 'always', { markers: ['/'] }],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in iterates over the prototype chain. Use Object.keys() or Object.entries().',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO. Use a named function or break to a block instead.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode.',
        },
      ],
    },
  },
);
