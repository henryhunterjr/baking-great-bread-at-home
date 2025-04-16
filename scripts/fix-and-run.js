
#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

console.log('🔧 Fixing Vite installation and running development server...');

try {
  // First check if Vite is already installed
  const projectRoot = process.cwd();
  const vitePackagePath = path.join(projectRoot, 'node_modules', 'vite');
  const viteExists = fs.existsSync(vitePackagePath);
  
  if (!viteExists) {
    console.log('📦 Vite not found. Installing required packages...');
    
    try {
      // Make sure we install vite with the exact version to avoid compatibility issues
      execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
        stdio: 'inherit',
        cwd: projectRoot
      });
      
      console.log('✅ Vite installed successfully!');
    } catch (installError) {
      console.error('⚠️ Failed to install Vite with npm:', installError.message);
      console.error('Trying with alternative installation method...');
      
      try {
        execSync('npx vite --version', {
          stdio: 'pipe',
          cwd: projectRoot
        });
        console.log('Vite is available through npx, continuing...');
      } catch (npxError) {
        console.error('⚠️ Failed to verify Vite through npx:', npxError.message);
        process.exit(1);
      }
    }
  } else {
    console.log('✅ Vite package found in node_modules');
  }

  // Now try to run Vite with various methods until one works
  const methods = [
    {
      name: 'Local Vite Binary',
      cmd: () => {
        const viteBinPath = path.join(projectRoot, 'node_modules', '.bin', 'vite');
        if (fs.existsSync(viteBinPath)) {
          console.log('🚀 Starting with local Vite binary...');
          return spawn(viteBinPath, [], { stdio: 'inherit', shell: true, cwd: projectRoot });
        }
        return null;
      }
    },
    {
      name: 'NPX Vite',
      cmd: () => {
        console.log('🚀 Starting with npx vite...');
        return spawn('npx', ['vite'], { stdio: 'inherit', shell: true, cwd: projectRoot });
      }
    },
    {
      name: 'Node Vite Module',
      cmd: () => {
        const viteCliPath = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
        if (fs.existsSync(viteCliPath)) {
          console.log('🚀 Starting with Vite CLI module...');
          return spawn('node', [viteCliPath], { stdio: 'inherit', shell: true, cwd: projectRoot });
        }
        return null;
      }
    },
    {
      name: 'Global Vite',
      cmd: () => {
        console.log('🚀 Starting with global vite command...');
        return spawn('vite', [], { stdio: 'inherit', shell: true, cwd: projectRoot });
      }
    }
  ];

  // Try each method until one works
  let started = false;
  for (const method of methods) {
    try {
      const proc = method.cmd();
      if (proc) {
        proc.on('error', (err) => {
          console.error(`Error with ${method.name}:`, err.message);
        });
        
        // If we've reached here without error, consider it started
        started = true;
        console.log(`Started server using ${method.name}`);
        break;
      }
    } catch (error) {
      console.warn(`Failed to start with ${method.name}:`, error.message);
    }
  }

  if (!started) {
    throw new Error('All startup methods failed');
  }

} catch (error) {
  console.error('❌ An error occurred:', error.message);
  console.error('Please try manually running: npm install --save-dev vite@4.5.1 @vitejs/plugin-react && npx vite');
  process.exit(1);
}
