
#!/usr/bin/env node

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
  
  // First, clean up any broken Vite installation
  console.log('🧹 Performing complete cleanup of Vite installations...');
  try {
    // Remove the vite folder from node_modules if it exists
    const vitePath = path.join(nodeModulesPath, 'vite');
    if (fs.existsSync(vitePath)) {
      fs.rmSync(vitePath, { recursive: true, force: true });
      console.log('✅ Removed existing Vite installation');
    }
    
    // Remove any broken vite binary links
    if (fs.existsSync(viteBinPath)) {
      fs.rmSync(viteBinPath, { recursive: true, force: true });
      console.log('✅ Removed existing Vite binary link');
    }

    // Remove vite plugin react
    const vitePluginReactPath = path.join(nodeModulesPath, '@vitejs', 'plugin-react');
    if (fs.existsSync(vitePluginReactPath)) {
      fs.rmSync(vitePluginReactPath, { recursive: true, force: true });
      console.log('✅ Removed Vite plugin React');
    }

    // Remove node_modules/.vite
    const viteCache = path.join(nodeModulesPath, '.vite');
    if (fs.existsSync(viteCache)) {
      fs.rmSync(viteCache, { recursive: true, force: true });
      console.log('✅ Removed Vite cache');
    }
  } catch (error) {
    console.warn('⚠️ Error during cleanup:', error.message);
  }
  
  // Now, install vite and related packages directly
  console.log('📦 Installing Vite and related packages...');
  
  try {
    // Install vite specifically with exact version
    console.log('Installing Vite specifically...');
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', { 
      stdio: 'inherit',
      cwd: projectRoot
    });
    
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
