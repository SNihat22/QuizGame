module.exports = {
    preset: "jest",
    testEnvironment: "node",
    testMatch: ["**/**/*.test.js"],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true
}