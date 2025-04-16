
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

try {
  console.log('Running Vite installation checks...');
  
  // First ensure vite is installed
  try {
    console.log('Installing required packages...');
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    console.log('✅ Vite packages installed successfully');
  } catch (installError) {
    console.error('Failed to install Vite:', installError.message);
    process.exit(1);
  }

  // Try to start Vite
  console.log('Starting Vite development server...');
  const viteProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    shell: true
  });

  viteProcess.on('error', (error) => {
    console.error('Failed to start Vite:', error.message);
    process.exit(1);
  });

} catch (error) {
  console.error('Error in fix-vite script:', error.message);
  process.exit(1);
}
