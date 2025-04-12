
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

function checkDependencies() {
  console.log('Checking project dependencies...');
  
  const nodeModulesPath = path.resolve(__dirname, '../node_modules');
  const packageLockPath = path.resolve(__dirname, '../package-lock.json');
  const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');
  
  // Check if node_modules exists and if vite binary is available
  if (!fs.existsSync(nodeModulesPath) || !fs.existsSync(viteBinPath)) {
    console.log('Vite not found in node_modules. Running fix-vite script...');
    
    try {
      // Run our specialized fix-vite script
      console.log('Running fix-vite.js...');
      execSync('node scripts/fix-vite.js', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      
      // Double check that Vite is now installed
      if (!fs.existsSync(viteBinPath)) {
        console.error('Failed to install Vite using fix-vite.js');
        throw new Error('Vite installation failed');
      }
    } catch (error) {
      console.error('Failed to fix Vite:', error);
      process.exit(1);
    }
    
    console.log('Dependencies installed successfully.');
  } else {
    console.log('Vite is properly installed.');
  }
  
  // Verify vite is accessible through npx
  try {
    execSync('npx vite --version', { 
      stdio: 'pipe',
      cwd: path.resolve(__dirname, '..')
    });
    console.log('Vite is accessible through npx.');
  } catch (error) {
    console.error('Vite module found but not accessible through npx. Running fix-vite.js...');
    try {
      execSync('node scripts/fix-vite.js', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    } catch (fixError) {
      console.error('Failed to repair Vite installation:', fixError);
      process.exit(1);
    }
  }
  
  console.log('✅ Dependencies check complete.');
}

checkDependencies();
