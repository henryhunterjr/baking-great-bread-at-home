
#!/usr/bin/env node

/**
 * Direct Vite runner script with intelligent fallbacks
 * This script tries multiple methods to run Vite and installs it if needed
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI colors for better console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

console.log(`${colors.blue}🚀 Attempting to start Vite development server...${colors.reset}`);

// Define paths
const projectRoot = process.cwd();
const nodeModulesPath = path.join(projectRoot, 'node_modules');
const viteCliPath = path.join(nodeModulesPath, 'vite', 'bin', 'vite.js');
const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');

// Function to check if a command exists in PATH
function commandExists(cmd) {
  try {
    // Use 'where' on Windows, 'which' on Unix
    const checkCommand = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${checkCommand} ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Try different methods to run Vite
async function runVite() {
  const methods = [
    {
      name: 'Local Vite binary',
      check: () => fs.existsSync(viteBinPath),
      run: () => {
        console.log(`${colors.green}Using local Vite binary...${colors.reset}`);
        return spawn(viteBinPath, [], { stdio: 'inherit', shell: true });
      }
    },
    {
      name: 'Vite CLI module',
      check: () => fs.existsSync(viteCliPath),
      run: () => {
        console.log(`${colors.green}Using Vite CLI module...${colors.reset}`);
        return spawn('node', [viteCliPath], { stdio: 'inherit', shell: true });
      }
    },
    {
      name: 'NPX Vite',
      check: () => commandExists('npx'),
      run: () => {
        console.log(`${colors.green}Using NPX Vite...${colors.reset}`);
        return spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
      }
    },
    {
      name: 'Global Vite',
      check: () => commandExists('vite'),
      run: () => {
        console.log(`${colors.green}Using global Vite...${colors.reset}`);
        return spawn('vite', [], { stdio: 'inherit', shell: true });
      }
    }
  ];

  // Try each method in order
  for (const method of methods) {
    if (method.check()) {
      console.log(`Trying to start Vite with ${method.name}...`);
      
      try {
        const process = method.run();
        
        return new Promise((resolve) => {
          process.on('error', (err) => {
            console.log(`${colors.yellow}Error starting with ${method.name}: ${err.message}${colors.reset}`);
            resolve(false);
          });
          
          // Wait a moment to see if the process starts successfully
          setTimeout(() => {
            if (process.exitCode === null) {
              // Process is still running
              process.on('close', (code) => {
                console.log(`\nVite process exited with code ${code}`);
              });
              resolve(true);
            } else {
              console.log(`${colors.yellow}Failed to start with ${method.name}${colors.reset}`);
              resolve(false);
            }
          }, 1000);
        });
      } catch (error) {
        console.log(`${colors.yellow}Failed to start with ${method.name}: ${error.message}${colors.reset}`);
      }
    }
  }
  
  return false;
}

// Install Vite if needed and retry
async function installAndRunVite() {
  console.log(`${colors.yellow}⚙️ Vite not found. Installing Vite...${colors.reset}`);
  
  try {
    console.log('Installing Vite and React plugin...');
    
    // Create a temporary package.json if it doesn't exist
    const packageJsonPath = path.join(projectRoot, 'package.json');
    let packageExists = false;
    let originalPackage = null;
    
    if (!fs.existsSync(packageJsonPath)) {
      console.log('Creating temporary package.json...');
      fs.writeFileSync(packageJsonPath, JSON.stringify({ name: "vite-temp", private: true }, null, 2));
    } else {
      packageExists = true;
      originalPackage = fs.readFileSync(packageJsonPath, 'utf8');
    }
    
    execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1', { 
      stdio: 'inherit',
      cwd: projectRoot
    });
    
    // Restore original package.json if we created a temporary one
    if (!packageExists) {
      fs.unlinkSync(packageJsonPath);
    }
    
    console.log(`${colors.green}✅ Vite installed successfully. Retrying...${colors.reset}`);
    return await runVite();
  } catch (error) {
    console.error(`${colors.red}Failed to install Vite: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  // First try running Vite directly
  let success = await runVite();
  
  // If direct run failed, try installing and running
  if (!success) {
    success = await installAndRunVite();
    
    if (!success) {
      console.error(`${colors.red}❌ All attempts to run Vite failed.${colors.reset}`);
      console.log('\nTroubleshooting tips:');
      console.log('1. Try running: npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
      console.log('2. Try running: npx vite');
      console.log('3. Try running the batch script: scripts\\start-dev.bat (on Windows)');
      console.log('4. Try running the shell script: bash scripts/start-dev.sh (on Unix/Mac)');
      process.exit(1);
    }
  }
}

// Run the main function
main().catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
