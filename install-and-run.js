
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Installing Vite and starting development server...');

try {
  // First check if Vite is already installed
  const viteModulePath = path.join(__dirname, 'node_modules', 'vite');
  const viteExists = fs.existsSync(viteModulePath);
  
  if (!viteExists) {
    console.log('📦 Vite not found. Installing required packages...');
    
    try {
      execSync('npm install --no-save vite@4.5.1 @vitejs/plugin-react@4.2.1', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      console.log('✅ Vite installed successfully!');
    } catch (installError) {
      console.error('Failed to install Vite with npm:', installError.message);
      process.exit(1);
    }
  }

  // Now try to run Vite
  console.log('🚀 Starting development server...');
  const child = spawn('npx', ['vite'], { 
    stdio: 'inherit', 
    shell: true,
    cwd: process.cwd()
  });
  
  child.on('error', (err) => {
    console.error('Failed to start Vite:', err.message);
    process.exit(1);
  });
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Vite exited with code ${code}`);
      process.exit(code);
    }
  });
  
} catch (error) {
  console.error('An error occurred:', error.message);
  process.exit(1);
}
