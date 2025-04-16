
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
    // Install Vite and the React plugin directly with exact versions
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('✅ Vite installed successfully!');
  } catch (installError) {
    console.error('❌ Failed to install Vite:', installError.message);
    console.error('Please try running: npm install --save-dev vite@4.5.1 @vitejs/plugin-react');
    process.exit(1);
  }
}

// Try different methods to start Vite
const methods = [
  {
    name: 'Local Vite Binary', 
    cmd: path.join(__dirname, 'node_modules', '.bin', 'vite'),
    args: []
  },
  {
    name: 'NPX Vite',
    cmd: 'npx',
    args: ['vite']
  },
  {
    name: 'Node Vite Module',
    cmd: 'node',
    args: [path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js')]
  },
  {
    name: 'Fix and Run Script',
    cmd: 'node',
    args: [path.join(__dirname, 'scripts', 'fix-and-run.js')]
  }
];

// Try each method until one works
(async function tryStartMethods() {
  for (const method of methods) {
    console.log(`Trying to start with ${method.name}...`);
    
    try {
      if (method.cmd === 'node' && method.args[0].includes('fix-and-run.js')) {
        // For the fix script, we'll just run it directly
        execSync(`node "${method.args[0]}"`, {
          stdio: 'inherit',
          cwd: __dirname
        });
        return; // If it runs without error, exit the loop
      } else {
        // Check if the command file exists (for local paths)
        if (method.cmd.includes(path.sep) && !fs.existsSync(method.cmd)) {
          console.log(`${method.name} not found, skipping.`);
          continue;
        }
        
        const child = spawn(method.cmd, method.args, {
          stdio: 'inherit',
          shell: true,
          cwd: __dirname
        });
        
        // Set up event handling
        child.on('error', (error) => {
          console.error(`Failed to start with ${method.name}:`, error.message);
        });
        
        // Wait to see if the process starts correctly
        await new Promise((resolve) => {
          // Check if the process is still running after a short time
          const timeout = setTimeout(() => {
            resolve(true); // Process appears to be running
          }, 2000);
          
          child.on('exit', (code) => {
            clearTimeout(timeout);
            if (code !== 0) {
              console.log(`${method.name} exited with code ${code}, trying next method...`);
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
        
        return; // If we get here, assume the process is running
      }
    } catch (error) {
      console.warn(`Error with ${method.name}:`, error.message);
    }
  }
  
  // If all methods failed, run the fix script as a last resort
  console.error('All startup methods failed. Trying fallback method...');
  try {
    execSync('node scripts/fix-and-run.js', {
      stdio: 'inherit',
      cwd: __dirname
    });
  } catch (error) {
    console.error('Failed to start development server:', error.message);
    console.error('Please try running: node scripts/fix-vite.js');
    process.exit(1);
  }
})();
