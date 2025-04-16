#!/usr/bin/env node

/**
 * Robust development script that tries multiple methods to run Vite
 * with better error handling and diagnostic information
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// ANSI colors for better console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

console.log(`${colors.blue}🚀 Starting development server with robust fallback mechanisms...${colors.reset}`);

// Define paths
const projectRoot = process.cwd();
const nodeModulesPath = path.join(projectRoot, 'node_modules');
const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');
const viteModulePath = path.join(nodeModulesPath, 'vite');
const viteCliPath = path.join(viteModulePath, 'bin', 'vite.js');

// Function to check if Vite is installed
async function checkViteInstallation() {
  console.log(`${colors.cyan}Checking Vite installation...${colors.reset}`);
  
  const viteExists = fs.existsSync(viteBinPath) || fs.existsSync(viteCliPath);
  if (!viteExists) {
    console.log(`${colors.yellow}Vite not found in node_modules. Installing it now...${colors.reset}`);
    try {
      execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1', { 
        stdio: 'inherit',
        cwd: projectRoot 
      });
      console.log(`${colors.green}✅ Vite installed successfully${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Failed to install Vite: ${error.message}${colors.reset}`);
      console.log(`Trying to run fix script...`);
      try {
        execSync('node scripts/fix-vite.js', { stdio: 'inherit', cwd: projectRoot });
      } catch (fixError) {
        console.error(`${colors.red}Fix script also failed: ${fixError.message}${colors.reset}`);
        console.log(`Please try installing Vite manually with: npm install --save-dev vite@4.5.1 @vitejs/plugin-react`);
      }
    }
  } else {
    console.log(`${colors.green}✅ Vite is installed${colors.reset}`);
  }
}

// Function to run Vite using multiple methods
async function runVite() {
  const methods = [
    {
      name: "Local Vite Binary",
      cmd: () => fs.existsSync(viteBinPath) ? spawn(viteBinPath, [], { stdio: 'inherit', shell: true }) : null
    },
    {
      name: "Vite Module Script",
      cmd: () => fs.existsSync(viteCliPath) ? spawn('node', [viteCliPath], { stdio: 'inherit', shell: true }) : null
    },
    {
      name: "NPX Vite",
      cmd: () => spawn('npx', ['vite'], { stdio: 'inherit', shell: true })
    },
    {
      name: "Global Vite",
      cmd: () => spawn('vite', [], { stdio: 'inherit', shell: true })
    },
    {
      name: "Run Direct Script",
      cmd: () => spawn('node', ['scripts/run-vite-direct.js'], { stdio: 'inherit', shell: true })
    }
  ];

  for (const method of methods) {
    console.log(`${colors.cyan}Attempting to start Vite with: ${method.name}...${colors.reset}`);
    
    try {
      const childProcess = method.cmd();
      
      if (!childProcess) {
        console.log(`${colors.yellow}Method ${method.name} not available, trying next...${colors.reset}`);
        continue;
      }
      
      console.log(`${colors.green}Started with ${method.name}, waiting to confirm it's running...${colors.reset}`);
      
      // Return a promise that resolves when the process exits or rejects after timeout
      return new Promise((resolve, reject) => {
        let exited = false;
        
        // Set up event handlers
        childProcess.on('error', (err) => {
          console.log(`${colors.yellow}Error with ${method.name}: ${err.message}${colors.reset}`);
          exited = true;
          reject(err);
        });
        
        childProcess.on('exit', (code) => {
          exited = true;
          if (code !== 0) {
            console.log(`${colors.yellow}${method.name} exited with code ${code}${colors.reset}`);
            reject(new Error(`Process exited with code ${code}`));
          } else {
            console.log(`${colors.green}${method.name} completed successfully${colors.reset}`);
            resolve();
          }
        });
        
        // Wait a short time to see if the process stays running
        setTimeout(() => {
          if (!exited) {
            console.log(`${colors.green}✅ Vite is running successfully with ${method.name}${colors.reset}`);
            // Don't resolve here - let the process keep running
          }
        }, 2000);
      }).catch(() => {
        // If this method failed, we'll try the next one
        return null;
      });
    } catch (error) {
      console.log(`${colors.yellow}Failed to start with ${method.name}: ${error.message}${colors.reset}`);
    }
  }
  
  throw new Error('All methods to start Vite have failed');
}

// Copy PDF resources if needed
async function copyPDFResources() {
  const pdfResourcesScript = path.join(projectRoot, 'scripts', 'copy-pdf-resources.js');
  if (fs.existsSync(pdfResourcesScript)) {
    console.log(`${colors.blue}Setting up PDF resources...${colors.reset}`);
    try {
      execSync(`node ${pdfResourcesScript}`, { stdio: 'inherit', cwd: projectRoot });
      console.log(`${colors.green}✅ PDF resources set up successfully${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠️ Warning: Failed to set up PDF resources: ${error.message}${colors.reset}`);
      console.warn('Some PDF features may not work correctly');
    }
  }
}

// Main function
async function main() {
  try {
    // Check and ensure Vite is installed
    await checkViteInstallation();
    
    // Copy PDF resources
    await copyPDFResources();
    
    // Run Vite
    await runVite();
  } catch (error) {
    console.error(`${colors.red}Failed to start development server: ${error.message}${colors.reset}`);
    console.error(`${colors.yellow}Try these troubleshooting steps:${colors.reset}`);
    console.error(`1. Run 'node scripts/fix-vite.js' to repair Vite installation`);
    console.error(`2. Run 'npm install --save-dev vite@4.5.1 @vitejs/plugin-react'`);
    console.error(`3. Run 'npx vite' directly to bypass npm scripts`);
    process.exit(1);
  }
}

main();
