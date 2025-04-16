
#!/usr/bin/env node

/**
 * This script will ensure Vite is installed and then run it
 * It's a direct approach to bypass all the complexity
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Fixing Vite installation and running development server...');

// Get the project root directory
const projectRoot = process.cwd();

try {
  // First check if Vite is already installed
  const vitePackagePath = path.join(projectRoot, 'node_modules', 'vite');
  const viteExists = fs.existsSync(vitePackagePath);
  
  if (!viteExists) {
    console.log('📦 Vite not found. Installing Vite and React plugin...');
    
    try {
      // Install Vite and the React plugin directly
      execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      console.log('✅ Vite installed successfully!');
    } catch (installError) {
      console.error('❌ Failed to install Vite:', installError.message);
      console.error('Please try running: npm install --save-dev vite @vitejs/plugin-react');
      process.exit(1);
    }
  } else {
    console.log('✅ Vite is already installed.');
  }
  
  // Now let's run Vite directly using npx
  console.log('🚀 Starting Vite development server...');
  
  const viteProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    cwd: projectRoot,
    shell: true
  });
  
  viteProcess.on('error', (error) => {
    console.error('❌ Failed to start Vite:', error.message);
    console.error('Trying alternative method...');
    
    try {
      // Direct execution of the Vite CLI
      const viteBin = path.join(projectRoot, 'node_modules', '.bin', 'vite');
      
      if (fs.existsSync(viteBin)) {
        execSync(`"${viteBin}"`, {
          stdio: 'inherit', 
          cwd: projectRoot,
          shell: true
        });
      } else {
        throw new Error('Vite binary not found');
      }
    } catch (altError) {
      console.error('❌ Alternative method failed too:', altError.message);
      console.error('Please try running these commands manually:');
      console.error('1. npm install --save-dev vite @vitejs/plugin-react');
      console.error('2. npx vite');
      process.exit(1);
    }
  });
  
  viteProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`⚠️ Vite exited with code ${code}`);
    }
  });
  
} catch (error) {
  console.error('❌ An error occurred:', error.message);
  process.exit(1);
}
