/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    globals: {
        "import.meta.env.VITE_API_URL": "http://localhost:5000",
    },
    setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.json",
                allowImportingTsExtensions: true,
            },
        ],
    },
};
