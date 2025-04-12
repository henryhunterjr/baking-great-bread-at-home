
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

// First run the dependency checker
try {
  console.log('Running dependency check...');
  execSync('node scripts/check-deps.js', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  // Try using npx vite with explicit path resolution
  console.log('Starting development server with npx vite...');
  
  try {
    // Try with explicit npx path
    execSync('npx vite', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
  } catch (error) {
    console.error('Failed to start with npx vite, trying alternative method...');
    
    // Try using direct path to vite executable
    const viteExecutable = path.join(__dirname, '..', 'node_modules', '.bin', 'vite');
    
    if (fs.existsSync(viteExecutable)) {
      console.log(`Found vite executable at ${viteExecutable}`);
      execSync(`"${viteExecutable}"`, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    } else {
      throw new Error('Vite executable not found in node_modules/.bin');
    }
  }
} catch (error) {
  console.error('Failed to start development server:', error.message);
  console.log('Trying to fix Vite installation and restart...');
  
  try {
    // Run fix-vite script
    console.log('Running fix-vite.js to repair Vite installation...');
    execSync('node scripts/fix-vite.js', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    
    // Try one more time with direct path after fixing
    const viteExecutable = path.join(__dirname, '..', 'node_modules', '.bin', 'vite');
    
    if (fs.existsSync(viteExecutable)) {
      console.log(`Retrying with direct path to vite: ${viteExecutable}`);
      execSync(`"${viteExecutable}"`, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    } else {
      // Last resort - try globally installed vite
      console.log('Trying with global vite installation...');
      execSync('npm install -g vite && vite', {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
    }
  } catch (altError) {
    console.error('All attempts to start Vite failed.');
    console.error('Please run the following commands manually:');
    console.error('npm install --save-dev vite@latest @vitejs/plugin-react@latest');
    console.error('npx vite');
    process.exit(1);
  }
}
