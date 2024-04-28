const path = require('path');

module.exports = {
    extends: ['@dishboard'],
    parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['**/migrations/*.ts'],
    settings: {
        'import/resolver': {
            typescript: {
                project: path.resolve(__dirname, './tsconfig.json'),
            },
        },
    },
};
