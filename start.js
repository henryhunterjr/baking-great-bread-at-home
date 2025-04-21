
#!/usr/bin/env node

/**
 * Unified start script that works across platforms
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

console.log('🚀 Starting development server...');

// Detect platform
const isWindows = os.platform() === 'win32';
const projectRoot = path.resolve(__dirname);

try {
  // First try the most direct approach - running our robust script
  const scriptPath = path.join(projectRoot, 'scripts', 'run-vite-direct.js');
  
  // Make sure the script has execute permissions
  if (!isWindows) {
    try {
      execSync(`chmod +x "${scriptPath}"`, { stdio: 'pipe' });
    } catch (e) {
      // Ignore chmod errors
    }
  }
  
  console.log('Running enhanced Vite startup script...');
  
  // Run the script directly
  const child = spawn('node', [scriptPath], {
    stdio: 'inherit',
    shell: true,
    cwd: projectRoot
  });
  
  child.on('error', (error) => {
    console.error('Failed to start with enhanced script:', error.message);
    fallbackStart();
  });
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.log(`Enhanced script exited with code ${code}`);
      fallbackStart();
    }
  });
  
} catch (error) {
  console.error('Error starting enhanced script:', error.message);
  fallbackStart();
}

// Fallback methods if the main script fails
function fallbackStart() {
  console.log('Trying fallback methods...');
  
  const methods = [
    // Just try running npx vite directly
    () => {
      console.log('Trying npx vite...');
      const child = spawn('npx', ['vite'], {
        stdio: 'inherit',
        shell: true,
        cwd: projectRoot
      });
      return child;
    },
    
    // Try installing and running
    () => {
      console.log('Trying installation and direct run...');
      execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      const child = spawn('npx', ['vite'], {
        stdio: 'inherit',
        shell: true,
        cwd: projectRoot
      });
      return child;
    },
    
    // Final direct attempt
    () => {
      console.log('Final attempt with global vite...');
      try {
        execSync('npm install -g vite', { stdio: 'inherit' });
      } catch (e) {
        // Ignore global install errors
      }
      const child = spawn('vite', [], {
        stdio: 'inherit',
        shell: true,
        cwd: projectRoot
      });
      return child;
    }
  ];
  
  // Try each fallback method
  let fallbackStarted = false;
  for (const method of methods) {
    if (fallbackStarted) break;
    
    try {
      const childProcess = method();
      
      childProcess.on('error', (err) => {
        console.error('Error with this fallback method:', err.message);
        // We'll continue to the next method in the next iteration
      });
      
      childProcess.on('exit', (code) => {
        if (code !== 0) {
          console.log(`Fallback exited with code ${code}.`);
        }
      });
      
      // We'll only reach this point if the process didn't immediately throw an error
      console.log('Fallback method appears to be working...');
      fallbackStarted = true;
      
    } catch (error) {
      console.warn('Fallback method failed:', error.message);
    }
    
    if (!fallbackStarted) {
      console.log('Continuing to next fallback method...');
    }
  }
  
  if (!fallbackStarted) {
    console.error('All methods to start Vite have failed.');
    console.error('Please try these manual steps:');
    console.error('1. npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
    console.error('2. npx vite');
    process.exit(1);
  }
}
