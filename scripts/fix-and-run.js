
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

console.log('🔧 Fixing Vite installation and running development server...');

try {
  // First check if Vite is already installed
  const vitePackagePath = path.join(process.cwd(), 'node_modules', 'vite');
  const viteExists = fs.existsSync(vitePackagePath);
  
  if (!viteExists) {
    console.log('📦 Vite not found. Installing required packages...');
    
    try {
      execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      console.log('✅ Vite installed successfully!');
    } catch (installError) {
      console.error('⚠️ Failed to install Vite with npm:', installError.message);
      process.exit(1);
    }
  }

  // Now try to run Vite directly
  console.log('🚀 Starting Vite development server...');
  const viteProcess = spawn('npx', ['vite'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true
  });
  
  viteProcess.on('error', (error) => {
    console.error('Failed to start Vite:', error);
    process.exit(1);
  });

} catch (error) {
  console.error('❌ An error occurred:', error.message);
  process.exit(1);
}
