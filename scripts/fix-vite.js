
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function fixViteInstallation() {
  console.log('🔍 Diagnosing Vite installation issues...');
  
  const projectRoot = path.resolve(__dirname, '..');
  const nodeModulesPath = path.resolve(projectRoot, 'node_modules');
  const viteBinPath = path.resolve(nodeModulesPath, '.bin', 'vite');
  const vitePackagePath = path.resolve(nodeModulesPath, 'vite');
  const packageJsonPath = path.resolve(projectRoot, 'package.json');
  
  // Check if package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ Cannot find package.json in the project root!');
    process.exit(1);
  }
  
  // Read package.json
  const packageJson = require(packageJsonPath);
  
  // Add/update our dev script to use our custom start script
  if (!packageJson.scripts || packageJson.scripts.dev !== 'node scripts/start-dev.js') {
    console.log('📝 Updating package.json scripts...');
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.dev = 'node scripts/start-dev.js';
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json dev script');
  }
  
  // Now, force install vite and related packages directly
  console.log('📦 Installing Vite globally and locally...');
  
  try {
    // First try to install globally (helps with npx)
    execSync('npm install -g vite@latest', { 
      stdio: 'inherit', 
      cwd: projectRoot 
    });
    
    // Then install locally as a dev dependency
    execSync('npm install --save-dev vite@latest @vitejs/plugin-react@latest', { 
      stdio: 'inherit',
      cwd: projectRoot
    });
    
    // Check if installation was successful
    if (fs.existsSync(viteBinPath)) {
      console.log('✅ Vite successfully installed!');
    } else {
      throw new Error('Vite binary not found after installation');
    }
    
    // Verify Vite is now accessible
    try {
      execSync('npx vite --version', { 
        stdio: 'inherit',
        cwd: projectRoot
      });
      console.log('✅ Vite is accessible through npx!');
    } catch (e) {
      console.warn('⚠️ Cannot run vite through npx, but installation appears successful.');
    }
    
  } catch (error) {
    console.error('❌ Failed to install Vite:', error.message);
    
    // One last attempt - try npm init vite
    console.log('🔄 Trying alternative approach...');
    try {
      // Create a temporary directory for vite installation
      const tempDir = path.resolve(projectRoot, 'temp-vite-install');
      fs.mkdirSync(tempDir, { recursive: true });
      
      // Create a minimal package.json in the temp directory
      fs.writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: "temp-vite-install", version: "1.0.0" })
      );
      
      // Install vite in the temporary directory
      execSync('npm install vite@latest', { 
        stdio: 'inherit',
        cwd: tempDir
      });
      
      // Copy the vite modules to our project
      if (fs.existsSync(path.join(tempDir, 'node_modules', 'vite'))) {
        fs.ensureDirSync(path.join(nodeModulesPath, 'vite'));
        fs.copySync(
          path.join(tempDir, 'node_modules', 'vite'),
          path.join(nodeModulesPath, 'vite')
        );
        
        // Create the bin link
        fs.ensureDirSync(path.join(nodeModulesPath, '.bin'));
        fs.copyFileSync(
          path.join(tempDir, 'node_modules', '.bin', 'vite'),
          path.join(nodeModulesPath, '.bin', 'vite')
        );
        
        console.log('✅ Manually copied Vite from temporary installation!');
      }
      
      // Clean up
      fs.removeSync(tempDir);
    } catch (altError) {
      console.error('❌ Alternative approach also failed:', altError.message);
      console.log('📋 Please try manually running: npm install vite@latest @vitejs/plugin-react@latest');
    }
  }
  
  console.log('\n🚀 Installation process completed. Try running "npm run dev" again.\n');
}

fixViteInstallation().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
