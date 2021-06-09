module.exports = {
  // A preset that is used as a base for Jest's configuration
  preset: 'ts-jest',
  
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  coverageReporters: [
    "json-summary",
    "text",
    "lcov"
  ],
  collectCoverage: true,

};
