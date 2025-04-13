#!/usr/bin/env node

/**
 * Direct Vite runner script
 * This script tries multiple methods to run Vite without modifying package.json
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Attempting to start Vite development server...');

// Define paths
const projectRoot = process.cwd();
const nodeModulesPath = path.join(projectRoot, 'node_modules');
const viteCliPath = path.join(nodeModulesPath, 'vite', 'bin', 'vite.js');
const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');

// Function to check if a command exists in PATH
function commandExists(cmd) {
  try {
    // Use 'where' on Windows, 'which' on Unix
    const checkCommand = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${checkCommand} ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Try different methods to run Vite
async function runVite() {
  const methods = [
    {
      name: 'Local Vite binary',
      check: () => fs.existsSync(viteBinPath),
      run: () => spawn(viteBinPath, [], { stdio: 'inherit', shell: true })
    },
    {
      name: 'Vite CLI module',
      check: () => fs.existsSync(viteCliPath),
      run: () => spawn('node', [viteCliPath], { stdio: 'inherit', shell: true })
    },
    {
      name: 'NPX Vite',
      check: () => commandExists('npx'),
      run: () => spawn('npx', ['vite'], { stdio: 'inherit', shell: true })
    },
    {
      name: 'Global Vite',
      check: () => commandExists('vite'),
      run: () => spawn('vite', [], { stdio: 'inherit', shell: true })
    }
  ];

  // Try each method in order
  for (const method of methods) {
    console.log(`Trying to start Vite using: ${method.name}`);
    
    if (method.check()) {
      try {
        const process = method.run();
        
        process.on('error', (err) => {
          console.error(`Error running Vite with ${method.name}:`, err.message);
        });
        
        // Wait to see if the process stays running
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (process.exitCode === null) {
          console.log(`✅ Successfully started Vite with ${method.name}`);
          
          // Keep the process running until it exits
          process.on('close', (code) => {
            console.log(`Vite process exited with code ${code}`);
            process.exit(code);
          });
          
          return true;
        }
      } catch (error) {
        console.error(`Failed with ${method.name}:`, error.message);
      }
    }
  }
  
  return false;
}

// Install Vite if needed and retry
async function installAndRunVite() {
  console.log('⚙️ Vite not found. Installing Vite...');
  
  try {
    console.log('Installing Vite and React plugin...');
    execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1', { 
      stdio: 'inherit',
      cwd: projectRoot
    });
    
    console.log('✅ Vite installed successfully. Retrying...');
    return await runVite();
  } catch (error) {
    console.error('Failed to install Vite:', error.message);
    return false;
  }
}

// Main function
async function main() {
  // First try running Vite directly
  const success = await runVite();
  
  // If direct run failed, try installing and running
  if (!success) {
    const installed = await installAndRunVite();
    
    if (!installed) {
      console.error('❌ All attempts to run Vite failed.');
      console.log('\nTroubleshooting tips:');
      console.log('1. Try running: node scripts/run-vite-direct.js');
      console.log('2. Try installing Vite manually: npm install --save-dev vite@4.5.1 @vitejs/plugin-react');
      console.log('3. Try running: npx vite');
      process.exit(1);
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
