
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkDependencies() {
  console.log('Checking project dependencies...');
  
  const nodeModulesPath = path.resolve(__dirname, '../node_modules');
  const packageLockPath = path.resolve(__dirname, '../package-lock.json');
  
  if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(path.join(nodeModulesPath, '.bin', 'vite'))) {
    console.log('Vite not found in node_modules. Reinstalling dependencies...');
    
    try {
      // Clean install dependencies
      execSync('npm ci', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    } catch (error) {
      console.log('npm ci failed, trying npm install instead...');
      try {
        execSync('npm install', { 
          stdio: 'inherit',
          cwd: path.resolve(__dirname, '..')
        });
      } catch (installError) {
        console.error('Failed to install dependencies:', installError);
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
