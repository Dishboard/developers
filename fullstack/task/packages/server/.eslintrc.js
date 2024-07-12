const path = require('path');

module.exports = {
    extends: ['@dishboard'],
    parserOptions: {
        project: path.resolve(process.cwd(), './tsconfig.json'),
        tsconfigRootDir: path.dirname(),
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
                project: path.resolve(path.dirname(), './tsconfig.json'),
            },
        },
    },
};
