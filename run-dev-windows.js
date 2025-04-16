
#!/usr/bin/env node

/**
 * Windows-compatible development server launcher
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting development server for Windows...');

// Check if Vite is installed
const nodeModulesPath = path.join(__dirname, 'node_modules');
const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite.cmd');
const viteModulePath = path.join(nodeModulesPath, 'vite');
const viteExists = fs.existsSync(viteBinPath) || fs.existsSync(viteModulePath);

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
    console.error('Trying with global install...');
    try {
      execSync('npm install -g vite', { stdio: 'inherit' });
      console.log('✅ Global Vite installed successfully!');
    } catch (globalError) {
      console.error('❌ Failed to install Vite globally:', globalError.message);
      console.error('Please try running: npm install --save-dev vite@4.5.1 @vitejs/plugin-react');
      process.exit(1);
    }
  }
}

// Try different methods to start Vite for Windows
const methods = [
  {
    name: 'Local Vite Windows Binary', 
    cmd: path.join(__dirname, 'node_modules', '.bin', 'vite.cmd'),
    args: [],
    options: { shell: true }
  },
  {
    name: 'NPX Vite',
    cmd: 'npx',
    args: ['vite'],
    options: { shell: true }
  },
  {
    name: 'Node Vite Module',
    cmd: 'node',
    args: [path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js')],
    options: { shell: true }
  },
  {
    name: 'Global Vite',
    cmd: 'vite',
    args: [],
    options: { shell: true }
  }
];

// Try each method until one works
(async function tryStartMethods() {
  for (const method of methods) {
    console.log(`Trying to start with ${method.name}...`);
    
    try {
      // Check if the command file exists (for local paths)
      if (method.cmd.includes(path.sep) && !fs.existsSync(method.cmd)) {
        console.log(`${method.name} not found, skipping.`);
        continue;
      }
      
      const child = spawn(method.cmd, method.args, {
        stdio: 'inherit',
        ...method.options,
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
    } catch (error) {
      console.warn(`Error with ${method.name}:`, error.message);
    }
  }
  
  // If all methods failed, try a direct install command as a last resort
  console.error('All startup methods failed. Trying direct installation and execution...');
  try {
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1 && npx vite', {
      stdio: 'inherit',
      cwd: __dirname,
      shell: true
    });
  } catch (error) {
    console.error('Failed to start development server:', error.message);
    console.error('Please try running manually: npx vite');
    process.exit(1);
  }
})();
