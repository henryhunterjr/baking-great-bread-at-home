
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function fixViteInstallation() {
  console.log('🔍 Diagnosing Vite installation issues...');
  
  const projectRoot = path.resolve(__dirname, '..');
  const nodeModulesPath = path.resolve(projectRoot, 'node_modules');
  const viteBinPath = path.resolve(nodeModulesPath, '.bin', 'vite');
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
  
  // First, clean up any broken Vite installation
  console.log('🧹 Cleaning up any broken Vite installations...');
  try {
    // Remove the vite folder from node_modules if it exists
    const vitePath = path.join(nodeModulesPath, 'vite');
    if (fs.existsSync(vitePath)) {
      fs.removeSync(vitePath);
      console.log('✅ Removed existing Vite installation');
    }
    
    // Remove any broken vite binary links
    const viteBinLink = path.join(nodeModulesPath, '.bin', 'vite');
    if (fs.existsSync(viteBinLink)) {
      fs.removeSync(viteBinLink);
      console.log('✅ Removed existing Vite binary link');
    }
  } catch (error) {
    console.warn('⚠️ Error during cleanup:', error.message);
  }
  
  // Now, force install vite and related packages directly
  console.log('📦 Installing Vite and related packages...');
  
  try {
    // First make sure npm is up to date
    try {
      console.log('Updating npm...');
      execSync('npm install -g npm@latest', {
        stdio: 'inherit',
        cwd: projectRoot
      });
    } catch (npmError) {
      console.warn('⚠️ Could not update npm, continuing with current version...');
    }
    
    // Install vite and plugin-react directly to the project
    console.log('Installing Vite locally...');
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
    
    // Verify Vite is now accessible using npx
    try {
      execSync('npx vite --version', { 
        stdio: 'pipe',
        cwd: projectRoot
      });
      console.log('✅ Vite is accessible through npx!');
    } catch (e) {
      console.warn('⚠️ Cannot run vite through npx, trying alternative approaches...');
      
      // Try installing globally
      console.log('Installing Vite globally...');
      execSync('npm install -g vite', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      // Try again with npx
      try {
        execSync('npx vite --version', { 
          stdio: 'pipe',
          cwd: projectRoot
        });
        console.log('✅ Vite is now accessible through npx after global installation!');
      } catch (npxError) {
        console.error('❌ Still cannot access Vite through npx:', npxError.message);
        throw new Error('Failed to make Vite accessible');
      }
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
        if (fs.existsSync(path.join(tempDir, 'node_modules', '.bin', 'vite'))) {
          fs.copyFileSync(
            path.join(tempDir, 'node_modules', '.bin', 'vite'),
            path.join(nodeModulesPath, '.bin', 'vite')
          );
        }
        
        console.log('✅ Manually copied Vite from temporary installation!');
      }
      
      // Clean up
      fs.removeSync(tempDir);
    } catch (altError) {
      console.error('❌ Alternative approach also failed:', altError.message);
      console.log('\n📋 MANUAL FIX: Please try running the following commands:');
      console.log('1. npm cache clean --force');
      console.log('2. rm -rf node_modules');
      console.log('3. npm install');
      console.log('4. npm install --save-dev vite@latest @vitejs/plugin-react@latest');
    }
  }
  
  console.log('\n🚀 Installation process completed. Try running "npm run dev" again.\n');
}

fixViteInstallation().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
