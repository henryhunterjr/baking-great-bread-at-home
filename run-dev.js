
#!/usr/bin/env node

/**
 * Direct entry point to start the development server
 * This script will be in the project root for easy access
 */

const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting development server...');

try {
  // Run the fix-and-run script
  execSync('node scripts/fix-and-run.js', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname)
  });
} catch (error) {
  console.error('❌ Failed to start development server:', error.message);
  console.error('Please try running: node scripts/fix-and-run.js');
  process.exit(1);
}
