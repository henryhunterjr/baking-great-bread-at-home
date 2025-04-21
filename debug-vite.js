
#!/usr/bin/env node

/**
 * Vite Development Server Diagnostic Script
 * This script provides detailed diagnostics about the Vite installation
 * and attempts to start the server with detailed error reporting
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI colors for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.bright}${colors.blue}=== Vite Diagnostic Tool ===${colors.reset}`);
console.log(`This script will diagnose Vite installation issues and provide detailed reports`);

// Helper functions for diagnostic information
function runCommand(cmd, options = {}) {
  try {
    const output = execSync(cmd, { 
      encoding: 'utf8',
      ...options
    }).toString();
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      stderr: error.stderr?.toString() || '',
      stdout: error.stdout?.toString() || '',
      status: error.status,
      signal: error.signal
    };
  }
}

function checkPath(pathToCheck) {
  try {
    const exists = fs.existsSync(pathToCheck);
    const stats = exists ? fs.statSync(pathToCheck) : null;
    const isDirectory = stats ? stats.isDirectory() : false;
    const isFile = stats ? stats.isFile() : false;
    const isExecutable = stats ? (stats.mode & 0o111) !== 0 : false;
    
    return {
      exists,
      isDirectory,
      isFile,
      isExecutable,
      path: pathToCheck
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
      path: pathToCheck
    };
  }
}

// Start diagnostic process
async function runDiagnostics() {
  console.log(`\n${colors.bright}${colors.cyan}=== Environment Information ===${colors.reset}`);
  
  // Check Node.js and npm versions
  const nodeVersion = runCommand('node --version');
  console.log(`Node.js Version: ${nodeVersion.success ? nodeVersion.output.trim() : 'ERROR: ' + nodeVersion.error}`);
  
  const npmVersion = runCommand('npm --version');
  console.log(`npm Version: ${npmVersion.success ? npmVersion.output.trim() : 'ERROR: ' + npmVersion.error}`);
  
  const projectRoot = process.cwd();
  console.log(`Current Directory: ${projectRoot}`);
  
  // Check for package.json
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJsonCheck = checkPath(packageJsonPath);
  console.log(`package.json: ${packageJsonCheck.exists ? colors.green + 'Found' + colors.reset : colors.red + 'Not Found' + colors.reset}`);
  
  // Try to check dev dependencies
  let viteVersionInPackage = 'Not Found';
  if (packageJsonCheck.exists) {
    try {
      const packageJson = require(packageJsonPath);
      const viteDep = packageJson.dependencies?.vite || packageJson.devDependencies?.vite;
      viteVersionInPackage = viteDep || 'Not specified in package.json';
      console.log(`Vite version in package.json: ${viteVersionInPackage}`);
    } catch (error) {
      console.log(`Error reading package.json: ${error.message}`);
    }
  }
  
  // Check node_modules and vite installation
  console.log(`\n${colors.bright}${colors.cyan}=== Vite Installation Check ===${colors.reset}`);
  
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  const nodeModulesCheck = checkPath(nodeModulesPath);
  console.log(`node_modules directory: ${nodeModulesCheck.exists ? colors.green + 'Found' + colors.reset : colors.red + 'Not Found' + colors.reset}`);
  
  const vitePath = path.join(projectRoot, 'node_modules', 'vite');
  const viteCheck = checkPath(vitePath);
  console.log(`Vite package: ${viteCheck.exists ? colors.green + 'Found' + colors.reset : colors.red + 'Not Found' + colors.reset}`);
  
  // Check vite binary
  const viteBinPath = path.join(projectRoot, 'node_modules', '.bin', 'vite');
  const viteBinCheck = checkPath(viteBinPath);
  console.log(`Vite binary: ${viteBinCheck.exists ? colors.green + 'Found' + colors.reset : colors.red + 'Not Found' + colors.reset}`);
  
  if (viteBinCheck.exists) {
    console.log(`Vite binary is executable: ${viteBinCheck.isExecutable ? colors.green + 'Yes' + colors.reset : colors.red + 'No' + colors.reset}`);
  }
  
  // Check vite CLI script
  const viteCliPath = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
  const viteCliCheck = checkPath(viteCliPath);
  console.log(`Vite CLI script: ${viteCliCheck.exists ? colors.green + 'Found' + colors.reset : colors.red + 'Not Found' + colors.reset}`);

  // Check PATH environment variable
  console.log(`\n${colors.bright}${colors.cyan}=== PATH Environment Check ===${colors.reset}`);
  
  const pathEnv = process.env.PATH || process.env.Path || process.env.path || '';
  console.log(`PATH environment variable: ${pathEnv.split(path.delimiter).join('\n  ')}`);
  
  // Check global vite installation
  const whichVite = runCommand('which vite || where vite', { stdio: 'pipe', shell: true });
  console.log(`Global vite location: ${whichVite.success ? whichVite.output.trim() : 'Not found globally'}`);
  
  // Fix: Install and run Vite
  console.log(`\n${colors.bright}${colors.cyan}=== Attempting to Install and Run Vite ===${colors.reset}`);
  
  console.log(`Installing Vite and React plugin...`);
  const installResult = runCommand('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', { stdio: 'pipe' });
  
  if (installResult.success) {
    console.log(`${colors.green}Installation successful${colors.reset}`);
    
    // Check installation again
    const viteCheckAfter = checkPath(vitePath);
    const viteBinCheckAfter = checkPath(viteBinPath);
    
    console.log(`Vite package after install: ${viteCheckAfter.exists ? colors.green + 'Found' + colors.reset : colors.red + 'Not Found' + colors.reset}`);
    console.log(`Vite binary after install: ${viteBinCheckAfter.exists ? colors.green + 'Found' + colors.reset : colors.red + 'Not Found' + colors.reset}`);
    
    // Now try to run Vite with detailed error reporting
    console.log(`\n${colors.bright}${colors.cyan}=== Attempting to Start Vite Server ===${colors.reset}`);
    
    // Method 1: Direct binary execution
    if (viteBinCheckAfter.exists) {
      console.log(`Attempting to run Vite binary directly...`);
      try {
        execSync(`"${viteBinPath}" --version`, { stdio: 'inherit' });
        console.log(`${colors.green}Vite binary works!${colors.reset} Starting server...`);
        
        const child = spawn(viteBinPath, [], {
          stdio: 'inherit',
          shell: true,
          env: process.env
        });
        
        child.on('error', (error) => {
          console.error(`${colors.red}Error starting Vite: ${error.message}${colors.reset}`);
          tryAlternateMethod();
        });
        
        // Success - let it run
        return;
      } catch (error) {
        console.error(`${colors.red}Error running Vite binary: ${error.message}${colors.reset}`);
      }
    }
    
    // Method 2: Node execution of vite.js
    function tryAlternateMethod() {
      if (viteCliCheck.exists) {
        console.log(`Attempting to run Vite through Node.js...`);
        try {
          const child = spawn('node', [viteCliPath], {
            stdio: 'inherit',
            shell: true,
            env: process.env
          });
          
          child.on('error', (error) => {
            console.error(`${colors.red}Error starting Vite with Node: ${error.message}${colors.reset}`);
            tryNpxMethod();
          });
          
          // Success - let it run
          return;
        } catch (error) {
          console.error(`${colors.red}Error running Vite with Node: ${error.message}${colors.reset}`);
        }
      }
      
      tryNpxMethod();
    }
    
    // Method 3: NPX execution
    function tryNpxMethod() {
      console.log(`Attempting to run Vite with npx...`);
      try {
        const child = spawn('npx', ['vite'], {
          stdio: 'inherit',
          shell: true,
          env: process.env
        });
        
        child.on('error', (error) => {
          console.error(`${colors.red}Error starting Vite with npx: ${error.message}${colors.reset}`);
          console.log(`\n${colors.red}${colors.bright}All methods failed to start Vite.${colors.reset}`);
          
          // Final diagnostic
          console.log(`\n${colors.bright}${colors.magenta}=== Final Diagnostic ===${colors.reset}`);
          console.log(`1. Vite is installed but cannot be executed`);
          console.log(`2. This may be due to permission issues or path problems`);
          console.log(`3. Consider trying a global installation: npm install -g vite`);
          console.log(`4. Or run vite directly from node_modules: node ./node_modules/vite/bin/vite.js`);
        });
        
        // Success - let it run
        return;
      } catch (error) {
        console.error(`${colors.red}Error running Vite with npx: ${error.message}${colors.reset}`);
      }
    }
    
    // Start the sequence
    tryAlternateMethod();
  } else {
    console.error(`${colors.red}Installation failed: ${installResult.error}${colors.reset}`);
    console.error(`${colors.red}${installResult.stderr}${colors.reset}`);
    
    console.log(`\n${colors.red}${colors.bright}Failed to install Vite.${colors.reset}`);
    console.log(`This could be due to network issues, permission problems, or npm configuration.`);
    console.log(`Please try manually running: npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1`);
  }
}

runDiagnostics().catch(error => {
  console.error(`${colors.red}Diagnostic failed: ${error.message}${colors.reset}`);
  console.error(error.stack);
});
