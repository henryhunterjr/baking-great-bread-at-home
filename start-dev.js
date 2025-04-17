
#!/usr/bin/env node

/**
 * Universal development server starter script
 * This script checks for Vite, installs it if needed, and starts the server
 * Works across all platforms (Windows, Mac, Linux)
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

// Check if Vite is installed
const viteModulePath = path.join(__dirname, 'node_modules', 'vite');
const viteExists = fs.existsSync(viteModulePath);

// Install Vite if it's not found
if (!viteExists) {
  console.log('📦 Vite not found. Installing required packages...');
  runCommand('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
}

// Try different methods to start Vite
console.log('🚀 Attempting to start Vite development server...');

const methods = [
  // Method 1: Use local Vite binary
  () => {
    const viteBinPath = path.join(__dirname, 'node_modules', '.bin', 'vite');
    if (fs.existsSync(viteBinPath)) {
      return runCommand(`"${viteBinPath}"`);
    }
    return false;
  },
  
  // Method 2: Use npx to run Vite
  () => runCommand('npx vite'),
  
  // Method 3: Use node to run Vite directly
  () => {
    const viteJsPath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
    if (fs.existsSync(viteJsPath)) {
      return runCommand(`node "${viteJsPath}"`);
    }
    return false;
  },
  
  // Method 4: Try one of the existing scripts
  () => runCommand('node scripts/fix-and-run.js'),
  
  // Method 5: As a last resort, try global Vite
  () => runCommand('vite')
];

// Try each method until one works
let success = false;
for (const method of methods) {
  console.log('Trying next method to start Vite...');
  success = method();
  if (success !== false) {
    break;
  }
}

if (!success) {
  console.error('❌ All methods to start Vite failed.');
  console.error('Try running these commands manually:');
  console.error('1. npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
  console.error('2. npx vite');
  process.exit(1);
}
