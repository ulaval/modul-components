module.exports = {
    testURL: 'http://localhost/',
    roots: [
        '<rootDir>/src/',
        '<rootDir>/conf/storybook/'
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.html(\\?style=\\..+)?$": "<rootDir>/tests/jest/vue-template-transformer.js"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    moduleNameMapper: {
        "^(.+\\.html)(\\?style=\\..+)?$": "$1",
        "\\.(css|less|sass|scss)$": "<rootDir>/tests/jest/jest-ignore.js",
        "\\.min\\.(css|less|sass|scss)|\\.svg$": "<rootDir>/tests/jest/jest-ignore.js"
    },
    snapshotSerializers: [
        "<rootDir>/node_modules/jest-serializer-vue"
    ],
    setupFiles: [
        "<rootDir>/tests/polyfills.js",
        "<rootDir>/tests/setup.ts"
    ],
    coverageDirectory: "<rootDir>/reports/coverage"
};
