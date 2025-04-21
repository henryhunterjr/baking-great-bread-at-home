
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
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
  
  // First ensure vite is installed
  if (!fs.existsSync(viteBinPath) && !fs.existsSync(viteCliPath)) {
    console.log('Vite not found. Installing it now...');
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    console.log('Vite installation completed.');
  }
  
  // Check if PDF resources exist, if not run the copy script
  const pdfWorkerPath = path.resolve(__dirname, '../../public/pdf.worker.min.js');
  const cmapsDir = path.resolve(__dirname, '../../public/cmaps');
  
  if (!fs.existsSync(pdfWorkerPath) || !fs.existsSync(cmapsDir)) {
    console.log('PDF resources missing. Copying them now...');
    try {
      // If the copy-pdf-resources.js script exists, run it
      const copyScriptPath = path.resolve(__dirname, '../../scripts/copy-pdf-resources.js');
      if (fs.existsSync(copyScriptPath)) {
        execSync('node ' + copyScriptPath, {
          stdio: 'inherit',
          cwd: path.resolve(__dirname, '../..')
        });
      } else {
        console.warn('PDF resource copy script not found. Some PDF features may not work correctly.');
      }
    } catch (copyError) {
      console.warn('Failed to copy PDF resources:', copyError.message);
    }
  }
  
  // Try multiple methods to start vite
  let started = false;
  
  // Method 1: Use local vite binary
  if (!started && fs.existsSync(viteBinPath)) {
    try {
      console.log('Using local Vite binary...');
      const child = spawn(viteBinPath, [], { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..'),
        shell: true 
      });
      
      child.on('error', (err) => {
        console.error('Error starting Vite with local binary:', err);
        // Continue to next method
      });
      
      // If we get here without error, assume it started
      started = true;
      
      // Keep the process running
      child.on('close', (code) => {
        process.exit(code);
      });
    } catch (error) {
      console.warn('Failed to start with local binary:', error.message);
    }
  }
  
  // Method 2: Use vite CLI module
  if (!started && fs.existsSync(viteCliPath)) {
    try {
      console.log('Using Vite CLI module...');
      const child = spawn('node', [viteCliPath], { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..'),
        shell: true 
      });
      
      child.on('error', (err) => {
        console.error('Error starting Vite with node CLI:', err);
        // Continue to next method
      });
      
      // If we get here without error, assume it started
      started = true;
      
      // Keep the process running
      child.on('close', (code) => {
        process.exit(code);
      });
    } catch (error) {
      console.warn('Failed to start with Vite CLI module:', error.message);
    }
  }
  
  // Method 3: Use global npx vite
  if (!started) {
    try {
      console.log('Using global npx Vite...');
      const child = spawn('npx', ['vite'], { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..'),
        shell: true 
      });
      
      child.on('error', (err) => {
        console.error('Error starting Vite with npx:', err);
        // Continue to next method
      });
      
      // If we get here without error, assume it started
      started = true;
      
      // Keep the process running
      child.on('close', (code) => {
        process.exit(code);
      });
    } catch (error) {
      console.warn('Failed to start with npx vite:', error.message);
    }
  }
  
  // Last resort: Try executing vite globally
  if (!started) {
    try {
      console.log('Attempting to use global vite...');
      execSync('vite --version', { stdio: 'pipe' });
      console.log('Global vite available, starting...');
      
      const child = spawn('vite', [], { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..'),
        shell: true 
      });
      
      // Keep the process running
      child.on('close', (code) => {
        process.exit(code);
      });
      
      started = true;
    } catch (error) {
      console.error('All methods to start Vite have failed.');
      console.error('Please run: npm install --save-dev vite@4.5.1 @vitejs/plugin-react');
      console.error('Then try running: node scripts/copy-pdf-resources.js');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('Failed to start Vite:', error.message);
  process.exit(1);
}
