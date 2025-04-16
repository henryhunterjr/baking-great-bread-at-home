
#!/usr/bin/env node

/**
 * Simple starter script that chooses the best method to run the app
 * based on the current platform.
 */

const { execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

console.log('📦 Starting application...');

// Determine platform
const isWindows = os.platform() === 'win32';
const projectRoot = path.resolve(__dirname);

try {
  // First check if we have vite directly available
  try {
    console.log('🧪 Checking for Vite...');
    
    // Try to find vite
    const viteBinExists = fs.existsSync(path.join(projectRoot, 'node_modules', '.bin', 'vite'));
    
    if (viteBinExists) {
      console.log('✅ Found Vite in node_modules. Starting...');
      const command = isWindows ? 
        'node_modules\\.bin\\vite' : 
        './node_modules/.bin/vite';
      
      execSync(command, { stdio: 'inherit', cwd: projectRoot });
      process.exit(0);
    }
  } catch (error) {
    console.log('❌ Local Vite not accessible. Trying alternative methods...');
  }
  
  // If that fails, use the robust scripts
  console.log('🔄 Using robust startup scripts...');
  
  if (isWindows) {
    console.log('💻 Windows detected. Using batch script...');
    execSync('node scripts\\dev.js', { stdio: 'inherit', cwd: projectRoot });
  } else {
    console.log('🐧 Unix-like OS detected. Using shell script...');
    execSync('bash start-dev.sh', { stdio: 'inherit', cwd: projectRoot });
  }
} catch (error) {
  console.error('❌ Failed to start the application:', error.message);
  console.log('⚙️ Trying direct Vite execution...');
  
  try {
    execSync('node scripts/run-vite-direct.js', { stdio: 'inherit', cwd: projectRoot });
  } catch (finalError) {
    console.error('❌ All startup methods failed.');
    console.error('Please try manually running: npm install --save-dev vite@4.5.1 @vitejs/plugin-react && npx vite');
    process.exit(1);
  }
}
