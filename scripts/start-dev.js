
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

async function startDevServer() {
  console.log('Starting development server...');
  
  const projectRoot = path.resolve(__dirname, '..');
  const nodeModulesPath = path.resolve(projectRoot, 'node_modules');
  const viteBinPath = path.resolve(nodeModulesPath, '.bin', 'vite');
  const viteModulePath = path.resolve(nodeModulesPath, 'vite');
  const viteCliPath = path.resolve(viteModulePath, 'bin', 'vite.js');

  const startMethods = [
    { 
      name: 'Local Vite Binary', 
      command: `"${viteBinPath}"`,
      cwd: projectRoot
    },
    { 
      name: 'NPX Vite', 
      command: 'npx vite',
      cwd: projectRoot
    },
    { 
      name: 'Node Vite CLI', 
      command: `node "${viteCliPath}"`,
      cwd: projectRoot
    },
    { 
      name: 'Global Vite', 
      command: 'vite',
      cwd: projectRoot
    }
  ];

  for (const method of startMethods) {
    try {
      console.log(`Attempting to start dev server with ${method.name}...`);
      
      const child = spawn(method.command, [], {
        stdio: 'inherit',
        shell: true,
        cwd: method.cwd
      });

      child.on('error', (err) => {
        console.error(`Error with ${method.name}:`, err);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          console.warn(`${method.name} exited with code ${code}`);
        }
      });

      return; // Exit if successfully started
    } catch (error) {
      console.warn(`Failed to start with ${method.name}:`, error.message);
    }
  }

  console.error('All attempts to start the development server failed.');
  console.error('Please try:');
  console.error('1. Reinstalling Vite: npm install --save-dev vite@latest');
  console.error('2. Checking your Node.js installation');
  console.error('3. Running node scripts/fix-vite.js');
  process.exit(1);
}

startDevServer();
