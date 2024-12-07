import prettierPlugin from 'eslint-plugin-prettier';
import typeScriptPlugin from '@typescript-eslint/eslint-plugin';
import typeScriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['src/**/*.ts'], // Target TypeScript files
    languageOptions: {
      parser: typeScriptParser, // Use @typescript-eslint/parser
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typeScriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'prettier/prettier': 'error', // Use Prettier to enforce formatting
    },
  },
  {
    ignores: ['node_modules'], // Ignore unnecessary files
  },
];