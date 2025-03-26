
#!/usr/bin/env node

/**
 * Utility script to run tests with proper configuration
 * Usage: node run-tests.js [testPattern]
 */

const { execSync } = require('child_process');
const path = require('path');

// Get optional test pattern from command line args
const testPattern = process.argv[2] || '';

// Build the Jest command
const jestBin = path.resolve(__dirname, '../../../../node_modules/.bin/jest');
const configPath = path.resolve(__dirname, '../../../../jest.config.js');

// Construct the command
let command = `${jestBin} --config=${configPath}`;

// Add test pattern if provided
if (testPattern) {
  command += ` ${testPattern}`;
}

// Run the tests
try {
  console.log(`Running tests: ${command}`);
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
