
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * Direct script to run Vite with more aggressive installation checks
 * and multiple fallback methods for starting the server
 */
try {
  console.log('Starting development server with enhanced checks...');
  
  // Define project root and paths
  const projectRoot = path.resolve(__dirname, '..');
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');
  const viteModulePath = path.join(nodeModulesPath, 'vite');
  const viteCliPath = path.join(viteModulePath, 'bin', 'vite.js');
  
  // Check if vite is installed
  if (!fs.existsSync(viteBinPath) && !fs.existsSync(viteCliPath)) {
    console.log('Vite not found, installing required packages...');
    try {
      execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      console.log('✅ Vite packages installed successfully');
    } catch (installError) {
      console.warn('⚠️ Failed to install Vite with npm:', installError.message);
      console.log('Trying with npx...');
      try {
        // Try running vite directly with npx (which will install it if needed)
        execSync('npx --yes vite@4.5.1', { 
          stdio: 'pipe',
          cwd: projectRoot
        });
        console.log('✅ Vite is accessible through npx');
      } catch (npxError) {
        console.warn('⚠️ Failed with npx:', npxError.message);
      }
    }
  }
  
  // Try multiple methods to start vite
  const methods = [
    // Method 1: Use local vite binary
    () => {
      if (fs.existsSync(viteBinPath)) {
        console.log('Using local Vite binary...');
        const child = spawn(viteBinPath, [], { 
          stdio: 'inherit', 
          cwd: projectRoot,
          shell: true
        });
        return child;
      }
      return null;
    },
    
    // Method 2: Use vite CLI module
    () => {
      if (fs.existsSync(viteCliPath)) {
        console.log('Using Vite CLI module...');
        const child = spawn('node', [viteCliPath], { 
          stdio: 'inherit', 
          cwd: projectRoot,
          shell: true
        });
        return child;
      }
      return null;
    },
    
    // Method 3: Use npx vite
    () => {
      console.log('Using npx Vite...');
      const child = spawn('npx', ['vite'], { 
        stdio: 'inherit',
        cwd: projectRoot,
        shell: true
      });
      return child;
    },
    
    // Method 4: Use global vite
    () => {
      console.log('Using global Vite...');
      const child = spawn('vite', [], { 
        stdio: 'inherit',
        cwd: projectRoot,
        shell: true
      });
      return child;
    },
    
    // Method 5: Last resort - install directly and run
    () => {
      console.log('Reinstalling Vite and running directly...');
      execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      const child = spawn('npx', ['vite'], { 
        stdio: 'inherit',
        cwd: projectRoot,
        shell: true
      });
      return child;
    }
  ];
  
  // Try each method until one works
  let started = false;
  for (const method of methods) {
    if (started) break;
    
    try {
      const childProcess = method();
      
      if (!childProcess) {
        console.log('Method not available, trying next...');
        continue;
      }
      
      childProcess.on('error', (err) => {
        console.error('Error with this method:', err.message);
        // We'll continue to the next method in the next iteration
      });
      
      childProcess.on('exit', (code) => {
        if (code !== 0) {
          console.log(`Process exited with code ${code}, next method will be tried on restart.`);
        }
      });
      
      // Wait a brief moment to see if the process immediately fails
      setTimeout(() => {
        started = true;
      }, 1000);
      
      // We'll only reach this point if the process didn't immediately throw an error
      console.log('Server appears to be starting...');
      started = true;
      
    } catch (error) {
      console.warn('Failed to start with this method:', error.message);
    }
  }
  
  if (!started) {
    console.error('All methods to start Vite have failed.');
    console.error('Please try running these commands manually:');
    console.error('1. npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
    console.error('2. npx vite');
    process.exit(1);
  }
} catch (error) {
  console.error('Failed to start Vite:', error.message);
  process.exit(1);
}
