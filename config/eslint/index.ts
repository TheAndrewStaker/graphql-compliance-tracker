import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

/**
 * Shareable base config — applies to all TypeScript files across packages.
 * React-specific rules and per-package tsconfig paths are layered in eslint.config.ts.
 */
export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/__generated__/**',
      '**/coverage/**',
      'scripts/**',
    ],
  },

  // strict > recommended — catches more real mistakes.
  // stylistic — opinionated consistency rules.
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  {
    rules: {
      // ── TypeScript ────────────────────────────────────────────────────────

      // no-explicit-any is already 'error' in strict — not repeated here.

      // strict sets this to 'error' but without ignore patterns. Override to
      // allow the _prefix convention for intentionally unused args/vars.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Prevents variable shadowing — TypeScript version handles enums/types correctly.
      // Core no-shadow must be off to avoid false positives.
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',

      // Enforce `import type` for type-only imports; inline style allows mixing
      // type and value imports from the same module without a second import line.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Airbnb: disallow use before definition, but allow function hoisting.
      // Core rule off — TS version handles type declarations correctly.
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, classes: true, variables: true },
      ],

      // ── Quotes ───────────────────────────────────────────────────────────

      // JS/TS strings: single quotes. JSX attributes: double (HTML convention).
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-double'],

      // ── Core — Airbnb-aligned ────────────────────────────────────────────

      // Allow console.warn/error (intentional); ban console.log (debug artifact).
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],

      // Airbnb ignore list covers reduce accumulators and Express req/res patterns.
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

      // Always === except null comparisons (null == undefined is idiomatic).
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // { foo: foo } → { foo }
      'object-shorthand': ['error', 'always'],

      // const { x } = obj over const x = obj.x — object only; array destructuring
      // is often clearer without it (index access is explicit).
      'prefer-destructuring': ['error', { array: false, object: true }],

      // 'hello ' + name → `hello ${name}`
      'prefer-template': 'error',

      // Return early rather than wrapping in else after a return.
      'no-else-return': ['error', { allowElseIf: false }],

      // Nested ternaries are unreadable.
      'no-nested-ternary': 'error',

      // x ? true : false → Boolean(x) or !!x
      'no-unneeded-ternary': 'error',

      // if (a) { if (b) {} } → if (a && b) {}
      'no-lonely-if': 'error',

      // Always use arrow functions for callbacks.
      'prefer-arrow-callback': 'error',

      // Omit braces when arrow body is a single expression.
      'arrow-body-style': ['error', 'as-needed'],

      // Always pass radix to parseInt to avoid octal surprises.
      radix: 'error',

      // Require braces for all control flow — prevents single-line if bugs.
      curly: ['error', 'all'],

      // Space after // comment marker; `markers: ['/']` allows triple-slash directives.
      'spaced-comment': ['error', 'always', { markers: ['/'] }],

      // Ban for..in (prototype chain leaks), labels, and with (legacy).
      // for..of is allowed — idiomatic in TypeScript with iterables.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in iterates over the prototype chain. Use Object.keys() or Object.entries().',
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
]);
