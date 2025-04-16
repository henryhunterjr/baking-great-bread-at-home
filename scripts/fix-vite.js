
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

try {
  console.log('Running Vite installation checks...');
  
  // First ensure vite is installed
  try {
    console.log('Installing required packages...');
    execSync('npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    console.log('✅ Vite packages installed successfully');
  } catch (installError) {
    console.error('Failed to install Vite:', installError.message);
    
    // Try with alternate methods (global install as fallback)
    try {
      console.log('Trying global installation...');
      execSync('npm install -g vite', { 
        stdio: 'inherit' 
      });
      console.log('✅ Globally installed Vite');
    } catch (globalError) {
      console.error('Failed to install globally:', globalError.message);
      process.exit(1);
    }
  }

  // Try to start Vite to verify it works
  console.log('Verifying Vite installation...');
  try {
    execSync('npx vite --version', { 
      stdio: 'pipe',
      cwd: path.resolve(__dirname, '..')
    });
    console.log('✅ Vite is properly installed and accessible');
  } catch (verifyError) {
    console.error('Vite installation verified but may not be executable:', verifyError.message);
    console.log('Please try running: npx vite');
    process.exit(1);
  }

} catch (error) {
  console.error('Error in fix-vite script:', error.message);
  process.exit(1);
}
