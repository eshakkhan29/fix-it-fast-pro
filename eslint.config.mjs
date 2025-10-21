import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  // Next.js plugin & recommended rules (react, react-hooks, next)
  ...compat.config({
    extends: ['next', 'next/core-web-vitals'],
  }),
  // Ignore common output and cache directories
  {
    ignores: ['.next', 'node_modules', 'dist', 'build', 'coverage']
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Ensure TS/TSX are parsed with the TS parser and project settings
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }]
    }
  },
  // JS/JSX/MJS/CJS: allow underscore-prefixed unused args/vars/catch params
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    rules: {
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }]
    }
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
];

export default eslintConfig;
