
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
  
  // Update our dev script to use node scripts/start-dev.js
  console.log('📝 Updating package.json scripts...');
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.dev = 'node scripts/start-dev.js';

  // Also add a direct vite script as fallback
  packageJson.scripts.vite = 'vite';
  packageJson.scripts.vite_npx = 'npx vite';
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json scripts');
  
  // First, clean up any broken Vite installation
  console.log('🧹 Performing complete cleanup of Vite installations...');
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

    // Remove vite plugin react
    const vitePluginReactPath = path.join(nodeModulesPath, '@vitejs', 'plugin-react');
    if (fs.existsSync(vitePluginReactPath)) {
      fs.removeSync(vitePluginReactPath);
      console.log('✅ Removed Vite plugin React');
    }

    // Remove node_modules/.vite
    const viteCache = path.join(nodeModulesPath, '.vite');
    if (fs.existsSync(viteCache)) {
      fs.removeSync(viteCache);
      console.log('✅ Removed Vite cache');
    }
    
    // Clear npm cache completely
    console.log('🧹 Clearing npm cache...');
    execSync('npm cache clean --force', { stdio: 'inherit', cwd: projectRoot });
    console.log('✅ Cleaned npm cache');

    // Remove package-lock.json if it exists to ensure clean install
    const packageLockPath = path.join(projectRoot, 'package-lock.json');
    if (fs.existsSync(packageLockPath)) {
      fs.removeSync(packageLockPath);
      console.log('✅ Removed package-lock.json for clean install');
    }

  } catch (error) {
    console.warn('⚠️ Error during cleanup:', error.message);
  }
  
  // Now, install vite and related packages directly
  console.log('📦 Installing Vite and related packages...');
  
  try {
    // First, install core dependencies
    console.log('Installing core dependencies...');
    execSync('npm install --no-package-lock', { 
      stdio: 'inherit',
      cwd: projectRoot,
      env: { ...process.env, NODE_ENV: 'development' }
    });
    
    // Now install vite specifically with exact version
    console.log('Installing Vite specifically...');
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1 --no-package-lock', { 
      stdio: 'inherit',
      cwd: projectRoot,
      env: { ...process.env, NODE_ENV: 'development' }
    });
    
    // Create a simple executable script as backup
    console.log('Creating a backup Vite executable...');
    const viteCliPath = path.join(nodeModulesPath, 'vite', 'bin', 'vite.js');
    
    if (fs.existsSync(viteCliPath)) {
      // Create directory for the bin file if it doesn't exist
      const binDir = path.dirname(viteBinPath);
      fs.ensureDirSync(binDir);

      try {
        // Create a simple executable script for Unix/Mac
        fs.writeFileSync(viteBinPath, `#!/usr/bin/env node\nrequire('${viteCliPath.replace(/\\/g, '/')}');\n`, { mode: 0o755 });
        console.log('✅ Created Vite executable script');
        
        // Create a .cmd file for Windows
        const viteBinCmdPath = viteBinPath + '.cmd';
        fs.writeFileSync(viteBinCmdPath, `@node "${viteCliPath}" %*`);
        console.log('✅ Created Vite Windows executable script');
      } catch (writeError) {
        console.warn('⚠️ Error creating manual script:', writeError.message);
      }
    } else {
      console.warn('⚠️ Vite CLI path not found at:', viteCliPath);
    }
    
    // Install vite globally as fallback
    console.log('Installing Vite globally as fallback...');
    try {
      execSync('npm install -g vite@4.5.1', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      console.log('✅ Global Vite installation completed');
    } catch (globalError) {
      console.warn('⚠️ Could not install globally, might need admin/sudo rights:', globalError.message);
    }
    
    // Verify Vite is now accessible
    try {
      // Check local vite first
      if (fs.existsSync(viteBinPath)) {
        const localResult = execSync(`"${viteBinPath}" --version`, { 
          stdio: 'pipe',
          cwd: projectRoot
        }).toString().trim();
        console.log(`✅ Local Vite is accessible! Version: ${localResult}`);
      } else {
        // Try with npx
        const npxResult = execSync('npx vite --version', { 
          stdio: 'pipe',
          cwd: projectRoot
        }).toString().trim();
        console.log(`✅ Vite is accessible through npx! Version: ${npxResult}`);
      }
    } catch (e) {
      console.warn('⚠️ Vite still not accessible through local or npx commands.');
      console.warn('Please try running "npm run vite_npx" manually.');
    }
  } catch (error) {
    console.error('❌ Failed to install Vite:', error.message);
    
    console.log('\n📋 MANUAL FIX: Please try running the following commands:');
    console.log('1. npm cache clean --force');
    console.log('2. rm -rf node_modules');
    console.log('3. npm install');
    console.log('4. npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
  }
  
  console.log('\n🚀 Installation process completed. Try running "npm run dev" again.\n');
}

fixViteInstallation().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
