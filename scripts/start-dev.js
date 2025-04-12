
const { execSync } = require('child_process');
const path = require('path');

// First run the dependency checker
try {
  console.log('Running dependency check...');
  execSync('node scripts/check-deps.js', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  // Then run the development server
  console.log('Starting development server...');
  execSync('npx vite', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
} catch (error) {
  console.error('Failed to start development server:', error);
  process.exit(1);
}
