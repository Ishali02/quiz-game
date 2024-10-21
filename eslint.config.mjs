import typescriptEslintEsLintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';


const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/.eslintrc.js"],
  },

  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslintEsLintPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'commonjs',

      parserOptions: {
        source: 'module',
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
]

