
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

function checkDependencies() {
  console.log('Checking project dependencies...');
  
  const nodeModulesPath = path.resolve(__dirname, '../node_modules');
  const packageLockPath = path.resolve(__dirname, '../package-lock.json');
  
  // Check if node_modules exists and if vite binary is available
  if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(path.join(nodeModulesPath, '.bin', 'vite'))) {
    console.log('Vite not found in node_modules. Reinstalling dependencies...');
    
    try {
      // Try to clean install dependencies first
      console.log('Running npm ci...');
      execSync('npm ci', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    } catch (error) {
      console.log('npm ci failed, trying npm install instead...');
      try {
        // Fall back to regular install if ci fails
        console.log('Running npm install...');
        execSync('npm install', { 
          stdio: 'inherit',
          cwd: path.resolve(__dirname, '..')
        });
      } catch (installError) {
        console.error('Failed to install dependencies:', installError);
        process.exit(1);
      }
    }
    
    // Explicitly install vite and vitejs/plugin-react if still missing
    if (!fs.existsSync(path.join(nodeModulesPath, '.bin', 'vite'))) {
      console.log('Explicitly installing vite and related packages...');
      try {
        execSync('npm install vite@latest @vitejs/plugin-react@latest --no-save', {
          stdio: 'inherit',
          cwd: path.resolve(__dirname, '..')
        });
      } catch (viteInstallError) {
        console.error('Failed to install Vite:', viteInstallError);
        process.exit(1);
      }
    }
    
    console.log('Dependencies installed successfully.');
  } else {
    console.log('Vite is properly installed.');
  }
  
  // Verify vite is installed
  try {
    const vitePath = require.resolve('vite');
    console.log(`Vite found at: ${vitePath}`);
  } catch (error) {
    console.error('Vite module not found even after installation. There might be a deeper issue.');
    process.exit(1);
  }
  
  console.log('✅ Dependencies check complete.');
}

checkDependencies();
