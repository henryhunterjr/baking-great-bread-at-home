
#!/usr/bin/env node

/**
 * Direct entry point to start the development server
 * This script will be in the project root for easy access
 */

const path = require('path');
const { execSync, spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting development server...');

// Check if Vite is installed
const vitePackagePath = path.join(__dirname, 'node_modules', 'vite');
const viteExists = fs.existsSync(vitePackagePath);

if (!viteExists) {
  console.log('📦 Vite not found. Installing Vite and React plugin...');
  try {
    // Install Vite and the React plugin directly
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('✅ Vite installed successfully!');
  } catch (installError) {
    console.error('❌ Failed to install Vite:', installError.message);
    console.error('Please try running: npm install --save-dev vite @vitejs/plugin-react');
    process.exit(1);
  }
}

try {
  // Try running vite directly with npx
  console.log('🚀 Starting Vite with npx...');
  const viteProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });

  viteProcess.on('error', (error) => {
    console.error('❌ Failed to start with npx vite:', error.message);
    
    // If direct npx fails, try the fix script as a fallback
    console.log('Trying fallback method...');
    execSync('node scripts/fix-and-run.js', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname)
    });
  });
} catch (error) {
  console.error('❌ Failed to start development server:', error.message);
  console.error('Please try running: node scripts/fix-vite.js');
  process.exit(1);
}
