
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
  
  // Try multiple methods to start vite
  console.log('Starting development server with Vite...');
  
  const methods = [
    { name: 'npx vite', cmd: 'npx vite' },
    { name: 'local vite binary', cmd: `"${path.join(__dirname, '..', 'node_modules', '.bin', 'vite')}"` },
    { name: 'global vite', cmd: 'vite' },
    { name: 'node vite module', cmd: `node "${path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js')}"` }
  ];
  
  // Try each method in sequence
  let started = false;
  
  for (const method of methods) {
    if (started) break;
    
    try {
      console.log(`Trying to start with ${method.name}...`);
      execSync(method.cmd, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      started = true;
      break;
    } catch (error) {
      console.warn(`Failed to start with ${method.name}, trying next method...`);
    }
  }
  
  // If all methods failed, try fixing vite
  if (!started) {
    throw new Error('All standard methods to start Vite failed');
  }
} catch (error) {
  console.error('Failed to start development server:', error.message);
  console.log('Trying to fix Vite installation and restart...');
  
  try {
    // Run fix-vite script
    execSync('node scripts/fix-vite.js', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    
    // Try one more time with each method after fixing
    let restarted = false;
    
    const fallbackMethods = [
      { name: 'npx vite (after fix)', cmd: 'npx vite' },
      { name: 'local vite binary (after fix)', cmd: `"${path.join(__dirname, '..', 'node_modules', '.bin', 'vite')}"` },
      { name: 'node vite module (after fix)', cmd: `node "${path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js')}"` },
      { name: 'global vite (after fix)', cmd: 'vite' }
    ];
    
    for (const method of fallbackMethods) {
      if (restarted) break;
      
      try {
        console.log(`Trying to restart with ${method.name}...`);
        execSync(method.cmd, {
          stdio: 'inherit',
          cwd: path.resolve(__dirname, '..')
        });
        restarted = true;
        break;
      } catch (methodError) {
        console.warn(`Failed to restart with ${method.name}...`);
      }
    }
    
    if (!restarted) {
      throw new Error('All attempts to start Vite failed, even after fixing.');
    }
  } catch (fixError) {
    console.error('All attempts to start Vite failed.');
    console.error('Please run the following commands manually:');
    console.error('1. node scripts/fix-vite.js');
    console.error('2. npm install --save-dev vite@4.5.1 @vitejs/plugin-react@4.2.1');
    console.error('3. npx vite');
    process.exit(1);
  }
}
