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
  
  // 1. Run dependency check
  log.info('Checking dependencies...');
  try {
    execSync('node scripts/check-deps.js', {
      stdio: 'inherit',
      cwd: projectRoot
    });
    log.success('Dependencies checked');
  } catch (error) {
    log.warn('Dependency check failed, continuing with setup');
  }
  
  // 2. Copy PDF resources
  log.step('Setting up PDF resources');
  try {
    execSync('node scripts/copy-pdf-resources.js', {
      stdio: 'inherit',
      cwd: projectRoot
    });
    log.success('PDF resources set up');
  } catch (error) {
    log.error('Failed to set up PDF resources');
    log.warn('Continuing anyway, but PDF functionality may not work properly');
  }
  
  // 3. Start the development server
  log.step('Starting development server');
  log.info('Running Vite through run-vite.js...');
  
  const runVitePath = path.join(projectRoot, 'src', 'scripts', 'run-vite.js');
  const fallbackRunVitePath = path.join(projectRoot, 'scripts', 'run-vite.js');
  
  let scriptPath = runVitePath;
  if (!fs.existsSync(runVitePath)) {
    if (fs.existsSync(fallbackRunVitePath)) {
      scriptPath = fallbackRunVitePath;
    } else {
      log.error('Could not find run-vite.js script');
      process.exit(1);
    }
  }
  
  log.info(`Using script: ${scriptPath}`);
  
  try {
    // Start the server and keep it running
    const serverProcess = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: projectRoot,
      shell: true
    });
    
    // Handle server process events
    serverProcess.on('error', (error) => {
      log.error(`Server failed to start: ${error.message}`);
      process.exit(1);
    });
    
    serverProcess.on('close', (code) => {
      if (code !== 0) {
        log.error(`Server exited with code ${code}`);
      }
      process.exit(code);
    });
    
    log.success('Development server started');
  } catch (error) {
    log.error(`Failed to start development server: ${error.message}`);
    process.exit(1);
  }
}

// Run setup
setup().catch(error => {
  log.error(`Setup failed: ${error.message}`);
  process.exit(1);
});
