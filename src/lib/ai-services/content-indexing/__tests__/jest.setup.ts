
// Global setup for Jest tests
import 'jest-extended';

// This will extend Jest with additional matchers
expect.extend({
  // Add any custom matchers here if needed
});

// Silence console output during tests if needed
// Uncomment these if you want to silence console during tests
/*
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
*/

// Mock any globals that might be needed in tests
