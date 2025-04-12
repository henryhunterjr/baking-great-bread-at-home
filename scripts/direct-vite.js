
#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Attempting to directly run Vite with npx...');

try {
  execSync('npx vite', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('Failed to start Vite:', error.message);
  console.error('Please make sure Vite is installed. Run: npm install --save-dev vite');
  process.exit(1);
}
