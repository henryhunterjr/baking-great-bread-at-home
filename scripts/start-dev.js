
const { execSync } = require('child_process');
const path = require('path');

// First run the dependency checker
try {
  console.log('Running dependency check...');
  execSync('node scripts/check-deps.js', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  // Then run the development server with npx to make sure we use the correct vite version
  console.log('Starting development server with npx vite...');
  execSync('npx vite', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
} catch (error) {
  console.error('Failed to start development server:', error);
  console.log('Trying to start with alternative method...');
  
  try {
    // Try running fix-vite script
    console.log('Running fix-vite.js to repair Vite installation...');
    execSync('node scripts/fix-vite.js', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    
    // Try with npx again
    console.log('Retrying with npx vite...');
    execSync('npx vite', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
  } catch (altError) {
    console.error('All attempts to start Vite failed:', altError);
    process.exit(1);
  }
}
