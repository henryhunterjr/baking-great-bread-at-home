
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
  
  // Add/update our dev script to directly use npx vite
  if (!packageJson.scripts || packageJson.scripts.dev !== 'npx vite') {
    console.log('📝 Updating package.json scripts...');
    packageJson.scripts = packageJson.scripts || {};
    packageJson.scripts.dev = 'npx vite';
    
    // Write updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json dev script to use npx vite');
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
    if (fs.existsSync(viteBinPath)) {
      fs.removeSync(viteBinPath);
      console.log('✅ Removed existing Vite binary link');
    }

    // Remove node_modules/.vite
    const viteCache = path.join(nodeModulesPath, '.vite');
    if (fs.existsSync(viteCache)) {
      fs.removeSync(viteCache);
      console.log('✅ Removed Vite cache');
    }
  } catch (error) {
    console.warn('⚠️ Error during cleanup:', error.message);
  }

  // Clear npm cache for vite
  console.log('🧹 Clearing npm cache for Vite...');
  try {
    execSync('npm cache clean --force vite', { stdio: 'inherit', cwd: projectRoot });
    console.log('✅ Cleaned npm cache for Vite');
  } catch (error) {
    console.warn('⚠️ Error clearing npm cache:', error.message);
  }
  
  // Now, force install vite and related packages directly
  console.log('📦 Installing Vite and related packages...');
  
  try {
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
      console.warn('⚠️ Cannot run vite through npx, trying global installation...');
      
      // Try installing globally
      console.log('Installing Vite globally...');
      execSync('npm install -g vite', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      console.log('✅ Global Vite installation completed');
    }
  } catch (error) {
    console.error('❌ Failed to install Vite:', error.message);
    
    // Manual steps for the user
    console.log('\n📋 MANUAL FIX: Please try running the following commands:');
    console.log('1. npm cache clean --force');
    console.log('2. rm -rf node_modules');
    console.log('3. npm install');
    console.log('4. npm install --save-dev vite@latest @vitejs/plugin-react@latest');
  }
  
  console.log('\n🚀 Installation process completed. Try running "npm run dev" again.\n');
}

fixViteInstallation().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
