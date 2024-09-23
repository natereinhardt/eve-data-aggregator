const { FlatCompat } = require('@eslint/eslintrc');
const { configs } = require('eslint-plugin-prettier');
const compat = new FlatCompat({ recommendedConfig: configs.recommended });

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
      },
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
];
