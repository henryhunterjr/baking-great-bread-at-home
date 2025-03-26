
// Jest setup file for content indexing tests

// Silence console output during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Add any other global setup needed for tests
