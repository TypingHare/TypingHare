import pluginJsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'

export default [
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc: pluginJsonc,
    },
    rules: {
      'jsonc/indent': ['error', 4],
      'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'jsonc/comma-dangle': ['error', 'never'],
      'jsonc/object-curly-spacing': ['error', 'always'],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/explicit-function-return-type': ['off'],
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
]
