
#!/usr/bin/env node

/**
 * Simple script to run Vite directly with npx
 * This is the simplest possible way to start Vite
 */

const { spawn } = require('child_process');

console.log('Starting Vite with npx...');

const child = spawn('npx', ['vite'], { 
  stdio: 'inherit', 
  shell: true,
  cwd: process.cwd()
});

child.on('error', (err) => {
  console.error('Failed to start Vite:', err.message);
  console.error('Please run: npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
  console.error('Then try again');
  process.exit(1);
});
