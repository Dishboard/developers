import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(ts|js)$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.{ts,js}'],
    coverageDirectory: '../coverage',
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleDirectories: ['node_modules'],
};

export default config;
