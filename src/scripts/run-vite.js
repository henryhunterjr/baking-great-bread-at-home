
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * Direct script to run Vite without any complex logic
 * Can be used as a fallback when start-dev.js doesn't work
 */
try {
  console.log('Running Vite directly...');
  
  // Detect installed vite binary path
  const nodeModulesPath = path.resolve(__dirname, '../node_modules');
  const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');
  const viteModulePath = path.join(nodeModulesPath, 'vite');
  const viteCliPath = path.join(viteModulePath, 'bin', 'vite.js');
  
  if (fs.existsSync(viteBinPath)) {
    console.log('Using local Vite binary...');
    execSync(`"${viteBinPath}"`, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  } else if (fs.existsSync(viteCliPath)) {
    console.log('Using Vite CLI module...');
    execSync(`node "${viteCliPath}"`, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  } else {
    console.log('Using global npx Vite...');
    execSync('npx vite', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  }
} catch (error) {
  console.error('Failed to start Vite:', error.message);
  process.exit(1);
}
