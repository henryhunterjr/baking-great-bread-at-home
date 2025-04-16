
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

/**
 * Direct script to run Vite with more aggressive installation checks
 */
try {
  console.log('Running Vite directly with enhanced checks...');
  
  // Ensure vite is installed
  const nodeModulesPath = path.resolve(__dirname, '../node_modules');
  const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');
  const viteModulePath = path.join(nodeModulesPath, 'vite');
  const viteCliPath = path.join(viteModulePath, 'bin', 'vite.js');
  
  // Check if vite is installed
  if (!fs.existsSync(viteBinPath) && !fs.existsSync(viteCliPath)) {
    console.log('Vite not found, installing required packages...');
    try {
      execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      console.log('✅ Vite packages installed successfully');
    } catch (installError) {
      console.warn('⚠️ Failed to install Vite with npm:', installError.message);
    }
  }
  
  // Try multiple methods to start vite
  let started = false;
  
  // Method 1: Use local vite binary
  if (!started && fs.existsSync(viteBinPath)) {
    try {
      console.log('Using local Vite binary...');
      execSync(`"${viteBinPath}"`, { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..') 
      });
      started = true;
    } catch (error) {
      console.warn('Failed to start with local binary:', error.message);
    }
  }
  
  // Method 2: Use vite CLI module
  if (!started && fs.existsSync(viteCliPath)) {
    try {
      console.log('Using Vite CLI module...');
      execSync(`node "${viteCliPath}"`, { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..') 
      });
      started = true;
    } catch (error) {
      console.warn('Failed to start with Vite CLI module:', error.message);
    }
  }
  
  // Method 3: Use global npx vite
  if (!started) {
    try {
      console.log('Using global npx Vite...');
      execSync('npx vite', { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..') 
      });
      started = true;
    } catch (error) {
      console.warn('Failed to start with npx vite:', error.message);
    }
  }
  
  // Method 4: Last resort - install and run directly
  if (!started) {
    try {
      console.log('All methods failed. Installing vite globally and trying again...');
      execSync('npm install -g vite', { stdio: 'inherit' });
      console.log('Running global vite...');
      execSync('vite', { 
        stdio: 'inherit', 
        cwd: path.resolve(__dirname, '..') 
      });
      started = true;
    } catch (error) {
      console.error('All methods to start Vite have failed.');
      console.error('Please run these commands manually:');
      console.error('1. npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
      console.error('2. npx vite');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('Failed to start Vite:', error.message);
  process.exit(1);
}
