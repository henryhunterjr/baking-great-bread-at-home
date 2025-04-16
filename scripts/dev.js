
#!/usr/bin/env node

/**
 * Development script that sets up the environment and starts the dev server
 * without needing to modify package.json
 * 
 * Usage: node scripts/dev.js
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// ANSI colors for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

// Helper for colored console messages
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}${colors.bright}→ ${msg}${colors.reset}\n`)
};

async function setup() {
  const projectRoot = path.resolve(__dirname, '..');
  
  log.step('Starting development setup');
  
  // Copy PDF resources
  log.info('Setting up PDF resources...');
  try {
    execSync('node scripts/copy-pdf-resources.js', {
      stdio: 'inherit',
      cwd: projectRoot
    });
    log.success('PDF resources installed successfully');
  } catch (error) {
    log.warn('Failed to copy PDF resources, some PDF features may not work correctly');
    // Continue anyway, as this isn't fatal for non-PDF functionality
  }
  
  // Check if vite is installed
  const nodeModulesPath = path.resolve(projectRoot, 'node_modules');
  const viteBinPath = path.resolve(nodeModulesPath, '.bin', 'vite');
  const viteExists = fs.existsSync(viteBinPath);
  
  if (!viteExists) {
    log.warn('Vite binary not found. Running fix script...');
    try {
      execSync('node scripts/fix-vite.js', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      log.success('Fixed Vite installation');
    } catch (error) {
      log.error(`Failed to fix Vite: ${error.message}`);
      log.info('Attempting to install vite directly...');
      try {
        execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
          stdio: 'inherit',
          cwd: projectRoot
        });
        log.success('Vite installed directly');
      } catch (installError) {
        log.error(`Failed to install Vite: ${installError.message}`);
        log.error('Please run "npm install" manually and try again.');
        process.exit(1);
      }
    }
  }
  
  // Start the development server using direct methods
  log.step('Starting development server');
  
  // Try all possible ways to start Vite
  const startMethods = [
    {
      name: "Local Vite Binary",
      cmd: () => {
        const viteBin = path.resolve(nodeModulesPath, '.bin', 'vite');
        return spawn(viteBin, [], { stdio: 'inherit', cwd: projectRoot, shell: true });
      }
    },
    {
      name: "Vite Module Direct",
      cmd: () => {
        const viteModule = path.resolve(nodeModulesPath, 'vite', 'bin', 'vite.js');
        return spawn('node', [viteModule], { stdio: 'inherit', cwd: projectRoot, shell: true });
      }
    },
    {
      name: "NPX Vite",
      cmd: () => spawn('npx', ['vite'], { stdio: 'inherit', cwd: projectRoot, shell: true })
    },
    {
      name: "Global Vite",
      cmd: () => spawn('vite', [], { stdio: 'inherit', cwd: projectRoot, shell: true })
    }
  ];
  
  // Try each method in order
  for (const method of startMethods) {
    log.info(`Trying to start server with: ${method.name}`);
    try {
      const process = method.cmd();
      
      // If we made it here without an error thrown, let this process run
      log.success(`Server started using ${method.name}`);
      
      // Handle server process events
      process.on('error', (err) => {
        log.error(`Server error: ${err.message}`);
        // Continue to next method
      });
      
      process.on('close', (code) => {
        if (code !== 0) {
          log.warn(`Server exited with code ${code}, trying next method...`);
        } else {
          log.info('Server shut down normally');
          process.exit(0);
        }
      });
      
      // Wait a few seconds to see if the server stays running
      await new Promise(resolve => setTimeout(resolve, 3000));
      return; // Exit the for loop if server is running
    } catch (error) {
      log.warn(`Failed to start with ${method.name}: ${error.message}`);
      // Continue to next method
    }
  }
  
  // If we get here, all methods failed
  log.error('All methods to start Vite server failed');
  log.info('Please try running these commands manually:');
  log.info('1. npm install --save-dev vite@4.5.1 @vitejs/plugin-react');
  log.info('2. node scripts/fix-vite.js');
  log.info('3. npx vite');
  process.exit(1);
}

setup().catch(error => {
  console.error(`Setup failed: ${error.message}`);
  process.exit(1);
});
