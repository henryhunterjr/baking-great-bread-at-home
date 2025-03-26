
// Global setup for Jest tests

// Extend Jest with additional matchers
expect.extend({
  // Custom matcher for testing deep object equality ignoring specific keys
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

  // Add custom matcher for array containment with partial object matching
  toContainObject(received, expected) {
    const pass = received.some(item => 
      Object.keys(expected).every(key => 
        item[key] === expected[key]
      )
    );
    
    return {
      pass,
      message: () => 
        pass
          ? `Expected array not to contain object ${this.utils.printExpected(expected)}`
          : `Expected array to contain object ${this.utils.printExpected(expected)}`
    };
  },
  
  // Add custom matcher for checking if a function changes a value
  toChangeValueBy(received, accessor, delta) {
    const before = accessor();
    received();
    const after = accessor();
    const pass = after - before === delta;
    
    return {
      pass,
      message: () => 
        pass
          ? `Expected function not to change value by ${delta}`
          : `Expected function to change value by ${delta}, but it changed by ${after - before}`
    };
  }
});

// Environment setup for consistent test execution
process.env.NODE_ENV = 'test';

// Define global mocks if needed for all tests
global.requestAnimationFrame = callback => setTimeout(callback, 0);
global.cancelAnimationFrame = id => clearTimeout(id);
