
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

function checkDependencies() {
  console.log('Checking project dependencies...');
  
  const nodeModulesPath = path.resolve(__dirname, '../node_modules');
  const packageLockPath = path.resolve(__dirname, '../package-lock.json');
  const viteBinPath = path.join(nodeModulesPath, '.bin', 'vite');
  const viteModulePath = path.join(nodeModulesPath, 'vite');
  const viteCliPath = path.join(viteModulePath, 'bin', 'vite.js');
  
  // Check if node_modules exists and if vite binary and module are available
  const nodeModulesExists = fs.existsSync(nodeModulesPath);
  const viteBinExists = fs.existsSync(viteBinPath);
  const viteModuleExists = fs.existsSync(viteModulePath);
  const viteCliExists = fs.existsSync(viteCliPath);
  
  console.log(`Node modules directory exists: ${nodeModulesExists}`);
  console.log(`Vite binary exists: ${viteBinExists}`);
  console.log(`Vite module exists: ${viteModuleExists}`);
  console.log(`Vite CLI script exists: ${viteCliExists}`);
  
  // Detect installed vite version
  let viteVersion = 'unknown';
  try {
    if (viteModuleExists) {
      const packageJson = require(path.join(viteModulePath, 'package.json'));
      viteVersion = packageJson.version;
      console.log(`Installed Vite version: ${viteVersion}`);
    }
  } catch (e) {
    console.warn('Could not determine Vite version from package.json');
  }
  
  // Test if vite is executable through different methods
  let viteAccessible = false;
  
  // Try using local binary
  if (viteBinExists) {
    try {
      const versionOutput = execSync(`"${viteBinPath}" --version`, { 
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '..')
      }).toString().trim();
      console.log(`Vite is accessible through local binary. Version: ${versionOutput}`);
      viteAccessible = true;
    } catch (e) {
      console.warn('Vite binary exists but is not accessible');
    }
  }
  
  // Try using npx
  if (!viteAccessible) {
    try {
      const versionOutput = execSync('npx vite --version', { 
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '..')
      }).toString().trim();
      console.log(`Vite is accessible through npx. Version: ${versionOutput}`);
      viteAccessible = true;
    } catch (e) {
      console.warn('Vite is not accessible through npx');
    }
  }
  
  // Try directly running the CLI file with node
  if (!viteAccessible && viteCliExists) {
    try {
      const versionOutput = execSync(`node "${viteCliPath}" --version`, { 
        stdio: 'pipe',
        cwd: path.resolve(__dirname, '..')
      }).toString().trim();
      console.log(`Vite is accessible through node CLI. Version: ${versionOutput}`);
      viteAccessible = true;
    } catch (e) {
      console.warn('Vite CLI exists but is not accessible');
    }
  }
  
  // If not vite is not properly installed or not accessible, run fix-vite.js
  if (!nodeModulesExists || !viteModuleExists || !viteAccessible) {
    console.log('Vite not properly installed or not accessible. Running fix-vite script...');
    
    try {
      console.log('Running fix-vite.js...');
      execSync('node scripts/fix-vite.js', { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      
      // Verify installation fixed the issue
      try {
        const verifyVersion = execSync('npx vite --version', { 
          stdio: 'pipe',
          cwd: path.resolve(__dirname, '..')
        }).toString().trim();
        console.log(`✅ Vite successfully installed! Version: ${verifyVersion}`);
      } catch (verifyError) {
        throw new Error(`Installation completed but Vite is still not accessible: ${verifyError.message}`);
      }
    } catch (error) {
      console.error('Failed to fix Vite:', error);
      process.exit(1);
    }
  } else {
    console.log('✅ Vite is properly installed and accessible.');
  }
  
  console.log('✅ Dependencies check complete.');
}

checkDependencies();
