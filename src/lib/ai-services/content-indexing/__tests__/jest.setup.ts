
// Global setup for Jest tests
import 'jest-extended';

// This will extend Jest with additional matchers
expect.extend({
  // Add custom matcher for testing deep object equality ignoring specific keys
  toEqualExcept(received, expected, excludedKeys) {
    const objWithoutKeys = (obj, keys) => {
      const result = { ...obj };
      keys.forEach(key => delete result[key]);
      return result;
    };
    
    const receivedWithoutKeys = objWithoutKeys(received, excludedKeys);
    const expectedWithoutKeys = objWithoutKeys(expected, excludedKeys);
    
    const pass = this.equals(receivedWithoutKeys, expectedWithoutKeys);
    
    return {
      pass,
      message: () => 
        pass
          ? `Expected objects not to be equal when ignoring ${excludedKeys.join(', ')}`
          : `Expected objects to be equal when ignoring ${excludedKeys.join(', ')}`
    };
  },
});

// Environment setup for consistent test execution
process.env.NODE_ENV = 'test';

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

// Define global mocks if needed for all tests
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);
