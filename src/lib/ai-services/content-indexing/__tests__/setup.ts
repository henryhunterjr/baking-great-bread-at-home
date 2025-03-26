// Jest setup file for content indexing tests

// Create spies for console methods
// but still keep their original behavior
const originalConsole = { ...console };

global.console = {
  ...console,
  log: jest.fn((...args) => originalConsole.log(...args)),
  info: jest.fn((...args) => originalConsole.info(...args)),
  warn: jest.fn((...args) => originalConsole.warn(...args)),
  error: jest.fn((...args) => originalConsole.error(...args)),
  debug: jest.fn((...args) => originalConsole.debug(...args))
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Add any other global setup needed for tests
