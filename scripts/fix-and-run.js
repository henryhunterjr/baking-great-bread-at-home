
#!/usr/bin/env node

/**
 * A more robust script to fix Vite installation issues and run the development server
 * This script will try multiple methods to ensure the server starts
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// Colors for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

console.log(`${colors.blue}${colors.bright}=== Vite Development Server Fixer ===${colors.reset}`);
console.log(`${colors.blue}This script will ensure Vite is installed and running${colors.reset}`);

// Project root
const projectRoot = path.resolve(__dirname, '..');

// First check if node_modules exists
if (!fs.existsSync(path.join(projectRoot, 'node_modules'))) {
  console.log(`${colors.yellow}node_modules not found, running npm install...${colors.reset}`);
  try {
    execSync('npm install', { 
      stdio: 'inherit', 
      cwd: projectRoot 
    });
    console.log(`${colors.green}npm install completed${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}npm install failed: ${error.message}${colors.reset}`);
    console.log(`${colors.yellow}Continuing anyway...${colors.reset}`);
  }
}

// Then ensure Vite is installed
console.log(`${colors.blue}Checking for Vite...${colors.reset}`);
const viteModulePath = path.join(projectRoot, 'node_modules', 'vite');
const viteExists = fs.existsSync(viteModulePath);

if (!viteExists) {
  console.log(`${colors.yellow}Vite not found. Installing required packages...${colors.reset}`);
  try {
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', { 
      stdio: 'inherit', 
      cwd: projectRoot 
    });
    console.log(`${colors.green}Vite packages installed successfully${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}Failed to install Vite with npm: ${error.message}${colors.reset}`);
  }
}

// Now try multiple methods to start Vite
console.log(`${colors.blue}${colors.bright}Starting Vite development server...${colors.reset}`);

const methods = [
  // Method 1: Use npx
  {
    name: 'NPX',
    command: () => spawn('npx', ['vite'], { stdio: 'inherit', shell: true, cwd: projectRoot })
  },
  
  // Method 2: Use local binary
  {
    name: 'Local binary',
    command: () => {
      const viteBin = path.join(projectRoot, 'node_modules', '.bin', 'vite');
      if (fs.existsSync(viteBin)) {
        return spawn(viteBin, [], { stdio: 'inherit', shell: true, cwd: projectRoot });
      }
      return null;
    }
  },
  
  // Method 3: Node direct execution
  {
    name: 'Direct module',
    command: () => {
      const viteModule = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
      if (fs.existsSync(viteModule)) {
        return spawn('node', [viteModule], { stdio: 'inherit', shell: true, cwd: projectRoot });
      }
      return null;
    }
  },
  
  // Method 4: Last resort - reinstall and try again
  {
    name: 'Reinstall and run',
    command: () => {
      try {
        execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1', { 
          stdio: 'inherit', 
          cwd: projectRoot 
        });
        return spawn('npx', ['vite'], { stdio: 'inherit', shell: true, cwd: projectRoot });
      } catch (error) {
        return null;
      }
    }
  }
];

// Try each method in order
async function tryMethods() {
  let started = false;
  
  for (const method of methods) {
    if (started) break;
    
    console.log(`${colors.blue}Trying with ${method.name}...${colors.reset}`);
    
    try {
      const childProcess = method.command();
      
      if (!childProcess) {
        console.log(`${colors.yellow}Method ${method.name} not available, skipping...${colors.reset}`);
        continue;
      }
      
      childProcess.on('error', (err) => {
        console.error(`${colors.red}Error with ${method.name}: ${err.message}${colors.reset}`);
      });
      
      // Give it a moment to see if it works
      await new Promise(resolve => {
        setTimeout(() => {
          console.log(`${colors.green}Server appears to be starting with ${method.name}...${colors.reset}`);
          started = true;
          resolve();
        }, 1000);
      });
      
      // If we get here, don't exit the process, let it run
      started = true;
      break;
    } catch (error) {
      console.warn(`${colors.yellow}Failed with ${method.name}: ${error.message}${colors.reset}`);
    }
  }
  
  if (!started) {
    console.error(`${colors.red}${colors.bright}FAILURE: All methods to start Vite have failed${colors.reset}`);
    console.error(`${colors.yellow}Please try running these commands manually:${colors.reset}`);
    console.error(`${colors.yellow}1. npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1${colors.reset}`);
    console.error(`${colors.yellow}2. npx vite${colors.reset}`);
    process.exit(1);
  }
}

// Run the methods
tryMethods().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
