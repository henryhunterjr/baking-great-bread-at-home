
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

function checkDependencies() {
  console.log('Checking project dependencies...');
  
  const nodeModulesPath = path.resolve(__dirname, '../node_modules');
  const packageLockPath = path.resolve(__dirname, '../package-lock.json');
  const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');
  const viteModulePath = path.join(nodeModulesPath, 'vite');
  
  // Check if node_modules exists and if vite binary and module are available
  const nodeModulesExists = fs.existsSync(nodeModulesPath);
  const viteBinExists = fs.existsSync(viteBinPath);
  const viteModuleExists = fs.existsSync(viteModulePath);
  
  console.log(`Node modules directory exists: ${nodeModulesExists}`);
  console.log(`Vite binary exists: ${viteBinExists}`);
  console.log(`Vite module exists: ${viteModuleExists}`);
  
  if (!nodeModulesExists || !viteBinExists || !viteModuleExists) {
    console.log('Vite not properly installed. Running fix-vite script...');
    
    try {
      // Run our specialized fix-vite script
      console.log('Running fix-vite.js...');
      execSync('node scripts/fix-vite.js', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    } catch (error) {
      console.error('Failed to fix Vite:', error);
      process.exit(1);
    }
  } else {
    // Even if everything seems OK, verify vite is accessible through npx
    try {
      const viteVersion = execSync('npx vite --version', { 
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '..')
      }).toString().trim();
      console.log(`Vite is accessible through npx. Version: ${viteVersion}`);
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
  }
  
  console.log('✅ Dependencies check complete.');
}

checkDependencies();
