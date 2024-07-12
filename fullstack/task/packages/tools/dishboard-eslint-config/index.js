const path = require('path');
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    parser: '@typescript-eslint/parser',
    root: true,
    plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
    extends: [
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
        'eslint-config-prettier',
    ],
    ignorePatterns: ['.eslintrc.js'],
    parserOptions: {
        project: path.resolve(process.cwd(), './tsconfig.json'),
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
    },
    settings: {
        react: {
            version: '999.999.999',
        },
        'import/resolver': {
            typescript: {
                project: path.resolve(process.cwd(), './tsconfig.json'),
            },
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-useless-constructor': 'off',
        'no-shadow': 'off',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'lines-between-class-members': 'off',
        'no-plusplus': 'off',
        'no-void': 'off',
        'max-classes-per-file': 'off',
        'no-use-before-define': 'off',
        'default-param-last': 'off',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                'newlines-between': 'ignore',
            },
        ],
        'sort-imports': ['warn', { ignoreDeclarationSort: true }],
        'class-methods-use-this': 'off',
        'prefer-destructuring': 'off',
        'max-len': [2, { code: 140 }],
    },
    overrides: [
        {
            files: ['**/migrations/*.ts'],
            rules: {
                'max-len': 0,
            },
        },
        {
            files: ['**/*.entity.ts'],
            rules: {
                'import/no-cycle': 0,
            },
        },
    ],
};
