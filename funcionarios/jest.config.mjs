export default {
  testEnvironment: 'node',
  verbose: true,
  transform: {},
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'text', 'lcov'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        outputPath: 'test-report/jest-report.html',
        pageTitle: 'Test Report',
        includeFailureMsg: true,
        includeSuiteFailure: true,
        sort: 'status'
      }
    ]
  ]
};
