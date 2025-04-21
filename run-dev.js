
#!/usr/bin/env node

/**
 * Simple script to start the development server
 * Works across all platforms (Windows, Mac, Linux)
 * This is the most reliable way to start the server
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting development server...');

// Helper function to execute a command and handle errors
function runCommand(command, options = {}) {
  try {
    console.log(`Running: ${command}`);
    return execSync(command, { ...options, stdio: 'inherit' });
  } catch (error) {
    console.log(`Command failed: ${error.message}`);
    return false;
  }
}

try {
  // First ensure Vite is installed
  console.log('Checking for Vite installation...');
  const viteModulePath = path.join(__dirname, 'node_modules', 'vite');
  const viteExists = fs.existsSync(viteModulePath);
  
  if (!viteExists) {
    console.log('📦 Vite not found. Installing required packages...');
    runCommand('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
    console.log('✅ Vite installed successfully!');
  }

  // Now try to run Vite using npx (which will find the local installation)
  console.log('🚀 Starting development server with npx...');
  const child = spawn('npx', ['vite'], { 
    stdio: 'inherit', 
    shell: true,
    cwd: process.cwd()
  });
  
  child.on('error', (err) => {
    console.error('Failed to start with npx:', err.message);
    console.log('Trying alternative method...');
    
    // If npx fails, try running the vite binary directly
    const viteBinPath = path.join(__dirname, 'node_modules', '.bin', 'vite');
    if (fs.existsSync(viteBinPath)) {
      const directChild = spawn(viteBinPath, [], { 
        stdio: 'inherit', 
        shell: true,
        cwd: process.cwd()
      });
      
      directChild.on('error', (directErr) => {
        console.error('All methods failed. Please try manual installation:', directErr.message);
        process.exit(1);
      });
    } else {
      console.error('Vite binary not found. Please try manual installation.');
      process.exit(1);
    }
  });
  
} catch (error) {
  console.error('An error occurred:', error.message);
  process.exit(1);
}
